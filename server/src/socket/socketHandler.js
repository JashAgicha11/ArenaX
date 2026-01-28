const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Match = require('../models/Match');
const logger = require('../utils/logger');

const socketHandler = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.email} (${socket.user.role})`);

    // Join match room for live updates
    socket.on('join_match', async (data) => {
      try {
        const { matchId } = data;
        
        // Validate match exists and user has access
        const match = await Match.findById(matchId);
        if (!match) {
          socket.emit('error', { message: 'Match not found' });
          return;
        }

        // Join the match room
        socket.join(`match_${matchId}`);
        socket.matchId = matchId;
        
        logger.info(`User ${socket.user.email} joined match ${matchId}`);
        
        // Send current match state
        socket.emit('match_joined', { 
          matchId, 
          message: 'Successfully joined match' 
        });

      } catch (error) {
        logger.error('Join match error:', error);
        socket.emit('error', { message: 'Failed to join match' });
      }
    });

    // Leave match room
    socket.on('leave_match', (data) => {
      const { matchId } = data;
      
      if (socket.matchId === matchId) {
        socket.leave(`match_${matchId}`);
        socket.matchId = null;
        
        logger.info(`User ${socket.user.email} left match ${matchId}`);
        socket.emit('match_left', { matchId });
      }
    });

    // Handle live scoring updates (scorers only)
    socket.on('score_update', async (data) => {
      try {
        const { matchId, scoringEvent } = data;
        
        // Verify user is a scorer for this match
        if (!socket.user.hasAnyRole(['scorer', 'admin', 'organizer'])) {
          socket.emit('error', { message: 'Insufficient permissions to score' });
          return;
        }

        // Validate match exists and is live
        const match = await Match.findById(matchId);
        if (!match) {
          socket.emit('error', { message: 'Match not found' });
          return;
        }

        if (match.status !== 'live') {
          socket.emit('error', { message: 'Match is not live' });
          return;
        }

        // Add scoring event to match
        const eventData = {
          ...scoringEvent,
          scorerId: socket.user._id,
          timestamp: new Date()
        };

        match.scoringFeed.push(eventData);
        await match.save();

        // Broadcast update to all users in match room
        io.to(`match_${matchId}`).emit('score_updated', {
          matchId,
          scoringEvent: eventData,
          updatedStats: match.statsAggregate
        });

        logger.info(`Score update in match ${matchId} by ${socket.user.email}`);

      } catch (error) {
        logger.error('Score update error:', error);
        socket.emit('error', { message: 'Failed to update score' });
      }
    });

    // Handle commentary updates
    socket.on('commentary_update', async (data) => {
      try {
        const { matchId, commentary } = data;
        
        // Verify user has permission to add commentary
        if (!socket.user.hasAnyRole(['scorer', 'admin', 'organizer'])) {
          socket.emit('error', { message: 'Insufficient permissions for commentary' });
          return;
        }

        // Broadcast commentary to match room
        io.to(`match_${matchId}`).emit('commentary_updated', {
          matchId,
          commentary: {
            ...commentary,
            author: socket.user.name,
            timestamp: new Date()
          }
        });

        logger.info(`Commentary update in match ${matchId} by ${socket.user.email}`);

      } catch (error) {
        logger.error('Commentary update error:', error);
        socket.emit('error', { message: 'Failed to update commentary' });
      }
    });

    // Handle match status changes
    socket.on('match_status_change', async (data) => {
      try {
        const { matchId, newStatus } = data;
        
        // Verify user has permission to change match status
        if (!socket.user.hasAnyRole(['scorer', 'admin', 'organizer'])) {
          socket.emit('error', { message: 'Insufficient permissions to change match status' });
          return;
        }

        // Update match status
        const match = await Match.findById(matchId);
        if (!match) {
          socket.emit('error', { message: 'Match not found' });
          return;
        }

        match.status = newStatus;
        if (newStatus === 'completed') {
          match.result.completedAt = new Date();
        }
        
        await match.save();

        // Broadcast status change
        io.to(`match_${matchId}`).emit('match_status_changed', {
          matchId,
          newStatus,
          updatedMatch: match
        });

        // Also broadcast to general live matches room
        io.emit('live_matches_updated');

        logger.info(`Match ${matchId} status changed to ${newStatus} by ${socket.user.email}`);

      } catch (error) {
        logger.error('Match status change error:', error);
        socket.emit('error', { message: 'Failed to change match status' });
      }
    });

    // Handle period changes (for sports with periods/overs)
    socket.on('period_change', async (data) => {
      try {
        const { matchId, period, time } = data;
        
        // Verify user has permission
        if (!socket.user.hasAnyRole(['scorer', 'admin', 'organizer'])) {
          socket.emit('error', { message: 'Insufficient permissions' });
          return;
        }

        // Broadcast period change
        io.to(`match_${matchId}`).emit('period_changed', {
          matchId,
          period,
          time,
          updatedBy: socket.user.name
        });

      } catch (error) {
        logger.error('Period change error:', error);
        socket.emit('error', { message: 'Failed to change period' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.matchId) {
        socket.leave(`match_${socket.matchId}`);
        logger.info(`User ${socket.user.email} disconnected from match ${socket.matchId}`);
      }
      
      logger.info(`User disconnected: ${socket.user.email}`);
    });

    // Error handling
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  // Broadcast live matches updates to all connected clients
  const broadcastLiveMatchesUpdate = async () => {
    try {
      const liveMatches = await Match.find({ status: 'live' })
        .populate('homeTeamId', 'name logoUrl')
        .populate('awayTeamId', 'name logoUrl')
        .populate('tournamentId', 'name')
        .limit(10);

      io.emit('live_matches_updated', { liveMatches });
    } catch (error) {
      logger.error('Broadcast live matches error:', error);
    }
  };

  // Set up periodic broadcast of live matches (every 30 seconds)
  setInterval(broadcastLiveMatchesUpdate, 30000);

  logger.info('Socket.io handler initialized');
};

module.exports = socketHandler; 
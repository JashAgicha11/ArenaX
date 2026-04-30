const jwt = require('jsonwebtoken');
const {
  User, Match, Team, Tournament, ScoringFeed,
} = require('../models');
const logger = require('../utils/logger');

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) return next(new Error('Authentication error: No token provided'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      if (!user) return next(new Error('Authentication error: User not found'));
      user._id = user.id;
      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.email} (${socket.user.role})`);

    socket.on('join_match', async (data) => {
      try {
        const { matchId } = data;
        const match = await Match.findByPk(matchId);
        if (!match) return socket.emit('error', { message: 'Match not found' });
        socket.join(`match_${matchId}`);
        socket.matchId = matchId;
        socket.emit('match_joined', { matchId, message: 'Successfully joined match' });
      } catch (error) {
        logger.error('Join match error:', error);
        socket.emit('error', { message: 'Failed to join match' });
      }
    });

    socket.on('leave_match', (data) => {
      const { matchId } = data;
      if (socket.matchId === matchId) {
        socket.leave(`match_${matchId}`);
        socket.matchId = null;
        socket.emit('match_left', { matchId });
      }
    });

    socket.on('score_update', async (data) => {
      try {
        const { matchId, scoringEvent } = data;
        if (!socket.user.hasAnyRole(['scorer', 'admin', 'organizer'])) {
          return socket.emit('error', { message: 'Insufficient permissions to score' });
        }
        const match = await Match.findByPk(matchId);
        if (!match) return socket.emit('error', { message: 'Match not found' });
        if (match.status !== 'live') return socket.emit('error', { message: 'Match is not live' });

        const eventData = {
          ...scoringEvent,
          matchId: Number(matchId),
          scorerId: socket.user.id,
          timestamp: new Date(),
          eventType: scoringEvent.eventType || 'update',
        };
        await ScoringFeed.create(eventData);
        io.to(`match_${matchId}`).emit('score_updated', { matchId, scoringEvent: eventData, updatedStats: null });
      } catch (error) {
        logger.error('Score update error:', error);
        socket.emit('error', { message: 'Failed to update score' });
      }
    });

    socket.on('commentary_update', async (data) => {
      try {
        const { matchId, commentary } = data;
        if (!socket.user.hasAnyRole(['scorer', 'admin', 'organizer'])) {
          return socket.emit('error', { message: 'Insufficient permissions for commentary' });
        }
        io.to(`match_${matchId}`).emit('commentary_updated', {
          matchId,
          commentary: { ...commentary, author: socket.user.name, timestamp: new Date() },
        });
      } catch (error) {
        logger.error('Commentary update error:', error);
        socket.emit('error', { message: 'Failed to update commentary' });
      }
    });

    socket.on('match_status_change', async (data) => {
      try {
        const { matchId, newStatus } = data;
        if (!socket.user.hasAnyRole(['scorer', 'admin', 'organizer'])) {
          return socket.emit('error', { message: 'Insufficient permissions to change match status' });
        }
        const match = await Match.findByPk(matchId);
        if (!match) return socket.emit('error', { message: 'Match not found' });
        const result = { ...(match.result || {}) };
        if (newStatus === 'completed') result.completedAt = new Date();
        match.status = newStatus;
        match.result = result;
        await match.save();
        io.to(`match_${matchId}`).emit('match_status_changed', { matchId, newStatus, updatedMatch: match });
        io.emit('live_matches_updated');
      } catch (error) {
        logger.error('Match status change error:', error);
        socket.emit('error', { message: 'Failed to change match status' });
      }
    });

    socket.on('period_change', async (data) => {
      try {
        const { matchId, period, time } = data;
        if (!socket.user.hasAnyRole(['scorer', 'admin', 'organizer'])) {
          return socket.emit('error', { message: 'Insufficient permissions' });
        }
        io.to(`match_${matchId}`).emit('period_changed', { matchId, period, time, updatedBy: socket.user.name });
      } catch (error) {
        logger.error('Period change error:', error);
        socket.emit('error', { message: 'Failed to change period' });
      }
    });
  });

  const broadcastLiveMatchesUpdate = async () => {
    try {
      const liveMatches = await Match.findAll({
        where: { status: 'live' },
        include: [
          { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
          { model: Team, as: 'awayTeam', attributes: ['id', 'name'] },
          { model: Tournament, as: 'tournament', attributes: ['id', 'name'] },
        ],
        limit: 10,
      });
      io.emit('live_matches_updated', { liveMatches });
    } catch (error) {
      logger.error('Broadcast live matches error:', error);
    }
  };

  setInterval(broadcastLiveMatchesUpdate, 30000);
  logger.info('Socket.io handler initialized');
};

module.exports = socketHandler;

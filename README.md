# **Arena X** : MultiSport Platform 🏆
## CSE250 - DBMS Project
A comprehensive CSE250 Project, Which reflects real-time multi-sport scoring and rankings platform built with the MERN stack and enhanced with GSAP animations.

## ✨ Features

- **Multi-Sport Support**: Cricket, Football, Basketball, Tennis, Badminton, Volleyball
- **Real-Time Scoring**: Live match updates with Socket.io
- **Tournament Management**: Create and manage competitions across all sports
- **Live Leaderboards**: Dynamic rankings with sport-specific algorithms
- **Role-Based Access**: Admin, Organizer, Scorer, Player, Fan roles
- **Beautiful UI**: Modern design with Tailwind CSS and GSAP animations
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Live Commentary**: Real-time match commentary and updates
- **Statistics Engine**: Comprehensive stats tracking per sport
- **Team Management**: Build teams, manage rosters, track performance

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Socket.io** for real-time updates

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **GSAP** for animations
- **React Router** for navigation
  

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd multisport-platform
```

### 2. Install dependencies
```bash
npm run install:all
```


#### Client Environment
```bash
cd client
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5173
```

### 4. Start MongoDB
```bash
# Start MongoDB service
mongod
```

### 6. Start the application
```bash
# Development mode (both client and server)
npm run dev

# Or start separately
npm run dev:server  # Backend on port 5000
npm run dev:client  # Frontend on port 3000
```

## 🔐 Default Users

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@multisport.com | admin123 |
| Organizer | organizer@multisport.com | organizer123 |
| Scorer | scorer@multisport.com | scorer123 |
| Player | cricket@multisport.com | player123 |
| Player | football@multisport.com | player123 |

## 🏗️ Project Structure

```
multisport-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── socket/        # Socket.io handlers
│   │   ├── utils/         # Utility functions
│   │   └── scripts/       # Database scripts
│   ├── logs/              # Application logs
│   └── package.json
└── README.md
```

## 🎯 Core Features

### 1. Multi-Sport Architecture
- **Configurable Rules**: Each sport has its own scoring rules and validation
- **Sport-Specific UI**: Different interfaces for different sports
- **Extensible**: Easy to add new sports without code changes

### 2. Real-Time Scoring
- **Live Updates**: Instant score updates across all connected clients
- **Scorer Console**: Dedicated interface for match officials
- **Event Tracking**: Comprehensive event logging for all sports

### 3. Tournament Management
- **Multiple Formats**: League, knockout, round-robin, mixed
- **Fixture Generation**: Automatic fixture creation
- **Standings**: Real-time tournament tables
- **Results Tracking**: Complete match result history

### 4. Ranking System
- **Fantasy Points**: Sport-specific point algorithms
- **Leaderboards**: Global and tournament-specific rankings
- **Elo Ratings**: Optional team rating system
- **Tie-Breakers**: Configurable tie-breaking criteria

## 🎨 UI/UX Features

### GSAP Animations
- **Page Transitions**: Smooth fade-slide animations
- **Scroll Triggers**: Animated content reveals
- **Micro-interactions**: Hover effects and button animations
- **Performance Optimized**: Respects `prefers-reduced-motion`

### Responsive Design
- **Mobile-First**: Touch-friendly interfaces
- **Breakpoint System**: Consistent across all devices
- **Sport Colors**: Unique color schemes per sport
- **Modern Cards**: Rounded corners, soft shadows, adequate spacing


### Client → Server
- `join_match` - Join match room
- `score_update` - Update match score
- `commentary_update` - Add match commentary
- `match_status_change` - Change match status

### Server → Client
- `score_updated` - Score change notification
- `commentary_updated` - New commentary
- `match_status_changed` - Status change notification
- `live_matches_updated` - Live matches update


## 🚀 Deployment

### Production Build
```bash
npm run build
```


## 🎉 Acknowledgments

- **GSAP** for amazing animations
- **Tailwind CSS** for utility-first styling

- **MongoDB** for flexible data storage

---
## Group Members
- Jash Agicha - AU2320253
- Aryan Tarachandani - AU240177
- Dev Shah - AU2420165
- Aditya Bhatt - AU2240109

**MultiSport Platform** - Where every sport finds its home! 🏆⚽🏀🎾🏸🏐 

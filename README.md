# MindSeek - AI-Powered Collaborative Learning Platform

## Overview
MindSeek is an innovative educational platform that combines AI capabilities with collaborative learning features to enhance the study experience. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it offers a comprehensive suite of tools for students and teachers.

## Features

### 1. Smart Note Management
- Upload and process PDF/Image notes with OCR technology
- Automatic content categorization and organization
- Full-text search capabilities

### 2. AI-Powered Features
- Intelligent quiz generation from uploaded notes
- AI chatbot for content-specific queries
- Smart content validation and annotation

### 3. Educational Video Integration
- YouTube educational video search and integration
- Curated video recommendations based on topics
- In-platform video viewing experience

### 4. User Roles and Permissions
- Student accounts for learning and collaboration
- Teacher accounts for content management and oversight
- Role-based access control

## Tech Stack

### Frontend
- React.js
- Material UI/Tailwind CSS
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io

### AI Services
- OpenAI API Integration
- OCR Processing (Tesseract.js/Google Cloud Vision)
- YouTube Data API v3

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/MindSeek.git
cd MindSeek
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
- Create `.env` file in server directory
- Create `.env` file in client directory

4. Start the development servers
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm start
```

## Project Structure
```
MindSeek/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── components/    # React components
│       ├── context/      # Context providers
│       └── styles/       # CSS styles
└── server/                # Node.js backend
    ├── controllers/      # Route controllers
    ├── models/          # Database models
    ├── routes/          # API routes
    └── utils/           # Utility functions
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

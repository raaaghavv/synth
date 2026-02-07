# Synth 🎵

A modern music streaming application showcasing **HTTP 206 Partial Content streaming** for audio and video, with a fully customized media player implementation.

## 🎯 Project Scope & Motive

This project demonstrates:

1. **HTTP Range Requests (206 Streaming)** - Efficient media delivery using partial content responses for seamless audio/video playback
2. **Custom Media Player** - A fully-featured, hand-crafted player with no third-party player libraries
3. **Video + Audio Sync** - Seamless switching between audio-only and video modes with time synchronization
4. **Picture-in-Picture** - Custom PiP implementation with floating mini-player
5. **Persistent Background Playback** - Media continues playing while navigating between pages
6. **Keyboard Controls** - keyboard support (spacebar, arrow keys)

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TailwindCSS v4** - Utility-first styling
- **React Query** - Server state management
- **Lucide React** - Icon library

### Backend

- **Express.js** - Node.js web server
- **MongoDB + Mongoose** - Database and ODM
- **Multer** - File upload handling
- **HTTP 206 Streaming** - Range request support for audio/video

## 📁 Project Structure

```
synth/
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   ├── context/   # PlayerContext (global player state)
│   │   └── lib/       # Utilities
│   └── next.config.mjs
│
└── backend/           # Express.js backend
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── models/
    │   └── middlewares/
    └── uploads/       # Local Media storage for simulating streaming response
```

## 🎮 Features

| Feature             | Description                              |
| ------------------- | ---------------------------------------- |
| **Stream Audio**    | HTTP 206 partial content for audio files |
| **Stream Video**    | HTTP 206 partial content for video files |
| **Play/Pause**      | Click video or use spacebar              |
| **Seek**            | Arrow Left/Right to skip 5 seconds       |
| **Volume**          | Arrow Up/Down to adjust volume           |
| **Shuffle/Repeat**  | Queue management controls                |
| **Fullscreen**      | Native fullscreen support                |
| **Mini PiP**        | Custom floating video player             |
| **Background Play** | Persistent playback across navigation    |

## 📡 API Endpoints

| Method | Endpoint                              | Description        |
| ------ | ------------------------------------- | ------------------ |
| `GET`  | `/api/v1/songs`                       | List all songs     |
| `POST` | `/api/v1/songs/upload`                | Upload new song    |
| `GET`  | `/api/v1/songs/:id/stream?type=audio` | Stream audio (206) |
| `GET`  | `/api/v1/songs/:id/stream?type=video` | Stream video (206) |

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lyrics Video Creator is a full-stack application that generates music videos with synchronized lyric subtitles. It uses Music AI for lyrics alignment and OpenAI for translation.

## Development Commands

### Backend (Python/FastAPI)
```bash
cd backend
uv run main                    # Start server at http://127.0.0.1:8000
uv sync                        # Install/sync dependencies
uv add <package>               # Add a dependency
```

### Frontend (React/TypeScript/Vite)
```bash
cd frontend
npm run dev                    # Start dev server at http://localhost:5173
npm run build                  # Production build to dist/
npm run lint                   # Run ESLint
npm run preview                # Preview production build
```

### Full Development Stack
Run both in separate terminals:
- Terminal 1: `cd backend && uv run main`
- Terminal 2: `cd frontend && npm run dev`

## Architecture

```
├── frontend/                  # React + TypeScript + Vite
│   └── src/
│       ├── components/        # UI components
│       │   ├── VideoGenerator.tsx   # Main component (useReducer state)
│       │   ├── FileUpload.tsx       # Audio/image upload
│       │   ├── LyricsInput.tsx      # Lyrics text input
│       │   └── SubtitleSettingsPanel.tsx
│       ├── types/index.ts     # TypeScript interfaces
│       └── utils/cn.ts        # Class name utility
│
└── backend/                   # Python FastAPI
    ├── main.py                # FastAPI app, POST /create_video endpoint
    └── src/lyrics_video_creator/
        ├── lib.py             # Core logic: alignment, translation, video creation
        └── font.py            # Windows font path resolution
```

## Key Integration Points

- **API Endpoint**: `POST /create_video` accepts multipart form data (music file, image, lyrics, subtitle settings)
- **CORS**: Backend configured for `http://localhost:5173`
- **API Docs**: Swagger UI at `http://localhost:8000/docs`

## Processing Pipeline (lib.py)

1. `align_lyrics()` - Music AI API for lyrics-to-audio alignment
2. `correct_lyrics_timing()` - Adjust timing based on original lyrics
3. `translate_lyrics()` - GPT-based English translation via LangChain
4. `create_lyric_video()` - MoviePy video rendering with subtitles

## Environment Variables

Create `.env` from `.env.template`:
```
MUSICAI_API_KEY=<Music AI API Key>
OPENAI_API_KEY=<OpenAI API Key>
```

## Tech Stack Notes

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI components, Framer Motion
- **Backend**: FastAPI, MoviePy (video), LangChain + OpenAI, Music AI SDK
- **Package Managers**: npm (frontend), uv (backend - Python 3.10+)

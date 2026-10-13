import logging
import logging.config
import os
import shutil
import uuid
from pathlib import Path

import uvicorn
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from lyrics_video_creator.lib import (
    align_lyrics,
    correct_lyrics_timing,
    create_lyric_video,
    translate_lyrics,
)

# Logging configuration in dictionary format
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": "%(levelprefix)s %(asctime)s - %(name)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
        "file": {
            "formatter": "default",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "app.log",
            "maxBytes": 1024 * 1024 * 5,  # 5MB
            "backupCount": 3,
            "encoding": "utf-8",
        },
    },
    "loggers": {
        "": {"handlers": ["default", "file"], "level": "INFO"},
        "uvicorn.error": {"level": "INFO"},
        "uvicorn.access": {
            "handlers": ["default", "file"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

# Apply logging configuration
logging.config.dictConfig(LOGGING_CONFIG)

# Get logger instance
logger = logging.getLogger(__name__)

# Create FastAPI application instance
app = FastAPI(
    title="Lyrics Video Creator API",
    description="API for creating lyric videos with music and images.",
    version="0.1.0",
)

# CORS configuration
origins = [
    "http://localhost:5173",  # Frontend application origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/create_video")
async def create_video(
    music_file: UploadFile = File(),
    image_file: UploadFile = File(),
    lyrics: str = Form(),
    font_name_ja: str = Form(default="Noto Sans JP"),
    font_name_en: str = Form(default="Arial"),
    font_color: str = Form(default="#FFFFFF"),
    font_size: int = Form(default=32),
    outline_color: str = Form(default="#000000"),
    outline_size: int = Form(default=0),
    bottom_margin: int = Form(default=50),
    enable_fade: bool = Form(default=False),
) -> FileResponse:
    # Assign unique ID to each request for log tracking
    request_id = str(uuid.uuid4())
    logger.info(f"[Request ID: {request_id}] Video creation request received.")
    logger.info(
        f"[Request ID: {request_id}] Parameters: font_name_ja={font_name_ja}, font_color={font_color}, etc."
    )

    # Create temporary upload directory for each request
    temp_dir_path = f"uploads/{request_id}"

    try:
        logger.info(
            f"[Request ID: {request_id}] Creating temporary directory: {temp_dir_path}"
        )
        os.makedirs(temp_dir_path, exist_ok=True)

        # Save files
        music_filename = os.path.join(temp_dir_path, f"music_{music_file.filename}")
        image_filename = os.path.join(temp_dir_path, f"image_{image_file.filename}")
        lyrics_filename = os.path.join(temp_dir_path, "lyrics.txt")
        video_filename = os.path.join(temp_dir_path, "output_video.mp4")

        logger.info(
            f"[Request ID: {request_id}] Saving music file: {music_filename}"
        )
        with open(music_filename, "wb") as f:
            f.write(await music_file.read())

        logger.info(
            f"[Request ID: {request_id}] Saving image file: {image_filename}"
        )
        with open(image_filename, "wb") as f:
            f.write(await image_file.read())

        logger.info(
            f"[Request ID: {request_id}] Saving lyrics file: {lyrics_filename}"
        )
        with open(lyrics_filename, "w", encoding="utf-8") as f:
            f.write(lyrics)

        # Lyrics alignment
        logger.info(f"[Request ID: {request_id}] Aligning lyrics...")
        aligned_lyrics = align_lyrics(
            workflow_slug="subtitle-transcription-and-alignment",
            music_file=Path(music_filename),
            lyrics=lyrics,
        )
        aligned_lyrics = correct_lyrics_timing(
            original_lyrics=lyrics, aligned_lyrics=aligned_lyrics
        )

        # Lyrics translation
        logger.info(f"[Request ID: {request_id}] Translating lyrics...")
        translated_lyrics = translate_lyrics(lyrics=aligned_lyrics)

        # Generate lyrics video
        logger.info(f"[Request ID: {request_id}] Generating lyrics video...")
        create_lyric_video(
            music_file=music_filename,
            image_file=image_filename,
            lyrics=translated_lyrics,
            output_file=video_filename,
            font_name_ja=font_name_ja,
            font_name_en=font_name_en,
            font_color=font_color,
            stroke_color=outline_color,
            font_size=font_size,
            stroke_width=outline_size,
            margin_bottom=bottom_margin,
            enable_fade=enable_fade,
        )
        logger.info(
            f"[Request ID: {request_id}] Lyrics video generation complete: {video_filename}"
        )

        # Return video file as response
        return FileResponse(
            video_filename,
            media_type="video/mp4",
            filename=os.path.basename(video_filename),
        )

    except Exception as e:
        logger.error(
            f"[Request ID: {request_id}] Error occurred during video creation.",
            exc_info=True,
        )
        # Clean up temporary directory on error
        if os.path.exists(temp_dir_path):
            shutil.rmtree(temp_dir_path)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


def main():
    logger.info("Starting FastAPI application.")
    logger.info("API documentation: http://127.0.0.1:8000/docs")
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        log_config=LOGGING_CONFIG,
        reload=True,
    )


if __name__ == "__main__":
    main()

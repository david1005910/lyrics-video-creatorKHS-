import { Eye } from 'lucide-react';
import React, { useReducer } from 'react';
import { FileUpload } from './FileUpload';
import { LyricsInput } from './LyricsInput';
import { SubtitleSettingsPanel } from './SubtitleSettingsPanel';
import { VideoPreview } from './VideoPreview';
import { VideoGeneratorState, ActionType } from '../types';

const initialState: VideoGeneratorState = {
  audioFile: null,
  backgroundImage: null,
  lyrics: '',
  settings: {
    fontFamilyJa: 'Noto Sans JP',
    fontFamilyEn: 'Roboto',
    fontSize: 32,
    color: '#ffffff',
    outlineColor: '#000000',
    outlineSize: 0,
    bottomMargin: 50,
    enableFade: true
  }
};

function reducer(state: VideoGeneratorState, action: ActionType): VideoGeneratorState {
  switch (action.type) {
    case 'SET_AUDIO_FILE':
      return { ...state, audioFile: action.payload };
    case 'SET_BACKGROUND_IMAGE':
      return { ...state, backgroundImage: action.payload };
    case 'SET_LYRICS':
      return { ...state, lyrics: action.payload };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    default:
      return state;
  }
}

export const VideoGenerator: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAudioUpload = (file: File | null) => {
    dispatch({ type: 'SET_AUDIO_FILE', payload: file });
  };

  const handleBackgroundUpload = (file: File | null) => {
    dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: file });
  };

  const handleLyricsChange = (text: string) => {
    dispatch({ type: 'SET_LYRICS', payload: text });
  };

  const updateSettings = (settings: Partial<typeof state.settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const handleVideoGenerate = async () => {
    if (!state.audioFile || !state.backgroundImage || !state.lyrics) {
      alert('Required files or lyrics are not set.');
      return;
    }

    const formData = new FormData();
    formData.append('music_file', state.audioFile);
    formData.append('image_file', state.backgroundImage);
    formData.append('lyrics', state.lyrics);
    formData.append('font_size', state.settings.fontSize.toString());
    formData.append('font_color', state.settings.color);
    formData.append('font_name_ja', state.settings.fontFamilyJa);
    formData.append('font_name_en', state.settings.fontFamilyEn);
    formData.append('outline_color', state.settings.outlineColor);
    formData.append('outline_size', state.settings.outlineSize.toString());
    formData.append('bottom_margin', state.settings.bottomMargin.toString());
    formData.append('enable_fade', state.settings.enableFade.toString());


    try {
      const backendURL = 'http://localhost:8000';
      const response = await fetch(`${backendURL}/create_video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Video generation failed: ${response.status} ${errorText}`);
      }

      const videoBlob = await response.blob();
      if (videoBlob.type !== 'video/mp4') {
        console.warn(`Expected video/mp4 but received ${videoBlob.type}`);
      }

      const url = window.URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'lyrics_video.mp4';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Video generation error:', error);
      if (error instanceof Error) {
        alert(`Error occurred: ${error.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card rounded-softer p-6 float-3d animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-slate-700 flex items-center">
            <div className="p-1.5 rounded-lg bg-gradient-button mr-2 shadow-glow-primary">
              <Eye className="h-4 w-4 text-white" />
            </div>
            Preview
          </h2>
          <VideoPreview
            backgroundImage={state.backgroundImage}
            lyrics={state.lyrics}
            settings={state.settings}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload
            type="audio"
            file={state.audioFile}
            onFileChange={handleAudioUpload}
          />
          <FileUpload
            type="image"
            file={state.backgroundImage}
            onFileChange={handleBackgroundUpload}
          />
        </div>

        <LyricsInput value={state.lyrics} onChange={handleLyricsChange} />

        <div className="text-center mt-8">
          <button
            onClick={handleVideoGenerate}
            disabled={!state.audioFile || !state.backgroundImage || !state.lyrics}
            className="btn-gradient px-8 py-4 rounded-xl text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Generate Lyrics Video
          </button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <SubtitleSettingsPanel
          settings={state.settings}
          onChange={updateSettings}
        />
      </div>
    </div>
  );
};

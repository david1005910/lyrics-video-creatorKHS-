import React from 'react';
import { SubtitleSettings } from '../types';

interface VideoPreviewProps {
  backgroundImage: File | null;
  lyrics: string;
  settings: SubtitleSettings;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  backgroundImage,
  lyrics,
  settings,
}) => {
  const [backgroundUrl, setBackgroundUrl] = React.useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = React.useState(16 / 9);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (backgroundImage) {
      const newUrl = URL.createObjectURL(backgroundImage);
      setBackgroundUrl(newUrl);

      // Load image to get its dimensions
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
        URL.revokeObjectURL(img.src);
      };
      img.src = newUrl;

      return () => URL.revokeObjectURL(newUrl);
    } else {
      setBackgroundUrl(null);
      setAspectRatio(16 / 9);
    }
  }, [backgroundImage]);

  const subtitleStyle: React.CSSProperties = {
    fontFamily: settings.fontFamilyJa,
    fontSize: `${settings.fontSize}px`,
    color: settings.color,
    textShadow: `0 0 ${settings.outlineSize}px ${settings.outlineColor}`,
    WebkitTextStroke: `${settings.outlineSize}px ${settings.outlineColor}`,
    marginBottom: 0,
    padding: 0,
  };

  // English subtitle style
  const englishSubtitleStyle: React.CSSProperties = {
    ...subtitleStyle,
    fontFamily: settings.fontFamilyEn,
    fontSize: `${settings.fontSize / 2}px`,
    marginTop: 0,
    marginBottom: `${settings.bottomMargin}px`,
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-soft-lg" ref={containerRef}>
      <div
        className="relative w-full overflow-hidden"
        style={{
          paddingBottom: `${(1 / aspectRatio) * 100}%`
        }}
      >
        {backgroundUrl ? (
          <img
            src={backgroundUrl}
            alt="Background preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-soft">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm font-medium">No background image</p>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-4 h-full">
          <div
            className="text-center px-4 py-2 max-w-[90%]"
            style={subtitleStyle}
          >
            Subtitles will appear here
          </div>
          <div
            className="mt-1"
            style={englishSubtitleStyle}
          >
            English subtitle appears here
          </div>
        </div>
      </div>
    </div>
  );
};
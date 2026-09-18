'use client';

import { useRef, useState } from 'react';

import ButtonAdmin from '@/components/admin/button-admin';
import { readVideoMetadata } from '@/lib/videos/read-video-metadata';
import {
  ALLOWED_TYPES,
  validateVideoFile,
} from '@/lib/videos/validate-video-file';

type VideoPickerProps = {
  defaultVideo?: string;
  defaultVideoWidth?: number | null;
  defaultVideoHeight?: number | null;
  disabled?: boolean;
  disabledReason?: string;
  onPresenceChange?: (hasVideo: boolean) => void;
};

export default function VideoPicker({
  defaultVideo = '',
  defaultVideoWidth = null,
  defaultVideoHeight = null,
  disabled = false,
  disabledReason,
  onPresenceChange,
}: VideoPickerProps) {
  const [existingVideo, setExistingVideo] = useState(defaultVideo.trim());
  const [existingWidth, setExistingWidth] = useState(defaultVideoWidth);
  const [existingHeight, setExistingHeight] = useState(defaultVideoHeight);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoWidth, setVideoWidth] = useState<number | null>(null);
  const [videoHeight, setVideoHeight] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReadingMetadata, setIsReadingMetadata] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasVideo = Boolean(existingVideo || previewUrl);

  function notifyPresence(nextHasVideo: boolean) {
    onPresenceChange?.(nextHasVideo);
  }

  function clearNewVideo() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setVideoWidth(null);
    setVideoHeight(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    notifyPresence(Boolean(existingVideo));
  }

  function removeVideo() {
    setExistingVideo('');
    setExistingWidth(null);
    setExistingHeight(null);
    clearNewVideo();
    notifyPresence(false);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      clearNewVideo();
      return;
    }

    const validationError = validateVideoFile(file);

    if (validationError) {
      setError(validationError);
      setPreviewUrl(null);
      setVideoWidth(null);
      setVideoHeight(null);
      notifyPresence(Boolean(existingVideo));
      return;
    }

    setIsReadingMetadata(true);
    setError(null);

    try {
      const metadata = await readVideoMetadata(file);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(URL.createObjectURL(file));
      setVideoWidth(metadata.width);
      setVideoHeight(metadata.height);
      notifyPresence(true);
    } catch (metadataError) {
      setPreviewUrl(null);
      setVideoWidth(null);
      setVideoHeight(null);
      setError(
        metadataError instanceof Error
          ? metadataError.message
          : 'Nepodařilo se načíst video.',
      );
      notifyPresence(Boolean(existingVideo));
    } finally {
      setIsReadingMetadata(false);
    }
  }

  const activeWidth = previewUrl ? videoWidth : existingWidth;
  const activeHeight = previewUrl ? videoHeight : existingHeight;
  const videoSrc = previewUrl ?? (existingVideo ? `/${existingVideo}` : null);

  return (
    <div>
      <span className="admin-label">Video</span>

      {existingVideo && !previewUrl ? (
        <>
          <input type="hidden" name="existingVideo" value={existingVideo} />
          {existingWidth ? (
            <input type="hidden" name="existingVideoWidth" value={existingWidth} />
          ) : null}
          {existingHeight ? (
            <input
              type="hidden"
              name="existingVideoHeight"
              value={existingHeight}
            />
          ) : null}
        </>
      ) : null}

      {videoWidth ? (
        <input type="hidden" name="videoWidth" value={videoWidth} />
      ) : null}
      {videoHeight ? (
        <input type="hidden" name="videoHeight" value={videoHeight} />
      ) : null}

      {hasVideo ? (
        <div className="space-y-3 rounded-md border border-border p-3">
          {videoSrc ? (
            <video
              src={videoSrc}
              controls
              className="max-h-80 w-full rounded-md bg-black"
              style={
                activeWidth && activeHeight
                  ? { aspectRatio: `${activeWidth} / ${activeHeight}` }
                  : undefined
              }
            />
          ) : null}

          {activeWidth && activeHeight ? (
            <p className="admin-hint">
              Rozměry: {activeWidth} × {activeHeight} px
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <ButtonAdmin
              type="button"
              color="light"
              onClick={removeVideo}
              disabled={disabled && !hasVideo}
            >
              Odebrat video
            </ButtonAdmin>
          </div>
        </div>
      ) : (
        <p className="admin-hint">Video není přidané.</p>
      )}

      <input
        ref={inputRef}
        type="file"
        name="video"
        accept={ALLOWED_TYPES.join(', ')}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mt-3 space-y-2">
        <ButtonAdmin
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || hasVideo || isReadingMetadata}
        >
          {hasVideo ? 'Video je přidané' : 'Přidat video'}
        </ButtonAdmin>

        {disabled && disabledReason ? (
          <p className="admin-hint">{disabledReason}</p>
        ) : null}

        {error ? <p className="text-sm text-red">{error}</p> : null}
        {isReadingMetadata ? (
          <p className="admin-hint">Načítám rozměry videa…</p>
        ) : null}
      </div>
    </div>
  );
}

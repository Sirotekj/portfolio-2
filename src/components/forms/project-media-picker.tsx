'use client';

import { useState } from 'react';

import GalleryPicker from '@/components/forms/gallery-picker';
import VideoPicker from '@/components/forms/video-picker';

type ProjectMediaPickerProps = {
  defaultGallery?: string[];
  defaultVideo?: string;
  defaultVideoWidth?: number | null;
  defaultVideoHeight?: number | null;
};

export default function ProjectMediaPicker({
  defaultGallery = [],
  defaultVideo = '',
  defaultVideoWidth = null,
  defaultVideoHeight = null,
}: ProjectMediaPickerProps) {
  const [galleryCount, setGalleryCount] = useState(
    defaultGallery.filter(Boolean).length,
  );
  const [hasVideo, setHasVideo] = useState(Boolean(defaultVideo.trim()));

  const galleryDisabled = hasVideo;
  const videoDisabled = galleryCount > 0;

  return (
    <div className="space-y-6">
      <GalleryPicker
        defaultGallery={defaultGallery}
        disabled={galleryDisabled}
        disabledReason="Pokud je v projektu video, nejde přidat galerie obrázků."
        onCountChange={setGalleryCount}
      />

      <VideoPicker
        defaultVideo={defaultVideo}
        defaultVideoWidth={defaultVideoWidth}
        defaultVideoHeight={defaultVideoHeight}
        disabled={videoDisabled}
        disabledReason="Pokud jsou obrázky v galerii, nejde přidat video."
        onPresenceChange={setHasVideo}
      />
    </div>
  );
}

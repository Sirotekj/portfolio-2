export type VideoMetadata = {
  width: number;
  height: number;
};

export function readVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);

      if (!video.videoWidth || !video.videoHeight) {
        reject(new Error('Nepodařilo se načíst rozměry videa.'));
        return;
      }

      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Nepodařilo se načíst video.'));
    };

    video.src = URL.createObjectURL(file);
  });
}

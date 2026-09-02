'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';

import ButtonAdmin from '@/components/admin/button-admin';
import {
  DEFAULT_IMAGE_WIDTH,
  getResponsiveImagePath,
} from '@/lib/images/responsive';

const MAX_SIZE = 2 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function ImagePicker({
  label,
  name,
  defaultImage,
}: {
  label: string;
  name: string;
  defaultImage?: string | null;
}) {
  const [pickedImage, setPickedImage] = useState<string | null>(
    defaultImage ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePickClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setPickedImage(null);
      return;
    }

    function validateFile(file: File): string | undefined {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Povolené formáty jsou PNG, JPG nebo WEBP.';
      }
      if (file.size > MAX_SIZE) {
        return 'Soubor je příliš velký. Maximální velikost je 1 MB.';
      }

      return undefined;
    }
    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setPickedImage(null);
      return;
    }

    setError(null);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  };
  const previewSrc = pickedImage?.startsWith('data:')
    ? pickedImage
    : pickedImage
      ? getResponsiveImagePath(pickedImage, DEFAULT_IMAGE_WIDTH)
      : null;

  return (
    <div>
      <label htmlFor={name} className="text-sm">
        {label}
      </label>
      <div className="controls">
        <div className="mb-4">
          {!previewSrc && (
            <p className="w-full sm:max-w-[50%] aspect-video p-2 border">
              Obrázek nevybrán.
            </p>
          )}
          {previewSrc && (
            <div className="relative border w-full sm:max-w-[50%] aspect-video">
              <Image
                src={previewSrc}
                width={960}
                height={540}
                alt="Vybraný obrázek."
                className="h-auto w-full"
              />
            </div>
          )}
        </div>
        <input
          type="file"
          id={name}
          accept="image/png, image/jpeg, image/webp"
          name={name}
          ref={imageInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        {defaultImage && (
          <input type="hidden" name="existingImage" value={defaultImage} />
        )}
        <ButtonAdmin type="button" onClick={handlePickClick}>
          Vyber obrázek
        </ButtonAdmin>
        {error && <p className="text-red">{error}</p>}
      </div>
    </div>
  );
}

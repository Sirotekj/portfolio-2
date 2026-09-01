'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';

const MAX_SIZE = 1024 * 1024; // 1MB
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

    function validateFile(file: File) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setPickedImage(null);
        return 'Povolené formáty jsou PNG, JPG nebo WEBP.';
      }
      if (file.size > MAX_SIZE) {
        setPickedImage(null);
        return 'Soubor je příliš velký. Maximální velikost je 1 MB.';
      }
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
  return (
    <div>
      <label htmlFor={name} className="text-sm">
        {label}
      </label>
      <div className="controls">
        <div className="mb-4">
          {!pickedImage && (
            <p className="w-full sm:max-w-[50%] aspect-video p-2 border">
              Obrázek nevybrán.
            </p>
          )}
          {pickedImage && (
            <div className="relative border w-full aspect-video">
              <Image
                src={pickedImage}
                width={0}
                height={0}
                sizes="30vw"
                alt="Vybraný obrázek."
                className="w-full h-auto"
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
        <button
          type="button"
          onClick={handlePickClick}
          className="border rounded-sm p-1 cursor-pointer hover:shadow-md hover:bg-background/10"
        >
          Vyber obrázek
        </button>
        {error && <p className="text-red">{error}</p>}
      </div>
    </div>
  );
}

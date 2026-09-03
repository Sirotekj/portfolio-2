'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import ButtonAdmin from '@/components/admin/button-admin';
import {
  DEFAULT_IMAGE_WIDTH,
  getResponsiveImagePath,
} from '@/lib/images/responsive';
import { ALLOWED_TYPES, validateImageFile } from '@/lib/images/validate-image-file';

type GalleryItem =
  | { id: string; kind: 'existing'; path: string }
  | { id: string; kind: 'new'; preview: string | null; error: string | null };

type GalleryPickerProps = {
  defaultGallery?: string[];
};

export default function GalleryPicker({
  defaultGallery = [],
}: GalleryPickerProps) {
  const [items, setItems] = useState<GalleryItem[]>(() =>
    defaultGallery
      .filter(Boolean)
      .map((path, index) => ({
        id: `existing-${index}-${path}`,
        kind: 'existing' as const,
        path,
      })),
  );
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        kind: 'new',
        preview: null,
        error: null,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const openFilePicker = (id: string) => {
    inputRefs.current.get(id)?.click();
  };

  const handleFileChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setItems((current) =>
        current.map((item) =>
          item.id === id && item.kind === 'new'
            ? { ...item, preview: null, error: null }
            : item,
        ),
      );
      return;
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      setItems((current) =>
        current.map((item) =>
          item.id === id && item.kind === 'new'
            ? { ...item, preview: null, error: validationError }
            : item,
        ),
      );
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setItems((current) =>
        current.map((item) =>
          item.id === id && item.kind === 'new'
            ? {
                ...item,
                preview: fileReader.result as string,
                error: null,
              }
            : item,
        ),
      );
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div>
      <span className="mb-1 block text-sm font-medium">Galerie</span>

      {items.length > 0 ? (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:items-start"
            >
              {item.kind === 'existing' ? (
                <>
                  <input type="hidden" name="existingGallery" value={item.path} />
                  <div className="relative aspect-video w-full max-w-xs overflow-hidden border border-border">
                    <Image
                      src={getResponsiveImagePath(item.path, DEFAULT_IMAGE_WIDTH)}
                      alt="Obrázek v galerii"
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    name="gallery"
                    accept={ALLOWED_TYPES.join(', ')}
                    className="hidden"
                    ref={(element) => {
                      if (element) {
                        inputRefs.current.set(item.id, element);
                      } else {
                        inputRefs.current.delete(item.id);
                      }
                    }}
                    onChange={(event) => handleFileChange(item.id, event)}
                  />
                  {item.preview ? (
                    <div className="relative aspect-video w-full max-w-xs overflow-hidden border border-border">
                      <Image
                        src={item.preview}
                        alt="Nový obrázek v galerii"
                        fill
                        className="object-cover"
                        sizes="320px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <p className="flex aspect-video w-full max-w-xs items-center justify-center border border-dashed border-border p-4 text-sm text-light">
                      Obrázek nevybrán
                    </p>
                  )}
                  <div className="flex flex-col gap-2">
                    <ButtonAdmin
                      type="button"
                      onClick={() => openFilePicker(item.id)}
                    >
                      Vyber obrázek
                    </ButtonAdmin>
                    {item.error ? (
                      <p className="text-sm text-red">{item.error}</p>
                    ) : null}
                  </div>
                </>
              )}

              <ButtonAdmin
                type="button"
                color="light"
                onClick={() => removeItem(item.id)}
              >
                Odebrat
              </ButtonAdmin>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-light">Galerie je prázdná.</p>
      )}

      <ButtonAdmin type="button" onClick={addItem} className="mt-3">
        {items.length === 0 ? 'Přidat obrázek' : 'Přidat další obrázek'}
      </ButtonAdmin>
    </div>
  );
}

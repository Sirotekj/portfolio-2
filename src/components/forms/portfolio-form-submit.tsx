'use client';

import ButtonAdmin from '@/components/admin/button-admin';

type PortfolioFormSubmitProps = {
  disabled?: boolean;
  pending?: boolean;
  uploading?: boolean;
};

export default function PortfolioFormSubmit({
  disabled = false,
  pending = false,
  uploading = false,
}: PortfolioFormSubmitProps) {
  const isBusy = disabled || pending || uploading;

  let label = 'Potvrdit';

  if (uploading) {
    label = 'Nahrávám obrázky…';
  } else if (pending) {
    label = 'Ukládám projekt…';
  }

  return (
    <ButtonAdmin type="submit" color="dark" disabled={isBusy}>
      <strong>{label}</strong>
    </ButtonAdmin>
  );
}

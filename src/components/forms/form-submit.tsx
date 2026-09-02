'use client';

import { useFormStatus } from 'react-dom';
import ButtonAdmin from '@/components/admin/button-admin';

export default function FormSubmit() {
  const { pending } = useFormStatus();

  return (
    <ButtonAdmin type="submit" color="dark" disabled={pending}>
      <strong>{pending ? 'Zpracovávám...' : 'Potvrdit'}</strong>
    </ButtonAdmin>
  );
}

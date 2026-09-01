'use client';

import { useFormStatus } from 'react-dom';
//import ButtonPage from '@/components/utils/button-page';

export default function FormSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="cursor-pointer border rounded-sm p-1 col-start-4 hover:shadow-md hover:bg-background/10"
      disabled={pending}
    >
      <strong>{pending ? 'Zpracovávám...' : 'Potvrdit'}</strong>
    </button>
  );
}

import type { Metadata } from 'next';

import AboutEditor from '@/components/admin/about-editor';
import EditShell from '@/components/admin/edit-shell';
import { getAboutEditorData } from '@/lib/actions/about-prisma';
import type { AboutEditorData } from '@/types/types';

export const metadata: Metadata = {
  title: 'Editace | O mně',
};

const emptyAboutData: AboutEditorData = {
  aboutPage: {
    id: 1,
    photo: '',
    intro: '',
    introEn: null,
  },
  skills: [],
  languages: [],
  education: [],
  jobs: [],
  hobbies: [],
};

export default async function EditAboutPage() {
  let data = emptyAboutData;

  try {
    data = await getAboutEditorData();
  } catch {
    data = emptyAboutData;
  }

  return (
    <EditShell
      title="O mně"
      description="Každá sekce odpovídá vlastnímu formuláři a modelu v databázi."
    >
      <AboutEditor data={data} />
    </EditShell>
  );
}

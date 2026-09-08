import type { Metadata } from 'next';

import EditShell from '@/components/admin/edit-shell';
import SettingsForm from '@/components/forms/settings-form';
import { getOrCreateSiteSettings } from '@/lib/actions/settings-actions';
import { defaultSiteSettings } from '@/lib/site-settings/defaults';
import type { SiteSettingsView } from '@/types/types';

export const metadata: Metadata = {
  title: 'Editace | Nastavení',
};

export default async function EditSettingsPage() {
  let settings: SiteSettingsView = defaultSiteSettings;

  try {
    settings = await getOrCreateSiteSettings();
  } catch {
    settings = defaultSiteSettings;
  }

  return (
    <EditShell
      title="Nastavení webu"
      description="SEO, branding, kontakt a texty formuláře v patičce."
    >
      <SettingsForm settings={settings} />
    </EditShell>
  );
}

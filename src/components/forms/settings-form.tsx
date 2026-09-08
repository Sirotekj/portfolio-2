'use client';

import { useActionState } from 'react';

import type { SiteSettingsView } from '@/types/types';

import { saveSiteSettingsAction } from '@/lib/actions/settings-actions';

import {
  fieldClass,
  FormFeedback,
} from '@/components/forms/admin-fields';
import FormSubmit from '@/components/forms/form-submit';
import ImagePicker from '@/components/forms/image-picker';

type SettingsFormProps = {
  settings: SiteSettingsView;
};

function FieldPair({
  csId,
  enId,
  csName,
  enName,
  label,
  defaultCs,
  defaultEn,
  multiline = false,
}: {
  csId: string;
  enId: string;
  csName: string;
  enName: string;
  label: string;
  defaultCs: string;
  defaultEn?: string | null;
  multiline?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label htmlFor={csId} className="mb-1 block text-sm font-medium">
          {label} (CS)
        </label>
        {multiline ? (
          <textarea
            id={csId}
            name={csName}
            rows={3}
            defaultValue={defaultCs}
            className={fieldClass}
          />
        ) : (
          <input
            type="text"
            id={csId}
            name={csName}
            defaultValue={defaultCs}
            className={fieldClass}
          />
        )}
      </div>
      <div>
        <label htmlFor={enId} className="mb-1 block text-sm font-medium">
          {label} (EN)
        </label>
        {multiline ? (
          <textarea
            id={enId}
            name={enName}
            rows={3}
            defaultValue={defaultEn ?? ''}
            placeholder="Volitelné"
            className={fieldClass}
          />
        ) : (
          <input
            type="text"
            id={enId}
            name={enName}
            defaultValue={defaultEn ?? ''}
            placeholder="Volitelné"
            className={fieldClass}
          />
        )}
      </div>
    </div>
  );
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [state, formAction] = useActionState(saveSiteSettingsAction, {
    messages: [],
    errors: [],
  });

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-4 rounded-xl border border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">SEO a metadata</h2>
        <FieldPair
          csId="siteTitle"
          enId="siteTitleEn"
          csName="siteTitle"
          enName="siteTitleEn"
          label="Název webu"
          defaultCs={settings.siteTitle}
          defaultEn={settings.siteTitleEn}
        />
        <FieldPair
          csId="siteDescription"
          enId="siteDescriptionEn"
          csName="siteDescription"
          enName="siteDescriptionEn"
          label="Popis webu"
          defaultCs={settings.siteDescription}
          defaultEn={settings.siteDescriptionEn}
          multiline
        />
        <FieldPair
          csId="keywords"
          enId="keywordsEn"
          csName="keywords"
          enName="keywordsEn"
          label="Klíčová slova"
          defaultCs={settings.keywords}
          defaultEn={settings.keywordsEn}
        />
        <div>
          <label htmlFor="author" className="mb-1 block text-sm font-medium">
            Autor
          </label>
          <input
            type="text"
            id="author"
            name="author"
            defaultValue={settings.author}
            className={fieldClass}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Branding</h2>
        <ImagePicker
          label="Favicon"
          name="favicon"
          defaultImage={settings.favicon}
          existingImageFieldName="existingFavicon"
        />
        <ImagePicker
          label="Logo"
          name="logo"
          defaultImage={settings.logo}
          existingImageFieldName="existingLogo"
        />
        <ImagePicker
          label="OG obrázek"
          name="ogImage"
          defaultImage={settings.ogImage}
          existingImageFieldName="existingOgImage"
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Kontakt v patičce</h2>
        <FieldPair
          csId="contactHeader"
          enId="contactHeaderEn"
          csName="contactHeader"
          enName="contactHeaderEn"
          label="Nadpis kontaktu"
          defaultCs={settings.contactHeader}
          defaultEn={settings.contactHeaderEn}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium">
              E-mail
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              defaultValue={settings.contactEmail}
              className={fieldClass}
            />
          </div>
          <div>
            <label
              htmlFor="contactLocation"
              className="mb-1 block text-sm font-medium"
            >
              Místo
            </label>
            <input
              type="text"
              id="contactLocation"
              name="contactLocation"
              defaultValue={settings.contactLocation}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className="mb-1 block text-sm font-medium">
              Telefon
            </label>
            <input
              type="text"
              id="contactPhone"
              name="contactPhone"
              defaultValue={settings.contactPhone}
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Kontaktní formulář</h2>
        <FieldPair
          csId="formHeader"
          enId="formHeaderEn"
          csName="formHeader"
          enName="formHeaderEn"
          label="Nadpis formuláře"
          defaultCs={settings.formHeader}
          defaultEn={settings.formHeaderEn}
        />
        <FieldPair
          csId="formNameLabel"
          enId="formNameLabelEn"
          csName="formNameLabel"
          enName="formNameLabelEn"
          label="Popisek jména"
          defaultCs={settings.formNameLabel}
          defaultEn={settings.formNameLabelEn}
        />
        <FieldPair
          csId="formEmailLabel"
          enId="formEmailLabelEn"
          csName="formEmailLabel"
          enName="formEmailLabelEn"
          label="Popisek e-mailu"
          defaultCs={settings.formEmailLabel}
          defaultEn={settings.formEmailLabelEn}
        />
        <FieldPair
          csId="formMessageLabel"
          enId="formMessageLabelEn"
          csName="formMessageLabel"
          enName="formMessageLabelEn"
          label="Popisek zprávy"
          defaultCs={settings.formMessageLabel}
          defaultEn={settings.formMessageLabelEn}
        />
        <FieldPair
          csId="formSubmitLabel"
          enId="formSubmitLabelEn"
          csName="formSubmitLabel"
          enName="formSubmitLabelEn"
          label="Text tlačítka"
          defaultCs={settings.formSubmitLabel}
          defaultEn={settings.formSubmitLabelEn}
        />
      </section>

      <FormFeedback errors={state.errors} messages={state.messages} />

      <FormSubmit />
    </form>
  );
}

import type { ReactNode } from 'react';

import FooterContactForm from '@/components/footer-contact-form';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getLocalizedFooterSettings } from '@/lib/site-settings/localize';
import { getSiteSettings } from '@/lib/site-settings/queries';

const footerHeadingClass = 'mb-3 text-[28px] text-black tracking-wide 2xl:pb-1';

type FooterProps = {
  locale: Locale;
};

function ContactItem({
  children,
  nowrap = false,
}: {
  children: ReactNode;
  nowrap?: boolean;
}) {
  return (
    <li>
      <div className="relative w-2/5">
        <p className={nowrap ? 'whitespace-nowrap' : undefined}>{children}</p>
        <span className="absolute bottom-px left-0 hidden h-0.5 w-4/5 translate-y-1/2 bg-footer-line md:block lg:w-full" />
      </div>
    </li>
  );
}

export default async function Footer({ locale }: FooterProps) {
  const settings = await getSiteSettings();
  const messages = getMessages(locale);
  const texts = getLocalizedFooterSettings(settings, locale);

  return (
    <footer>
      <div className="w-full bg-footer-light">
        <div className="mx-auto grid w-full max-w-footer grid-cols-1 justify-between px-6 py-12 lg:grid-cols-2 lg:items-start lg:px-16">
          <div className="col-span-1 max-w-64 py-8 pt-4 pb-2 tracking-wide lg:py-0 lg:pt-12 lg:pb-4">
            <h1 className={footerHeadingClass}>{texts.contactHeader}</h1>
            <ul className="flex w-full list-none flex-col justify-start p-0 text-black leading-7 lg:leading-8 xl:leading-[2.4rem]">
              {texts.contactEmail ? (
                <ContactItem>{texts.contactEmail}</ContactItem>
              ) : null}
              {texts.contactLocation ? (
                <ContactItem nowrap>{texts.contactLocation}</ContactItem>
              ) : null}
              {texts.contactPhone ? (
                <ContactItem nowrap>{texts.contactPhone}</ContactItem>
              ) : null}
            </ul>
          </div>

          <div className="col-span-1 w-full pt-4 pb-2 md:pt-12 md:pb-4">
            <h1 className={`${footerHeadingClass} tracking-wider`}>
              {texts.formHeader}
            </h1>
            <FooterContactForm
              locale={locale}
              labels={{
                formNameLabel: texts.formNameLabel,
                formEmailLabel: texts.formEmailLabel,
                formMessageLabel: texts.formMessageLabel,
                formSubmitLabel: texts.formSubmitLabel,
              }}
              formMessages={messages.footer.form}
            />
          </div>
        </div>
      </div>

      <div className="bg-footer-dark py-3 text-center text-sm text-white">
        <ul className="mx-auto flex w-full max-w-footer list-none flex-wrap items-center justify-center gap-4 p-0 px-6 lg:px-8">
          <li>Copyright {new Date().getFullYear()} ©</li>
          <li>Sára Šebelíková.</li>
        </ul>
      </div>
    </footer>
  );
}

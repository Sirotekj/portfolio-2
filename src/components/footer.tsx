import type { ReactNode } from 'react';

import FooterContactForm from '@/components/footer-contact-form';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getLocalizedFooterSettings } from '@/lib/site-settings/localize';
import { getSiteSettings } from '@/lib/site-settings/queries';

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
      <div className="site-footer__contact-item">
        <p className={nowrap ? 'whitespace-nowrap' : undefined}>{children}</p>
        <span className="site-footer__contact-line" />
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
      <div className="site-footer__main">
        <div className="site-footer__grid">
          <div className="site-footer__section site-footer__section--contact">
            <h2 className="site-footer__heading">{texts.contactHeader}</h2>
            <ul className="site-footer__contact-list">
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

          <div className="site-footer__section">
            <h2 className="site-footer__heading site-footer__heading--form">
              {texts.formHeader}
            </h2>
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

      <div className="site-footer__bar">
        <ul className="site-footer__bar-list">
          <li>Copyright {new Date().getFullYear()} ©</li>
          <li>Sára Šebelíková.</li>
        </ul>
      </div>
    </footer>
  );
}

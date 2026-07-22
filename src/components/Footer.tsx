import { getFooter } from './dummy-footer';

export default function Footer() {
  const texts = getFooter();

  return (
    <footer>
      <div className="footer">
        <div className="footer-container grid grid-cols-1 justify-between px-6 py-12 lg:grid-cols-2 lg:items-start lg:px-16">
          <div className="kontakt-wrapper col-span-1 max-w-64 pt-4 pb-2 tracking-wide text-start lg:py-0 lg:pt-12 lg:pb-4 py-8">
            <h1 className="nadpis-footer malej-nadpis mb-3 h-1/5 tracking-wide 2xl:pb-1">
              {texts.kontakt_header}
            </h1>
            <ul className="malej-text flex h-4/5 w-full flex-col justify-start">
              <li>
                <div className="relative w-2/5 w-max-8">
                  <p>{texts.kontakt_mail}</p>
                  <span className="absolute bottom-px left-0 hidden h-2 w-4/5 lajna-footer md:flex lg:w-full" />
                </div>
              </li>
              <li>
                <div className="relative w-2/5 w-max-8">
                  <p className="whitespace-nowrap">{texts.kontakt_bydliste}</p>
                  <span className="absolute bottom-px left-0 hidden h-2 w-4/5 lajna-footer md:flex lg:w-full" />
                </div>
              </li>
              <li>
                <div className="relative w-2/5 w-max-8">
                  <p className="whitespace-nowrap">{texts.kontakt_telefon}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="formular-wrapper col-span-1 w-full pt-4 pb-2 md:pt-12 md:pb-4">
            <h1 className="nadpis-footer malej-nadpis mb-3 h-1/5 tracking-wider text-start 2xl:pb-1 2xl:text-left">
              {texts.formular_header}
            </h1>
            <form className="footer-form h-4/5" action="" id="contact_form">
              <div className="form-wrapper grid grid-cols-1 gap-x-2 sm:grid-cols-2">
                <div className="flex flex-col items-center justify-center">
                  <input
                    type="text"
                    placeholder={texts.fomrular_jmeno}
                    className="mb-2 w-full sm:w-full"
                    id="contact_name"
                  />
                  <input
                    type="email"
                    placeholder={texts.formular_mail}
                    className="mb-2 w-full sm:w-full"
                    id="contact_email"
                  />
                  <textarea
                    placeholder={texts.formular_zprava}
                    className="mb-2 flex h-auto w-full sm:hidden"
                    id="contact_message2"
                  />
                  <button
                    className="default-btn w-full py-1 text-base font-medium sm:w-full"
                    id="contact_submit"
                    type="submit"
                  >
                    {texts.formular_odeslat}
                  </button>
                </div>
                <div>
                  <textarea
                    placeholder={texts.formular_zprava}
                    className="hidden h-full w-full sm:flex"
                    id="contact_message"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-footer-black py-3 text-center text-sm text-white">
        <ul className="mx-auto flex flex-wrap items-center justify-center gap-4 px-6 lg:px-8">
          <li>Copyright {new Date().getFullYear()} ©</li>
          <li>Sára Šebelíková.</li>
        </ul>
      </div>
    </footer>
  );
}

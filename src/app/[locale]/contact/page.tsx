import { PageHero } from '@/components/sections/page-hero';
import { JsonLd } from '@/components/shared/json-ld';
import { MailIcon, PhoneIcon } from '@/components/ui/icons';
import { SERVICES, getServiceCopy } from '@/content/services';
import { SITE } from '@/content/site';
import { ContactForm } from '@/features/contact/components/contact-form';
import { hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { pages } = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/contact',
    title: pages.contact.metaTitle,
    description: pages.contact.metaDescription,
  });
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const contact = dict.pages.contact;
  const services = SERVICES.map((service) => ({
    value: service.slug,
    label: getServiceCopy(service, locale).title,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: dict.nav.home, path: '/' },
          { name: contact.eyebrow, path: '/contact' },
        ])}
      />
      <PageHero
        eyebrow={contact.eyebrow}
        title={contact.title}
        description={contact.description}
        breadcrumb={[
          { label: dict.nav.home, href: localizedPath(locale) },
          { label: contact.eyebrow },
        ]}
      />

      <section
        id="appointment"
        className="mx-auto grid max-w-7xl scroll-mt-24 grid-cols-12 items-start gap-5 px-6 py-20"
      >
        <div className="col-span-12 rounded-3xl border border-emerald-900/60 bg-forest-deep p-8 shadow-2xl lg:col-span-5">
          <h2 className="text-xl font-extrabold tracking-tight text-brand">{contact.infoTitle}</h2>
          <ul className="mt-6 space-y-5">
            <li className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                <MailIcon className="h-5 w-5" />
              </span>
              <div>
                <span className="block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  {contact.email}
                </span>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm font-semibold text-white transition-colors hover:text-brand"
                >
                  {SITE.email}
                </a>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <div>
                <span className="block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  {contact.phone}
                </span>
                <a
                  href={SITE.phoneHref}
                  className="text-sm font-semibold text-white transition-colors hover:text-brand"
                >
                  {SITE.phone}
                </a>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-span-12 w-full items-start gap-6 lg:col-span-7">
          <div className="relative rounded-3xl border border-emerald-900/60 bg-forest-deep p-8 shadow-2xl sm:p-10 lg:col-span-7">
            <h2 className="mb-6 text-xl font-extrabold tracking-tight text-white">
              {contact.form.title}
            </h2>
            <ContactForm dict={contact.form} services={services} />
          </div>
        </div>
      </section>
    </>
  );
}

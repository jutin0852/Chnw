import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";

type PolicySection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export default function PolicyPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-screen bg-paper text-ink outline-none">
        <article className="mx-auto max-w-[1120px] px-4 py-16 sm:px-8 sm:py-24">
          <p className="label text-[12px] text-thread">{eyebrow}</p>
          <h1 data-split="lines" data-intro className="mt-4 max-w-3xl text-[48px] leading-[0.98] sm:text-[80px]">{title}</h1>
          <p className="mt-7 max-w-2xl text-[17px] leading-[1.65] text-[#3d3832]">{intro}</p>
          <p className="label mt-6 text-[11px] text-stone">Last updated 18 September 2026</p>

          <div className="mt-14 border-t border-ink">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-[var(--line)] py-8 sm:grid sm:grid-cols-[240px_1fr] sm:gap-10">
                <h2 className="font-display text-[24px] leading-tight">{section.title}</h2>
                <div className="mt-4 space-y-4 text-[16px] leading-[1.65] text-[#3d3832] sm:mt-0">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && <ul className="list-disc space-y-2 pl-5">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

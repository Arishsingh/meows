const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:6191").replace(/\/$/, "");
const TITLE = "Create account · Rankly";
const DESCRIPTION = "Start auditing deployed sites for SEO gaps and keep fix history in one place.";
const IMAGE = SITE + "/opengraph-image";

export default function Head() {
  return (
    <>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={SITE + "/sign-up"} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={IMAGE} />
      <meta property="og:url" content={SITE + "/sign-up"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={IMAGE} />
    </>
  );
}
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:6191").replace(/\/$/, "");
const TITLE = "Sign in · Rankly";
const DESCRIPTION = "Access your SEO audits, tracked sites, and fix history.";
const IMAGE = SITE + "/opengraph-image";

export default function Head() {
  return (
    <>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={SITE + "/sign-in"} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={IMAGE} />
      <meta property="og:url" content={SITE + "/sign-in"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={IMAGE} />
    </>
  );
}
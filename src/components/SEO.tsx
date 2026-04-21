import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
}

export const SEO = ({ title, description, canonical }: SEOProps) => {
  const fullTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description.slice(0, 160)} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description.slice(0, 160)} />}
    </Helmet>
  );
};

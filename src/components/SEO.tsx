import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
}

export function SEO({ title, description, canonical, ogImage }: SEOProps) {
  const siteName = 'Amare Resort Wear'
  const fullTitle = `${title} | ${siteName}`
  const defaultOgImage = 'https://amareswimwear.com/og-image.jpg' // Replace with your default OG image URL

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* Additional tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
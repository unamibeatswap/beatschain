export const pageQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    title,
    heroSection {
      headline,
      subheadline,
      backgroundImage,
      style,
      ctaButtons[] {
        text,
        url,
        style
      },
      badges[]
    },
    contentBlocks[] {
      type,
      title,
      items[] {
        title,
        description,
        icon,
        value
      },
      backgroundColor
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    title,
    description,
    logo,
    seo {
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`
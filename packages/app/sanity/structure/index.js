import { blockTemplates } from './blockTemplates'

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Pages
      S.listItem()
        .title('Pages')
        .child(
          S.documentList()
            .title('Pages')
            .filter('_type == "page"')
        ),
      
      // Blog Posts
      S.listItem()
        .title('Blog Posts')
        .child(
          S.documentList()
            .title('Blog Posts')
            .filter('_type == "post"')
        ),
      
      // Beats
      S.listItem()
        .title('Beats')
        .child(
          S.documentList()
            .title('Beats')
            .filter('_type == "beat"')
        ),
      
      // Producers
      S.listItem()
        .title('Producers')
        .child(
          S.documentList()
            .title('Producers')
            .filter('_type == "producer"')
        ),
      
      // Navigation
      S.listItem()
        .title('Navigation')
        .child(
          S.documentList()
            .title('Navigation')
            .filter('_type == "navigation"')
        ),
      
      // Block Templates
      S.listItem()
        .title('Block Templates')
        .child(
          S.list()
            .title('Block Templates')
            .items(
              blockTemplates.map(template => 
                S.listItem()
                  .title(template.title)
                  .child(
                    S.editor()
                      .id(template.title.toLowerCase().replace(/\s+/g, '-'))
                      .schemaType('page')
                      .documentId('template-' + template.title.toLowerCase().replace(/\s+/g, '-'))
                      .initialValueTemplate(() => {
                        return {
                          _type: 'page',
                          title: `Template: ${template.title}`,
                          contentBlocks: [template.value]
                        }
                      })
                  )
              )
            )
        ),
      
      // Settings
      S.listItem()
        .title('Settings')
        .child(
          S.editor()
            .id('siteSettings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      
      // Divider
      S.divider(),
      
      // UI Components
      S.listItem()
        .title('UI Components')
        .child(
          S.list()
            .title('UI Components')
            .items([
              S.listItem()
                .title('Card Styles')
                .child(
                  S.list()
                    .title('Card Styles')
                    .items([
                      S.listItem()
                        .title('Beat Card Styles')
                        .child(
                          S.documentList()
                            .title('Beat Card Styles')
                            .filter('_type == "beatCardStyle"')
                        ),
                      S.listItem()
                        .title('Producer Card Styles')
                        .child(
                          S.documentList()
                            .title('Producer Card Styles')
                            .filter('_type == "producerCardStyle"')
                        )
                    ])
                ),
              S.listItem()
                .title('Pagination Styles')
                .child(
                  S.documentList()
                    .title('Pagination Styles')
                    .filter('_type == "paginationStyle"')
                ),
              S.listItem()
                .title('Contact Form Styles')
                .child(
                  S.documentList()
                    .title('Contact Form Styles')
                    .filter('_type == "contactFormStyle"')
                )
            ])
        )
    ])
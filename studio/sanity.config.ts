import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { resolve } from './presentation';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

export default defineConfig({
  name: 'default',
  title: 'House of Dimah website',
  projectId: 'z8yud8k3',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    // Side-by-side preview: the draft-showing copy of the site, built from the studio-preview branch
    presentationTool({
      title: 'Preview',
      resolve,
      previewUrl: {
        origin: 'https://studio-preview--houseofdimah.netlify.app',
        previewMode: { enable: '/api/draft-mode/enable/', disable: '/api/draft-mode/disable/' },
      },
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    // site settings is a single document: no "new" or "delete" for it
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== 'siteSettings'),
    actions: (prev, ctx) => (ctx.schemaType === 'siteSettings' ? prev.filter((a) => !['delete', 'duplicate', 'unpublish'].includes(a.action ?? '')) : prev),
  },
});

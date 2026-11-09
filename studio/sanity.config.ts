import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

export default defineConfig({
  name: 'default',
  title: 'House of Dimah website',
  projectId: 'z8yud8k3',
  dataset: 'production',
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
  document: {
    // site settings is a single document: no "new" or "delete" for it
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== 'siteSettings'),
    actions: (prev, ctx) => (ctx.schemaType === 'siteSettings' ? prev.filter((a) => !['delete', 'duplicate', 'unpublish'].includes(a.action ?? '')) : prev),
  },
});

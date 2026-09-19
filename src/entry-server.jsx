import { prerenderToNodeStream } from 'react-dom/static';
import App from './App.jsx';
import { setInitialContent } from './lib/content.js';
export { headFor } from './seo/head.js';
export { sitemapXml, robotsTxt, llmsTxt } from './seo/files.js';

// Waits for lazy pages (Commission, Legal), unlike renderToString.
export async function render(url, content) {
  setInitialContent(content);
  const { prelude } = await prerenderToNodeStream(<App url={url} />);
  let html = '';
  for await (const chunk of prelude) html += chunk.toString();
  return html;
}

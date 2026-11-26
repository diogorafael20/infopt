import { Router } from 'itty-router';

const router = Router();

// News sources configuration
const NEWS_SOURCES = {
  portugal: [
    { name: 'Público', url: 'https://www.publico.pt/rss' },
    { name: 'Observador', url: 'https://observador.pt/feed/' },
    { name: 'Expresso', url: 'https://expresso.pt/rss' },
    { name: 'Visão', url: 'https://visao.pt/rss' },
    { name: 'TSF', url: 'https://feeds.feedburner.com/TSF-Ultimas' },
  ],
  internacional: [
    { name: 'BBC', url: 'http://feeds.bbc.co.uk/news/world/rss.xml' },
    { name: 'Reuters', url: 'https://www.reutersagency.com/feed/?rpc=1&taxonomy=best-topics' },
    { name: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss' },
  ],
  futebol: [
    { name: 'Abola', url: 'https://www.abola.pt/rss/feed' },
    { name: 'Record', url: 'https://www.record.pt/rss' },
    { name: 'Maisfutebol', url: 'https://maisfutebol.iol.pt/rss' },
  ],
  financas: [
    { name: 'ECO', url: 'https://eco.sapo.pt/feed/' },
    { name: 'Dinheiro Vivo', url: 'https://www.dinheirovivo.pt/feed/' },
    { name: 'Negócios', url: 'https://www.negocios.pt/rss' },
  ],
};

// Decode HTML entities
function decodeHTML(html: string): string {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8217;': "'",
    '&#39;': "'",
    '&nbsp;': ' ',
  };
  let text = html;
  for (const [entity, char] of Object.entries(entities)) {
    text = text.replace(new RegExp(entity, 'g'), char);
  }
  // Decode decimal and hexadecimal numeric entities.
  text = text.replace(/&#(x?[0-9a-f]+);/gi, (_, value) => {
    const codePoint = value[0].toLowerCase() === 'x'
      ? parseInt(value.slice(1), 16)
      : parseInt(value, 10);
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : _;
  });
  return text;
}

function readCharset(response: Response, bytes: Uint8Array): string {
  const headerCharset = response.headers.get('content-type')?.match(/charset\s*=\s*["']?([^;\s"']+)/i)?.[1];
  if (headerCharset) return headerCharset;

  const declaration = new TextDecoder('ascii').decode(bytes.slice(0, 250));
  return declaration.match(/<\?xml[^>]*encoding\s*=\s*["']([^"']+)["']/i)?.[1] || 'utf-8';
}

async function readFeedText(response: Response): Promise<string> {
  const bytes = new Uint8Array(await response.arrayBuffer());
  const charset = readCharset(response, bytes);

  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder('utf-8').decode(bytes);
  }
}

function cleanFeedText(value: string): string {
  let text = decodeHTML(value);
  text = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  text = text.replace(/<[^>]*>/g, ' ');
  return decodeHTML(text).replace(/\s+/g, ' ').trim();
}

// Parse RSS feed
async function parseFeed(feedUrl: string) {
  try {
    const response = await fetch(feedUrl);
    const text = await readFeedText(response);

    // Simple XML parsing (basic implementation)
    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null) {
      const item = match[1];

      // Extract raw XML content. It is normalized after HTML entities are decoded.
      const extractContent = (regex: RegExp) => {
        const match = regex.exec(item);
        if (!match) return '';
        return match[1];
      };

      const title = extractContent(/<title[^>]*>(.*?)<\/title>/s) || 'No title';
      const link = extractContent(/<link[^>]*>(.*?)<\/link>/s) || '';
      const description = extractContent(/<description[^>]*>(.*?)<\/description>/s) || '';
      const pubDate = extractContent(/<pubDate[^>]*>(.*?)<\/pubDate>/s) || '';

      items.push({
        title: cleanFeedText(title),
        link: cleanFeedText(link),
        description: cleanFeedText(description).substring(0, 200),
        pubDate,
      });
    }

    return items.slice(0, 10); // Limit to 10 items per source
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error);
    return [];
  }
}

// Root endpoint
router.get('/', () => {
  return new Response(
    JSON.stringify({
      name: 'InfoPT',
      description: 'Portuguese news aggregator',
      version: '0.1.0',
      endpoints: {
        news: '/api/news/:category (portugal|internacional|futebol|financas)',
        health: '/health',
      },
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
});

// Fetch news from all sources
router.get('/api/news/:category?', async (request) => {
  const category = (request as any).params.category || 'portugal';
  const sources = NEWS_SOURCES[category as keyof typeof NEWS_SOURCES] || NEWS_SOURCES.portugal;

  const allNews: any[] = [];

  for (const source of sources) {
    const items = await parseFeed(source.url);
    allNews.push(
      ...items.map(item => ({
        ...item,
        source: source.name,
        category,
      }))
    );
  }

  // Sort by date (newest first)
  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return new Response(JSON.stringify(allNews), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

// Health check
router.get('/health', () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// 404
router.all('*', () => new Response('Not found', { status: 404 }));

export default router;

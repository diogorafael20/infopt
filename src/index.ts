import { Router } from 'itty-router';

const router = Router();

// News sources configuration
const NEWS_SOURCES = {
  portugal: [
    { name: 'Público', url: 'https://www.publico.pt/rss' },
    { name: 'Observador', url: 'https://observador.pt/feed/' },
    { name: 'Expresso', url: 'https://expresso.pt/rss' },
    { name: 'Visão', url: 'https://visao.pt/rss' },
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

// Parse RSS feed
async function parseFeed(feedUrl: string) {
  try {
    const response = await fetch(feedUrl);
    const text = await response.text();

    // Simple XML parsing (basic implementation)
    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null) {
      const item = match[1];
      const title = item.match(/<title[^>]*>(.*?)<\/title>/)?.[1] || 'No title';
      const link = item.match(/<link[^>]*>(.*?)<\/link>/)?.[1] || '';
      const description = item.match(/<description[^>]*>(.*?)<\/description>/)?.[1] || '';
      const pubDate = item.match(/<pubDate[^>]*>(.*?)<\/pubDate>/)?.[1] || '';

      items.push({
        title: title.replace(/<[^>]*>/g, ''),
        link,
        description: description.replace(/<[^>]*>/g, '').substring(0, 200),
        pubDate,
      });
    }

    return items.slice(0, 10); // Limit to 10 items per source
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error);
    return [];
  }
}

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

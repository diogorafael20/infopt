import { Router } from 'itty-router';

const router = Router();

const NEWS_SOURCES = {
  portugal: [
    { name: 'Público', url: 'https://feeds.feedburner.com/PublicoRSS' },
    { name: 'Observador', url: 'https://observador.pt/feed/' },
    { name: 'Expresso', url: 'https://feeds.feedburner.com/expresso-geral' },
    { name: 'Visão', url: 'https://visao.pt/rss' },
    { name: 'CM', url: 'https://www.cmjornal.pt/rss' },
    { name: 'DN', url: 'https://feeds.feedburner.com/dn-ultimas' },
    { name: 'JN', url: 'https://feeds.feedburner.com/jn-ultimas' },
    { name: 'RTP', url: 'https://www.rtp.pt/noticias/rss' },
    { name: 'CNN Portugal', url: 'https://cnnportugal.iol.pt/rss.xml' },
    { name: 'Notícias ao Minuto', url: 'https://www.noticiasaominuto.com/rss/ultima-hora' },
    { name: 'Sábado', url: 'https://www.sabado.pt/rss' },
    { name: 'TSF', url: 'https://feeds.feedburner.com/TSF-Ultimas' },
  ],
  internacional: [
    { name: 'BBC', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'BBC Brasil', url: 'https://feeds.bbci.co.uk/portuguese/rss.xml' },
    { name: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss' },
    { name: 'Reuters', url: 'https://www.reutersagency.com/feed/?rpc=1&taxonomy=best-topics' },
    { name: 'NYT', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
    { name: 'France 24', url: 'https://www.france24.com/en/rss' },
    { name: 'DW', url: 'https://rss.dw.com/xml/rss_en_world' },
    { name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada' },
    { name: 'Euractiv', url: 'https://www.euractiv.com/feed/' },
  ],
  futebol: [
    { name: 'Abola', url: 'https://feeds.feedburner.com/abola' },
    { name: 'Record', url: 'https://www.record.pt/rss' },
    { name: 'Maisfutebol', url: 'https://maisfutebol.iol.pt/rss' },
    { name: 'ZeroZero', url: 'https://www.zerozero.pt/rss/noticias.php' },
    { name: 'Marca', url: 'https://e00-marca.uecdn.es/rss/portada.xml' },
    { name: 'AS', url: 'https://feeds.as.com/mrss-s/pages/as/site/as.com/section/futbol/portada' },
  ],
  desporto: [
    { name: 'Record', url: 'https://www.record.pt/rss' },
    { name: 'Abola', url: 'https://feeds.feedburner.com/abola' },
    { name: 'Maisfutebol', url: 'https://maisfutebol.iol.pt/rss' },
    { name: 'ESPN', url: 'https://www.espn.com/espn/rss/news' },
    { name: 'Marca', url: 'https://e00-marca.uecdn.es/rss/portada.xml' },
  ],
  financas: [
    { name: 'ECO', url: 'https://eco.sapo.pt/feed/' },
    { name: 'Dinheiro Vivo', url: 'https://www.dinheirovivo.pt/feed/' },
    { name: 'Negócios', url: 'https://www.negocios.pt/rss' },
    { name: 'Jornal Económico', url: 'https://jornaleconomico.pt/feed' },
    { name: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss' },
  ],
  tecnologia: [
    { name: 'Pplware', url: 'https://pplware.sapo.pt/feed/' },
    { name: 'Tek', url: 'https://tek.sapo.pt/rss' },
    { name: 'Exame Informática', url: 'https://visao.pt/exameinformatica/feed/' },
    { name: 'PCGuia', url: 'https://www.pcguia.pt/feed/' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { name: 'Wired', url: 'https://www.wired.com/feed/rss' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  ],
  cultura: [
    { name: 'Observador', url: 'https://observador.pt/seccao/cultura/feed/' },
    { name: 'Visão', url: 'https://visao.pt/cultura/feed/' },
    { name: 'BBC', url: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml' },
  ],
  ciencia: [
    { name: 'BBC', url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml' },
    { name: 'Nature', url: 'https://www.nature.com/nature.rss' },
    { name: 'ScienceDaily', url: 'https://www.sciencedaily.com/rss/all.xml' },
    { name: 'Space', url: 'https://www.space.com/feeds/all' },
    { name: 'NASA', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss' },
  ],
};

const CATEGORY_IDS = Object.keys(NEWS_SOURCES);

function decodeHTML(html: string): string {
  const entities: Record<string, string> = {
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

function extractImage(item: string): string {
  const patterns = [
    /<media:content[^>]*url=["']([^"']+)["'][^>]*medium=["']image["'][^>]*\/?>/i,
    /<media:content[^>]*medium=["']image["'][^>]*url=["']([^"']+)["'][^>]*\/?>/i,
    /<media:content[^>]*url=["']([^"']+\.(?:jpg|jpeg|png|webp|gif)[^"']*)["'][^>]*\/?>/i,
    /<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*\/?>/i,
    /<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image[^"']*["'][^>]*\/?>/i,
    /<enclosure[^>]*type=["']image[^"']*["'][^>]*url=["']([^"']+)["'][^>]*\/?>/i,
    /<img[^>]*src=["']([^"']+)["'][^>]*\/?>/i,
  ];

  for (const pattern of patterns) {
    const match = item.match(pattern);
    if (!match?.[1]) continue;
    const url = decodeHTML(match[1]).trim();
    if (/^https?:\/\//i.test(url)) return url;
  }

  return '';
}

function extractBlock(item: string, regex: RegExp): string {
  const match = regex.exec(item);
  return match?.[1] || '';
}

function parseRssItems(text: string) {
  const items: any[] = [];
  const itemRegex = /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(text)) !== null) {
    const item = match[1];
    const title = extractBlock(item, /<title[^>]*>([\s\S]*?)<\/title>/i) || 'No title';
    const link = extractBlock(item, /<link[^>]*>([\s\S]*?)<\/link>/i) || '';
    const description = extractBlock(item, /<description[^>]*>([\s\S]*?)<\/description>/i) || '';
    const contentEncoded = extractBlock(item, /<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i) || '';
    const pubDate = extractBlock(item, /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || '';
    const image = extractImage(item) || extractImage(contentEncoded) || extractImage(description);

    items.push({
      title: cleanFeedText(title),
      link: cleanFeedText(link),
      description: cleanFeedText(description).substring(0, 200),
      pubDate: cleanFeedText(pubDate),
      image,
    });
  }

  return items;
}

function parseAtomItems(text: string) {
  const items: any[] = [];
  const entryRegex = /<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi;
  let match;

  while ((match = entryRegex.exec(text)) !== null) {
    const item = match[1];
    const title = extractBlock(item, /<title[^>]*>([\s\S]*?)<\/title>/i) || 'No title';
    const linkHref = item.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i)?.[1]
      || extractBlock(item, /<link[^>]*>([\s\S]*?)<\/link>/i)
      || '';
    const description = extractBlock(item, /<summary[^>]*>([\s\S]*?)<\/summary>/i)
      || extractBlock(item, /<content[^>]*>([\s\S]*?)<\/content>/i)
      || '';
    const pubDate = extractBlock(item, /<published[^>]*>([\s\S]*?)<\/published>/i)
      || extractBlock(item, /<updated[^>]*>([\s\S]*?)<\/updated>/i)
      || '';
    const image = extractImage(item) || extractImage(description);

    items.push({
      title: cleanFeedText(title),
      link: cleanFeedText(linkHref),
      description: cleanFeedText(description).substring(0, 200),
      pubDate: cleanFeedText(pubDate),
      image,
    });
  }

  return items;
}

async function parseFeed(feedUrl: string) {
  try {
    const response = await fetch(feedUrl, {
      headers: { 'User-Agent': 'InfoPT/1.0 (+https://diogorafael20.github.io/infopt/)' },
    });
    if (!response.ok) return [];

    const text = await readFeedText(response);
    const items = text.includes('<entry') ? parseAtomItems(text) : parseRssItems(text);
    return items.slice(0, 10);
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error);
    return [];
  }
}

router.get('/', () => {
  return new Response(
    JSON.stringify({
      name: 'InfoPT',
      description: 'Portuguese news aggregator',
      version: '0.2.0',
      endpoints: {
        news: `/api/news/:category (${CATEGORY_IDS.join('|')})`,
        categories: '/api/categories',
        health: '/health',
      },
    }),
    { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
  );
});

router.get('/api/categories', () => {
  const categories = CATEGORY_IDS.map((id) => ({
    id,
    sources: NEWS_SOURCES[id as keyof typeof NEWS_SOURCES].map((s) => s.name),
  }));

  return new Response(JSON.stringify(categories), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
});

router.get('/api/news/:category?', async (request) => {
  const category = (request as any).params.category || 'portugal';
  const sources = NEWS_SOURCES[category as keyof typeof NEWS_SOURCES] || NEWS_SOURCES.portugal;

  const batches = await Promise.all(
    sources.map(async (source) => {
      const items = await parseFeed(source.url);
      return items.map((item) => ({
        ...item,
        source: source.name,
        category,
      }));
    })
  );

  const allNews = batches.flat();
  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return new Response(JSON.stringify(allNews), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=120',
    },
  });
});

router.get('/health', () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
});

router.all('*', () => new Response('Not found', { status: 404 }));

export default router;

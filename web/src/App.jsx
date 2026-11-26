import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'https://infopt.diogorafael212.workers.dev'

const CATEGORIAS = [
  { id: 'portugal', label: 'Portugal' },
  { id: 'internacional', label: 'Mundo' },
  { id: 'futebol', label: 'Futebol' },
  { id: 'desporto', label: 'Desporto' },
  { id: 'financas', label: 'Finanças' },
  { id: 'tecnologia', label: 'Tecnologia' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'ciencia', label: 'Ciência' },
]

const FONTES = {
  Público: { color: '#111111', domain: 'publico.pt' },
  Observador: { color: '#1a1a1a', domain: 'observador.pt' },
  Expresso: { color: '#c41e3a', domain: 'expresso.pt' },
  Visão: { color: '#e30613', domain: 'visao.pt' },
  CM: { color: '#c41230', domain: 'cmjornal.pt' },
  DN: { color: '#0055a5', domain: 'dn.pt' },
  JN: { color: '#e30613', domain: 'jn.pt' },
  RTP: { color: '#0072ce', domain: 'rtp.pt' },
  'CNN Portugal': { color: '#cc0000', domain: 'cnnportugal.iol.pt' },
  'Notícias ao Minuto': { color: '#f5a623', domain: 'noticiasaominuto.com' },
  Sábado: { color: '#8b0000', domain: 'sabado.pt' },
  TSF: { color: '#c8102e', domain: 'tsf.pt' },
  BBC: { color: '#bb1919', domain: 'bbc.com' },
  'BBC Brasil': { color: '#bb1919', domain: 'bbc.com' },
  Reuters: { color: '#ff8000', domain: 'reuters.com' },
  CNN: { color: '#cc0000', domain: 'cnn.com' },
  NYT: { color: '#111111', domain: 'nytimes.com' },
  'Al Jazeera': { color: '#fa9000', domain: 'aljazeera.com' },
  'France 24': { color: '#004b93', domain: 'france24.com' },
  DW: { color: '#0098d8', domain: 'dw.com' },
  'El País': { color: '#1066a8', domain: 'elpais.com' },
  Euractiv: { color: '#1b75bb', domain: 'euractiv.com' },
  Abola: { color: '#e30613', domain: 'abola.pt' },
  Record: { color: '#c8102e', domain: 'record.pt' },
  Maisfutebol: { color: '#009639', domain: 'maisfutebol.iol.pt' },
  ZeroZero: { color: '#1b5e20', domain: 'zerozero.pt' },
  Marca: { color: '#e30613', domain: 'marca.com' },
  AS: { color: '#e30613', domain: 'as.com' },
  ESPN: { color: '#d00', domain: 'espn.com' },
  ECO: { color: '#00a3e0', domain: 'eco.sapo.pt' },
  'Dinheiro Vivo': { color: '#0b3d2e', domain: 'dinheirovivo.pt' },
  Negócios: { color: '#003366', domain: 'negocios.pt' },
  'Jornal Económico': { color: '#1a237e', domain: 'jornaleconomico.pt' },
  Bloomberg: { color: '#2800d7', domain: 'bloomberg.com' },
  Pplware: { color: '#e85d04', domain: 'pplware.sapo.pt' },
  Tek: { color: '#00a3e0', domain: 'tek.sapo.pt' },
  'Exame Informática': { color: '#111111', domain: 'visao.pt' },
  PCGuia: { color: '#0066cc', domain: 'pcguia.pt' },
  'The Verge': { color: '#3b82f6', domain: 'theverge.com' },
  Wired: { color: '#111111', domain: 'wired.com' },
  'Ars Technica': { color: '#ff4e00', domain: 'arstechnica.com' },
  TechCrunch: { color: '#0a9e01', domain: 'techcrunch.com' },
  Nature: { color: '#c5000b', domain: 'nature.com' },
  ScienceDaily: { color: '#004b87', domain: 'sciencedaily.com' },
  Space: { color: '#0b3d91', domain: 'space.com' },
  NASA: { color: '#0b3d91', domain: 'nasa.gov' },
}

function metaFonte(nome) {
  const base = FONTES[nome]
  if (base) return base
  return {
    color: '#243447',
    domain: '',
  }
}

function logoUrl(domain) {
  if (!domain) return ''
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`
}

function tempoRelativo(valor) {
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return ''

  const diffMs = Date.now() - data.getTime()
  const min = Math.round(diffMs / 60000)

  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const horas = Math.round(min / 60)
  if (horas < 24) return `há ${horas} h`
  const dias = Math.round(horas / 24)
  if (dias === 1) return 'ontem'
  if (dias < 7) return `há ${dias} dias`
  return data.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
}

function textoActualizado(data) {
  if (!data) return 'Ainda não actualizado'
  const min = Math.max(0, Math.round((Date.now() - data.getTime()) / 60000))
  if (min < 1) return 'Actualizado agora'
  if (min === 1) return 'Actualizado há 1 min'
  return `Actualizado há ${min} min`
}

function SourceBadge({ nome }) {
  const meta = metaFonte(nome)
  const [logoOk, setLogoOk] = useState(Boolean(meta.domain))
  const initial = (nome || '?').slice(0, 1).toUpperCase()

  useEffect(() => {
    setLogoOk(Boolean(meta.domain))
  }, [meta.domain, nome])

  return (
    <div className="source" title={nome}>
      {logoOk && meta.domain ? (
        <img
          className="source-logo"
          src={logoUrl(meta.domain)}
          alt=""
          width={34}
          height={34}
          loading="lazy"
          onError={() => setLogoOk(false)}
        />
      ) : (
        <span className="source-mark" style={{ background: meta.color }}>
          {initial}
        </span>
      )}
      <span className="source-name">{nome}</span>
    </div>
  )
}

function Story({ noticia, densidade, mostrarResumo, style }) {
  return (
    <a
      className={`story${densidade === 'compacto' ? ' compacto' : ''}`}
      href={noticia.link}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
    >
      <div className="story-body">
        <div className="story-top">
          <SourceBadge nome={noticia.source} />
          <time className="time" dateTime={noticia.pubDate}>
            {tempoRelativo(noticia.pubDate)}
          </time>
        </div>
        <h3>{noticia.title}</h3>
        {mostrarResumo && noticia.description ? <p>{noticia.description}</p> : null}
        <div className="story-foot">
          <span className="ler">Abrir notícia →</span>
        </div>
      </div>
    </a>
  )
}

export default function App() {
  const [categoria, setCategoria] = useState('portugal')
  const [fonte, setFonte] = useState('todas')
  const [pesquisa, setPesquisa] = useState('')
  const [densidade, setDensidade] = useState('normal')
  const [mostrarResumo, setMostrarResumo] = useState(true)
  const [ordenacao, setOrdenacao] = useState('recentes')
  const [noticias, setNoticias] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [actualizadoEm, setActualizadoEm] = useState(null)
  const [agora, setAgora] = useState(() => Date.now())

  const carregar = useCallback(async () => {
    try {
      setCarregando(true)
      setErro(null)
      const res = await axios.get(`${API_URL}/api/news/${categoria}`)
      setNoticias(Array.isArray(res.data) ? res.data : [])
      setActualizadoEm(new Date())
    } catch (e) {
      console.error(e)
      setNoticias([])
      setErro('Não foi possível carregar as notícias.')
    } finally {
      setCarregando(false)
    }
  }, [categoria])

  useEffect(() => {
    setFonte('todas')
    setPesquisa('')
    carregar()
  }, [carregar])

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  const fontesDisponiveis = useMemo(() => {
    const nomes = [...new Set(noticias.map((n) => n.source).filter(Boolean))]
    return nomes.sort((a, b) => a.localeCompare(b, 'pt'))
  }, [noticias])

  const agoraLista = useMemo(() => {
    const limite = Date.now() - 2 * 60 * 60 * 1000
    return noticias
      .filter((n) => {
        const t = new Date(n.pubDate).getTime()
        return Number.isFinite(t) && t >= limite
      })
      .slice(0, 5)
  }, [noticias, agora])

  const filtradas = useMemo(() => {
    const q = pesquisa.trim().toLowerCase()
    let lista = noticias

    if (fonte !== 'todas') lista = lista.filter((n) => n.source === fonte)
    if (q) {
      lista = lista.filter(
        (n) =>
          (n.title || '').toLowerCase().includes(q) ||
          (n.description || '').toLowerCase().includes(q) ||
          (n.source || '').toLowerCase().includes(q)
      )
    }

    if (ordenacao === 'fonte') {
      lista = [...lista].sort((a, b) => {
        const bySource = (a.source || '').localeCompare(b.source || '', 'pt')
        if (bySource !== 0) return bySource
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      })
    } else {
      lista = [...lista].sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      )
    }

    return lista
  }, [noticias, fonte, pesquisa, ordenacao])

  const labelActualizado = textoActualizado(actualizadoEm)
  void agora

  return (
    <div className="app">
      <header className="masthead">
        <div className="brand-row">
          <a className="brand" href="./" aria-label="InfoPT">
            <span className="brand-mark">
              Info<span className="brand-p">P</span>
              <span className="brand-t">T</span>
            </span>
          </a>
          <div className="mast-actions">
            <div className="live-pill" aria-live="polite">
              <span className="live-dot" />
              {labelActualizado}
            </div>
            <button
              type="button"
              className="refresh-btn"
              onClick={carregar}
              disabled={carregando}
            >
              {carregando ? 'A actualizar…' : 'Actualizar'}
            </button>
          </div>
        </div>
        <p className="tagline">
          Agregador de notícias portuguesas e internacionais — Portugal, mundo, desporto, finanças,
          tecnologia, cultura e ciência.
        </p>
      </header>

      <nav className="nav" aria-label="Categorias">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`tab${categoria === cat.id ? ' ativo' : ''}`}
            onClick={() => setCategoria(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <div className="toolbar">
        <label className="search">
          <span className="sr-only">Pesquisar</span>
          <input
            type="search"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="Pesquisar títulos, fontes…"
          />
        </label>

        <div className="toolbar-opts" aria-label="Opções">
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            aria-label="Ordenação"
          >
            <option value="recentes">Mais recentes</option>
            <option value="fonte">Por fonte</option>
          </select>
          <button
            type="button"
            className={`opt-btn${densidade === 'compacto' ? ' ativo' : ''}`}
            onClick={() => setDensidade((d) => (d === 'compacto' ? 'normal' : 'compacto'))}
          >
            Compacto
          </button>
          <button
            type="button"
            className={`opt-btn${mostrarResumo ? ' ativo' : ''}`}
            onClick={() => setMostrarResumo((v) => !v)}
          >
            Resumos
          </button>
        </div>
      </div>

      {fontesDisponiveis.length > 0 ? (
        <div className="fonte-bar" aria-label="Filtrar por fonte">
          <button
            type="button"
            className={`fonte-chip${fonte === 'todas' ? ' ativo' : ''}`}
            onClick={() => setFonte('todas')}
          >
            Todas
          </button>
          {fontesDisponiveis.map((nome) => {
            const meta = metaFonte(nome)
            return (
              <button
                key={nome}
                type="button"
                className={`fonte-chip${fonte === nome ? ' ativo' : ''}`}
                onClick={() => setFonte(nome)}
                style={fonte === nome ? { borderColor: meta.color, color: meta.color } : undefined}
              >
                {meta.domain ? (
                  <img
                    className="fonte-logo"
                    src={logoUrl(meta.domain)}
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                  />
                ) : (
                  <span className="fonte-dot" style={{ background: meta.color }} />
                )}
                {nome}
              </button>
            )
          })}
        </div>
      ) : null}

      {agoraLista.length > 0 && fonte === 'todas' && !pesquisa ? (
        <section className="agora" aria-label="Agora">
          <div className="agora-head">
            <h2>Agora</h2>
            <span>últimas 2 horas</span>
          </div>
          <div className="agora-list">
            {agoraLista.map((n, i) => (
              <a
                key={`agora-${n.link}-${i}`}
                className="agora-item"
                href={n.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SourceBadge nome={n.source} />
                <span className="agora-title">{n.title}</span>
                <time>{tempoRelativo(n.pubDate)}</time>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <main>
        {erro ? <div className="erro">{erro}</div> : null}
        {carregando && noticias.length === 0 ? (
          <div className="status">A carregar notícias…</div>
        ) : null}

        {!carregando && !erro && filtradas.length === 0 ? (
          <div className="status">Sem notícias para este filtro.</div>
        ) : null}

        {filtradas.length > 0 ? (
          <div className={`feed${densidade === 'compacto' ? ' compacto' : ''}`}>
            {filtradas.map((noticia, i) => (
              <Story
                key={`${noticia.link}-${i}`}
                noticia={noticia}
                densidade={densidade}
                mostrarResumo={mostrarResumo}
                style={{ animationDelay: `${0.04 + Math.min(i, 12) * 0.03}s` }}
              />
            ))}
          </div>
        ) : null}
      </main>

      <footer className="footer">
        <span>
          {filtradas.length} notícias · fontes via RSS
        </span>
        <a href="https://diogorafael.com" target="_blank" rel="noopener noreferrer">
          diogorafael.com
        </a>
      </footer>
    </div>
  )
}

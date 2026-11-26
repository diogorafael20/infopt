import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'https://infopt.diogorafael212.workers.dev'

const CATEGORIAS = [
  { id: 'portugal', label: 'Portugal' },
  { id: 'internacional', label: 'Mundo' },
  { id: 'futebol', label: 'Futebol' },
  { id: 'financas', label: 'Finanças' },
]

const FONTES = {
  Público: { domain: 'publico.pt', color: '#111111', short: 'PÚB' },
  Observador: { domain: 'observador.pt', color: '#111111', short: 'OBS' },
  Expresso: { domain: 'expresso.pt', color: '#c41e3a', short: 'EXP' },
  Visão: { domain: 'visao.pt', color: '#e30613', short: 'VIS' },
  TSF: { domain: 'tsf.pt', color: '#e30613', short: 'TSF' },
  BBC: { domain: 'bbc.com', color: '#bb1919', short: 'BBC' },
  Reuters: { domain: 'reuters.com', color: '#ff8000', short: 'REU' },
  CNN: { domain: 'cnn.com', color: '#cc0000', short: 'CNN' },
  Abola: { domain: 'abola.pt', color: '#e30613', short: 'ABL' },
  Record: { domain: 'record.pt', color: '#c8102e', short: 'REC' },
  Maisfutebol: { domain: 'maisfutebol.iol.pt', color: '#009639', short: 'MF' },
  ECO: { domain: 'eco.sapo.pt', color: '#00a3e0', short: 'ECO' },
  'Dinheiro Vivo': { domain: 'dinheirovivo.pt', color: '#0b3d2e', short: 'DV' },
  Negócios: { domain: 'negocios.pt', color: '#003366', short: 'NEG' },
}

function metaFonte(nome) {
  return FONTES[nome] || {
    domain: '',
    color: '#243447',
    short: (nome || '?').slice(0, 3).toUpperCase(),
  }
}

function logoCandidates(domain) {
  if (!domain) return []
  return [
    `https://logo.clearbit.com/${domain}?size=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
  ]
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

function SourceBadge({ nome }) {
  const meta = metaFonte(nome)
  const candidatos = useMemo(() => logoCandidates(meta.domain), [meta.domain])
  const [indice, setIndice] = useState(0)
  const falhou = indice >= candidatos.length

  return (
    <div className="source" title={nome}>
      {!falhou ? (
        <span className="source-logo-wrap">
          <img
            className="source-logo"
            src={candidatos[indice]}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setIndice((i) => i + 1)}
          />
        </span>
      ) : (
        <span className="source-fallback" style={{ background: meta.color }}>
          {meta.short}
        </span>
      )}
      <span className="source-name">{nome}</span>
    </div>
  )
}

function Story({ noticia, destaque, style }) {
  return (
    <a
      className={`story${destaque ? ' destaque' : ''}`}
      href={noticia.link}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
    >
      <div className="story-top">
        <SourceBadge nome={noticia.source} />
        <time className="time" dateTime={noticia.pubDate}>
          {tempoRelativo(noticia.pubDate)}
        </time>
      </div>
      {destaque ? <h2>{noticia.title}</h2> : <h3>{noticia.title}</h3>}
      {noticia.description ? <p>{noticia.description}</p> : null}
      <div className="story-foot">
        <span className="ler">Abrir notícia →</span>
      </div>
    </a>
  )
}

export default function App() {
  const [categoria, setCategoria] = useState('portugal')
  const [noticias, setNoticias] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let activo = true

    const carregar = async () => {
      try {
        setCarregando(true)
        setErro(null)
        const res = await axios.get(`${API_URL}/api/news/${categoria}`)
        if (activo) setNoticias(Array.isArray(res.data) ? res.data : [])
      } catch (e) {
        console.error(e)
        if (activo) {
          setNoticias([])
          setErro('Não foi possível carregar as notícias.')
        }
      } finally {
        if (activo) setCarregando(false)
      }
    }

    carregar()
    return () => {
      activo = false
    }
  }, [categoria])

  const [destaque, ...resto] = useMemo(() => noticias, [noticias])

  return (
    <div className="app">
      <header className="masthead">
        <div className="brand-row">
          <a className="brand" href="./" aria-label="InfoPT">
            <span className="brand-mark">
              Info<span>PT</span>
            </span>
          </a>
          <div className="live-pill" aria-hidden="true">
            <span className="live-dot" />
            Ao minuto
          </div>
        </div>
        <p className="tagline">
          Agregador de notícias portuguesas e internacionais — Portugal, mundo, futebol e finanças.
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

      <main>
        {erro ? <div className="erro">{erro}</div> : null}
        {carregando ? <div className="status">A carregar notícias…</div> : null}

        {!carregando && !erro && noticias.length === 0 ? (
          <div className="status">Sem notícias nesta categoria de momento.</div>
        ) : null}

        {!carregando && noticias.length > 0 ? (
          <div className="feed">
            {destaque ? (
              <Story noticia={destaque} destaque style={{ animationDelay: '0.04s' }} />
            ) : null}
            <div className="feed-side">
              {resto.map((noticia, i) => (
                <Story
                  key={`${noticia.link}-${i}`}
                  noticia={noticia}
                  style={{ animationDelay: `${0.06 + i * 0.03}s` }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </main>

      <footer className="footer">
        <span>Fontes oficiais via RSS · actualização contínua</span>
        <a href="https://diogorafael.com" target="_blank" rel="noopener noreferrer">
          diogorafael.com
        </a>
      </footer>
    </div>
  )
}

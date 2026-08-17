import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'https://infopt.diogorafael212.workers.dev'

export default function App() {
  const [categoria, setCategoria] = useState('portugal')
  const [noticias, setNoticias] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    carregarNoticias()
  }, [categoria])

  const carregarNoticias = async () => {
    try {
      setCarregando(true)
      const res = await axios.get(`${API_URL}/api/news/${categoria}`)
      setNoticias(res.data)
      setErro(null)
    } catch (e) {
      setErro('Erro ao carregar notícias')
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  const categorias = [
    { id: 'portugal', label: 'Portugal' },
    { id: 'internacional', label: 'Internacional' },
    { id: 'futebol', label: 'Futebol' },
    { id: 'financas', label: 'Finanças' },
  ]

  return (
    <div className="app">
      <header>
        <h1>InfoPT</h1>
        <p>Notícias em tempo real</p>
      </header>

      <nav>
        {categorias.map(cat => (
          <button
            key={cat.id}
            className={`tab ${categoria === cat.id ? 'ativo' : ''}`}
            onClick={() => setCategoria(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <main>
        {carregando && <div className="carregando">Carregando...</div>}
        {erro && <div className="erro">{erro}</div>}

        <div className="lista">
          {noticias.map((noticia, i) => (
            <article key={i} className="card">
              <h3>{noticia.title}</h3>
              <p>{noticia.description}</p>
              <div className="meta">
                <span className="fonte">{noticia.source}</span>
                <span className="data">{new Date(noticia.pubDate).toLocaleDateString('pt-PT')}</span>
              </div>
              <a href={noticia.link} target="_blank" rel="noopener noreferrer">
                Ler mais →
              </a>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

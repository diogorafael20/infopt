import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://infopt.diogorafael212.workers.dev';

interface Noticia {
  title: string;
  link: string;
  description: string;
  source: string;
  pubDate: string;
}

export default function NoticiasIntScreen() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarNoticias();
  }, []);

  const carregarNoticias = async () => {
    try {
      setCarregando(true);
      const resposta = await axios.get(`${API_URL}/api/news/internacional`);
      setNoticias(resposta.data);
      setErro(null);
    } catch (e) {
      setErro('Erro ao carregar notícias');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <View style={estilos.container}>
        <ActivityIndicator size="large" color="#51D6C4" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.erro}>{erro}</Text>
        <TouchableOpacity style={estilos.botaoRetentar} onPress={carregarNoticias}>
          <Text style={estilos.textoBotao}>Tentar de novo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderizarNoticia = ({ item }: { item: Noticia }) => (
    <TouchableOpacity
      style={estilos.card}
      onPress={() => Linking.openURL(item.link)}
    >
      <Text style={estilos.titulo}>{item.title}</Text>
      <Text style={estilos.descricao}>{item.description}</Text>
      <View style={estilos.rodape}>
        <Text style={estilos.fonte}>{item.source}</Text>
        <Text style={estilos.data}>
          {new Date(item.pubDate).toLocaleDateString('pt-PT')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={estilos.container}>
      <FlatList
        data={noticias}
        renderItem={renderizarNoticia}
        keyExtractor={(item, idx) => idx.toString()}
        contentContainerStyle={estilos.lista}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D10' },
  lista: { paddingHorizontal: 12, paddingVertical: 12 },
  card: {
    backgroundColor: '#11151A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A3038',
  },
  titulo: { fontSize: 16, fontWeight: '600', color: '#E9ECEF', marginBottom: 8 },
  descricao: { fontSize: 14, color: '#8A93A0', marginBottom: 12, lineHeight: 20 },
  rodape: { flexDirection: 'row', justifyContent: 'space-between' },
  fonte: { fontSize: 12, color: '#51D6C4', fontWeight: '600' },
  data: { fontSize: 12, color: '#5B6472' },
  erro: { color: '#E74C3C', fontSize: 16, textAlign: 'center', marginTop: 20 },
  botaoRetentar: {
    backgroundColor: '#51D6C4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  textoBotao: { color: '#0A0D10', fontWeight: '600' },
});

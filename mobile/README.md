# InfoPT — App Mobile

📱 Agregador de notícias portuguesas em React Native com Expo.

Aceda a notícias de Portugal, Internacional, Futebol e Finanças em tempo real, alimentadas pela API do InfoPT.

## Como usar

```bash
npm install
npm start
```

Depois:
- **iOS:** Pressione `i`
- **Android:** Pressione `a`
- **Web:** Pressione `w`

## O que tem

- 4 abas: Portugal · Internacional · Futebol · Finanças
- Dark theme minimalista
- Notícias em tempo real da API
- Abrir notícia no browser com um toque

## Tecnologia

- React Native com Expo
- Axios para fetch de dados
- React Navigation (bottom tabs)
- TypeScript

## Deploy

```bash
eas build --platform all
```

Depois publiquemos em TestFlight (iOS) e Google Play (Android).

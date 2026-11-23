// =========================================================
// Configuração principal — Onde está meu Venancinho? 💗
// =========================================================
// Para sincronizar em tempo real entre o celular do Venâncio (João Pessoa)
// e o celular da Caroline (Manaus), cole abaixo a URL do seu
// Firebase Realtime Database (gratuito). Veja o passo a passo no DEPLOY.md!
//
// Exemplo:
//   firebaseDatabaseUrl: "https://meu-venancinho-default-rtdb.firebaseio.com",
//
// Enquanto ficar vazio "", o app funciona perfeitamente em modo local
// (ideal para testar no seu computador antes de publicar).

export const APP_CONFIG = {
  firebaseDatabaseUrl: "https://meu-venancin-default-rtdb.firebaseio.com",
  venancioPin: "2430", // PIN do painel do Venâncio (datas 24 a 30)
  pollIntervalMs: 7000, // Verifica novidades a cada 7 segundos quando na nuvem
  returnDateIso: "2026-12-01T01:30:00-04:00", // Previsão de chegada em Manaus após voo da noite do dia 30/11
  homeCoords: {
    name: "Casinha da Caroline (Manaus)",
    lat: -3.1190,
    lng: -60.0217
  }
};

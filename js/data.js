// =========================================================
// Dados padrão do roteiro Manaus -> Recife -> João Pessoa (OBR)
// =========================================================

export const TRIP_DAYS = [
  { key: "2026-11-24", week: "Ter", num: "24", label: "Ida ✈️🚗", summary: "Manaus ✈️ Recife (14h) 🚗 João Pessoa (17h)" },
  { key: "2026-11-25", week: "Qua", num: "25", label: "OBR 🤖", summary: "1º dia na OBR • Centro de Convenções de João Pessoa" },
  { key: "2026-11-26", week: "Qui", num: "26", label: "OBR 🤖", summary: "2º dia na OBR • Centro de Convenções de João Pessoa" },
  { key: "2026-11-27", week: "Sex", num: "27", label: "OBR 🤖", summary: "3º dia na OBR • Centro de Convenções de João Pessoa" },
  { key: "2026-11-28", week: "Sáb", num: "28", label: "OBR 🤖", summary: "4º dia na OBR • Centro de Convenções de João Pessoa" },
  { key: "2026-11-29", week: "Dom", num: "29", label: "OBR 🏆", summary: "Último dia na OBR • Centro de Convenções de João Pessoa" },
  { key: "2026-11-30", week: "Seg", num: "30", label: "Volta 🌴✈️", summary: "Passeio em João Pessoa • À noite carro pra Recife e voo pra Manaus!" }
];

export const LOCATION_PRESETS = [
  {
    id: "manaus-home",
    icon: "🏡",
    shortLabel: "Manaus (Casa)",
    name: "Manaus • Pertinho da Caroline",
    lat: -3.1190,
    lng: -60.0217,
    pose: "love",
    bubble: "Ainda pertinho do meu amor! 💗"
  },
  {
    id: "manaus-airport",
    icon: "✈️",
    shortLabel: "Aeroporto Manaus",
    name: "Aeroporto de Manaus (MAO)",
    lat: -3.0358,
    lng: -60.0463,
    pose: "plane",
    bubble: "Embarcando rumo a Recife! Te amo! ✈️"
  },
  {
    id: "in-flight",
    icon: "🛫",
    shortLabel: "No avião (MAO↔REC)",
    name: "Voando sobre o Brasil (Manaus ↔ Recife)",
    lat: -5.55,
    lng: -47.45,
    pose: "plane",
    bubble: "Nas nuvens pensando na minha Caroline ☁️💗"
  },
  {
    id: "recife-airport",
    icon: "🛬",
    shortLabel: "Aeroporto Recife",
    name: "Aeroporto do Recife (REC)",
    lat: -8.1265,
    lng: -34.9236,
    pose: "plane",
    bubble: "Cheguei em Recife! Próxima parada: JP 🛬"
  },
  {
    id: "road-rec-jp",
    icon: "🚗",
    shortLabel: "Estrada REC ↔ JP",
    name: "Na estrada de carro (Recife ↔ João Pessoa)",
    lat: -7.5600,
    lng: -34.9960,
    pose: "car",
    bubble: "Na estrada de carrinho rumo a João Pessoa! 🚗"
  },
  {
    id: "jp-hotel",
    icon: "🏨",
    shortLabel: "Hotel em João Pessoa",
    name: "Hotel em João Pessoa",
    lat: -7.1153,
    lng: -34.8240,
    pose: "hotel",
    bubble: "Descansando no hotel com saudade de você 🌙💗"
  },
  {
    id: "jp-obr",
    icon: "🤖",
    shortLabel: "Centro de Convenções (OBR)",
    name: "Centro de Convenções de João Pessoa • OBR",
    lat: -7.1869,
    lng: -34.8126,
    pose: "obr",
    bubble: "Na OBR mandando ver nos robôs! 🤖✨"
  },
  {
    id: "jp-food",
    icon: "🍽️",
    shortLabel: "Almoço / Jantar JP",
    name: "Comendo em João Pessoa",
    lat: -7.1255,
    lng: -34.8225,
    pose: "tour",
    bubble: "Recarregando as energias! Queria você aqui 🍽️"
  },
  {
    id: "jp-tour",
    icon: "🌴",
    shortLabel: "Passeando em JP",
    name: "Passeando por João Pessoa",
    lat: -7.1489,
    lng: -34.7966,
    pose: "tour",
    bubble: "Passeando em JP e tirando fotos pra você! 🌴📸"
  },
  {
    id: "going-home",
    icon: "💗",
    shortLabel: "Voltando pra Manaus!",
    name: "Voltando pra casa nos braços da Caroline!",
    lat: -6.10,
    lng: -45.20,
    pose: "love",
    bubble: "Tô voltando pro meu amor em Manaus! ✈️💗"
  }
];

// Pontos da rota completa exibida no mapa
export const ROUTE_WAYPOINTS = [
  { lat: -3.1190, lng: -60.0217, label: "Manaus (AM) • Casinha da Caroline 🏡", icon: "🏡" },
  { lat: -8.1265, lng: -34.9236, label: "Aeroporto do Recife (PE) ✈️", icon: "✈️" },
  { lat: -7.1869, lng: -34.8126, label: "Centro de Convenções de João Pessoa • OBR 🤖", icon: "🤖" },
  { lat: -7.1153, lng: -34.8240, label: "João Pessoa (Orla / Hotel) 🌴", icon: "🌴" }
];

export function createDefaultState() {
  const now = Date.now();
  return {
    location: {
      presetId: "manaus-airport",
      name: "Aeroporto de Manaus (MAO)",
      lat: -3.0358,
      lng: -60.0463,
      pose: "plane",
      bubble: "Preparando tudo pra viagem! Já tô com saudade 💗",
      updatedAt: now
    },
    hugsCount: 1,
    notes: [
      {
        id: "welcome-v-1",
        from: "venancio",
        mood: "💗 Te amo",
        text: "Oi minha Caroline linda! Fiz esse cantinho pra você saber onde seu Venancinho está em cada passo da viagem até a OBR em João Pessoa. Quando bater saudade, me manda um recadinho aqui! Te amo muito! 💗",
        createdAt: now - 60000
      }
    ],
    routine: {
      "2026-11-24": [
        { id: "r24-1", time: "08:00", emoji: "✈️", title: "Voo saindo de Manaus para Recife", place: "Aeroporto Eduardo Gomes (MAO)", status: "upcoming" },
        { id: "r24-2", time: "14:00", emoji: "🛬", title: "Chegada no Aeroporto do Recife", place: "Aeroporto dos Guararapes (REC)", status: "upcoming" },
        { id: "r24-3", time: "14:30", emoji: "🚗", title: "Viagem de carro direto para João Pessoa", place: "BR-101 • Recife → João Pessoa", status: "upcoming" },
        { id: "r24-4", time: "17:00", emoji: "🏨", title: "Chegada em João Pessoa e check-in", place: "João Pessoa (PB)", status: "upcoming" },
        { id: "r24-5", time: "20:00", emoji: "📞", title: "Ligar pra Caroline e contar da viagem", place: "No coração dela 💗", status: "upcoming" }
      ],
      "2026-11-25": [
        { id: "r25-1", time: "08:00", emoji: "🤖", title: "1º dia na OBR • Credenciamento e montagem", place: "Centro de Convenções de João Pessoa", status: "upcoming" },
        { id: "r25-2", time: "12:30", emoji: "🍽️", title: "Pausa para almoço", place: "Centro de Convenções / arredores", status: "upcoming" },
        { id: "r25-3", time: "14:00", emoji: "🤖", title: "Atividades da tarde na OBR", place: "Centro de Convenções de João Pessoa", status: "upcoming" },
        { id: "r25-4", time: "19:30", emoji: "💗", title: "Volta pro hotel e recadinho pra Caroline", place: "João Pessoa", status: "upcoming" }
      ],
      "2026-11-26": [
        { id: "r26-1", time: "08:00", emoji: "🤖", title: "OBR • Rodadas da manhã", place: "Centro de Convenções de João Pessoa", status: "upcoming" },
        { id: "r26-2", time: "14:00", emoji: "🤖", title: "OBR • Rodadas da tarde", place: "Centro de Convenções de João Pessoa", status: "upcoming" },
        { id: "r26-3", time: "19:30", emoji: "🍽️", title: "Jantar e descanso", place: "João Pessoa", status: "upcoming" }
      ],
      "2026-11-27": [
        { id: "r27-1", time: "08:00", emoji: "🤖", title: "OBR • Competição o dia todo", place: "Centro de Convenções de João Pessoa", status: "upcoming" },
        { id: "r27-2", time: "19:00", emoji: "📞", title: "Chamada de vídeo com a Caroline", place: "Hotel em João Pessoa", status: "upcoming" }
      ],
      "2026-11-28": [
        { id: "r28-1", time: "08:00", emoji: "🤖", title: "OBR • Penúltimo dia de competição", place: "Centro de Convenções de João Pessoa", status: "upcoming" },
        { id: "r28-2", time: "19:30", emoji: "💗", title: "Contando as horas pra voltar pra casa", place: "João Pessoa", status: "upcoming" }
      ],
      "2026-11-29": [
        { id: "r29-1", time: "08:00", emoji: "🤖", title: "OBR • Finais da competição", place: "Centro de Convenções de João Pessoa", status: "upcoming" },
        { id: "r29-2", time: "16:30", emoji: "🏆", title: "Encerramento e premiação da OBR", place: "Centro de Convenções de João Pessoa", status: "upcoming" },
        { id: "r29-3", time: "20:00", emoji: "🍽️", title: "Jantar de comemoração", place: "João Pessoa", status: "upcoming" }
      ],
      "2026-11-30": [
        { id: "r30-1", time: "09:00", emoji: "🌴", title: "Passeio pela manhã em João Pessoa", place: "Orla / Pontos turísticos de JP", status: "upcoming" },
        { id: "r30-2", time: "14:00", emoji: "🌴", title: "Passeio pela tarde e lembrancinha pra Caroline", place: "João Pessoa", status: "upcoming" },
        { id: "r30-3", time: "19:00", emoji: "🚗", title: "Volta de carro para Recife", place: "João Pessoa → Aeroporto do Recife", status: "upcoming" },
        { id: "r30-4", time: "23:00", emoji: "✈️", title: "Voo de volta pra Manaus nos braços da Caroline!", place: "Aeroporto do Recife → Manaus 💗", status: "upcoming" }
      ]
    }
  };
}

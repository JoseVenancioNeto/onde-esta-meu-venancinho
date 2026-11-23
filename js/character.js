// =========================================================
// Bonequinho Chibi do Venâncio com o rosto recortado em cima!
// =========================================================

export const POSES = [
  { id: "obr", label: "Na OBR", emoji: "🤖" },
  { id: "plane", label: "De avião", emoji: "✈️" },
  { id: "car", label: "De carro", emoji: "🚗" },
  { id: "hotel", label: "No hotel", emoji: "🌙" },
  { id: "tour", label: "Passeando", emoji: "🌴" },
  { id: "love", label: "Saudade", emoji: "💗" }
];

function getBodySvg(pose) {
  switch (pose) {
    case "plane":
      return `
        <!-- Asas do aviãozinho pastel -->
        <ellipse cx="60" cy="112" rx="52" ry="12" fill="#B2DCFF" stroke="#4A3548" stroke-width="2.5"/>
        <!-- Cauda do avião -->
        <path d="M18 104 L10 89 L25 97 Z" fill="#FFB8CE" stroke="#4A3548" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Corpo do aviãozinho fofo -->
        <rect x="20" y="96" width="80" height="30" rx="15" fill="#FFFDFB" stroke="#4A3548" stroke-width="2.6"/>
        <path d="M26 111 H94" stroke="#FFB8CE" stroke-width="5" stroke-linecap="round"/>
        <!-- Hélice fofa na frente -->
        <circle cx="102" cy="111" r="5" fill="#FFD1A3" stroke="#4A3548" stroke-width="2.2"/>
        <ellipse cx="106" cy="111" rx="3" ry="13" fill="#E6DCFA" stroke="#4A3548" stroke-width="1.8" opacity="0.9"/>
        <!-- Torso com cachecol de piloto -->
        <rect x="44" y="79" width="32" height="22" rx="10" fill="#8B6BD6" stroke="#4A3548" stroke-width="2.4"/>
        <path d="M42 84 Q60 92 78 84 L88 89 Q76 96 60 92 Q46 93 42 84 Z" fill="#FFB8CE" stroke="#4A3548" stroke-width="2"/>
        <!-- Mãozinhas segurando a cabine -->
        <circle cx="43" cy="96" r="5.5" fill="#F2C6A8" stroke="#4A3548" stroke-width="2"/>
        <circle cx="77" cy="96" r="5.5" fill="#F2C6A8" stroke="#4A3548" stroke-width="2"/>
      `;

    case "car":
      return `
        <!-- Carrinho pastel fofo -->
        <path d="M22 108 Q25 90 42 88 H78 Q95 90 98 108 Z" fill="#DCF7ED" stroke="#4A3548" stroke-width="2.4"/>
        <!-- Torso dentro do carro -->
        <rect x="45" y="81" width="30" height="22" rx="10" fill="#FFB8CE" stroke="#4A3548" stroke-width="2.3"/>
        <rect x="14" y="102" width="92" height="26" rx="13" fill="#A9E8D3" stroke="#4A3548" stroke-width="2.6"/>
        <!-- Faixa pastel no carro -->
        <line x1="22" y1="115" x2="98" y2="115" stroke="#FFFBF7" stroke-width="4" stroke-linecap="round"/>
        <!-- Farol fofo -->
        <circle cx="101" cy="112" r="4.5" fill="#FFE89E" stroke="#4A3548" stroke-width="2"/>
        <!-- Rodinhas -->
        <circle cx="34" cy="128" r="10" fill="#4A3548"/>
        <circle cx="34" cy="128" r="4.5" fill="#FFFBF7"/>
        <circle cx="86" cy="128" r="10" fill="#4A3548"/>
        <circle cx="86" cy="128" r="4.5" fill="#FFFBF7"/>
        <!-- Mãozinha no volante -->
        <circle cx="77" cy="100" r="5" fill="#F2C6A8" stroke="#4A3548" stroke-width="2"/>
      `;

    case "hotel":
      return `
        <!-- Perninhas de pijama -->
        <rect x="43" y="114" width="13" height="20" rx="6" fill="#B2DCFF" stroke="#4A3548" stroke-width="2.3"/>
        <rect x="64" y="114" width="13" height="20" rx="6" fill="#B2DCFF" stroke="#4A3548" stroke-width="2.3"/>
        <!-- Pantufinhas fofas -->
        <ellipse cx="49" cy="135" rx="9" ry="5.5" fill="#FFB8CE" stroke="#4A3548" stroke-width="2.2"/>
        <ellipse cx="71" cy="135" rx="9" ry="5.5" fill="#FFB8CE" stroke="#4A3548" stroke-width="2.2"/>
        <!-- Pijama pastel listrado -->
        <rect x="38" y="80" width="44" height="39" rx="16" fill="#DFF1FF" stroke="#4A3548" stroke-width="2.5"/>
        <line x1="42" y1="93" x2="78" y2="93" stroke="#B2DCFF" stroke-width="4"/>
        <line x1="42" y1="104" x2="78" y2="104" stroke="#B2DCFF" stroke-width="4"/>
        <!-- Travesseiro fofo no braço -->
        <rect x="70" y="88" width="28" height="22" rx="9" fill="#FFF5E6" stroke="#4A3548" stroke-width="2.2" transform="rotate(-10 84 99)"/>
        <!-- Mãozinhas -->
        <circle cx="35" cy="99" r="6" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.2"/>
        <circle cx="74" cy="101" r="6" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.2"/>
        <!-- Estrelinha e Zzz -->
        <text x="90" y="76" font-size="14" font-family="Fredoka, sans-serif" font-weight="700" fill="#8B6BD6">zZ</text>
      `;

    case "tour":
      return `
        <!-- Perninhas de bermuda -->
        <rect x="44" y="113" width="12" height="21" rx="6" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.3"/>
        <rect x="64" y="113" width="12" height="21" rx="6" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.3"/>
        <!-- Bermuda pastel -->
        <rect x="41" y="109" width="38" height="14" rx="6" fill="#B2DCFF" stroke="#4A3548" stroke-width="2.3"/>
        <!-- Chinelinho -->
        <ellipse cx="49" cy="136" rx="9" ry="5" fill="#A9E8D3" stroke="#4A3548" stroke-width="2.2"/>
        <ellipse cx="71" cy="136" rx="9" ry="5" fill="#A9E8D3" stroke="#4A3548" stroke-width="2.2"/>
        <!-- Camiseta tropical pastel -->
        <rect x="38" y="80" width="44" height="34" rx="15" fill="#FFD1A3" stroke="#4A3548" stroke-width="2.5"/>
        <circle cx="52" cy="94" r="3.5" fill="#FFFBF7"/>
        <circle cx="66" cy="101" r="3.5" fill="#FFB8CE"/>
        <!-- Braços -->
        <path d="M39 89 Q28 96 32 106" fill="none" stroke="#4A3548" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="32" cy="106" r="5.5" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.1"/>
        <!-- Água de coco fofa na mão direita -->
        <circle cx="88" cy="100" r="10" fill="#A9E8D3" stroke="#4A3548" stroke-width="2.3"/>
        <line x1="90" y1="90" x2="96" y2="78" stroke="#E86F98" stroke-width="3" stroke-linecap="round"/>
        <circle cx="79" cy="102" r="5.5" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.1"/>
      `;

    case "love":
      return `
        <!-- Perninhas -->
        <rect x="44" y="114" width="12" height="20" rx="6" fill="#8B6BD6" stroke="#4A3548" stroke-width="2.3"/>
        <rect x="64" y="114" width="12" height="20" rx="6" fill="#8B6BD6" stroke="#4A3548" stroke-width="2.3"/>
        <!-- Tênis pastel -->
        <ellipse cx="49" cy="136" rx="9.5" ry="5.5" fill="#FFFBF7" stroke="#4A3548" stroke-width="2.2"/>
        <ellipse cx="71" cy="136" rx="9.5" ry="5.5" fill="#FFFBF7" stroke="#4A3548" stroke-width="2.2"/>
        <!-- Moletom rosa pastel -->
        <rect x="37" y="80" width="46" height="38" rx="16" fill="#FFB8CE" stroke="#4A3548" stroke-width="2.5"/>
        <!-- Coraçãozão fofo nos braços -->
        <path d="M60 116 C60 116 42 105 42 94 C42 88 47 84 52 84 C56 84 59 87 60 90 C61 87 64 84 68 84 C73 84 78 88 78 94 C78 105 60 116 60 116 Z" fill="#E86F98" stroke="#4A3548" stroke-width="2.2"/>
        <!-- Mãozinhas abraçando o coração -->
        <circle cx="42" cy="99" r="5.5" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.1"/>
        <circle cx="78" cy="99" r="5.5" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.1"/>
        <text x="86" y="82" font-size="14">💗</text>
      `;

    case "obr":
    default:
      return `
        <!-- Perninhas (calça jeans pastel) -->
        <rect x="44" y="114" width="12" height="20" rx="6" fill="#76A8D8" stroke="#4A3548" stroke-width="2.3"/>
        <rect x="64" y="114" width="12" height="20" rx="6" fill="#76A8D8" stroke="#4A3548" stroke-width="2.3"/>
        <!-- Tênis fofinhos -->
        <ellipse cx="49" cy="136" rx="9.5" ry="5.5" fill="#FFD1A3" stroke="#4A3548" stroke-width="2.2"/>
        <ellipse cx="71" cy="136" rx="9.5" ry="5.5" fill="#FFD1A3" stroke="#4A3548" stroke-width="2.2"/>
        <!-- Moletom da equipe de Robótica (OBR) -->
        <rect x="37" y="80" width="46" height="38" rx="16" fill="#D1BEFF" stroke="#4A3548" stroke-width="2.5"/>
        <!-- Bolso canguru + sigla OBR -->
        <rect x="47" y="102" width="26" height="11" rx="5" fill="#EFE7FF" stroke="#4A3548" stroke-width="1.8"/>
        <text x="60" y="96" text-anchor="middle" font-size="10.5" font-family="Fredoka, sans-serif" font-weight="700" fill="#4A3548">OBR</text>
        <!-- Mãozinha esquerda acenando -->
        <circle cx="33" cy="95" r="5.8" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.1"/>
        <!-- Mini robôzinho pastel na mão direita -->
        <line x1="93" y1="81" x2="93" y2="87" stroke="#4A3548" stroke-width="2"/>
        <circle cx="93" cy="79" r="3" fill="#FFB8CE" stroke="#4A3548" stroke-width="1.8"/>
        <rect x="81" y="87" width="24" height="20" rx="6" fill="#A9E8D3" stroke="#4A3548" stroke-width="2.2"/>
        <circle cx="88" cy="95" r="2.3" fill="#4A3548"/>
        <circle cx="98" cy="95" r="2.3" fill="#4A3548"/>
        <path d="M88 101 Q93 105 98 101" fill="none" stroke="#4A3548" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="79" cy="100" r="5.5" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.1"/>
      `;
  }
}

export function renderChibiVenancioSvg(pose = "obr", width = 76) {
  const height = Math.round(width * 1.24);
  return `
    <div class="chibi-doll" style="width:${width}px;height:${height}px;">
      <svg viewBox="0 0 120 148" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" aria-label="Bonequinho do Venâncio">
        <!-- Corpinho cartoon fofo -->
        <g class="doll-body-group">
          ${getBodySvg(pose)}
          <!-- Pescoço fofo -->
          <rect x="53" y="72" width="14" height="12" rx="5" fill="#F2C6A8" stroke="#4A3548" stroke-width="2.2"/>
        </g>

        <!-- Rosto recortado real do Venâncio em proporção chibi! -->
        <g class="doll-head-group">
          <image
            href="assets/venancio-face.png"
            x="23"
            y="2"
            width="74"
            height="86"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
    </div>
  `;
}

export function getPoseMeta(poseId) {
  return POSES.find((p) => p.id === poseId) || POSES[0];
}

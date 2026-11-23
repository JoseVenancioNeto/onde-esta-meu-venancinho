// =========================================================
// Controlador Principal — Onde está meu Venancinho? 💗
// =========================================================

import { APP_CONFIG } from "./config.js";
import { TRIP_DAYS, LOCATION_PRESETS, createDefaultState } from "./data.js";
import { POSES, renderChibiVenancioSvg, getPoseMeta } from "./character.js";
import {
  initTripMap,
  updateVenancioOnMap,
  focusOnVenancio,
  focusOnFullRoute,
  focusOnHome,
  calculateDistanceKm,
  invalidateMapSize
} from "./map.js";
import {
  fetchAppState,
  putFullStateToCloud,
  saveLocationPatch,
  saveNoteItem,
  saveDayRoutine,
  saveHugsCount,
  getFirebaseUrl,
  setCustomFirebaseUrl,
  isCloudEnabled
} from "./sync.js";

const SEEN_V_NOTE_KEY = "venancinho_seen_v_note";
const SEEN_C_NOTE_KEY = "venancinho_seen_c_note";
const VENANCIO_UNLOCKED_KEY = "venancinho_panel_unlocked";

let appState = createDefaultState();
let currentMode = "caroline"; // "caroline" | "venancio"
let selectedDayKey = pickDefaultTripDay();
let selectedCarolineMood = "💗 Saudade";
let selectedVenancioMood = "💗 Te amo";

// Rascunho do editor de localização no painel do Venâncio
let draftLocation = { ...appState.location };

// =========================================================
// Utilitários
// =========================================================
function pickDefaultTripDay() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const todayKey = `${y}-${m}-${d}`;
  const found = TRIP_DAYS.find((day) => day.key === todayKey);
  if (found) return found.key;
  if (todayKey > TRIP_DAYS[TRIP_DAYS.length - 1].key) return TRIP_DAYS[TRIP_DAYS.length - 1].key;
  return TRIP_DAYS[0].key;
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "agora";
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSec < 45) return "agora há pouco";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    const dt = new Date(timestamp);
    const hh = String(dt.getHours()).padStart(2, "0");
    const mm = String(dt.getMinutes()).padStart(2, "0");
    return `hoje às ${hh}:${mm}`;
  }
  const dt = new Date(timestamp);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  return `${dd}/${mm} às ${hh}:${mi}`;
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 3000);
}

function burstHearts(count = 14) {
  const layer = document.getElementById("hearts-layer");
  const emojis = ["💗", "💕", "💖", "🌸", "✨", "💜", "🥰"];
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "floating-heart";
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = `${8 + Math.random() * 84}vw`;
    span.style.fontSize = `${18 + Math.random() * 18}px`;
    span.style.animationDelay = `${Math.random() * 0.45}s`;
    span.style.setProperty("--rot", `${(Math.random() - 0.5) * 50}deg`);
    layer.appendChild(span);
    setTimeout(() => span.remove(), 3000);
  }
}

// =========================================================
// Relógios (Manaus & João Pessoa) + Contagem Regressiva
// =========================================================
function updateClocksAndCountdown() {
  const now = new Date();
  try {
    const fmtMao = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Manaus",
      hour: "2-digit",
      minute: "2-digit"
    }).format(now);
    const fmtJpa = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Recife",
      hour: "2-digit",
      minute: "2-digit"
    }).format(now);
    document.getElementById("clocks-text").textContent = `MAO ${fmtMao} • JPA ${fmtJpa}`;
  } catch {
    document.getElementById("clocks-text").textContent = "Manaus ↔ João Pessoa";
  }

  const target = new Date(APP_CONFIG.returnDateIso).getTime();
  const diff = target - now.getTime();
  const countdownEl = document.getElementById("countdown-text");
  if (diff <= 0) {
    countdownEl.textContent = "Já nos braços dela! 💗";
  } else {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    if (days > 0) {
      countdownEl.textContent = `${days}d ${hours}h pro abraço 🤗`;
    } else {
      countdownEl.textContent = `${hours}h ${mins}min pro abraço 🤗`;
    }
  }
}

// =========================================================
// Renderização da Tela Inicial (Caroline) e do Painel (Venâncio)
// =========================================================
function renderSyncStatus(source) {
  const sub = document.getElementById("sync-status-text");
  const cloudDesc = document.getElementById("cloud-mode-desc");
  if (source === "cloud") {
    sub.textContent = "☁️ Conectado ao vivo • Manaus ↔ João Pessoa";
    cloudDesc.textContent = "Conectado na nuvem! Tudo que você ou a Caroline enviarem aparece no celular do outro em segundos.";
  } else if (source === "offline") {
    sub.textContent = "⚠️ Nuvem temporariamente offline • usando cache";
    cloudDesc.textContent = "Não consegui falar com o Firebase agora. Verifique a URL ou sua internet.";
  } else {
    sub.textContent = "🌷 Caroline & Venâncio • Modo local (preview)";
    cloudDesc.textContent = "Modo local ativo. Para sincronizar entre os celulares de vocês dois, cole a URL gratuita do Firebase abaixo (veja o guia DEPLOY.md).";
  }
}

function renderFeaturedNotes() {
  const latestFromVenancio = appState.notes.find((n) => n.from === "venancio");
  const latestFromCaroline = appState.notes.find((n) => n.from === "caroline");

  // 1) Tela inicial da Caroline -> Destaque do Venâncio
  const vText = document.getElementById("featured-v-text");
  const vTime = document.getElementById("featured-v-time");
  const vBadge = document.getElementById("featured-v-badge");
  if (latestFromVenancio) {
    vText.textContent = latestFromVenancio.text;
    vTime.textContent = `${latestFromVenancio.mood || "💌"} • ${formatRelativeTime(latestFromVenancio.createdAt)}`;
    const seenV = localStorage.getItem(SEEN_V_NOTE_KEY);
    const isNewV = seenV && seenV !== latestFromVenancio.id;
    vBadge.classList.toggle("hidden", !isNewV);
    if (currentMode === "caroline") {
      localStorage.setItem(SEEN_V_NOTE_KEY, latestFromVenancio.id);
    }
  }

  // 2) Painel do Venâncio -> Destaque da Caroline
  const cText = document.getElementById("featured-c-text");
  const cTime = document.getElementById("featured-c-time");
  const cBadge = document.getElementById("featured-c-badge");
  const unreadDot = document.getElementById("venancio-unread-dot");

  if (latestFromCaroline) {
    cText.textContent = latestFromCaroline.text;
    cTime.textContent = `${latestFromCaroline.mood || "💗"} • ${formatRelativeTime(latestFromCaroline.createdAt)}`;
    const seenC = localStorage.getItem(SEEN_C_NOTE_KEY);
    const isUnreadC = seenC !== latestFromCaroline.id;
    unreadDot.classList.toggle("hidden", !isUnreadC || currentMode === "venancio");
    cBadge.classList.toggle("hidden", !isUnreadC);
    if (currentMode === "venancio") {
      localStorage.setItem(SEEN_C_NOTE_KEY, latestFromCaroline.id);
    }
  } else {
    cText.textContent = "Quando a Caroline mandar um recadinho pra você, ele vai aparecer bem aqui assim que você abrir! 💗";
    cTime.textContent = "aguardando o primeiro bilhetinho";
    cBadge.classList.add("hidden");
    unreadDot.classList.add("hidden");
  }

  document.getElementById("hug-counter").textContent = appState.hugsCount;
  document.getElementById("venancio-hug-counter").textContent = appState.hugsCount;
}

function renderNotesFeeds() {
  const buildHtml = () => {
    if (!appState.notes.length) {
      return `<div class="empty-state">Ainda sem bilhetinhos. Escreva o primeiro! 💌</div>`;
    }
    return appState.notes
      .slice(0, 25)
      .map((note) => {
        const isV = note.from === "venancio";
        const author = isV ? "🧸 Venâncio" : "🌷 Caroline";
        return `
          <div class="note-bubble ${isV ? "by-venancio" : "by-caroline"}">
            <div class="note-bubble-meta">
              <span>${author} • ${formatRelativeTime(note.createdAt)}</span>
              <span class="note-bubble-mood">${escapeHtml(note.mood || "💌")}</span>
            </div>
            <p class="note-bubble-text">${escapeHtml(note.text)}</p>
          </div>
        `;
      })
      .join("");
  };

  const html = buildHtml();
  document.getElementById("caroline-notes-feed").innerHTML = html;
  document.getElementById("venancio-notes-feed").innerHTML = html;
}

function renderLocationAndMap() {
  const loc = appState.location;
  const poseMeta = getPoseMeta(loc.pose);

  document.getElementById("current-pose-tag").textContent = `${poseMeta.emoji} ${poseMeta.label}`;
  document.getElementById("current-place-name").textContent = loc.name;
  document.getElementById("current-status-bubble").textContent = `"${loc.bubble}"`;
  document.getElementById("status-character-preview").innerHTML = renderChibiVenancioSvg(loc.pose, 62);
  document.getElementById("last-updated-text").textContent = `Atualizado ${formatRelativeTime(loc.updatedAt)}`;

  const distKm = calculateDistanceKm(
    APP_CONFIG.homeCoords.lat,
    APP_CONFIG.homeCoords.lng,
    loc.lat,
    loc.lng
  );
  document.getElementById("distance-text").textContent =
    distKm <= 15 ? "Pertinho em Manaus! 🏡" : `${distKm.toLocaleString("pt-BR")} km 💗`;

  updateVenancioOnMap(loc);
}

function renderDayTabs() {
  const buildTabs = (containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = TRIP_DAYS.map((day) => {
      const active = day.key === selectedDayKey ? "active" : "";
      return `
        <button type="button" class="day-tab ${active}" data-day="${day.key}" role="tab" aria-selected="${day.key === selectedDayKey}">
          <span class="day-week">${day.week}</span>
          <span class="day-num">${day.num}</span>
          <span class="day-tag">${day.label}</span>
        </button>
      `;
    }).join("");

    container.querySelectorAll(".day-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedDayKey = btn.dataset.day;
        renderDayTabs();
        renderRoutineLists();
      });
    });
  };

  buildTabs("caroline-day-tabs");
  buildTabs("venancio-day-tabs");
}

function getStatusBadgeInfo(status) {
  if (status === "now") return { cls: "badge-now", label: "Agora ✨" };
  if (status === "done") return { cls: "badge-done", label: "Feito ✓" };
  return { cls: "badge-upcoming", label: "Previsto" };
}

function renderRoutineLists() {
  const dayMeta = TRIP_DAYS.find((d) => d.key === selectedDayKey) || TRIP_DAYS[0];
  document.getElementById("routine-day-summary").textContent = `${dayMeta.week}, ${dayMeta.num}/11 — ${dayMeta.summary}`;

  const items = appState.routine[selectedDayKey] || [];

  // 1) Lista da Caroline (somente leitura fofa)
  const cList = document.getElementById("caroline-routine-list");
  if (!items.length) {
    cList.innerHTML = `<div class="empty-state">O Venancinho ainda não colocou atividades para o dia ${dayMeta.num}/11 🧸</div>`;
  } else {
    cList.innerHTML = items
      .map((item) => {
        const b = getStatusBadgeInfo(item.status);
        return `
          <div class="timeline-item status-${item.status || "upcoming"}">
            <div class="timeline-emoji">${escapeHtml(item.emoji || "✨")}</div>
            <div class="timeline-body">
              <div class="timeline-top">
                <span class="timeline-time">${escapeHtml(item.time)}</span>
                <span class="timeline-badge ${b.cls}">${b.label}</span>
              </div>
              <p class="timeline-title">${escapeHtml(item.title)}</p>
              ${item.place ? `<p class="timeline-place">📍 ${escapeHtml(item.place)}</p>` : ""}
            </div>
          </div>
        `;
      })
      .join("");
  }

  // 2) Lista do Venâncio (com botões para alternar status e excluir!)
  const vList = document.getElementById("venancio-routine-list");
  if (!items.length) {
    vList.innerHTML = `<div class="empty-state">Nenhuma atividade nesse dia ainda. Adicione logo abaixo! ✨</div>`;
  } else {
    vList.innerHTML = items
      .map((item) => {
        const b = getStatusBadgeInfo(item.status);
        const nextLabel =
          item.status === "upcoming"
            ? "▶ Agora"
            : item.status === "now"
              ? "✓ Feito"
              : "↺ Reset";
        return `
          <div class="timeline-item status-${item.status || "upcoming"}">
            <div class="timeline-emoji">${escapeHtml(item.emoji || "✨")}</div>
            <div class="timeline-body">
              <div class="timeline-top">
                <span class="timeline-time">${escapeHtml(item.time)}</span>
                <span class="timeline-badge ${b.cls}">${b.label}</span>
              </div>
              <p class="timeline-title">${escapeHtml(item.title)}</p>
              ${item.place ? `<p class="timeline-place">📍 ${escapeHtml(item.place)}</p>` : ""}
            </div>
            <div class="timeline-actions">
              <button type="button" class="mini-action-btn" data-action="cycle" data-id="${item.id}">${nextLabel}</button>
              <button type="button" class="mini-action-btn btn-del" data-action="delete" data-id="${item.id}">Excluir</button>
            </div>
          </div>
        `;
      })
      .join("");

    vList.querySelectorAll("[data-action='cycle']").forEach((btn) => {
      btn.addEventListener("click", () => cycleRoutineStatus(btn.dataset.id));
    });
    vList.querySelectorAll("[data-action='delete']").forEach((btn) => {
      btn.addEventListener("click", () => deleteRoutineItem(btn.dataset.id));
    });
  }
}

// =========================================================
// Painel do Venâncio: Editor de Localização & Bonequinho
// =========================================================
function syncDraftFromState() {
  draftLocation = { ...appState.location };
  document.getElementById("input-custom-place").value = draftLocation.name || "";
  document.getElementById("input-status-bubble").value = draftLocation.bubble || "";
  renderLocationEditor();
}

function renderLocationEditor() {
  // Prévia ao vivo do bonequinho
  document.getElementById("venancio-character-live-preview").innerHTML = renderChibiVenancioSvg(
    draftLocation.pose || "obr",
    78
  );
  document.getElementById("preview-place-badge").textContent = draftLocation.name || "Local escolhido";
  document.getElementById("preview-bubble-text").textContent = `"${draftLocation.bubble || "Pensando na Caroline!"}"`;

  // Grid de presets rápidos
  const presetGrid = document.getElementById("location-presets-grid");
  presetGrid.innerHTML = LOCATION_PRESETS.map((p) => {
    const active = draftLocation.presetId === p.id ? "active" : "";
    return `
      <button type="button" class="preset-btn ${active}" data-preset="${p.id}">
        <span class="preset-ico">${p.icon}</span>
        <span>${p.shortLabel}</span>
      </button>
    `;
  }).join("");

  presetGrid.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = LOCATION_PRESETS.find((p) => p.id === btn.dataset.preset);
      if (!preset) return;
      draftLocation = {
        presetId: preset.id,
        name: preset.name,
        lat: preset.lat,
        lng: preset.lng,
        pose: preset.pose,
        bubble: preset.bubble,
        updatedAt: Date.now()
      };
      document.getElementById("input-custom-place").value = preset.name;
      document.getElementById("input-status-bubble").value = preset.bubble;
      renderLocationEditor();
    });
  });

  // Grid de poses do bonequinho
  const poseGrid = document.getElementById("pose-picker-grid");
  poseGrid.innerHTML = POSES.map((pose) => {
    const active = draftLocation.pose === pose.id ? "active" : "";
    return `
      <button type="button" class="pose-card ${active}" data-pose="${pose.id}">
        ${renderChibiVenancioSvg(pose.id, 52)}
        <span>${pose.emoji} ${pose.label}</span>
      </button>
    `;
  }).join("");

  poseGrid.querySelectorAll(".pose-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      draftLocation.pose = btn.dataset.pose;
      renderLocationEditor();
    });
  });
}

// =========================================================
// Ações de Salvar (Rotina, Recadinhos, Localização, Saudade)
// =========================================================
async function cycleRoutineStatus(itemId) {
  const list = [...(appState.routine[selectedDayKey] || [])];
  const idx = list.findIndex((i) => i.id === itemId);
  if (idx === -1) return;
  const order = ["upcoming", "now", "done"];
  const cur = order.indexOf(list[idx].status || "upcoming");
  list[idx] = { ...list[idx], status: order[(cur + 1) % order.length] };
  await saveDayRoutine(appState, selectedDayKey, list);
  renderRoutineLists();
  showToast("Rotina atualizada para a Caroline! ✨");
}

async function deleteRoutineItem(itemId) {
  const list = (appState.routine[selectedDayKey] || []).filter((i) => i.id !== itemId);
  await saveDayRoutine(appState, selectedDayKey, list);
  renderRoutineLists();
  showToast("Atividade removida da rotina.");
}

async function handleAddRoutine(e) {
  e.preventDefault();
  const time = document.getElementById("routine-time").value || "09:00";
  const emoji = document.getElementById("routine-emoji").value || "✨";
  const title = document.getElementById("routine-title").value.trim();
  const place = document.getElementById("routine-place").value.trim();
  if (!title) return;

  const newItem = {
    id: `rt-${Date.now()}`,
    time,
    emoji,
    title,
    place,
    status: "upcoming"
  };

  const list = [...(appState.routine[selectedDayKey] || []), newItem];
  await saveDayRoutine(appState, selectedDayKey, list);

  document.getElementById("routine-title").value = "";
  document.getElementById("routine-place").value = "";
  renderRoutineLists();
  showToast("Atividade adicionada! A Caroline já pode ver 📅💗");
}

async function handleSendNote(from, textareaId, mood) {
  const textarea = document.getElementById(textareaId);
  const text = textarea.value.trim();
  if (!text) return;

  const note = {
    id: `note-${from[0]}-${Date.now()}`,
    from,
    mood,
    text,
    createdAt: Date.now()
  };

  await saveNoteItem(appState, note);
  if (from === "venancio") {
    localStorage.setItem(SEEN_V_NOTE_KEY, note.id);
  } else {
    localStorage.setItem(SEEN_C_NOTE_KEY, note.id);
  }

  textarea.value = "";
  renderFeaturedNotes();
  renderNotesFeeds();
  burstHearts(16);
  showToast(
    from === "venancio"
      ? "Recadinho publicado na tela inicial da Caroline! 💌"
      : "Recadinho enviado! O Venâncio vai ver assim que abrir 💗"
  );
}

async function handleSaveLocation() {
  const name = document.getElementById("input-custom-place").value.trim() || draftLocation.name;
  const bubble = document.getElementById("input-status-bubble").value.trim() || "Pensando na Caroline 💗";
  const updated = {
    ...draftLocation,
    name,
    bubble,
    updatedAt: Date.now()
  };
  await saveLocationPatch(appState, updated);
  renderLocationAndMap();
  burstHearts(10);
  showToast("Bonequinho atualizado no mapa da Caroline! 🗺️💗");
}

function handleUseGps() {
  if (!navigator.geolocation) {
    showToast("Seu navegador não liberou GPS aqui.");
    return;
  }
  showToast("Buscando sua localização exata pelo GPS... 🛰️");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      draftLocation.presetId = "gps";
      draftLocation.lat = Number(pos.coords.latitude.toFixed(5));
      draftLocation.lng = Number(pos.coords.longitude.toFixed(5));
      if (!document.getElementById("input-custom-place").value.trim()) {
        draftLocation.name = "Localização ao vivo do Venancinho 📍";
        document.getElementById("input-custom-place").value = draftLocation.name;
      }
      renderLocationEditor();
      showToast("GPS capturado! Agora clique em 'Salvar posição' 📍✨");
    },
    () => {
      showToast("Não consegui pegar o GPS. Escolha um dos locais rápidos acima!");
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// =========================================================
// Alternância de Modo (Caroline <-> Venâncio com PIN)
// =========================================================
function switchMode(mode) {
  currentMode = mode;
  const viewC = document.getElementById("view-caroline");
  const viewV = document.getElementById("view-venancio");
  const btnC = document.getElementById("btn-mode-caroline");
  const btnV = document.getElementById("btn-mode-venancio");

  if (mode === "venancio") {
    viewC.classList.add("hidden");
    viewV.classList.remove("hidden");
    btnC.classList.remove("active");
    btnV.classList.add("active");
    btnC.setAttribute("aria-selected", "false");
    btnV.setAttribute("aria-selected", "true");
    syncDraftFromState();
  } else {
    viewV.classList.add("hidden");
    viewC.classList.remove("hidden");
    btnV.classList.remove("active");
    btnC.classList.add("active");
    btnV.setAttribute("aria-selected", "false");
    btnC.setAttribute("aria-selected", "true");
    invalidateMapSize();
  }

  renderFeaturedNotes();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function requestVenancioMode() {
  if (sessionStorage.getItem(VENANCIO_UNLOCKED_KEY) === "1") {
    switchMode("venancio");
    return;
  }
  const modal = document.getElementById("pin-modal");
  const pinInput = document.getElementById("input-pin");
  document.getElementById("pin-error").classList.add("hidden");
  pinInput.value = "";
  modal.classList.remove("hidden");
  setTimeout(() => pinInput.focus(), 60);
}

// =========================================================
// Sincronização & Inicialização
// =========================================================
async function refreshAll(silent = false) {
  const { state, source } = await fetchAppState();
  appState = state;
  renderSyncStatus(source);
  renderFeaturedNotes();
  renderNotesFeeds();
  renderLocationAndMap();
  renderDayTabs();
  renderRoutineLists();

  document.getElementById("input-firebase-url").value = getFirebaseUrl();
  if (!silent) {
    showToast(source === "cloud" ? "Atualizado da nuvem! ☁️✨" : "Tudo atualizado! 💗");
  }
}

function setupMoodPicker(containerId, onSelect) {
  const container = document.getElementById(containerId);
  container.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".mood-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      onSelect(btn.dataset.mood);
    });
  });
}

function bindEvents() {
  // Troca de modo
  document.getElementById("btn-mode-caroline").addEventListener("click", () => switchMode("caroline"));
  document.getElementById("btn-mode-venancio").addEventListener("click", requestVenancioMode);

  // Modal de PIN
  document.getElementById("btn-cancel-pin").addEventListener("click", () => {
    document.getElementById("pin-modal").classList.add("hidden");
  });
  document.getElementById("form-pin").addEventListener("submit", (e) => {
    e.preventDefault();
    const typed = document.getElementById("input-pin").value.trim();
    if (typed === APP_CONFIG.venancioPin) {
      sessionStorage.setItem(VENANCIO_UNLOCKED_KEY, "1");
      document.getElementById("pin-modal").classList.add("hidden");
      switchMode("venancio");
      showToast("Bem-vindo, Venancinho! 🧸💗");
    } else {
      document.getElementById("pin-error").classList.remove("hidden");
    }
  });

  // Botões do mapa
  document.getElementById("btn-focus-venancio").addEventListener("click", () => focusOnVenancio(appState.location, true));
  document.getElementById("btn-focus-route").addEventListener("click", () => focusOnFullRoute(appState.location));
  document.getElementById("btn-focus-home").addEventListener("click", () => focusOnHome());
  document.getElementById("btn-refresh-now").addEventListener("click", () => refreshAll(false));

  // Saudade + responder rápido (Caroline)
  document.getElementById("btn-miss-you").addEventListener("click", async () => {
    const next = (appState.hugsCount || 0) + 1;
    await saveHugsCount(appState, next);
    renderFeaturedNotes();
    burstHearts(18);
    showToast("Abraço apertado enviado pro Venancinho! 🤗💗");
  });
  document.getElementById("btn-jump-reply").addEventListener("click", () => {
    document.getElementById("caroline-notes-section").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("input-caroline-note").focus(), 450);
  });

  // Seletor de humor nos recadinhos
  setupMoodPicker("caroline-mood-picker", (m) => (selectedCarolineMood = m));
  setupMoodPicker("venancio-mood-picker", (m) => (selectedVenancioMood = m));

  // Envio de recadinhos
  document.getElementById("form-caroline-note").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSendNote("caroline", "input-caroline-note", selectedCarolineMood);
  });
  document.getElementById("form-venancio-note").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSendNote("venancio", "input-venancio-note", selectedVenancioMood);
  });

  // Editor de localização (Venâncio)
  document.getElementById("input-custom-place").addEventListener("input", (e) => {
    draftLocation.name = e.target.value;
    document.getElementById("preview-place-badge").textContent = draftLocation.name || "Local escolhido";
  });
  document.getElementById("input-status-bubble").addEventListener("input", (e) => {
    draftLocation.bubble = e.target.value;
    document.getElementById("preview-bubble-text").textContent = `"${draftLocation.bubble || "Pensando na Caroline!"}"`;
  });
  document.getElementById("btn-use-gps").addEventListener("click", handleUseGps);
  document.getElementById("btn-save-location").addEventListener("click", handleSaveLocation);

  // Adicionar rotina
  document.getElementById("form-add-routine").addEventListener("submit", handleAddRoutine);

  // Configuração da nuvem (Firebase)
  document.getElementById("btn-save-cloud-url").addEventListener("click", async () => {
    const url = document.getElementById("input-firebase-url").value.trim();
    setCustomFirebaseUrl(url);
    await refreshAll(false);
  });

  document.getElementById("btn-reset-demo").addEventListener("click", async () => {
    if (!confirm("Deseja restaurar o roteiro padrão da viagem (24 a 30/11)?")) return;
    appState = createDefaultState();
    await putFullStateToCloud(appState);
    renderFeaturedNotes();
    renderNotesFeeds();
    renderLocationAndMap();
    renderDayTabs();
    renderRoutineLists();
    syncDraftFromState();
    showToast("Roteiro padrão restaurado! ✨");
  });
}

async function boot() {
  bindEvents();
  updateClocksAndCountdown();
  setInterval(updateClocksAndCountdown, 30000);

  const { state, source } = await fetchAppState();
  appState = state;
  initTripMap(appState.location);
  renderSyncStatus(source);
  renderFeaturedNotes();
  renderNotesFeeds();
  renderLocationAndMap();
  renderDayTabs();
  renderRoutineLists();
  document.getElementById("input-firebase-url").value = getFirebaseUrl();

  // Polling suave para atualizações ao vivo quando conectado no Firebase
  setInterval(async () => {
    if (!isCloudEnabled()) return;
    const prevV = appState.notes.find((n) => n.from === "venancio")?.id;
    const prevC = appState.notes.find((n) => n.from === "caroline")?.id;
    const { state: fresh, source: freshSource } = await fetchAppState();
    appState = fresh;
    renderSyncStatus(freshSource);
    renderFeaturedNotes();
    renderNotesFeeds();
    renderLocationAndMap();
    renderRoutineLists();

    const newV = appState.notes.find((n) => n.from === "venancio")?.id;
    const newC = appState.notes.find((n) => n.from === "caroline")?.id;
    if (currentMode === "caroline" && newV && newV !== prevV) {
      burstHearts(12);
      showToast("💌 Novo recadinho do seu Venancinho!");
    } else if (currentMode === "venancio" && newC && newC !== prevC) {
      burstHearts(12);
      showToast("🌷 Novo recadinho da Caroline!");
    }
  }, APP_CONFIG.pollIntervalMs);
}

boot();

// =========================================================
// Sincronização Local + Nuvem (Firebase Realtime Database)
// =========================================================

import { APP_CONFIG } from "./config.js";
import { TRIP_DAYS, createDefaultState } from "./data.js";

const LOCAL_STATE_KEY = "venancinho_app_state_v1";
const CUSTOM_CLOUD_URL_KEY = "venancinho_firebase_url_v1";

export function getFirebaseUrl() {
  const fromQuery = new URLSearchParams(window.location.search).get("cloud");
  if (fromQuery && fromQuery.startsWith("https://")) {
    localStorage.setItem(CUSTOM_CLOUD_URL_KEY, cleanUrl(fromQuery));
  }
  const saved = localStorage.getItem(CUSTOM_CLOUD_URL_KEY) || "";
  const configured = APP_CONFIG.firebaseDatabaseUrl || "";
  return cleanUrl(saved || configured);
}

export function setCustomFirebaseUrl(url) {
  const cleaned = cleanUrl(url);
  if (!cleaned) {
    localStorage.removeItem(CUSTOM_CLOUD_URL_KEY);
    return "";
  }
  localStorage.setItem(CUSTOM_CLOUD_URL_KEY, cleaned);
  return cleaned;
}

function cleanUrl(url) {
  let cleaned = String(url || "").trim().replace(/\/+$/, "");
  // Caso alguém cole a URL do console do Firebase, extrai o ID do banco automaticamente
  const consoleMatch = cleaned.match(/console\.firebase\.google\.com\/project\/[^/]+\/database\/([^/]+)/);
  if (consoleMatch) {
    cleaned = `https://${consoleMatch[1]}.firebaseio.com`;
  }
  return cleaned;
}

export function isCloudEnabled() {
  return Boolean(getFirebaseUrl());
}

export function normalizeState(raw) {
  const fallback = createDefaultState();
  if (!raw || typeof raw !== "object") return fallback;

  // Notes pode vir como objeto (chaveado por id no Firebase) ou array
  let notesList = [];
  if (Array.isArray(raw.notes)) {
    notesList = raw.notes.filter(Boolean);
  } else if (raw.notes && typeof raw.notes === "object") {
    notesList = Object.values(raw.notes).filter(Boolean);
  } else {
    notesList = fallback.notes;
  }
  notesList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  // Routine por dia
  const routine = {};
  const rawRoutine = raw.routine && typeof raw.routine === "object" ? raw.routine : fallback.routine;
  for (const day of TRIP_DAYS) {
    const items = rawRoutine[day.key];
    if (Array.isArray(items)) {
      routine[day.key] = items.filter(Boolean);
    } else if (items && typeof items === "object") {
      routine[day.key] = Object.values(items).filter(Boolean);
    } else {
      routine[day.key] = [];
    }
    routine[day.key].sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
  }

  const loc = raw.location && typeof raw.location === "object" ? raw.location : fallback.location;

  return {
    location: {
      presetId: loc.presetId || "custom",
      name: loc.name || fallback.location.name,
      lat: typeof loc.lat === "number" ? loc.lat : fallback.location.lat,
      lng: typeof loc.lng === "number" ? loc.lng : fallback.location.lng,
      pose: loc.pose || "obr",
      bubble: loc.bubble || fallback.location.bubble,
      updatedAt: loc.updatedAt || Date.now()
    },
    hugsCount: typeof raw.hugsCount === "number" ? raw.hugsCount : fallback.hugsCount,
    notes: notesList,
    routine
  };
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(LOCAL_STATE_KEY);
    if (!raw) {
      const def = createDefaultState();
      saveLocalState(def);
      return def;
    }
    return normalizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

function saveLocalState(state) {
  try {
    localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state));
  } catch {
    // Ignora quota
  }
}

function toFirebasePayload(state) {
  const notesMap = {};
  for (const n of state.notes) {
    notesMap[n.id] = n;
  }
  return {
    location: state.location,
    hugsCount: state.hugsCount,
    notes: notesMap,
    routine: state.routine
  };
}

export async function fetchAppState() {
  const baseUrl = getFirebaseUrl();
  if (!baseUrl) {
    return { state: loadLocalState(), source: "local" };
  }

  try {
    const res = await fetch(`${baseUrl}/venancinho.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Primeira vez no Firebase: inicializa com o roteiro padrão!
    if (!data) {
      const initial = loadLocalState();
      await putFullStateToCloud(initial);
      return { state: initial, source: "cloud" };
    }

    const normalized = normalizeState(data);
    saveLocalState(normalized);
    return { state: normalized, source: "cloud" };
  } catch (err) {
    console.warn("Falha ao buscar nuvem, usando cache local:", err);
    return { state: loadLocalState(), source: "offline" };
  }
}

export async function putFullStateToCloud(state) {
  saveLocalState(state);
  const baseUrl = getFirebaseUrl();
  if (!baseUrl) return true;

  const res = await fetch(`${baseUrl}/venancinho.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toFirebasePayload(state))
  });
  return res.ok;
}

export async function saveLocationPatch(state, location) {
  state.location = location;
  saveLocalState(state);
  const baseUrl = getFirebaseUrl();
  if (!baseUrl) return true;

  const res = await fetch(`${baseUrl}/venancinho/location.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location)
  });
  return res.ok;
}

export async function saveNoteItem(state, note) {
  state.notes = [note, ...state.notes.filter((n) => n.id !== note.id)];
  saveLocalState(state);
  const baseUrl = getFirebaseUrl();
  if (!baseUrl) return true;

  const res = await fetch(`${baseUrl}/venancinho/notes/${encodeURIComponent(note.id)}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  });
  return res.ok;
}

export async function saveDayRoutine(state, dayKey, items) {
  items.sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
  state.routine[dayKey] = items;
  saveLocalState(state);
  const baseUrl = getFirebaseUrl();
  if (!baseUrl) return true;

  const res = await fetch(`${baseUrl}/venancinho/routine/${encodeURIComponent(dayKey)}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items)
  });
  return res.ok;
}

export async function saveHugsCount(state, newCount) {
  state.hugsCount = newCount;
  saveLocalState(state);
  const baseUrl = getFirebaseUrl();
  if (!baseUrl) return true;

  const res = await fetch(`${baseUrl}/venancinho/hugsCount.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCount)
  });
  return res.ok;
}

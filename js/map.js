// =========================================================
// Mapa interativo pastel com o bonequinho do Venâncio!
// =========================================================

import { APP_CONFIG } from "./config.js";
import { ROUTE_WAYPOINTS } from "./data.js";
import { renderChibiVenancioSvg } from "./character.js";

let mapInstance = null;
let venancioMarker = null;
let loveLine = null;

export function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildVenancioIcon(location) {
  const safeBubble = escapeHtml(location.bubble || "Pensando na Caroline 💗");
  const html = `
    <div class="venancio-pin-wrap">
      <div class="venancio-speech">${safeBubble}</div>
      ${renderChibiVenancioSvg(location.pose || "obr", 76)}
      <div class="chibi-ground-shadow"></div>
    </div>
  `;
  return L.divIcon({
    className: "venancio-map-marker",
    html,
    iconSize: [210, 140],
    iconAnchor: [105, 134]
  });
}

export function initTripMap(initialLocation) {
  if (mapInstance || typeof L === "undefined") return;

  mapInstance = L.map("trip-map", {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([initialLocation.lat, initialLocation.lng], 12);

  // Tiles claros e elegantes da CartoDB Voyager (combinam perfeitamente com pastel!)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(mapInstance);

  // Linha suave da rota planejada da viagem (Manaus -> Recife -> João Pessoa)
  const plannedCoords = ROUTE_WAYPOINTS.map((w) => [w.lat, w.lng]);
  L.polyline(plannedCoords, {
    color: "#B39DDB",
    weight: 3,
    opacity: 0.72,
    dashArray: "7 8"
  }).addTo(mapInstance);

  // Marcadores dos pontos da viagem (Recife, Centro de Convenções OBR, Orla JP)
  ROUTE_WAYPOINTS.forEach((wp, idx) => {
    if (idx === 0) return; // Manaus ganha marcador especial da Casinha da Caroline
    const icon = L.divIcon({
      className: "venancio-map-marker",
      html: `<div class="waypoint-dot" title="${escapeHtml(wp.label)}">${wp.icon}</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
    L.marker([wp.lat, wp.lng], { icon })
      .addTo(mapInstance)
      .bindPopup(`<strong>${escapeHtml(wp.label)}</strong>`);
  });

  // Marcador especial: Casinha da Caroline em Manaus
  const home = APP_CONFIG.homeCoords;
  const homeIcon = L.divIcon({
    className: "venancio-map-marker",
    html: `<div class="home-marker-pill">🏡 Casinha da Caroline 💗</div>`,
    iconSize: [185, 32],
    iconAnchor: [92, 16]
  });
  L.marker([home.lat, home.lng], { icon: homeIcon })
    .addTo(mapInstance)
    .bindPopup("<strong>🏡 Casinha da Caroline</strong><br/>Manaus (AM) • Onde está o coração do Venâncio 💗");

  // Linha de amor ligando Manaus até o Venâncio atual
  loveLine = L.polyline(
    [
      [home.lat, home.lng],
      [initialLocation.lat, initialLocation.lng]
    ],
    {
      color: "#E86F98",
      weight: 3.5,
      opacity: 0.8,
      dashArray: "4 8"
    }
  ).addTo(mapInstance);

  // Marcador principal: Bonequinho do Venâncio!
  venancioMarker = L.marker([initialLocation.lat, initialLocation.lng], {
    icon: buildVenancioIcon(initialLocation),
    zIndexOffset: 1000
  }).addTo(mapInstance);

  // Enquadra inicialmente o Venâncio
  focusOnVenancio(initialLocation, false);
}

export function updateVenancioOnMap(location) {
  if (!mapInstance) {
    initTripMap(location);
    return;
  }
  const latLng = [location.lat, location.lng];
  venancioMarker.setLatLng(latLng);
  venancioMarker.setIcon(buildVenancioIcon(location));

  const home = APP_CONFIG.homeCoords;
  loveLine.setLatLngs([[home.lat, home.lng], latLng]);
}

export function focusOnVenancio(location, animate = true) {
  if (!mapInstance || !location) return;
  const zoom = location.presetId === "in-flight" || location.presetId === "going-home" ? 5 : 13;
  if (animate) {
    mapInstance.flyTo([location.lat, location.lng], zoom, { duration: 1.1 });
  } else {
    mapInstance.setView([location.lat, location.lng], zoom);
  }
}

export function focusOnFullRoute(location) {
  if (!mapInstance) return;
  const boundsPoints = ROUTE_WAYPOINTS.map((w) => [w.lat, w.lng]);
  if (location) boundsPoints.push([location.lat, location.lng]);
  mapInstance.fitBounds(boundsPoints, { padding: [46, 46], maxZoom: 12 });
}

export function focusOnHome() {
  if (!mapInstance) return;
  const home = APP_CONFIG.homeCoords;
  mapInstance.flyTo([home.lat, home.lng], 12, { duration: 1.1 });
}

export function invalidateMapSize() {
  if (mapInstance) {
    setTimeout(() => mapInstance.invalidateSize(), 180);
  }
}

import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer, TileLayer, Marker, Popup, useMap,
  Circle, Polyline, useMapEvent
} from "react-leaflet";
import L from "leaflet";
import { t } from "../i18n";
import type { Lang } from "../i18n";
import type { Theme, MapMode } from "../App";
import { places } from "../places-data";
import type { Place } from "../places-data";
import { Navigation2, X, Eye, Satellite, Map } from "lucide-react";
import { RouteLayer } from "./route-layer";

// Bounds for East Kazakhstan region
const VKO_BOUNDS: L.LatLngBoundsExpression = [[47.0, 79.5], [51.5, 87.5]];

// ── Inner component: sets map constraints and handles flyTo ──────────────────
const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  mapMode: MapMode;
  flyToRef: React.MutableRefObject<((c: [number, number], z: number) => void) | null>;
  zoomInRef: React.MutableRefObject<(() => void) | null>;
  zoomOutRef: React.MutableRefObject<(() => void) | null>;
  onOpenPanorama?: () => void;
}> = ({ center, zoom, mapMode, flyToRef, zoomInRef, zoomOutRef, onOpenPanorama }) => {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(VKO_BOUNDS);
    map.setMinZoom(6);
    
    // Ограничение maxZoom в зависимости от режима карты
    // Satellite: max 16 (чтобы не было ошибок текстур)
    // Panorama: max 18 (можно ближе, откроется 360°)
    // Normal: max 18 (стандартное максимальное приближение)
    const maxZoomLevel = mapMode === "satellite" ? 16 : 18;
    map.setMaxZoom(maxZoomLevel);
    
    // prevent browser zoom: map handles scroll
    map.scrollWheelZoom.enable();

    flyToRef.current = (c, z) => map.flyTo(c, z, { duration: 1.0, animate: true });
    zoomInRef.current  = () => map.setZoom(Math.min(map.getZoom() + 1, maxZoomLevel), { animate: true });
    zoomOutRef.current = () => map.setZoom(Math.max(map.getZoom() - 1, 6),  { animate: true });
  }, [map, mapMode]);

  // fly whenever center/zoom changes
  const prevCenter = useRef<[number,number]>([0,0]);
  const prevZoom   = useRef<number>(0);
  const zoomTimeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Debounce zoom changes to prevent "map data not loaded" errors
    if (zoomTimeout.current) {
      clearTimeout(zoomTimeout.current);
    }
    
    zoomTimeout.current = setTimeout(() => {
      if (
        prevCenter.current[0] !== center[0] ||
        prevCenter.current[1] !== center[1] ||
        prevZoom.current !== zoom
      ) {
        prevCenter.current = center;
        prevZoom.current = zoom;
        map.flyTo(center, zoom, { duration: 0.8, animate: true });
      }
    }, 100); // Delay 100ms to wait for tiles
    
    return () => {
      if (zoomTimeout.current) {
        clearTimeout(zoomTimeout.current);
      }
    };
  }, [center, zoom, map]);

  // Отдельный эффект для отслеживания зума и открытия панорамы
  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      if (mapMode === "panorama" && currentZoom >= 18 && onOpenPanorama) {
        setTimeout(() => {
          onOpenPanorama();
        }, 300);
      }
    };

    map.on('zoomend', handleZoomEnd);
    
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, mapMode, onOpenPanorama]);

  return null;
};

// ── Stop wheel events bubbling to window ────────────────────────────────────
const WheelCapture: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const stop = (e: WheelEvent) => e.stopPropagation();
    container.addEventListener("wheel", stop, { passive: true });
    return () => container.removeEventListener("wheel", stop);
  }, [map]);
  return null;
};

// ── Click outside markers to deselect ───────────────────────────────────────
const MapClickHandler: React.FC<{ onMapClick: () => void }> = ({ onMapClick }) => {
  useMapEvent("click", onMapClick);
  return null;
};

interface MapViewProps {
  viewCenter: [number, number];
  zoomLevel: number;
  mapMode: MapMode;
  lang: Lang;
  theme: Theme;
  userLocation: [number, number] | null;
  isGeolocating?: boolean;
  routeTarget: Place | null;
  savedPlaces: number[];
  onZoomIn: () => void;
  onZoomOut: () => void;
  onGeolocate: () => void;
  onClearRoute: () => void;
  onOpenModal: (p: Place) => void;
  onSavePlace: (id: number) => void;
  setMapMode: (m: MapMode) => void;
}

const getTile = (mode: MapMode, isDark: boolean) => {
  if (mode === "satellite" || mode === "panorama") {
    return {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "© Esri",
      subdomains: "" as string,
    };
  }
  return {
    url: isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap © CARTO",
    subdomains: "abcd",
  };
};

const createPlaceIcon = (emoji: string, selected: boolean) =>
  new L.DivIcon({
    className: "",
    html: `<div style="
      background:${selected ? "#16a34a" : "#15803d"};
      width:${selected ? 46 : 38}px;height:${selected ? 46 : 38}px;
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      border:3px solid white;box-shadow:0 4px 16px rgba(0,0,0,${selected ? .45 : .28});
      transition:all .15s;
    "><span style="transform:rotate(45deg);font-size:${selected ? 22 : 17}px">${emoji}</span></div>`,
    iconSize: [selected ? 46 : 38, selected ? 55 : 46],
    iconAnchor: [selected ? 23 : 19, selected ? 55 : 46],
    popupAnchor: [0, -60],
  });

const createUserIcon = () =>
  new L.DivIcon({
    className: "",
    html: `<div style="position:relative;width:28px;height:28px">
      <div style="position:absolute;inset:0;background:rgba(59,130,246,.25);border-radius:50%;animation:gpulse 2s infinite"></div>
      <div style="position:absolute;inset:5px;background:#3b82f6;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 10px rgba(59,130,246,.6)"></div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

export const MapView: React.FC<MapViewProps> = ({
  viewCenter, zoomLevel, mapMode, lang, theme,
  userLocation, isGeolocating = false, routeTarget, savedPlaces,
  onZoomIn, onZoomOut, onGeolocate, onClearRoute,
  onOpenModal, onSavePlace, setMapMode,
}) => {
  const isDark = theme === "dark";
  const tile = getTile(mapMode, isDark);

  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [showFullPanorama, setShowFullPanorama] = useState(false);

  const flyToRef   = useRef<((c: [number, number], z: number) => void) | null>(null);
  const zoomInRef  = useRef<(() => void) | null>(null);
  const zoomOutRef = useRef<(() => void) | null>(null);

  const routePoints: [number, number][] | null =
    routeTarget && userLocation
      ? [userLocation, [routeTarget.lat, routeTarget.lng]]
      : null;

  const getName = (p: Place) => lang === "kk" ? p.nameKk : p.name;

  if (!viewCenter || isNaN(viewCenter[0])) return null;

  const isDarkCtrl = isDark
    ? "bg-gray-800/95 border-gray-700 text-white hover:bg-gray-700"
    : "bg-white/95 border-gray-200 text-gray-800 hover:bg-gray-50";

  const controlBtn = `${isDarkCtrl} border shadow-lg rounded-xl transition-colors flex items-center justify-center cursor-pointer select-none`;

  const mapModes: { mode: MapMode; icon: React.ReactNode; label: string }[] = [
    { mode: "normal",    icon: <Map size={13} />,       label: t(lang, "normal") },
    { mode: "satellite", icon: <Satellite size={13} />, label: t(lang, "satellite") },
    { mode: "panorama",  icon: <Eye size={13} />,       label: t(lang, "panorama") },
  ];

  return (
    <div
      className="w-full h-full relative"
      style={{ touchAction: "none", overflow: "hidden", minHeight: 0 }}
    >
      <style>{`
        @keyframes gpulse {
          0%,100%{transform:scale(1);opacity:.5}
          50%{transform:scale(2.2);opacity:0}
        }
        /* prevent page zoom on trackpad/scroll inside map */
        .leaflet-container { touch-action: none !important; }
      `}</style>

      <MapContainer
        center={viewCenter}
        zoom={zoomLevel}
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        maxBounds={VKO_BOUNDS}
        maxBoundsViscosity={0.9}
        minZoom={6}
        maxZoom={18}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          key={`${mapMode}-${isDark}`}
          url={tile.url}
          attribution={tile.attribution}
          subdomains={tile.subdomains as any}
          maxZoom={18}
          maxNativeZoom={18}
          tileSize={256}
          updateWhenZooming={false}
          keepBuffer={2}
          updateWhenIdle={true}
        />

        {/* 360/Panorama: add label overlay on top of satellite */}
        {mapMode === "panorama" && (
          <TileLayer
            key="labels-overlay"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            attribution=""
            opacity={0.85}
            maxZoom={18}
            maxNativeZoom={18}
          />
        )}

        <MapController
          center={viewCenter}
          zoom={zoomLevel}
          mapMode={mapMode}
          flyToRef={flyToRef}
          zoomInRef={zoomInRef}
          zoomOutRef={zoomOutRef}
          onOpenPanorama={() => setShowFullPanorama(true)}
        />
        <WheelCapture />
        <MapClickHandler onMapClick={() => setActiveMarker(null)} />

        {/* Place markers */}
        {places.map(place => {
          const isActive = activeMarker === place.id;
          const isSaved  = savedPlaces.includes(place.id);
          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createPlaceIcon(place.emoji, isActive)}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  // Open modal directly on marker click
                  onOpenModal(place);
                }
              }}
            />
          );
        })}

        {/* User location */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={createUserIcon()} />
            <Circle center={userLocation} radius={400}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 1.5 }} />
          </>
        )}

        {/* Route with road-following */}
        {routePoints && (
          <RouteLayer
            start={routePoints[0]}
            end={routePoints[1]}
          />
        )}
      </MapContainer>

      {/* ── Zoom controls ─────────────────────────────────── */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-1.5" style={{ pointerEvents: "auto" }}>
        <button
          onClick={() => { if (zoomInRef.current) zoomInRef.current(); onZoomIn(); }}
          className={`${controlBtn} w-10 h-10 text-xl font-bold`}
        >+</button>
        <button
          onClick={() => { if (zoomOutRef.current) zoomOutRef.current(); onZoomOut(); }}
          className={`${controlBtn} w-10 h-10 text-xl font-bold`}
        >−</button>
      </div>

      {/* ── Geolocation button ────────────────────────────── */}
      <div className="absolute top-4 right-16 z-[400]" style={{ pointerEvents: "auto" }}>
        <button
          onClick={onGeolocate}
          disabled={isGeolocating}
          className={`${controlBtn} w-10 h-10 transition-all duration-200 hover:scale-110 active:scale-95 ${isGeolocating ? 'opacity-50 cursor-wait' : ''}`}
          title={t(lang, "geolocation")}
        >
          {isGeolocating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
          ) : (
            <Navigation2 size={16} className={userLocation ? "text-blue-500" : ""} />
          )}
        </button>
      </div>

      {/* ── Map mode switcher ─────────────────────────────── */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-1" style={{ pointerEvents: "auto" }}>
        {mapModes.map(({ mode, icon, label }) => (
          <button
            key={mode}
            onClick={() => setMapMode(mode)}
            className={`${controlBtn} px-3 h-9 gap-1.5 text-xs font-semibold whitespace-nowrap ${
              mapMode === mode ? "!bg-green-600 !text-white !border-green-500" : ""
            }`}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── 360° iframe overlay (panorama mode) ──────────── */}
      {mapMode === "panorama" && !showFullPanorama && (
        <div className="absolute bottom-16 left-4 z-[400] bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20" style={{ width: 300, height: 200, pointerEvents: "auto" }}>
          <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
            📍 {t(lang, "panorama")}
          </div>
          {/* OpenStreetMap - полностью бесплатно, без API ключей */}
          <iframe
            key={`${viewCenter[0]}-${viewCenter[1]}`}
            width="300"
            height="200"
            style={{ border: "none", display: "block" }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${viewCenter[1]-0.01},${viewCenter[0]-0.01},${viewCenter[1]+0.01},${viewCenter[0]+0.01}&layer=mapnik&marker=${viewCenter[0]},${viewCenter[1]}`}
            allowFullScreen
            loading="lazy"
            title="OpenStreetMap view"
          />
          <div className="absolute bottom-2 left-2 right-2 flex gap-2">
            <button
              onClick={() => setShowFullPanorama(true)}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-[9px] font-bold py-1 px-2 rounded text-center transition-colors"
            >
              🔍 {lang === "kk" ? "360° Толық экран" : "360° Полный экран"}
            </button>
            <a 
              href={`https://www.openstreetmap.org/?mlat=${viewCenter[0]}&mlon=${viewCenter[1]}&zoom=16`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-500 text-white text-[9px] font-bold py-1 px-2 rounded text-center transition-colors"
            >
              {lang === "kk" ? "Картада ашу" : "Открыть на карте"}
            </a>
          </div>
        </div>
      )}

      {/* ── Полноэкранная 360° панорама ──────────── */}
      {showFullPanorama && (
        <div className="absolute inset-0 z-[500] bg-black/95 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white">
              <h3 className="font-bold text-lg">360° {t(lang, "panorama")}</h3>
              <p className="text-xs text-white/70">{viewCenter[0].toFixed(5)}, {viewCenter[1].toFixed(5)}</p>
            </div>
            <button
              onClick={() => setShowFullPanorama(false)}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 p-4 overflow-auto">
            {/* Mapillary - бесплатная платформа для уличных фото на основе OpenStreetMap */}
            <div className="bg-gray-900 rounded-xl overflow-hidden flex-1 min-h-[300px]">
              <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 text-white text-sm font-bold flex items-center gap-2">
                <span>🗺️ Mapillary Street View</span>
                <span className="ml-auto text-xs opacity-75">{lang === "kk" ? "Ашық деректер" : "Открытые данные"}</span>
              </div>
              <iframe
                key={`mapillary-${viewCenter[0]}-${viewCenter[1]}`}
                width="100%"
                height="400"
                style={{ border: "none", display: "block" }}
                src={`https://www.mapillary.com/embed?map_style=Mapillary%20light&image_key=&x=${viewCenter[1]}&y=${viewCenter[0]}&client_id=cElrVnNMeDBGaWxGemloQWM1OWN6dzpiNDNmNzk4YWM1YWY0NWYy&style=split&z=16`}
                allowFullScreen
                title="Mapillary Street View"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
              <div className="p-3 text-xs text-white/60">
                {lang === "kk" 
                  ? "Mapillary - қоғамдастық жасаған көше фотографиялары" 
                  : "Mapillary - панорамы улиц от сообщества"}
              </div>
            </div>

            {/* Google Street View - стандартный сервис */}
            <div className="bg-gray-900 rounded-xl overflow-hidden flex-1 min-h-[300px]">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white text-sm font-bold flex items-center gap-2">
                <span>🌍 Google Street View</span>
              </div>
              <iframe
                key={`google-${viewCenter[0]}-${viewCenter[1]}`}
                width="100%"
                height="400"
                style={{ border: "none", display: "block" }}
                src={`https://www.google.com/maps/embed/v1/streetview?location=${viewCenter[0]},${viewCenter[1]}&heading=0&pitch=0&fov=90&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
                allowFullScreen
                title="Google Street View"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>

            {/* Ссылки на внешние сервисы */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://www.openstreetmap.org/?mlat=${viewCenter[0]}&mlon=${viewCenter[1]}&zoom=18`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 text-white py-3 px-4 rounded-xl text-center font-bold transition-colors"
              >
                🗺️ OpenStreetMap
              </a>
              <a
                href={`https://www.google.com/maps/@${viewCenter[0]},${viewCenter[1]},18z`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl text-center font-bold transition-colors"
              >
                🌐 Google Maps
              </a>
              <a
                href={`https://www.mapillary.com/app/?lat=${viewCenter[0]}&lng=${viewCenter[1]}&z=17`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl text-center font-bold transition-colors"
              >
                📸 Mapillary App
              </a>
              <a
                href={`https://yandex.ru/maps/?ll=${viewCenter[1]},${viewCenter[0]}&z=18&l=map`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-xl text-center font-bold transition-colors"
              >
                🗺️ Яндекс.Карты
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Route banner ──────────────────────────────────── */}
      {routeTarget && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] max-w-[260px]" style={{ pointerEvents: "auto" }}>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border text-xs font-semibold ${
            isDark ? "bg-green-900 border-green-700 text-green-200" : "bg-green-50 border-green-200 text-green-800"
          }`}>
            <Navigation2 size={13} />
            <span className="truncate">{t(lang, "routeBuilt")}: {lang === "kk" ? routeTarget.nameKk : routeTarget.name}</span>
            <button onClick={onClearRoute} className="ml-auto p-0.5 rounded hover:bg-black/10 flex-shrink-0">
              <X size={11} />
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom legend ─────────────────────────────────── */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] px-4 py-1.5 rounded-full shadow-xl border flex items-center gap-3 text-xs font-semibold ${
        isDark ? "bg-gray-800/90 border-gray-700 text-gray-300" : "bg-white/90 border-white/30 text-gray-500"
      }`}>
        <span>🇰🇿 {t(lang, "appSubtitle")}</span>
        <span className="w-px h-3 bg-current opacity-30" />
        <span className="text-green-600">{places.length} {t(lang, "places")}</span>
      </div>
    </div>
  );
};

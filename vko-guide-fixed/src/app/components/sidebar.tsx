import React, { useState } from "react";
import {
  Search, Compass, X, Bookmark, Sun, Moon,
  Map, Globe, Satellite, Navigation2,
  Leaf, Snowflake, ThermometerSun, User, Pencil, Check
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { t } from "../i18n";
import type { Lang } from "../i18n";
import { places } from "../places-data";
import type { Place } from "../places-data";
import type { Theme, MapMode } from "../App";
import { db } from "../db";
import type { UserProfile } from "../db";

interface SidebarProps {
  onSelectLocation: (lat: number, lng: number, zoom: number, place?: Place) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  lang: Lang; setLang: (l: Lang) => void;
  theme: Theme; setTheme: (t: Theme) => void;
  mapMode: MapMode; setMapMode: (m: MapMode) => void;
  savedPlaces: number[];
  onSavePlace: (id: number) => void;
  activeTab: "explore" | "saved" | "settings";
  setActiveTab: (t: "explore" | "saved" | "settings") => void;
  userLocation: [number, number] | null;
  onBuildRoute: (place: Place) => void;
  onOpenModal: (place: Place) => void;
  profile: UserProfile;
}

const getCurrentSeason = (): "winter" | "summer" => {
  const m = new Date().getMonth();
  return m >= 4 && m <= 8 ? "summer" : "winter";
};

export const Sidebar: React.FC<SidebarProps> = ({
  onSelectLocation, isOpen, setIsOpen,
  lang, setLang, theme, setTheme,
  mapMode, setMapMode,
  savedPlaces, onSavePlace,
  activeTab, setActiveTab,
  userLocation, onBuildRoute, onOpenModal,
  profile,
}) => {
  const [search, setSearch] = useState("");
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);

  // Swipe для закрытия (влево)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const minSwipeDistance = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    if (touchStart !== null) {
      const distance = touchStart - currentTouch; // Влево = положительное
      if (distance > 0) {
        setSwipeDistance(distance);
      }
    }
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    
    if (distance > minSwipeDistance) {
      setIsOpen(false);
    }
    
    setSwipeDistance(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const isDark = theme === "dark";

  // ── colour tokens ─────────────────────────────────────────────────────────
  const bg       = isDark ? "bg-gray-900"  : "bg-white";
  const text      = isDark ? "text-white"   : "text-gray-900";
  const subtext   = isDark ? "text-gray-400": "text-gray-500";
  const border    = isDark ? "border-gray-700": "border-gray-100";
  const cardBg    = isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-white hover:shadow-lg";
  const inputBg   = isDark ? "bg-gray-800 text-white placeholder-gray-500" : "bg-gray-50 text-gray-900";
  const btnHover  = isDark ? "hover:bg-gray-800" : "hover:bg-gray-50";
  const sectionBg = isDark ? "bg-gray-800" : "bg-gray-100";

  const season = getCurrentSeason();
  const seasonalPlace = places.find(p => p.season === season || p.season === "all") ?? places[0];

  const filtered = places.filter(p => {
    const name = lang === "kk" ? p.nameKk : p.name;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const savedList = places.filter(p => savedPlaces.includes(p.id));

  const getName   = (p: Place) => lang === "kk" ? p.nameKk       : p.name;
  const getRegion = (p: Place) => lang === "kk" ? p.regionKk     : p.region;
  const getDesc   = (p: Place) => lang === "kk" ? p.descriptionKk: p.description;

  const saveName = () => {
    const next = { ...localProfile, name: tempName || localProfile.name };
    setLocalProfile(next);
    db.saveProfile(next);
    setEditingName(false);
  };

  // avatar cycle
  const AVATARS = ["🧭","🏔️","🌿","🦅","♨️","🌊","🌲","🎿","🐺","🌸"];
  const cycleAvatar = () => {
    const i = (AVATARS.indexOf(localProfile.avatar) + 1) % AVATARS.length;
    const next = { ...localProfile, avatar: AVATARS[i] };
    setLocalProfile(next);
    db.saveProfile(next);
  };

  // ── Place mini-card ───────────────────────────────────────────────────────
  const PlaceCard = ({ place, compact = false }: { place: Place; compact?: boolean }) => {
    const isSaved = savedPlaces.includes(place.id);
    return (
      <div className={`group cursor-pointer ${cardBg} rounded-2xl overflow-hidden transition-all duration-200 border ${isDark ? "border-gray-700 hover:border-green-700" : "border-transparent hover:border-green-100"}`}>
        {/* Click anywhere → select on map */}
        <div onClick={() => onSelectLocation(place.lat, place.lng, place.zoom, place)}>
          {!compact && (
            <div className="h-28 relative overflow-hidden">
              <ImageWithFallback src={place.image} alt={getName(place)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow text-[10px] font-bold text-gray-800">
                ★ {place.rating}
              </div>
              <span className="absolute top-2 left-2 text-xl">{place.emoji}</span>
            </div>
          )}
          <div className="p-3">
            <div className="flex items-start justify-between gap-1">
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm group-hover:text-green-500 transition-colors ${text} truncate`}>
                  {compact && <span className="mr-1">{place.emoji}</span>}
                  {getName(place)}
                </h4>
                <p className={`text-xs ${subtext} truncate`}>{getRegion(place)}</p>
                {compact && <span className="text-xs text-yellow-500 font-bold">★ {place.rating}</span>}
              </div>
              <button
                onClick={e => { e.stopPropagation(); onSavePlace(place.id); }}
                className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${isSaved ? "text-green-500" : `${subtext} ${btnHover}`}`}
              >
                <Bookmark size={13} className={isSaved ? "fill-green-500" : ""} />
              </button>
            </div>
            {!compact && <p className={`text-xs ${subtext} mt-1 line-clamp-2`}>{getDesc(place)}</p>}
          </div>
        </div>
        {/* Подробнее */}
        {!compact && (
          <div className={`px-3 pb-3 flex gap-2`}>
            <button
              onClick={() => onOpenModal(place)}
              className="flex-1 py-1.5 rounded-xl bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-colors"
            >
              {lang === "kk" ? "Толығырақ" : "Подробнее"}
            </button>
            <button
              onClick={() => onBuildRoute(place)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} flex items-center gap-1`}
            >
              <Navigation2 size={11} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div 
      className={`fixed top-0 left-0 h-full ${bg} z-[1000] shadow-2xl transition-all duration-300 ${
        isOpen ? "w-80" : "w-0 overflow-hidden"
      } md:relative md:w-80 flex flex-col`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isOpen && swipeDistance > 0 ? `translateX(-${swipeDistance}px)` : 'none',
        transition: swipeDistance === 0 ? 'transform 0.3s ease-out, width 0.3s' : 'width 0.3s'
      }}
    >

      {/* Header */}
      <div className={`p-4 flex items-center justify-between border-b ${border} flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <div className="bg-green-700 p-1.5 rounded-xl text-white"><Compass size={20} /></div>
          <div>
            <span className={`text-base font-bold ${text}`}>{t(lang, "appName")}</span>
            <p className={`text-[10px] ${subtext} uppercase tracking-widest`}>{t(lang, "appSubtitle")}</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className={`md:hidden p-2 ${subtext} ${btnHover} rounded-full`}><X size={18} /></button>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${border} flex-shrink-0`}>
        {(["explore","saved","settings"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${
              activeTab === tab ? "border-green-500 text-green-500" : `border-transparent ${subtext} ${btnHover}`
            }`}>
            {tab === "explore"  && <Map size={12} />}
            {tab === "saved"    && <Bookmark size={12} />}
            {tab === "settings" && <User size={12} />}
            {tab === "explore"  && t(lang, "explore")}
            {tab === "saved"    && t(lang, "savedPlaces")}
            {tab === "settings" && t(lang, "settings")}
          </button>
        ))}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">

        {/* ── EXPLORE ───────────────────────────────────────────────────────── */}
        {activeTab === "explore" && (
          <div className="p-3 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtext}`} />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t(lang, "search")}
                className={`w-full pl-9 pr-3 py-2 ${inputBg} rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 text-xs border-none`}
              />
            </div>

            {/* Seasonal banner */}
            {!search && (
              <div className={`rounded-2xl p-3 border ${isDark ? "bg-amber-900/20 border-amber-700/30" : "bg-amber-50 border-amber-100"}`}>
                <p className={`text-xs font-bold flex items-center gap-1 mb-2 ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                  {season === "winter" ? <Snowflake size={11}/> : <ThermometerSun size={11}/>}
                  {season === "winter" ? t(lang,"winter") : t(lang,"summer")}
                </p>
                <PlaceCard place={seasonalPlace} compact />
              </div>
            )}

            {/* All places */}
            <h3 className={`text-xs font-semibold ${subtext} uppercase tracking-wider`}>{t(lang,"naturalPlaces")}</h3>
            <div className="space-y-3">
              {filtered.map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          </div>
        )}

        {/* ── SAVED ─────────────────────────────────────────────────────────── */}
        {activeTab === "saved" && (
          <div className="p-3 space-y-3">
            <h3 className={`text-xs font-semibold ${subtext} uppercase tracking-wider`}>{t(lang,"savedPlaces")}</h3>
            {savedList.length === 0 ? (
              <div className={`text-center py-16 ${subtext}`}>
                <Bookmark size={36} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">{t(lang,"noSaved")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedList.map(p => <PlaceCard key={p.id} place={p} />)}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS ──────────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="p-3 space-y-4">
            {/* Profile */}
            <div className={`rounded-2xl p-4 ${sectionBg}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${subtext} mb-3`}>{lang === "kk" ? "Профиль" : "Профиль"}</p>
              <div className="flex items-center gap-3">
                <button onClick={cycleAvatar} className="text-4xl select-none active:scale-90 transition-transform cursor-pointer" title="Сменить аватар">
                  {localProfile.avatar}
                </button>
                <div className="flex-1 min-w-0">
                  {editingName ? (
                    <div className="flex items-center gap-1">
                      <input
                        autoFocus
                        value={tempName}
                        onChange={e => setTempName(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveName(); }}
                        className={`flex-1 text-sm font-bold px-2 py-1 rounded-lg outline-none border border-green-500 ${isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                      />
                      <button onClick={saveName} className="p-1 rounded-lg bg-green-600 text-white"><Check size={13}/></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${text}`}>{localProfile.name}</span>
                      <button onClick={() => { setTempName(localProfile.name); setEditingName(true); }} className={`p-1 rounded-lg ${btnHover}`}>
                        <Pencil size={11} className={subtext} />
                      </button>
                    </div>
                  )}
                  <p className={`text-xs ${subtext}`}>{t(lang,"appName")}</p>
                </div>
              </div>
            </div>

            {/* Theme */}
            <div className={`rounded-2xl p-4 ${sectionBg}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${subtext} mb-2`}>{t(lang,"theme")}</p>
              <div className="flex gap-2">
                {(["light","dark"] as Theme[]).map(th => (
                  <button key={th} onClick={() => setTheme(th)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      theme === th ? "bg-green-700 text-white" : `${isDark ? "bg-gray-700 text-gray-300" : "bg-white text-gray-600 border border-gray-200"}`
                    }`}>
                    {th === "light" ? <Sun size={12}/> : <Moon size={12}/>}
                    {th === "light" ? t(lang,"light") : t(lang,"dark")}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className={`rounded-2xl p-4 ${sectionBg}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${subtext} mb-2`}>{t(lang,"language")}</p>
              <div className="flex gap-2">
                {([["ru","🇷🇺 Русский"],["kk","🇰🇿 Қазақша"]] as [Lang,string][]).map(([l,label]) => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                      lang === l ? "bg-green-700 text-white" : `${isDark ? "bg-gray-700 text-gray-300" : "bg-white text-gray-600 border border-gray-200"}`
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map mode */}
            <div className={`rounded-2xl p-4 ${sectionBg}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${subtext} mb-2`}>{t(lang,"mapMode")}</p>
              <div className="space-y-1.5">
                {([
                  ["normal", <Map size={12}/>, t(lang,"normal")],
                  ["satellite", <Satellite size={12}/>, t(lang,"satellite")],
                  ["panorama", <Globe size={12}/>, t(lang,"panorama")],
                ] as [MapMode, React.ReactNode, string][]).map(([mode, icon, label]) => (
                  <button key={mode} onClick={() => setMapMode(mode)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                      mapMode === mode ? "bg-green-700 text-white" : `${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`
                    }`}>
                    {icon}{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Eco tip */}
            <div className={`rounded-2xl p-4 border ${isDark ? "bg-green-900/30 border-green-700/30" : "bg-green-50 border-green-100"}`}>
              <p className={`text-xs font-bold flex items-center gap-1 mb-1 ${isDark ? "text-green-400" : "text-green-700"}`}>
                <Leaf size={12}/> {t(lang,"ecoTip")}
              </p>
              <p className={`text-xs ${isDark ? "text-green-300" : "text-green-600"}`}>
                {lang === "kk"
                  ? "ВКО табиғатын бірге сақтайық. Пластиктен бас тартыңыз, от жақпаңыз."
                  : "Сохраним природу ВКО вместе. Отказывайтесь от пластика и не разжигайте огонь."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`p-3 border-t ${border} flex-shrink-0`}>
        <p className={`text-xs text-center ${subtext}`}>
          🇰🇿 {places.length} {t(lang,"places")} · {t(lang,"appName")}
        </p>
      </div>
    </div>
  );
};

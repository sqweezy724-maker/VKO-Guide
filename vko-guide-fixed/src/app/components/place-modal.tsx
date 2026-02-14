import React, { useEffect } from "react";
import {
  X, Bookmark, Navigation2, Star, Leaf, Info, CheckCircle2, Lightbulb,
  MapPin, Globe, Mountain
} from "lucide-react";
import type { Place } from "../places-data";
import type { Lang } from "../i18n";
import { t } from "../i18n";
import type { Theme } from "../App";

interface PlaceModalProps {
  place: Place;
  lang: Lang;
  theme: Theme;
  isSaved: boolean;
  onClose: () => void;
  onSave: () => void;
  onBuildRoute: () => void;
}

export const PlaceModal: React.FC<PlaceModalProps> = ({
  place, lang, theme, isSaved, onClose, onSave, onBuildRoute
}) => {
  const isDark = theme === "dark";

  const getName  = (p: Place) => lang === "kk" ? p.nameKk  : p.name;
  const getRegion= (p: Place) => lang === "kk" ? p.regionKk: p.region;
  const getDesc  = (p: Place) => lang === "kk" ? p.descriptionKk : p.description;
  const getInfo  = (p: Place) => lang === "kk" ? p.infoKk  : p.info;
  const getEco   = (p: Place) => lang === "kk" ? p.ecologyKk: p.ecology;
  const getPros  = (p: Place) => lang === "kk" ? p.prosKk  : p.pros;
  const getTip   = (p: Place) => lang === "kk" ? p.ecoTipKk: p.ecoTip;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const overlay = "fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4";
  const bg = isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";
  const subtext = isDark ? "text-gray-400" : "text-gray-500";
  const sectionBg = isDark ? "bg-gray-800" : "bg-gray-50";
  const ecoBg = isDark ? "bg-green-900/40 border-green-700/40" : "bg-green-50 border-green-100";
  const ecoText = isDark ? "text-green-300" : "text-green-700";
  const tipBg = isDark ? "bg-amber-900/30 border-amber-700/30" : "bg-amber-50 border-amber-100";
  const tipText = isDark ? "text-amber-300" : "text-amber-700";
  const tagBg = isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600";

  return (
    <div className={overlay}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className={`
        relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl
        ${bg} scrollbar-hide
      `}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
          <img
            src={place.image}
            alt={getName(place)}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm"
          >
            <X size={18} />
          </button>

          {/* Save button */}
          <button
            onClick={onSave}
            className={`absolute top-4 left-4 p-2 rounded-full transition-colors backdrop-blur-sm ${
              isSaved ? "bg-green-500 text-white" : "bg-black/40 hover:bg-black/60 text-white"
            }`}
          >
            <Bookmark size={18} className={isSaved ? "fill-white" : ""} />
          </button>

          {/* Title on image */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{place.emoji}</span>
              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">{place.rating}</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{getName(place)}</h2>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-white/70" />
              <span className="text-xs text-white/70">{getRegion(place)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Description */}
          <p className={`text-sm leading-relaxed ${subtext}`}>{getDesc(place)}</p>

          {/* Info block */}
          <div className={`rounded-2xl p-4 ${sectionBg}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Info size={14} className="text-blue-500" />
              </div>
              <span className="text-sm font-semibold">{t(lang, "info")}</span>
            </div>
            <p className={`text-xs leading-relaxed ${subtext}`}>{getInfo(place)}</p>
          </div>

          {/* Ecology block */}
          <div className={`rounded-2xl p-4 border ${ecoBg}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-green-500/15">
                <Leaf size={14} className={ecoText} />
              </div>
              <span className={`text-sm font-semibold ${ecoText}`}>{t(lang, "ecology")}</span>
            </div>
            <p className={`text-xs leading-relaxed ${ecoText} opacity-90`}>{getEco(place)}</p>
          </div>

          {/* Pros */}
          <div className={`rounded-2xl p-4 ${sectionBg}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-green-500/10">
                <CheckCircle2 size={14} className="text-green-500" />
              </div>
              <span className="text-sm font-semibold">{t(lang, "pros")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {getPros(place).map((pro, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-full font-medium ${tagBg}`}>
                  {pro}
                </span>
              ))}
            </div>
          </div>

          {/* Eco tip */}
          <div className={`rounded-2xl p-4 border ${tipBg}`}>
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/15 flex-shrink-0 mt-0.5">
                <Lightbulb size={14} className={tipText} />
              </div>
              <div>
                <span className={`text-xs font-bold ${tipText}`}>{t(lang, "ecoTip")}</span>
                <p className={`text-xs leading-relaxed mt-0.5 ${tipText} opacity-90`}>{getTip(place)}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onBuildRoute}
              className="flex-1 py-3 rounded-2xl bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20"
            >
              <Navigation2 size={16} />
              {t(lang, "buildRoute")}
            </button>
            <button
              onClick={onSave}
              className={`px-5 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                isSaved
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                  : isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Bookmark size={16} className={isSaved ? "fill-white" : ""} />
              {isSaved ? t(lang, "saved") : t(lang, "save")}
            </button>
          </div>
          
          {/* Link to dedicated page */}
          <a
            href={`./places/place-${place.id}.html`}
            target="_blank"
            className="mt-3 w-full py-3 rounded-2xl border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Globe size={16} />
            {lang === "kk" ? "Толық ақпарат" : "Полная информация"}
          </a>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Menu, MapPin, Gift } from "lucide-react";
import { t } from "../i18n";
import type { Lang } from "../i18n";
import type { Theme } from "../App";
import type { UserProfile } from "../db";

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenQuests: () => void;
  lang: Lang;
  theme: Theme;
  profile: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenQuests, lang, theme, profile }) => {
  const isDark = theme === "dark";
  return (
    <nav className={`relative h-14 z-[999] px-4 flex items-center justify-between border-b transition-colors duration-300 ${
      isDark ? "bg-gray-800/95 border-gray-700 text-white" : "bg-white/90 border-gray-100 text-gray-900"
    } backdrop-blur-lg`}>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes pulse-gift {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .gift-button:hover .gift-icon {
          animation: wiggle 0.5s ease-in-out;
        }
        .gift-button {
          animation: pulse-gift 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className={`md:hidden p-2 rounded-xl transition-colors ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
          <Menu size={22} />
        </button>
        <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <MapPin size={15} className="text-green-500" />
          <span className="hidden sm:inline">{t(lang, "appSubtitle")}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Quest Button */}
        <button
          onClick={onOpenQuests}
          className={`gift-button relative p-2.5 rounded-xl transition-all ${
            isDark 
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white" 
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white"
          } shadow-lg hover:shadow-xl`}
          title={lang === "kk" ? "Квесттер және сыйлықтар" : "Квесты и награды"}
        >
          <Gift size={20} className="gift-icon" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-sm select-none">
            {profile.avatar}
          </div>
          <div className="leading-none">
            <span className={`text-sm font-bold ${isDark ? "text-green-400" : "text-green-700"}`}>{t(lang, "appName")}</span>
            <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-400"} hidden sm:block`}>{profile.name}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

import React from "react";
import { MessageCircle } from "lucide-react";
import type { Theme } from "../App";

interface AIChatButtonProps {
  onClick: () => void;
  theme: Theme;
  hasUnread?: boolean;
}

export const AIChatButton: React.FC<AIChatButtonProps> = ({ 
  onClick, 
  theme,
  hasUnread = false 
}) => {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-[9998] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
        isDark 
          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" 
          : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
      }`}
      aria-label="Открыть AI ассистент"
    >
      <MessageCircle size={28} className="text-white" />
      {hasUnread && (
        <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
};

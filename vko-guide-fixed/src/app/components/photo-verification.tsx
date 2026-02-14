import React, { useState, useRef } from "react";
import { Camera, X, Upload, Check, Send, Loader } from "lucide-react";
import type { Lang } from "../i18n";
import type { Theme } from "../App";
import type { Quest } from "./quest-system";

interface PhotoVerificationProps {
  quest: Quest;
  lang: Lang;
  theme: Theme;
  onClose: () => void;
  onSubmit: (questId: number, photo: string, location: GeolocationPosition | null) => void;
}

export const PhotoVerification: React.FC<PhotoVerificationProps> = ({
  quest,
  lang,
  theme,
  onClose,
  onSubmit
}) => {
  const isDark = theme === "dark";
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(lang === "kk" 
        ? "Файл өте үлкен. Максимум 5MB"
        : "Файл слишком большой. Максимум 5MB");
      return;
    }
    
    // Конвертируем в base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async () => {
    if (!photo) return;
    
    setLoading(true);
    
    // Получаем геолокацию
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Отправляем данные
        onSubmit(quest.id, photo, position);
        
        setLoading(false);
        setSubmitted(true);
        
        // Сохраняем в localStorage как "на модерации"
        const pending = JSON.parse(localStorage.getItem("vko-pending-photos") || "[]");
        pending.push({
          questId: quest.id,
          questTitle: lang === "kk" ? quest.titleKk : quest.title,
          photo,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          timestamp: new Date().toISOString(),
          status: "pending"
        });
        localStorage.setItem("vko-pending-photos", JSON.stringify(pending));
        
        // Закрываем через 2 секунды
        setTimeout(() => {
          onClose();
        }, 2000);
      },
      () => {
        // Если геолокация не доступна, отправляем без неё
        onSubmit(quest.id, photo, null);
        setLoading(false);
        setSubmitted(true);
        setTimeout(() => onClose(), 2000);
      },
      { enableHighAccuracy: true }
    );
  };
  
  return (
    <div className="fixed inset-0 z-[2100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div 
        className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Camera size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">
              {lang === "kk" ? "Фото тексеру" : "Фото-проверка"}
            </h2>
          </div>
          <p className="text-white/80 text-sm">
            {lang === "kk" ? quest.titleKk : quest.title}
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {!submitted ? (
            <>
              <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {lang === "kk" 
                  ? "Квестті аяқтағаныңызды растау үшін фото жүктеңіз. Фото әкімшілерге модерацияға жіберіледі."
                  : "Загрузите фото для подтверждения выполнения квеста. Фото будет отправлено администраторам на модерацию."}
              </p>
              
              {/* Photo Preview */}
              {photo ? (
                <div className="relative mb-4">
                  <img 
                    src={photo} 
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <button
                    onClick={() => setPhoto(null)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                    isDark 
                      ? "border-gray-700 hover:border-gray-600 bg-gray-800"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                >
                  <Upload size={48} className={`mx-auto mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                  <p className={`text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {lang === "kk" ? "Фото жүктеу үшін басыңыз" : "Нажмите для загрузки фото"}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    JPG, PNG (макс 5MB)
                  </p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {/* Info */}
              <div className={`mt-4 p-3 rounded-xl ${
                isDark ? "bg-blue-900/20 border border-blue-700/30" : "bg-blue-50 border border-blue-200"
              }`}>
                <p className={`text-xs ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                  ℹ️ {lang === "kk" 
                    ? "Сіздің геолокацияңыз автоматты түрде фотоға қосылады"
                    : "Ваша геолокация будет автоматически добавлена к фото"}
                </p>
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!photo || loading}
                className={`w-full mt-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  !photo || loading
                    ? isDark 
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg"
                }`}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    {lang === "kk" ? "Жіберілуде..." : "Отправка..."}
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    {lang === "kk" ? "Модерацияға жіберу" : "Отправить на модерацию"}
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {lang === "kk" ? "Жіберілді!" : "Отправлено!"}
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {lang === "kk" 
                  ? "Фото модерацияға жіберілді. Нәтижені 24 сағат ішінде күтіңіз."
                  : "Фото отправлено на модерацию. Ожидайте результат в течение 24 часов."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

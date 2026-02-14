import React, { useState } from "react";
import { User, Mail, Sparkles, ArrowRight, UserCircle } from "lucide-react";
import type { Lang } from "../i18n";
import type { Theme } from "../App";
import { db, type UserProfile } from "../db";

interface AuthModalProps {
  lang: Lang;
  theme: Theme;
  onComplete: (profile: UserProfile) => void;
}

const AVATARS = ["🧭", "🎒", "🗺️", "⛰️", "🏔️", "🌄", "🌅", "✈️", "🚶", "🧗"];

export const AuthModal: React.FC<AuthModalProps> = ({ lang, theme, onComplete }) => {
  const isDark = theme === "dark";
  const [step, setStep] = useState<"choice" | "register" | "login">("choice");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🧭");

  const handleGuestMode = () => {
    const profile = db.continueAsGuest();
    onComplete(profile);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    const profile = db.register(email, name, selectedAvatar);
    onComplete(profile);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Простой логин - проверяем есть ли такой email
    const existingProfile = db.getProfile();
    if (existingProfile.email === email) {
      onComplete(existingProfile);
    } else {
      alert(lang === "kk" 
        ? "Email табылмады. Тіркеліңіз."
        : "Email не найден. Зарегистрируйтесь.");
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`max-w-md w-full rounded-3xl p-8 shadow-2xl ${
        isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
      }`}>
        {step === "choice" ? (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              <Sparkles size={40} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold">
              {lang === "kk" ? "ШҚО Гидіне қош келдіңіз!" : "Добро пожаловать в VKO Guide!"}
            </h2>
            
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {lang === "kk" 
                ? "Саяхатыңызды бастаңыз және квесттерді орындаңыз"
                : "Начните свое путешествие и выполняйте квесты"}
            </p>

            <div className="space-y-3 pt-4">
              <button
                onClick={() => setStep("login")}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all flex items-center justify-between group"
              >
                <span>{lang === "kk" ? "Кіру" : "Войти"}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setStep("register")}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all flex items-center justify-between group ${
                  isDark 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <span>{lang === "kk" ? "Тіркелу" : "Регистрация"}</span>
                <User size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleGuestMode}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all flex items-center justify-between group ${
                  isDark 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <span>{lang === "kk" ? "Қонақ режимінде" : "Гостевой режим"}</span>
                <UserCircle size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              {lang === "kk" 
                ? "Тіркелу прогрессті сақтауға мүмкіндік береді"
                : "Регистрация позволяет сохранить прогресс"}
            </p>
          </div>
        ) : step === "login" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {lang === "kk" ? "Кіру" : "Вход"}
              </h2>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {lang === "kk" ? "Email адресіңізді енгізіңіз" : "Введите ваш email"}
              </p>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Email
              </label>
              <div className="relative">
                <Mail size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    isDark 
                      ? "bg-gray-700 text-white border border-gray-600" 
                      : "bg-gray-50 text-gray-900 border border-gray-200"
                  }`}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("choice")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  isDark 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {lang === "kk" ? "Артқа" : "Назад"}
              </button>
              
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all"
              >
                {lang === "kk" ? "Кіру" : "Войти"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {lang === "kk" ? "Профиль құру" : "Создание профиля"}
              </h2>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {lang === "kk" ? "Өз аватарыңызды таңдаңыз" : "Выберите свой аватар"}
              </p>
            </div>

            {/* Avatar Selection */}
            <div className="grid grid-cols-5 gap-3">
              {AVATARS.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-3xl p-3 rounded-2xl transition-all ${
                    selectedAvatar === avatar
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 scale-110"
                      : isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>

            {/* Name Input */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                {lang === "kk" ? "Атыңыз" : "Ваше имя"}
              </label>
              <div className="relative">
                <User size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "kk" ? "Атыңызды енгізіңіз" : "Введите ваше имя"}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    isDark 
                      ? "bg-gray-700 text-white border border-gray-600" 
                      : "bg-gray-50 text-gray-900 border border-gray-200"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Email
              </label>
              <div className="relative">
                <Mail size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === "kk" ? "email@example.com" : "email@example.com"}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    isDark 
                      ? "bg-gray-700 text-white border border-gray-600" 
                      : "bg-gray-50 text-gray-900 border border-gray-200"
                  }`}
                  required
                />
              </div>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                {lang === "kk" 
                  ? "Құпия сөз қажет емес - тек прогрессті сақтау үшін"
                  : "Пароль не требуется - только для сохранения прогресса"}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("choice")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  isDark 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {lang === "kk" ? "Артқа" : "Назад"}
              </button>
              
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all"
              >
                {lang === "kk" ? "Бастау" : "Начать"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

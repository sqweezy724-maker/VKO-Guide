import React, { useState, useEffect } from "react";
import { 
  Gift, X, Trophy, Star, Map, Camera, Footprints, 
  Award, Sparkles, Plane, Check, Lock, ChevronRight, Clock 
} from "lucide-react";
import type { Lang } from "../i18n";
import { t } from "../i18n";
import type { Theme } from "../App";
import type { Place } from "../places-data";
import { getDailyQuests, saveDailyQuests, getTimeUntilRefresh, type DailyQuest } from "../daily-quests";
import { PhotoVerification } from "./photo-verification";

// Типы квестов
export interface Quest {
  id: number;
  title: string;
  titleKk: string;
  description: string;
  descriptionKk: string;
  exp: number;
  type: "visit" | "photo" | "route" | "explore";
  icon: React.ReactNode;
  placeId?: number;
  completed: boolean;
}

// Ранги
interface Rank {
  level: number;
  title: string;
  titleKk: string;
  minExp: number;
  icon: string;
  color: string;
}

// Награды (путевки)
interface Reward {
  id: number;
  title: string;
  titleKk: string;
  description: string;
  descriptionKk: string;
  image: string;
  requiredExp: number;
}

const ranks: Rank[] = [
  { level: 1, title: "Новичок", titleKk: "Жаңадан келген", minExp: 0, icon: "🌱", color: "#94a3b8" },
  { level: 2, title: "Путешественник", titleKk: "Саяхатшы", minExp: 500, icon: "🎒", color: "#60a5fa" },
  { level: 3, title: "Исследователь", titleKk: "Зерттеуші", minExp: 1500, icon: "🔍", color: "#a78bfa" },
  { level: 4, title: "Знаток ВКО", titleKk: "ШҚО білгірі", minExp: 3000, icon: "⭐", color: "#fbbf24" },
  { level: 5, title: "Легенда Алтая", titleKk: "Алтай аңызы", minExp: 5000, icon: "👑", color: "#f59e0b" },
];

const rewards: Reward[] = [
  {
    id: 1,
    title: "Путевка на Рахмановские Ключи",
    titleKk: "Рахман Бұлақтарына жолдама",
    description: "3 дня на термальном курорте с лечением",
    descriptionKk: "Емдеумен термалды курортта 3 күн",
    image: "https://lh3.googleusercontent.com/place-photos/AL8-SNFvc2i4uYGNkMkEJr0s6OIxbkfb_QlIG-_2qCRbsxA-H9W9zFoGBgB6iT4quKpr_ZURet9zhpimXSEry4T3_eBVgeedsLhQZw6vWE50mj-LIOXPCVBcxaZMk1ZIqhgWw_b-yt6pQnSa4zYIICE=s800-w800-h600",
    requiredExp: 5000
  },
  {
    id: 2,
    title: "Тур в Катон-Карагайский парк",
    titleKk: "Қатон-Қарағай паркіне тур",
    description: "Недельное путешествие по нацпарку с гидом",
    descriptionKk: "Гидпен ұлттық паркпен бір апталық саяхат",
    image: "https://lh3.googleusercontent.com/place-photos/AL8-SNHVqHccflhMeU0bRkUg2P6z0yZw5XhW8frYLwR9ZBw8rP2oDVehwyoNydtrJYT4qonBT21RXodSaewRcxQzLhtK5iIAiyw0U6uhuIK1ut2VxMXQfcu0cv4eQ-TKmO8pKP37pzQKnYUNUZcfHjg=s800-w800-h600",
    requiredExp: 3000
  },
  {
    id: 3,
    title: "Экскурсия в Западно-Алтайский заповедник",
    titleKk: "Батыс Алтай қорығына экскурсия",
    description: "Двухдневная экскурсия с фотоохотой",
    descriptionKk: "Фотоаңшылықпен екі күндік экскурсия",
    image: "https://lh3.googleusercontent.com/place-photos/AL8-SNGOwmRTqNdXBotCSUvhn4wEjbnC4j7I_E3d9EpKzxOTSF6NlcpbTApRVk9-D80yXS9mjec3ePXJpXlCmZrFSdt1SOhVE2XPniRRksO9yaelJNt0fwjfeONUMoBgq3T5WDXpveU1jHHLIdicGg=s800-w800-h600",
    requiredExp: 1500
  }
];

const initialQuests: Quest[] = [
  {
    id: 1,
    title: "Первые шаги",
    titleKk: "Алғашқы қадамдар",
    description: "Посетите первое место на карте",
    descriptionKk: "Картадағы бірінші орынға барыңыз",
    exp: 100,
    type: "visit",
    icon: <Footprints size={20} />,
    completed: false
  },
  {
    id: 2,
    title: "Путешественник",
    titleKk: "Саяхатшы",
    description: "Посетите 3 разных места",
    descriptionKk: "3 түрлі орынға барыңыз",
    exp: 300,
    type: "visit",
    icon: <Map size={20} />,
    completed: false
  },
  {
    id: 3,
    title: "Фотограф природы",
    titleKk: "Табиғат фотографы",
    description: "Сделайте фото в Катон-Карагайском парке",
    descriptionKk: "Қатон-Қарағай паркінде сурет түсіріңіз",
    exp: 200,
    type: "photo",
    icon: <Camera size={20} />,
    placeId: 1,
    completed: false
  },
  {
    id: 4,
    title: "Исследователь маршрутов",
    titleKk: "Маршрут зерттеушісі",
    description: "Постройте маршрут к любому месту",
    descriptionKk: "Кез келген жерге маршрут құрыңыз",
    exp: 150,
    type: "route",
    icon: <Map size={20} />,
    completed: false
  },
  {
    id: 5,
    title: "Городской турист",
    titleKk: "Қалалық турист",
    description: "Посетите все городские парки Усть-Каменогорска",
    descriptionKk: "Өскеменнің барлық қалалық саяхаттарына барыңыз",
    exp: 400,
    type: "visit",
    icon: <Trophy size={20} />,
    completed: false
  },
  {
    id: 6,
    title: "Покоритель вершин",
    titleKk: "Шыңдарды бағындырушы",
    description: "Изучите информацию о горных локациях",
    descriptionKk: "Тау орындары туралы ақпаратты зерттеңіз",
    exp: 250,
    type: "explore",
    icon: <Award size={20} />,
    completed: false
  },
  {
    id: 7,
    title: "Эко-путешественник",
    titleKk: "Эко-саяхатшы",
    description: "Прочитайте все эко-советы",
    descriptionKk: "Барлық эко-кеңестерді оқыңыз",
    exp: 200,
    type: "explore",
    icon: <Sparkles size={20} />,
    completed: false
  },
  {
    id: 8,
    title: "Мастер локаций",
    titleKk: "Локация шебері",
    description: "Посетите все места на карте",
    descriptionKk: "Картадағы барлық орындарға барыңыз",
    exp: 800,
    type: "visit",
    icon: <Trophy size={20} />,
    completed: false
  }
];

interface QuestSystemProps {
  lang: Lang;
  theme: Theme;
  visitedPlaces: number[];
  onClose: () => void;
}

export const QuestSystem: React.FC<QuestSystemProps> = ({ 
  lang, 
  theme, 
  visitedPlaces,
  onClose 
}) => {
  const isDark = theme === "dark";
  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem("vko-quests");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : initialQuests;
      }
    } catch (error) {
      console.error("Error loading quests:", error);
    }
    return initialQuests;
  });
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => {
    try {
      return getDailyQuests();
    } catch (error) {
      console.error("Error loading daily quests:", error);
      return [];
    }
  });
  const [totalExp, setTotalExp] = useState(() => {
    try {
      const saved = localStorage.getItem("vko-total-exp");
      return saved ? parseInt(saved) || 0 : 0;
    } catch (error) {
      console.error("Error loading exp:", error);
      return 0;
    }
  });
  const [selectedTab, setSelectedTab] = useState<"quests" | "daily" | "rewards">("daily");
  const [showRewardClaim, setShowRewardClaim] = useState<Reward | null>(null);
  const [photoQuest, setPhotoQuest] = useState<Quest | null>(null);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(() => {
    try {
      return getTimeUntilRefresh();
    } catch (error) {
      console.error("Error getting refresh time:", error);
      return "24:00:00";
    }
  });

  // Swipe для закрытия
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientY;
    if (touchStart !== null) {
      const distance = currentTouch - touchStart;
      if (distance > 0) {
        setSwipeDistance(distance);
      }
    }
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchEnd - touchStart;
    
    if (distance > minSwipeDistance) {
      onClose();
    }
    
    setSwipeDistance(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Получаем текущий ранг
  const currentRank = [...ranks].reverse().find(r => totalExp >= r.minExp) || ranks[0];
  const nextRank = ranks.find(r => r.minExp > totalExp);
  const progress = nextRank 
    ? ((totalExp - currentRank.minExp) / (nextRank.minExp - currentRank.minExp)) * 100
    : 100;

  // Сохраняем прогресс
  useEffect(() => {
    localStorage.setItem("vko-quests", JSON.stringify(quests));
    localStorage.setItem("vko-total-exp", totalExp.toString());
  }, [quests, totalExp]);
  
  // Обновляем таймер каждую минуту
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilRefresh(getTimeUntilRefresh());
      // Проверяем, нужно ли обновить ежедневные квесты
      const newDailyQuests = getDailyQuests();
      if (newDailyQuests[0]?.date !== dailyQuests[0]?.date) {
        setDailyQuests(newDailyQuests);
      }
    }, 60000); // Каждую минуту
    
    return () => clearInterval(interval);
  }, [dailyQuests]);

  // Автоматическая проверка квестов
  useEffect(() => {
    const updatedQuests = quests.map(quest => {
      if (quest.completed) return quest;
      
      // Квест "Первые шаги"
      if (quest.id === 1 && visitedPlaces.length > 0) {
        return { ...quest, completed: true };
      }
      
      // Квест "Путешественник" 
      if (quest.id === 2 && visitedPlaces.length >= 3) {
        return { ...quest, completed: true };
      }
      
      // Квест "Мастер локаций"
      if (quest.id === 8 && visitedPlaces.length >= 6) {
        return { ...quest, completed: true };
      }
      
      return quest;
    });
    
    setQuests(updatedQuests);
  }, [visitedPlaces]);

  const completeQuest = (questId: number) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    // Если квест требует фото, открываем окно загрузки
    if (quest.type === "photo") {
      setPhotoQuest(quest);
      return;
    }
    
    setQuests(prev => 
      prev.map(q => q.id === questId ? { ...q, completed: true } : q)
    );
    setTotalExp(prev => prev + quest.exp);
  };
  
  const completeDailyQuest = (questId: string) => {
    const quest = dailyQuests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    const updated = dailyQuests.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    );
    setDailyQuests(updated);
    saveDailyQuests(updated);
    setTotalExp(prev => prev + quest.exp);
  };
  
  const handlePhotoSubmit = (questId: number, photo: string, location: GeolocationPosition | null) => {
    console.log("Photo submitted for quest:", questId, "Location:", location);
    // Здесь в реальном приложении было бы API для отправки администраторам
    // Пока просто помечаем квест как "на модерации"
    alert(lang === "kk" 
      ? "Фото модерацияға жіберілді!" 
      : "Фото отправлено на модерацию!");
    setPhotoQuest(null);
  };

  const claimReward = (reward: Reward) => {
    if (totalExp >= reward.requiredExp) {
      setShowRewardClaim(reward);
    }
  };

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const completedDaily = dailyQuests.filter(q => q.completed).length;
  const totalDaily = dailyQuests.length;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full sm:max-w-2xl max-h-[92vh] overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${Math.min(swipeDistance, 300)}px)`,
          transition: swipeDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {/* Swipe indicator для мобильных */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className={`w-12 h-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
        </div>

        {/* Header */}
        <div className="relative h-48 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 text-8xl">🎁</div>
            <div className="absolute bottom-10 right-10 text-6xl">🏆</div>
            <div className="absolute top-20 right-20 text-5xl">⭐</div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-sm z-10"
          >
            <X size={20} />
          </button>
          
          <div className="relative h-full flex flex-col justify-end p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-5xl">{currentRank.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {lang === "kk" ? "Саяхат квесттері" : "Квесты путешественника"}
                </h2>
                <p className="text-white/80 text-sm">
                  {lang === "kk" ? currentRank.titleKk : currentRank.title}
                </p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-white/90 text-xs font-bold">{totalExp} EXP</span>
              {nextRank && (
                <span className="text-white/70 text-xs">
                  {nextRank.minExp} {lang === "kk" ? "дейін" : "до"} {lang === "kk" ? nextRank.titleKk : nextRank.title}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className={`flex border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={() => setSelectedTab("daily")}
            className={`flex-1 py-3 font-semibold transition-colors relative ${
              selectedTab === "daily"
                ? isDark 
                  ? "border-b-2 border-purple-500 text-purple-400"
                  : "border-b-2 border-purple-600 text-purple-600"
                : isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock size={16} />
              {lang === "kk" ? "Күнделікті" : "Ежедневные"} ({completedDaily}/{totalDaily})
            </div>
            {selectedTab === "daily" && (
              <div className="text-[10px] text-center mt-0.5 opacity-70">
                {timeUntilRefresh}
              </div>
            )}
          </button>
          <button
            onClick={() => setSelectedTab("quests")}
            className={`flex-1 py-3 font-semibold transition-colors ${
              selectedTab === "quests"
                ? isDark 
                  ? "border-b-2 border-purple-500 text-purple-400"
                  : "border-b-2 border-purple-600 text-purple-600"
                : isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {lang === "kk" ? "Квесттер" : "Квесты"} ({completedQuests}/{totalQuests})
          </button>
          <button
            onClick={() => setSelectedTab("rewards")}
            className={`flex-1 py-3 font-semibold transition-colors ${
              selectedTab === "rewards"
                ? isDark 
                  ? "border-b-2 border-purple-500 text-purple-400"
                  : "border-b-2 border-purple-600 text-purple-600"
                : isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {lang === "kk" ? "Сыйлықтар" : "Награды"}
          </button>
        </div>
        
        {/* Content */}
        <div className={`overflow-y-auto max-h-[50vh] p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
          {selectedTab === "daily" ? (
            <div className="space-y-3">
              {/* Info Banner */}
              <div className={`p-3 rounded-xl mb-4 ${
                isDark ? "bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50" 
                       : "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-purple-500" />
                  <span className="text-sm font-bold">
                    {lang === "kk" ? "Жаңарту:" : "Обновление:"} {timeUntilRefresh}
                  </span>
                </div>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {lang === "kk" 
                    ? "Күнделікті квесттер әр 24 сағат сайын жаңартылады"
                    : "Ежедневные квесты обновляются каждые 24 часа"}
                </p>
              </div>
              
              {dailyQuests.map(quest => (
                <div
                  key={quest.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    quest.completed
                      ? isDark 
                        ? "bg-green-900/20 border-green-700/50"
                        : "bg-green-50 border-green-200"
                      : isDark
                        ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${
                      quest.completed
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                    }`}>
                      {quest.completed ? <Check size={20} /> : <Sparkles size={20} />}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">
                        {lang === "kk" ? quest.titleKk : quest.title}
                      </h3>
                      <p className={`text-xs mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {lang === "kk" ? quest.descriptionKk : quest.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                          <Star size={12} className="fill-yellow-500" />
                          +{quest.exp} EXP
                        </div>
                        {quest.completed && (
                          <div className="text-xs text-green-500 font-bold">
                            ✓ {lang === "kk" ? "Аяқталды" : "Выполнено"}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!quest.completed && (
                      <button
                        onClick={() => completeDailyQuest(quest.id)}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-colors"
                      >
                        {lang === "kk" ? "Тексеру" : "Проверить"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedTab === "quests" ? (
            <div className="space-y-3">
              {quests.map(quest => (
                <div
                  key={quest.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    quest.completed
                      ? isDark 
                        ? "bg-green-900/20 border-green-700/50"
                        : "bg-green-50 border-green-200"
                      : isDark
                        ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${
                      quest.completed
                        ? "bg-green-500 text-white"
                        : isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                    }`}>
                      {quest.completed ? <Check size={20} /> : quest.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">
                        {lang === "kk" ? quest.titleKk : quest.title}
                      </h3>
                      <p className={`text-xs mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {lang === "kk" ? quest.descriptionKk : quest.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                          <Star size={12} className="fill-yellow-500" />
                          +{quest.exp} EXP
                        </div>
                        {quest.completed && (
                          <div className="text-xs text-green-500 font-bold">
                            ✓ {lang === "kk" ? "Аяқталды" : "Выполнено"}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!quest.completed && (
                      <button
                        onClick={() => completeQuest(quest.id)}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        {quest.type === "photo" && <Camera size={14} />}
                        {lang === "kk" ? "Тексеру" : "Проверить"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {rewards.map(reward => {
                const canClaim = totalExp >= reward.requiredExp;
                return (
                  <div
                    key={reward.id}
                    className={`relative overflow-hidden rounded-2xl border ${
                      canClaim
                        ? isDark
                          ? "border-yellow-600 bg-gradient-to-br from-yellow-900/20 to-orange-900/20"
                          : "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50"
                        : isDark
                          ? "border-gray-700 bg-gray-800"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {!canClaim && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock size={32} className="text-white mx-auto mb-2" />
                          <p className="text-white font-bold text-sm">
                            {reward.requiredExp - totalExp} EXP {lang === "kk" ? "жетіспейді" : "не хватает"}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-4 p-4">
                      <img 
                        src={reward.image}
                        alt={lang === "kk" ? reward.titleKk : reward.title}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">
                          {lang === "kk" ? reward.titleKk : reward.title}
                        </h3>
                        <p className={`text-xs mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {lang === "kk" ? reward.descriptionKk : reward.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                            <Trophy size={12} />
                            {reward.requiredExp} EXP
                          </div>
                        </div>
                      </div>
                      
                      {canClaim && (
                        <button
                          onClick={() => claimReward(reward)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold transition-all flex items-center gap-2 h-fit"
                        >
                          <Plane size={16} />
                          {lang === "kk" ? "Алу" : "Получить"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Reward Claim Modal */}
      {showRewardClaim && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80"
            onClick={() => setShowRewardClaim(null)}
          />
          <div className={`relative max-w-md w-full rounded-3xl p-6 text-center ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold mb-2">
              {lang === "kk" ? "Құттықтаймыз!" : "Поздравляем!"}
            </h3>
            <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {lang === "kk" 
                ? "Сіз жолдаманы алдыңыз:" 
                : "Вы получили путевку:"}
            </p>
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 mb-4">
              <p className="text-white font-bold text-lg">
                {lang === "kk" ? showRewardClaim.titleKk : showRewardClaim.title}
              </p>
            </div>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {lang === "kk"
                ? "Бұл макет. Нағыз жолдама үшін біздің серіктестерімізбен байланысыңыз."
                : "Это макет. Для получения настоящей путевки свяжитесь с нашими партнерами."}
            </p>
            <button
              onClick={() => setShowRewardClaim(null)}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
            >
              {lang === "kk" ? "Жақсы!" : "Отлично!"}
            </button>
          </div>
        </div>
      )}
      
      {/* Photo Verification Modal */}
      {photoQuest && (
        <PhotoVerification
          quest={photoQuest}
          lang={lang}
          theme={theme}
          onClose={() => setPhotoQuest(null)}
          onSubmit={handlePhotoSubmit}
        />
      )}
    </div>
  );
};

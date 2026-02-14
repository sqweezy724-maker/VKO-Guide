// Система ежедневных квестов
export interface DailyQuest {
  id: string;
  title: string;
  titleKk: string;
  description: string;
  descriptionKk: string;
  exp: number;
  type: "visit" | "photo" | "route" | "explore";
  placeId?: number;
  completed: boolean;
  date: string; // ISO date string
}

// Генератор случайных ежедневных квестов
export const generateDailyQuests = (): DailyQuest[] => {
  const today = new Date().toISOString().split('T')[0];
  
  const questPool = [
    {
      title: "Утренняя прогулка",
      titleKk: "Таңғы серуен",
      description: "Посетите городской парк до 12:00",
      descriptionKk: "12:00-ге дейін қалалық паркке барыңыз",
      exp: 150,
      type: "visit" as const,
      placeId: 5
    },
    {
      title: "Фотограф дня",
      titleKk: "Күннің фотографы",
      description: "Сделайте фото в любом месте",
      descriptionKk: "Кез келген жерде сурет түсіріңіз",
      exp: 200,
      type: "photo" as const
    },
    {
      title: "Путешествие выходного дня",
      titleKk: "Демалыс күні саяхаты",
      description: "Посетите 2 места за сегодня",
      descriptionKk: "Бүгін 2 жерге барыңыз",
      exp: 250,
      type: "visit" as const
    },
    {
      title: "Исследователь маршрутов",
      titleKk: "Маршрут зерттеушісі",
      description: "Постройте маршрут до любого места",
      descriptionKk: "Кез келген жерге маршрут құрыңыз",
      exp: 100,
      type: "route" as const
    },
    {
      title: "Эко-воин",
      titleKk: "Эко-жауынгер",
      description: "Прочитайте 3 эко-совета",
      descriptionKk: "3 эко-кеңес оқыңыз",
      exp: 150,
      type: "explore" as const
    },
    {
      title: "Культурный турист",
      titleKk: "Мәдени турист",
      description: "Посетите этнопарк",
      descriptionKk: "Этнопаркке барыңыз",
      exp: 200,
      type: "visit" as const,
      placeId: 4
    }
  ];
  
  // Выбираем 3 случайных квеста на день (seed based on date for consistency)
  const seed = today.split('-').reduce((a, b) => parseInt(a) + parseInt(b), 0);
  const shuffled = questPool.sort(() => 0.5 - Math.sin(seed));
  const selected = shuffled.slice(0, 3);
  
  return selected.map((q, i) => ({
    id: `daily-${today}-${i}`,
    ...q,
    completed: false,
    date: today
  }));
};

// Проверка, нужно ли обновить квесты
export const shouldRefreshDailyQuests = (lastUpdate: string | null): boolean => {
  if (!lastUpdate) return true;
  
  const today = new Date().toISOString().split('T')[0];
  return lastUpdate !== today;
};

// Получить ежедневные квесты из localStorage
export const getDailyQuests = (): DailyQuest[] => {
  const saved = localStorage.getItem("vko-daily-quests");
  const lastUpdate = localStorage.getItem("vko-daily-quests-date");
  
  if (shouldRefreshDailyQuests(lastUpdate)) {
    // Генерируем новые квесты
    const newQuests = generateDailyQuests();
    const today = new Date().toISOString().split('T')[0];
    
    localStorage.setItem("vko-daily-quests", JSON.stringify(newQuests));
    localStorage.setItem("vko-daily-quests-date", today);
    
    return newQuests;
  }
  
  return saved ? JSON.parse(saved) : generateDailyQuests();
};

// Сохранить ежедневные квесты
export const saveDailyQuests = (quests: DailyQuest[]): void => {
  localStorage.setItem("vko-daily-quests", JSON.stringify(quests));
};

// Получить время до обновления квестов
export const getTimeUntilRefresh = (): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}ч ${minutes}м`;
};

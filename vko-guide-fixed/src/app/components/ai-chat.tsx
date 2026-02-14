import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Loader2, Sparkles, MapPin, Camera, Compass } from "lucide-react";
import type { Lang } from "../i18n";
import type { Theme } from "../App";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  lang: Lang;
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
}

const SYSTEM_PROMPT_RU = `Ты - виртуальный туристический гид по Восточно-Казахстанской области (ВКО). Твоя задача - помогать путешественникам с информацией о:

1. Туристических местах ВКО (Катон-Карагайский парк, Рахмановские ключи, озеро Маркаколь, и т.д.)
2. Практических советах для путешественников
3. Маршрутах и логистике
4. Местной культуре и традициях
5. Безопасности в горах
6. Сезонности посещения разных мест

Отвечай кратко, дружелюбно и по существу. Если вопрос не связан с туризмом в ВКО, вежливо перенаправь разговор к туристической тематике.`;

const SYSTEM_PROMPT_KK = `Сіз - Шығыс Қазақстан облысы (ШҚО) бойынша виртуалды туристік гид. Сіздің міндетіңіз - саяхатшыларға мына ақпарат беру:

1. ШҚО туристік жерлері (Қатон-Қарағай паркі, Рахман бұлақтары, Марқакөл көлі, т.б.)
2. Саяхатшылар үшін практикалық кеңестер
3. Маршруттар мен логистика
4. Жергілікті мәдениет пен дәстүрлер
5. Таулардағы қауіпсіздік
6. Әр түрлі жерлерге баруға маусымдылық

Қысқа, достық және нақты жауап беріңіз. Егер сұрақ ШҚО туризміне қатысты болмаса, әдепті түрде әңгімені туристік тақырыпқа бағыттаңыз.`;

const QUICK_QUESTIONS_RU = [
  "Что посетить в ВКО?",
  "Маршрут на выходные",
  "Где остановиться?",
  "Лучшее время для поездки"
];

const QUICK_QUESTIONS_KK = [
  "ШҚО-да не көруге болады?",
  "Демалыс күндеріне маршрут",
  "Қайда тоқтауға болады?",
  "Саяхатқа ең жақсы уақыт"
];

export const AIChat: React.FC<AIChatProps> = ({ lang, theme, isOpen, onClose }) => {
  const isDark = theme === "dark";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = lang === "kk" ? QUICK_QUESTIONS_KK : QUICK_QUESTIONS_RU;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: lang === "kk" 
          ? "Сәлеметсіз бе! Мен ШҚО бойынша сіздің виртуалды гидіңізбін. ☀️\n\nМен сізге көмектесе аламын:\n• Туристік орындар туралы ақпарат\n• Маршруттарды жоспарлау\n• Қонақ үйлер мен тұру\n• Жергілікті кеңестер\n\nНені білгіңіз келеді?"
          : "Здравствуйте! Я ваш виртуальный гид по ВКО. ☀️\n\nЯ могу помочь вам с:\n• Информацией о туристических местах\n• Планированием маршрутов\n• Отелями и проживанием\n• Местными советами\n\nЧто вас интересует?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Задержка для имитации обработки
    await new Promise(resolve => setTimeout(resolve, 800));

    // Простые ответы на основе ключевых слов
    let responseText = "";
    const lowerMessage = messageText.toLowerCase();
    
    if (lowerMessage.includes("посетить") || lowerMessage.includes("көру") || lowerMessage.includes("что") || lowerMessage.includes("не")) {
      responseText = lang === "kk"
        ? "ШҚО-да міндетті түрде көруге тұрарлық орындар:\n\n🏔️ Қатон-Қарағай ұлттық паркі - таңғажайып табиғат\n♨️ Рахман бұлақтары - термалды көздер\n🏞️ Марқакөл көлі - таза тау көлі\n🏛️ Өскемен қаласы - өнеркәсіп орталығы\n\nҚайсысы туралы көбірек білгіңіз келеді?"
        : "В ВКО обязательно стоит посетить:\n\n🏔️ Катон-Карагайский национальный парк - потрясающая природа\n♨️ Рахмановские ключи - термальные источники\n🏞️ Озеро Маркаколь - чистейшее горное озеро\n🏛️ Усть-Каменогорск - промышленный центр\n\nО чем хотите узнать подробнее?";
    } else if (lowerMessage.includes("маршрут") || lowerMessage.includes("выходн") || lowerMessage.includes("демалыс")) {
      responseText = lang === "kk"
        ? "Демалыс күндеріне маршрут:\n\n📍 1 күн: Өскемен қаласы - саябақтар мен мұражайлар\n📍 2 күн: Риддерге сапар - тау пейзаждары\n📍 Балама: Бұқтырма су қоймасы - демалыс\n\nАвтокөлікпен шамамен 200-300 км."
        : "Маршрут на выходные:\n\n📍 День 1: Усть-Каменогорск - парки и музеи\n📍 День 2: Поездка в Риддер - горные пейзажи\n📍 Альтернатива: Бухтарминское водохранилище - отдых\n\nНа машине примерно 200-300 км.";
    } else if (lowerMessage.includes("остановиться") || lowerMessage.includes("отель") || lowerMessage.includes("тоқта") || lowerMessage.includes("қонақ")) {
      responseText = lang === "kk"
        ? "Тұру орындары:\n\n🏨 Өскемен: қонақ үйлер мен хостелдар бар\n🏡 Қатон-Қарағай: гест-хаустар және базалар\n♨️ Рахман бұлақтары: санаторий\n\nБағалар 5000-15000 тг аралығында."
        : "Варианты проживания:\n\n🏨 Усть-Каменогорск: отели и хостелы\n🏡 Катон-Карагай: гостевые дома и базы\n♨️ Рахмановские ключи: санаторий\n\nЦены от 5000 до 15000 тг.";
    } else if (lowerMessage.includes("время") || lowerMessage.includes("когда") || lowerMessage.includes("уақыт") || lowerMessage.includes("қашан")) {
      responseText = lang === "kk"
        ? "ШҚО-ға баруға ең жақсы уақыт:\n\n☀️ Маусым-тамыз: жаз, жылы ауа-райы\n🍂 Қыркүйек: алтын күз, әдемі түстер\n❄️ Желтоқсан-ақпан: қыс спорты\n\nНегізгі сезон - маусым-қыркүйек."
        : "Лучшее время для поездки в ВКО:\n\n☀️ Июнь-август: лето, теплая погода\n🍂 Сентябрь: золотая осень, красивые краски\n❄️ Декабрь-февраль: зимние виды спорта\n\nОсновной сезон - июнь-сентябрь.";
    } else if (lowerMessage.includes("спасибо") || lowerMessage.includes("рахмет") || lowerMessage.includes("thanks")) {
      responseText = lang === "kk"
        ? "Қош келдіңіз! 😊 Басқа сұрақтарыңыз болса, сұраңыз!"
        : "Пожалуйста! 😊 Если будут еще вопросы, обращайтесь!";
    } else {
      responseText = lang === "kk"
        ? "Мен ШҚО туризмі туралы ақпарат бере аламын:\n\n• Туристік орындар\n• Маршруттар\n• Қонақ үйлер\n• Баруға ең жақсы уақыт\n\nНені білгіңіз келеді?"
        : "Я могу помочь с информацией о туризме в ВКО:\n\n• Туристические места\n• Маршруты\n• Отели и проживание\n• Лучшее время для поездки\n\nЧто вас интересует?";
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col">
      <div 
        className={`w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] rounded-3xl shadow-2xl flex flex-col ${
          isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? "border-gray-700 bg-gradient-to-r from-purple-900/50 to-pink-900/50" : "border-gray-200 bg-gradient-to-r from-purple-100 to-pink-100"
        } rounded-t-3xl`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {lang === "kk" ? "AI Туристік Гид" : "AI Туристический Гид"}
              </h3>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {lang === "kk" ? "ШҚО туралы барлығы" : "Всё о ВКО"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}>
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : isDark
                      ? "bg-gray-800 text-gray-100 border border-gray-700"
                      : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                <p className={`text-xs mt-2 ${
                  message.role === "user" 
                    ? "text-purple-200" 
                    : isDark ? "text-gray-500" : "text-gray-400"
                }`}>
                  {message.timestamp.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className={`rounded-2xl px-4 py-3 ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}>
                <Loader2 size={20} className="animate-spin text-purple-600" />
              </div>
            </div>
          )}
          
          {/* Quick Questions */}
          {messages.length === 1 && !isLoading && (
            <div className="space-y-2 pt-2">
              <p className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {lang === "kk" ? "Жиі қойылатын сұрақтар:" : "Популярные вопросы:"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(question)}
                    className={`p-3 rounded-xl text-xs text-left transition-all ${
                      isDark 
                        ? "bg-gray-800 hover:bg-gray-700 border border-gray-700" 
                        : "bg-white hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        } rounded-b-3xl`}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={lang === "kk" ? "Сұрақты жазыңыз..." : "Введите вопрос..."}
              className={`flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                isDark 
                  ? "bg-gray-900 text-white border border-gray-700" 
                  : "bg-gray-50 text-gray-900 border border-gray-200"
              }`}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition-all ${
                input.trim() && !isLoading
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                  : isDark
                    ? "bg-gray-700 text-gray-500"
                    : "bg-gray-200 text-gray-400"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

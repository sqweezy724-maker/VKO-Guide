import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { MapView } from "./components/map-view";
import { Navbar } from "./components/navbar";
import { PlaceModal } from "./components/place-modal";
import { QuestSystem } from "./components/quest-system";
import { AIChat } from "./components/ai-chat";
import { AIChatButton } from "./components/ai-chat-button";
import { AuthModal } from "./components/auth-modal";
import type { Lang } from "./i18n";
import type { Place } from "./places-data";
import { db } from "./db";

export type MapMode = "normal" | "satellite" | "panorama";
export type Theme = "light" | "dark";

const App: React.FC = () => {
  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(() => !db.isAuthenticated());
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Load persisted settings on first render
  const saved = db.getSettings();
  const profile = db.getProfile();

  // Координаты Усть-Каменогорска по умолчанию
  const [viewCenter, setViewCenter] = useState<[number, number]>([49.9485, 82.5869]);
  const [zoomLevel, setZoomLevel] = useState(8);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lang, setLangState] = useState<Lang>(saved.lang);
  const [theme, setThemeState] = useState<Theme>(saved.theme);
  const [mapMode, setMapModeState] = useState<MapMode>(saved.mapMode);
  const [savedPlaces, setSavedPlacesState] = useState<number[]>(saved.savedPlaces);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [activeTab, setActiveTab] = useState<"explore" | "saved" | "settings">("explore");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalPlace, setModalPlace] = useState<Place | null>(null);
  const [routeTarget, setRouteTarget] = useState<Place | null>(null);
  const [showQuests, setShowQuests] = useState(false);
  const [visitedPlaces, setVisitedPlaces] = useState<number[]>(() => db.getVisitedPlaces());

  // Persist whenever settings change
  const setLang = (v: Lang) => { setLangState(v); db.saveSettings({ lang: v }); };
  const setTheme = (v: Theme) => { setThemeState(v); db.saveSettings({ theme: v }); };
  const setMapMode = (v: MapMode) => { setMapModeState(v); db.saveSettings({ mapMode: v }); };

  const handleSavePlace = (id: number) => {
    setSavedPlacesState(prev => {
      const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      db.saveSettings({ savedPlaces: next });
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleSelectLocation = (lat: number, lng: number, zoom: number, place?: Place) => {
    setViewCenter([lat, lng]);
    setZoomLevel(zoom);
    if (place) {
      setSelectedPlace(place);
      // Отмечаем место как посещенное
      if (!visitedPlaces.includes(place.id)) {
        const newVisited = [...visitedPlaces, place.id];
        setVisitedPlaces(newVisited);
        db.saveVisitedPlaces(newVisited);
      }
    }
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleOpenModal = (place: Place) => {
    setModalPlace(place);
    // Отмечаем место как посещенное
    if (!visitedPlaces.includes(place.id)) {
      const newVisited = [...visitedPlaces, place.id];
      setVisitedPlaces(newVisited);
      db.saveVisitedPlaces(newVisited);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 5));

  const handleBuildRoute = (place: Place) => {
    setRouteTarget(place);
    setViewCenter([place.lat, place.lng]);
    setZoomLevel(Math.max(place.zoom - 1, 8));
    setModalPlace(null);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      // Если геолокация недоступна, предлагаем ручной ввод координат
      const useManual = confirm(
        lang === 'kk' 
          ? 'Геолокация қолжетімді емес. Қалаңызды қолмен таңдағыңыз келе ме?'
          : 'Геолокация недоступна. Хотите выбрать город вручную?'
      );
      
      if (useManual) {
        // Усть-Каменогорск по умолчанию
        setViewCenter([49.9485, 82.5869]);
        setZoomLevel(12);
        setUserLocation([49.9485, 82.5869]);
      }
      return;
    }
    
    setIsGeolocating(true);
    
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setViewCenter(coords);
        setZoomLevel(14);
        setIsGeolocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGeolocating(false);
        
        // Предлагаем альтернативу - выбор города
        const cities = [
          { name: lang === 'kk' ? 'Өскемен' : 'Усть-Каменогорск', coords: [49.9485, 82.5869] },
          { name: lang === 'kk' ? 'Семей' : 'Семей', coords: [50.4111, 80.2275] },
          { name: lang === 'kk' ? 'Риддер' : 'Риддер', coords: [50.3448, 83.5125] }
        ];
        
        const cityChoice = prompt(
          lang === 'kk'
            ? `Геолокация жұмыс істемейді. Қалаңызды таңдаңыз:\n${cities.map((c, i) => `${i + 1}. ${c.name}`).join('\n')}\n\nСанды енгізіңіз (1-3):`
            : `Геолокация не работает. Выберите ваш город:\n${cities.map((c, i) => `${i + 1}. ${c.name}`).join('\n')}\n\nВведите номер (1-3):`
        );
        
        const index = parseInt(cityChoice || '1') - 1;
        if (index >= 0 && index < cities.length) {
          const city = cities[index];
          setUserLocation(city.coords as [number, number]);
          setViewCenter(city.coords as [number, number]);
          setZoomLevel(12);
        }
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const isDark = theme === "dark";

  return (
    <>
      {showAuthModal && (
        <AuthModal
          lang={lang}
          theme={theme}
          onComplete={(profile) => {
            setShowAuthModal(false);
            db.saveProfile(profile);
          }}
        />
      )}
      
      <div className={`flex h-screen w-full ${isDark ? "bg-gray-900" : "bg-gray-50"} overflow-hidden font-sans transition-colors duration-300`}>
        <Sidebar
          onSelectLocation={handleSelectLocation}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          lang={lang} setLang={setLang}
          theme={theme} setTheme={setTheme}
          mapMode={mapMode} setMapMode={setMapMode}
          savedPlaces={savedPlaces}
          onSavePlace={handleSavePlace}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userLocation={userLocation}
          onBuildRoute={handleBuildRoute}
          onOpenModal={handleOpenModal}
          profile={profile}
        />

        <main className="flex-1 flex flex-col relative overflow-hidden">
          <Navbar
            onToggleSidebar={() => setIsSidebarOpen(v => !v)}
            onOpenQuests={() => setShowQuests(true)}
            lang={lang}
            theme={theme}
            profile={profile}
          />
          <div className="flex-1 w-full relative" style={{ overflow: "hidden" }}>
            <MapView
              viewCenter={viewCenter}
              zoomLevel={zoomLevel}
              mapMode={mapMode}
              lang={lang}
              theme={theme}
              userLocation={userLocation}
              isGeolocating={isGeolocating}
              routeTarget={routeTarget}
              savedPlaces={savedPlaces}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onGeolocate={handleGeolocate}
              onClearRoute={() => setRouteTarget(null)}
              onOpenModal={handleOpenModal}
              onSavePlace={handleSavePlace}
              setMapMode={setMapMode}
            />
          </div>
          {isSidebarOpen && (
            <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[999]"
              onClick={() => setIsSidebarOpen(false)} />
          )}
        </main>

        {/* Place detail modal */}
        {modalPlace && (
          <PlaceModal
            place={modalPlace}
            lang={lang}
            theme={theme}
            isSaved={savedPlaces.includes(modalPlace.id)}
            onClose={() => setModalPlace(null)}
            onSave={() => handleSavePlace(modalPlace.id)}
            onBuildRoute={() => handleBuildRoute(modalPlace)}
          />
        )}
        
        {/* Quest System */}
        {showQuests && (
          <QuestSystem
            lang={lang}
            theme={theme}
            visitedPlaces={visitedPlaces}
            onClose={() => setShowQuests(false)}
          />
        )}
        
        {/* AI Chat */}
        {!isChatOpen && !showAuthModal && (
          <AIChatButton
            onClick={() => setIsChatOpen(true)}
            theme={theme}
          />
        )}
        
        {isChatOpen && (
          <AIChat
            lang={lang}
            theme={theme}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default App;

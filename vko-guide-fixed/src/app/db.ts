// ─── Enhanced LocalStorage-based persistence with auth ───────────────────

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  createdAt: string;
  isGuest: boolean;
}

export interface AppSettings {
  theme: "light" | "dark";
  lang: "ru" | "kk";
  mapMode: "normal" | "satellite" | "panorama";
  savedPlaces: number[];
}

export interface QuestProgress {
  questId: number;
  completed: boolean;
  completedAt?: string;
  photoUrl?: string;
}

export interface UserData {
  profile: UserProfile;
  settings: AppSettings;
  questProgress: QuestProgress[];
  visitedPlaces: number[];
  totalExp: number;
  dailyQuestsLastRefresh: string;
}

const PROFILE_KEY = "vko_profile";
const SETTINGS_KEY = "vko_settings";
const QUEST_PROGRESS_KEY = "vko_quest_progress";
const VISITED_PLACES_KEY = "vko_visited_places";
const TOTAL_EXP_KEY = "vko_total_exp";
const DAILY_QUESTS_KEY = "vko_daily_quests";
const AUTH_TOKEN_KEY = "vko_auth_token";
const IS_GUEST_KEY = "vko_is_guest";

function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

const defaultProfile: UserProfile = { 
  id: generateUserId(),
  name: "Путешественник", 
  avatar: "🧭",
  createdAt: new Date().toISOString(),
  isGuest: true
};

const defaultSettings: AppSettings = {
  theme: "light",
  lang: "ru",
  mapMode: "normal",
  savedPlaces: [],
};

export const db = {
  // Auth Methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY) || this.isGuest();
  },

  isGuest(): boolean {
    const isGuest = localStorage.getItem(IS_GUEST_KEY);
    return isGuest === 'true';
  },

  setGuestMode(isGuest: boolean) {
    localStorage.setItem(IS_GUEST_KEY, String(isGuest));
    if (isGuest) {
      const profile = this.getProfile();
      profile.isGuest = true;
      this.saveProfile(profile);
    }
  },

  register(email: string, name: string, avatar: string = "🧭"): UserProfile {
    const userId = generateUserId();
    const token = 'token_' + userId;
    
    const profile: UserProfile = {
      id: userId,
      name,
      avatar,
      email,
      createdAt: new Date().toISOString(),
      isGuest: false
    };
    
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(IS_GUEST_KEY, 'false');
    this.saveProfile(profile);
    
    return profile;
  },

  continueAsGuest(): UserProfile {
    const profile = this.getProfile();
    profile.isGuest = true;
    this.setGuestMode(true);
    this.saveProfile(profile);
    return profile;
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.setItem(IS_GUEST_KEY, 'true');
  },

  // Profile Methods
  getProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const profile = JSON.parse(raw);
        if (profile.isGuest === undefined) {
          profile.isGuest = !localStorage.getItem(AUTH_TOKEN_KEY);
        }
        return { ...defaultProfile, ...profile };
      }
      return defaultProfile;
    } catch { 
      return defaultProfile; 
    }
  },

  saveProfile(p: Partial<UserProfile>) {
    try { 
      const current = this.getProfile();
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...current, ...p })); 
    } catch {}
  },

  // Settings Methods
  getSettings(): AppSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
    } catch { 
      return defaultSettings; 
    }
  },

  saveSettings(s: Partial<AppSettings>) {
    try {
      const current = this.getSettings();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...s }));
    } catch {}
  },

  // Quest Progress Methods
  getQuestProgress(): QuestProgress[] {
    try {
      const raw = localStorage.getItem(QUEST_PROGRESS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveQuestProgress(progress: QuestProgress[]) {
    try {
      localStorage.setItem(QUEST_PROGRESS_KEY, JSON.stringify(progress));
    } catch {}
  },

  completeQuest(questId: number, photoUrl?: string) {
    const progress = this.getQuestProgress();
    const existing = progress.find(p => p.questId === questId);
    
    if (existing) {
      existing.completed = true;
      existing.completedAt = new Date().toISOString();
      if (photoUrl) existing.photoUrl = photoUrl;
    } else {
      progress.push({
        questId,
        completed: true,
        completedAt: new Date().toISOString(),
        photoUrl
      });
    }
    
    this.saveQuestProgress(progress);
  },

  // Visited Places Methods
  getVisitedPlaces(): number[] {
    try {
      const raw = localStorage.getItem(VISITED_PLACES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveVisitedPlaces(places: number[]) {
    try {
      localStorage.setItem(VISITED_PLACES_KEY, JSON.stringify(places));
    } catch {}
  },

  addVisitedPlace(placeId: number) {
    const visited = this.getVisitedPlaces();
    if (!visited.includes(placeId)) {
      visited.push(placeId);
      this.saveVisitedPlaces(visited);
    }
  },

  // Experience Methods
  getTotalExp(): number {
    try {
      const raw = localStorage.getItem(TOTAL_EXP_KEY);
      return raw ? parseInt(raw) : 0;
    } catch {
      return 0;
    }
  },

  saveTotalExp(exp: number) {
    try {
      localStorage.setItem(TOTAL_EXP_KEY, String(exp));
    } catch {}
  },

  addExp(amount: number) {
    const current = this.getTotalExp();
    this.saveTotalExp(current + amount);
  },

  // Export/Import
  exportUserData(): UserData {
    return {
      profile: this.getProfile(),
      settings: this.getSettings(),
      questProgress: this.getQuestProgress(),
      visitedPlaces: this.getVisitedPlaces(),
      totalExp: this.getTotalExp(),
      dailyQuestsLastRefresh: localStorage.getItem(DAILY_QUESTS_KEY) || ''
    };
  },

  importUserData(data: UserData) {
    this.saveProfile(data.profile);
    this.saveSettings(data.settings);
    this.saveQuestProgress(data.questProgress);
    this.saveVisitedPlaces(data.visitedPlaces);
    this.saveTotalExp(data.totalExp);
    if (data.dailyQuestsLastRefresh) {
      localStorage.setItem(DAILY_QUESTS_KEY, data.dailyQuestsLastRefresh);
    }
  },

  clearAllData() {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(QUEST_PROGRESS_KEY);
    localStorage.removeItem(VISITED_PLACES_KEY);
    localStorage.removeItem(TOTAL_EXP_KEY);
    localStorage.removeItem(DAILY_QUESTS_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(IS_GUEST_KEY);
  }
};

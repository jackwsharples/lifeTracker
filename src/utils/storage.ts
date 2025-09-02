// src/utils/storage.ts
// A thin client that talks to your Express/Prisma API instead of localStorage.
// It preserves the same method names your components already call.

import type {
  Class,
  WorkItem,
  ImportantDate,
  Idea,
  Event,
  Workout,
  Exercise,
  BikeIdea,
  BikeEvent,
} from "../types";

const json = (r: Response) => {
  if (!r.ok) throw new Error(`API ${r.status} ${r.statusText}`);
  return r.json();
};

// If you ever host API on a different origin in dev, set this via Vite env:
// import.meta.env.VITE_API_BASE or default to same-origin.
const API = (import.meta as any).env?.VITE_API_BASE || "";

export const storage = {
  // ---------- CLASSES ----------
  async getClasses(): Promise<Class[]> {
    return fetch(`${API}/api/classes`).then(json);
  },
  async saveClasses(newClasses: Class[]): Promise<void> {
    // Not typically used anymore; create individually
    // Keep for backward compat: no-op
    return;
  },
  async createClass(name: string): Promise<Class> {
    return fetch(`${API}/api/classes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then(json);
  },

  // ---------- WORK ITEMS ----------
  async getWorkItems(): Promise<WorkItem[]> {
    return fetch(`${API}/api/work-items`).then(json);
  },
  async saveWorkItems(_items: WorkItem[]): Promise<void> {
    // Legacy no-op
    return;
  },
  async createWorkItem(data: Omit<WorkItem, "id" | "createdAt" | "updatedAt">): Promise<WorkItem> {
    return fetch(`${API}/api/work-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(json);
  },
  async updateWorkItem(id: string, patch: Partial<WorkItem>): Promise<WorkItem> {
    return fetch(`${API}/api/work-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then(json);
  },
  async deleteWorkItem(id: string): Promise<void> {
    await fetch(`${API}/api/work-items/${id}`, { method: "DELETE" }).then(json);
  },

  // ---------- IMPORTANT DATES ----------
  async getImportantDates(): Promise<ImportantDate[]> {
    return fetch(`${API}/api/important-dates`).then(json);
  },
  async saveImportantDates(_dates: ImportantDate[]): Promise<void> {
    // Legacy no-op
    return;
  },
  async createImportantDate(
    data: Omit<ImportantDate, "id" | "createdAt" | "updatedAt">
  ): Promise<ImportantDate> {
    return fetch(`${API}/api/important-dates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(json);
  },
  async deleteImportantDate(id: string): Promise<void> {
    await fetch(`${API}/api/important-dates/${id}`, { method: "DELETE" }).then(json);
  },

  // ---------- IDEAS ----------
  async getIdeas(): Promise<Idea[]> {
    return fetch(`${API}/api/ideas`).then(json);
  },
  async saveIdeas(_ideas: Idea[]): Promise<void> {
    // Legacy no-op
    return;
  },
  async createIdea(content: string): Promise<Idea> {
    return fetch(`${API}/api/ideas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }).then(json);
  },
  async deleteIdea(id: string): Promise<void> {
    await fetch(`${API}/api/ideas/${id}`, { method: "DELETE" }).then(json);
  },

  // ---------- EVENTS ----------
  async getEvents(): Promise<Event[]> {
    return fetch(`${API}/api/events`).then(json);
  },
  async saveEvents(_events: Event[]): Promise<void> {
    // Legacy no-op
    return;
  },
  async createEvent(data: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    return fetch(`${API}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(json);
  },
  async deleteEvent(id: string): Promise<void> {
    await fetch(`${API}/api/events/${id}`, { method: "DELETE" }).then(json);
  },

  // ---------- (OPTIONAL) WORKOUTS / BIKE ----------
  async getWorkouts(): Promise<Workout[]> {
    // add route if/when you implement it server-side
    return [];
  },
  async getBikeIdeas(): Promise<BikeIdea[]> { return []; },
  async getBikeEvents(): Promise<BikeEvent[]> { return []; },
};

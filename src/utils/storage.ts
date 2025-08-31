import { Class, WorkItem, ImportantDate, Idea, Event, Workout, BikeIdea, BikeEvent } from '../types';

const STORAGE_KEYS = {
  CLASSES: 'life-tracker-classes',
  WORK_ITEMS: 'life-tracker-work-items',
  IMPORTANT_DATES: 'life-tracker-important-dates',
  IDEAS: 'life-tracker-ideas',
  EVENTS: 'life-tracker-events',
  WORKOUTS: 'life-tracker-workouts',
  BIKE_IDEAS: 'life-tracker-bike-ideas',
  BIKE_EVENTS: 'life-tracker-bike-events',
};

export const storage = {
  // Classes
  getClasses: (): Class[] => {
    const classes = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return classes ? JSON.parse(classes) : [
      { id: '1', name: 'Senior Seminar', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), workItems: [], importantDates: [] },
      { id: '2', name: 'ClientSide', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), workItems: [], importantDates: [] },
      { id: '3', name: 'CIS Audit', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), workItems: [], importantDates: [] },
      { id: '4', name: 'Managing Security', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), workItems: [], importantDates: [] },
    ];
  },
  
  saveClasses: (classes: Class[]): void => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },

  // Work Items
  getWorkItems: (): WorkItem[] => {
    const items = localStorage.getItem(STORAGE_KEYS.WORK_ITEMS);
    return items ? JSON.parse(items) : [];
  },
  
  saveWorkItems: (items: WorkItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.WORK_ITEMS, JSON.stringify(items));
  },

  // Important Dates
  getImportantDates: (): ImportantDate[] => {
    const dates = localStorage.getItem(STORAGE_KEYS.IMPORTANT_DATES);
    return dates ? JSON.parse(dates) : [];
  },
  
  saveImportantDates: (dates: ImportantDate[]): void => {
    localStorage.setItem(STORAGE_KEYS.IMPORTANT_DATES, JSON.stringify(dates));
  },

  // Ideas
  getIdeas: (): Idea[] => {
    const ideas = localStorage.getItem(STORAGE_KEYS.IDEAS);
    return ideas ? JSON.parse(ideas) : [];
  },
  
  saveIdeas: (ideas: Idea[]): void => {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
  },

  // Events
  getEvents: (): Event[] => {
    const events = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return events ? JSON.parse(events) : [];
  },
  
  saveEvents: (events: Event[]): void => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  // Workouts
  getWorkouts: (): Workout[] => {
    const workouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return workouts ? JSON.parse(workouts) : [];
  },
  
  saveWorkouts: (workouts: Workout[]): void => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  },

  // Bike Ideas
  getBikeIdeas: (): BikeIdea[] => {
    const ideas = localStorage.getItem(STORAGE_KEYS.BIKE_IDEAS);
    return ideas ? JSON.parse(ideas) : [];
  },
  
  saveBikeIdeas: (ideas: BikeIdea[]): void => {
    localStorage.setItem(STORAGE_KEYS.BIKE_IDEAS, JSON.stringify(ideas));
  },

  // Bike Events
  getBikeEvents: (): BikeEvent[] => {
    const events = localStorage.getItem(STORAGE_KEYS.BIKE_EVENTS);
    return events ? JSON.parse(events) : [];
  },
  
  saveBikeEvents: (events: BikeEvent[]): void => {
    localStorage.setItem(STORAGE_KEYS.BIKE_EVENTS, JSON.stringify(events));
  },
};
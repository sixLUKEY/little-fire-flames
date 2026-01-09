import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname, resolve } from "path";
import { Event, CreateEventRequest, UpdateEventRequest } from "../types/event";
import { randomUUID } from "crypto";

// Default path: project root / data / events.db.txt
const DEFAULT_DB_PATH = resolve(process.cwd(), "..", "..", "data", "events.db.txt");
const DB_FILE_PATH = process.env.LOCAL_DB_PATH 
  ? resolve(process.env.LOCAL_DB_PATH)
  : DEFAULT_DB_PATH;

function ensureDbFile(): void {
  const dir = dirname(DB_FILE_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(DB_FILE_PATH)) {
    writeFileSync(DB_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
  }
}

function readDb(): Event[] {
  ensureDbFile();
  try {
    const content = readFileSync(DB_FILE_PATH, "utf-8");
    return JSON.parse(content || "[]") as Event[];
  } catch (error) {
    console.error("Error reading database file:", error);
    return [];
  }
}

function writeDb(events: Event[]): void {
  ensureDbFile();
  try {
    writeFileSync(DB_FILE_PATH, JSON.stringify(events, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database file:", error);
    throw error;
  }
}

export async function getAllEvents(): Promise<Event[]> {
  return readDb();
}

export async function getEventById(id: string): Promise<Event | null> {
  const events = readDb();
  return events.find((e) => e.id === id) || null;
}

export async function createEvent(data: CreateEventRequest): Promise<Event> {
  const events = readDb();
  const event: Event = {
    id: randomUUID(),
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl || "",
  };
  events.push(event);
  writeDb(events);
  return event;
}

export async function updateEvent(id: string, data: UpdateEventRequest): Promise<Event | null> {
  const events = readDb();
  const index = events.findIndex((e) => e.id === id);
  
  if (index === -1) {
    return null;
  }

  const existing = events[index];
  const updated: Event = {
    ...existing,
    ...(data.name !== undefined && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
  };

  events[index] = updated;
  writeDb(events);
  return updated;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const events = readDb();
  const index = events.findIndex((e) => e.id === id);
  
  if (index === -1) {
    return false;
  }

  events.splice(index, 1);
  writeDb(events);
  return true;
}


import { API_BASE_URL } from "./config";

// API Event interface (matches backend)
export interface ApiEvent {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

// Frontend Event interface (matches current UI)
export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
}

// Convert API event to frontend event
function apiToFrontend(apiEvent: ApiEvent): Event {
  return {
    id: apiEvent.id,
    title: apiEvent.name,
    description: apiEvent.description,
    image: apiEvent.imageUrl || "",
  };
}

// Convert frontend event to API event
function frontendToApi(event: Partial<Event>): Partial<ApiEvent> {
  const apiEvent: Partial<ApiEvent> = {};
  if (event.title !== undefined) apiEvent.name = event.title;
  if (event.description !== undefined) apiEvent.description = event.description;
  if (event.image !== undefined) apiEvent.imageUrl = event.image;
  return apiEvent;
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  const data = await response.json();
  return data.events.map(apiToFrontend);
}

export async function fetchEvent(id: string): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  const data = await response.json();
  return apiToFrontend(data.event);
}

export async function createEvent(event: Omit<Event, "id">): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(frontendToApi(event)),
  });
  if (!response.ok) {
    throw new Error("Failed to create event");
  }
  const data = await response.json();
  return apiToFrontend(data.event);
}

export async function updateEvent(id: string, event: Partial<Event>): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(frontendToApi(event)),
  });
  if (!response.ok) {
    throw new Error("Failed to update event");
  }
  const data = await response.json();
  return apiToFrontend(data.event);
}

export async function deleteEvent(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
}


export interface Event {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface CreateEventRequest {
  name: string;
  description: string;
  imageUrl?: string;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
}


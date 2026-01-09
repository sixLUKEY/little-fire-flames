import express from "express";
import cors from "cors";
import { getAllEvents } from "./db/events";
import { getEventById } from "./db/events";
import { createEvent } from "./db/events";
import { updateEvent } from "./db/events";
import { deleteEvent } from "./db/events";
import { CreateEventRequest, UpdateEventRequest } from "./types/event";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET /events - List all events
app.get("/events", async (req, res) => {
  try {
    const events = await getAllEvents();
    res.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET /events/:id - Get a specific event
app.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// POST /events - Create a new event
app.post("/events", async (req, res) => {
  try {
    const body = req.body as CreateEventRequest;

    if (!body.name || !body.description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    const newEvent = await createEvent(body);
    res.status(201).json({ event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// PUT /events/:id - Update an event
app.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateEventRequest;

    const updatedEvent = await updateEvent(id, body);

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /events/:id - Delete an event
app.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteEvent(id);

    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

app.listen(PORT, () => {
  const useLocalDb = process.env.USE_LOCAL_DB !== "false" && !process.env.AWS_LAMBDA_FUNCTION_NAME;
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📁 Using ${useLocalDb ? "local file database (data/events.db.txt)" : "DynamoDB"}`);
  if (useLocalDb) {
    console.log(`✅ No AWS credentials required for local development`);
  }
});


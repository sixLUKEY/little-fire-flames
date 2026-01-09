import { Event, CreateEventRequest, UpdateEventRequest } from "../types/event";
import * as fileDb from "./file-db";
import * as dynamoDb from "./dynamo-db";

// Use file-based DB in local development, DynamoDB in AWS
// Default to local DB unless explicitly set to use DynamoDB (AWS Lambda environment)
// This ensures no AWS credentials are needed for local development
// Check: explicit setting, SAM local, or absence of real AWS environment
const USE_LOCAL_DB = 
  process.env.USE_LOCAL_DB === "true" || 
  (process.env.USE_LOCAL_DB !== "false" && 
   (process.env.SAM_LOCAL === "true" || 
    !process.env.AWS_EXECUTION_ENV || 
    process.env.AWS_EXECUTION_ENV.includes("Local")));

export async function getAllEvents(): Promise<Event[]> {
  if (USE_LOCAL_DB) {
    return fileDb.getAllEvents();
  }
  return dynamoDb.getAllEvents();
}

export async function getEventById(id: string): Promise<Event | null> {
  if (USE_LOCAL_DB) {
    return fileDb.getEventById(id);
  }
  return dynamoDb.getEventById(id);
}

export async function createEvent(data: CreateEventRequest): Promise<Event> {
  if (USE_LOCAL_DB) {
    return fileDb.createEvent(data);
  }
  return dynamoDb.createEvent(data);
}

export async function updateEvent(id: string, data: UpdateEventRequest): Promise<Event | null> {
  if (USE_LOCAL_DB) {
    return fileDb.updateEvent(id, data);
  }
  return dynamoDb.updateEvent(id, data);
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (USE_LOCAL_DB) {
    return fileDb.deleteEvent(id);
  }
  return dynamoDb.deleteEvent(id);
}


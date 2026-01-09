import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { Event, CreateEventRequest, UpdateEventRequest } from "../types/event";

// Lazy initialization - only create client when actually used (in AWS Lambda)
let client: DynamoDBClient | null = null;
let docClient: DynamoDBDocumentClient | null = null;

function getDocClient(): DynamoDBDocumentClient {
  if (!client) {
    client = new DynamoDBClient({});
    docClient = DynamoDBDocumentClient.from(client);
  }
  return docClient!;
}

const TABLE_NAME = process.env.EVENTS_TABLE_NAME || "little-fire-flames-events";

export async function getAllEvents(): Promise<Event[]> {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });

  const response = await getDocClient().send(command);
  return (response.Items || []) as Event[];
}

export async function getEventById(id: string): Promise<Event | null> {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });

  const response = await getDocClient().send(command);
  return (response.Item as Event) || null;
}

export async function createEvent(data: CreateEventRequest): Promise<Event> {
  const event: Event = {
    id: randomUUID(),
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl || "",
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: event,
  });

  await getDocClient().send(command);
  return event;
}

export async function updateEvent(id: string, data: UpdateEventRequest): Promise<Event | null> {
  // First check if event exists
  const existing = await getEventById(id);
  if (!existing) {
    return null;
  }

  // Build update expression
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  if (data.name !== undefined) {
    updateExpressions.push("#name = :name");
    expressionAttributeNames["#name"] = "name";
    expressionAttributeValues[":name"] = data.name;
  }

  if (data.description !== undefined) {
    updateExpressions.push("#description = :description");
    expressionAttributeNames["#description"] = "description";
    expressionAttributeValues[":description"] = data.description;
  }

  if (data.imageUrl !== undefined) {
    updateExpressions.push("#imageUrl = :imageUrl");
    expressionAttributeNames["#imageUrl"] = "imageUrl";
    expressionAttributeValues[":imageUrl"] = data.imageUrl;
  }

  if (updateExpressions.length === 0) {
    return existing;
  }

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  const response = await getDocClient().send(command);
  return response.Attributes as Event;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id },
    ReturnValues: "ALL_OLD",
  });

  const response = await getDocClient().send(command);
  return !!response.Attributes;
}


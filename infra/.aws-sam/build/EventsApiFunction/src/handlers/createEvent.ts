import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createEvent } from "../db/events";
import { CreateEventRequest } from "../types/event";
import { successResponse, errorResponse } from "../utils/response";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return errorResponse("Request body is required", 400);
    }

    const body = JSON.parse(event.body) as CreateEventRequest;

    if (!body.name || !body.description) {
      return errorResponse("Name and description are required", 400);
    }

    const newEvent = await createEvent(body);
    return successResponse({ event: newEvent }, 201);
  } catch (error) {
    console.error("Error creating event:", error);
    return errorResponse("Failed to create event", 500);
  }
};


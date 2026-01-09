import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { updateEvent } from "../db/events";
import { UpdateEventRequest } from "../types/event";
import { successResponse, errorResponse } from "../utils/response";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return errorResponse("Event ID is required", 400);
    }

    if (!event.body) {
      return errorResponse("Request body is required", 400);
    }

    const body = JSON.parse(event.body) as UpdateEventRequest;

    const updatedEvent = await updateEvent(id, body);

    if (!updatedEvent) {
      return errorResponse("Event not found", 404);
    }

    return successResponse({ event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return errorResponse("Failed to update event", 500);
  }
};


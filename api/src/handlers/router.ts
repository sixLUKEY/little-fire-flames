import { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../db/events";
import { CreateEventRequest, UpdateEventRequest } from "../types/event";
import { successResponse, errorResponse } from "../utils/response";

// Support both REST API (v1) and HTTP API (v2) event formats
type LambdaEvent = APIGatewayProxyEvent | APIGatewayProxyEventV2;

function getMethod(event: LambdaEvent): string {
  if ("requestContext" in event && "http" in event.requestContext) {
    // HTTP API v2
    return event.requestContext.http.method;
  }
  // REST API v1
  return (event as APIGatewayProxyEvent).httpMethod;
}

function getPath(event: LambdaEvent): string {
  if ("rawPath" in event) {
    // HTTP API v2
    return event.rawPath;
  }
  // REST API v1
  return (event as APIGatewayProxyEvent).path;
}

function getPathParameters(event: LambdaEvent): Record<string, string | undefined> {
  return event.pathParameters || {};
}

function getBody(event: LambdaEvent): string | null {
  return event.body || null;
}

export const handler = async (
  event: LambdaEvent
): Promise<APIGatewayProxyResult> => {
  const method = getMethod(event);
  const path = getPath(event);
  const pathParameters = getPathParameters(event);

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return successResponse({}, 200);
  }

  // Only handle /events routes
  if (!path.startsWith("/events")) {
    return errorResponse("Route not found", 404);
  }

  try {
    // Route: GET /events (list all)
    if (method === "GET" && path === "/events") {
      const events = await getAllEvents();
      return successResponse({ events });
    }

    // Route: GET /events/{id} (get single)
    if (method === "GET" && path.startsWith("/events/") && pathParameters.id) {
      const id = pathParameters.id as string;
      const event = await getEventById(id);

      if (!event) {
        return errorResponse("Event not found", 404);
      }

      return successResponse({ event });
    }

    // Route: POST /events (create)
    if (method === "POST" && path === "/events") {
      const bodyStr = getBody(event);
      if (!bodyStr) {
        return errorResponse("Request body is required", 400);
      }

      const body = JSON.parse(bodyStr) as CreateEventRequest;

      if (!body.name || !body.description) {
        return errorResponse("Name and description are required", 400);
      }

      const newEvent = await createEvent(body);
      return successResponse({ event: newEvent }, 201);
    }

    // Route: PUT /events/{id} (update)
    if (method === "PUT" && path.startsWith("/events/") && pathParameters.id) {
      const id = pathParameters.id as string;

      const bodyStr = getBody(event);
      if (!bodyStr) {
        return errorResponse("Request body is required", 400);
      }

      const body = JSON.parse(bodyStr) as UpdateEventRequest;
      const updatedEvent = await updateEvent(id, body);

      if (!updatedEvent) {
        return errorResponse("Event not found", 404);
      }

      return successResponse({ event: updatedEvent });
    }

    // Route: DELETE /events/{id} (delete)
    if (method === "DELETE" && path.startsWith("/events/") && pathParameters.id) {
      const id = pathParameters.id as string;
      const deleted = await deleteEvent(id);

      if (!deleted) {
        return errorResponse("Event not found", 404);
      }

      return successResponse({ message: "Event deleted successfully" });
    }

    // Route not found
    return errorResponse("Route not found", 404);
  } catch (error) {
    console.error("Error handling request:", error);
    if (error instanceof SyntaxError) {
      return errorResponse("Invalid JSON in request body", 400);
    }
    return errorResponse("Internal server error", 500);
  }
};


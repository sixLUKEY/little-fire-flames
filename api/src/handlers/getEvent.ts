import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getEventById } from "../db/events";
import { successResponse, errorResponse } from "../utils/response";

export const handler = async (
  apiEvent: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = apiEvent.pathParameters?.id;

    if (!id) {
      return errorResponse("Event ID is required", 400);
    }

    const event = await getEventById(id);

    if (!event) {
      return errorResponse("Event not found", 404);
    }

    return successResponse({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    return errorResponse("Failed to fetch event", 500);
  }
};


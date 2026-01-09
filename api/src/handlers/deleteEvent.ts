import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { deleteEvent } from "../db/events";
import { successResponse, errorResponse } from "../utils/response";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return errorResponse("Event ID is required", 400);
    }

    const deleted = await deleteEvent(id);

    if (!deleted) {
      return errorResponse("Event not found", 404);
    }

    return successResponse({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return errorResponse("Failed to delete event", 500);
  }
};


import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getAllEvents } from "../db/events";
import { successResponse, errorResponse } from "../utils/response";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const events = await getAllEvents();
    return successResponse({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return errorResponse("Failed to fetch events", 500);
  }
};


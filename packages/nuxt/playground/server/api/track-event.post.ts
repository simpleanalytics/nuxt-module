import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const { eventName, metadata } = await readBody(event);

    // Track the custom event using server-side function
    await trackEvent(event, eventName, {
      ...metadata,
    });

    return {
      success: true,
      message: "Event tracked successfully",
    };
  } catch (error) {
    console.error("Error tracking event:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to track event",
    });
  }
});

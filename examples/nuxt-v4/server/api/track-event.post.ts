import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    await trackEvent("button_clicked", {
      event,
      metadata: {
        source: "test_page",
      },
    });

    return {
      success: true,
      message: "Button click event tracked successfully",
    };
  } catch (error) {
    console.error("Error tracking event:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to track event",
    });
  }
});

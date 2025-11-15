/**
=========================================================
* ChatBot API Endpoints
=========================================================
* API endpoints for LLM chat functionality
*/

import { apiClient } from "core/api";

export const chatAPI = {
  /**
   * Send a message to the LLM
   * @param {string} message - User message
   * @param {Array} history - Conversation history
   * @param {Array} files - Attached files
   * @returns {Promise} { response }
   */
  sendMessage: async (message, history = [], files = []) => {
    // TODO: Handle file uploads when backend supports it
    // For file uploads, use FormData:
    // const formData = new FormData();
    // formData.append("message", message);
    // formData.append("context", JSON.stringify(history));
    // files.forEach((file) => formData.append("files", file));
    // return apiClient.post("/api/v1/chat", formData, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });

    if (!message || !message.trim()) {
      return Promise.reject({
        response: {
          data: {
            message: "Message cannot be empty",
          },
        },
      });
    }

    try {
      // Use centralized API client
      const response = await apiClient.post(
        "/api/v1/chat",
        {
          message: message.trim(),
          context: "", // Can be used for conversation history in future
          include_datetime: true,
          max_tokens: 0,
          temperature: 0,
        },
        {
          headers: {
            accept: "application/json",
          },
        }
      );

      // API response structure: { response, timestamp, model_name, tokens_used, processing_time }
      return {
        data: {
          response: response.data.response,
          timestamp: response.data.timestamp,
          model_name: response.data.model_name,
          tokens_used: response.data.tokens_used,
          processing_time: response.data.processing_time,
        },
      };
    } catch (error) {
      // If API call fails, provide helpful error message
      throw {
        response: {
          data: {
            message:
              error.response?.data?.detail ||
              error.response?.data?.message ||
              error.message ||
              "Failed to get response from AI. Please try again.",
          },
        },
      };
    }
  },
};

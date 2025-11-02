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
    // TODO: Replace with actual API call when backend is ready
    // For file uploads, use FormData:
    // const formData = new FormData();
    // formData.append("message", message);
    // formData.append("history", JSON.stringify(history));
    // files.forEach((file) => formData.append("files", file));
    // return apiClient.post("/chat/message", formData, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });

    // Mock API response for now
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate API delay
        if ((message && message.trim()) || files.length > 0) {
          // Simple mock responses based on message content
          let response = "";

          if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
            response = "Hello! How can I help you today?";
          } else if (message.toLowerCase().includes("help")) {
            response =
              "I'm here to assist you! You can ask me about:\n- General questions\n- Coding help\n- Explanations\n- Problem solving\n- Or just have a conversation!";
          } else if (
            message.toLowerCase().includes("code") ||
            message.toLowerCase().includes("programming")
          ) {
            response =
              "I can help with coding! I can:\n- Explain programming concepts\n- Help debug code\n- Suggest implementations\n- Review code structure\n\nWhat would you like to know?";
          } else if (
            message.toLowerCase().includes("javascript") ||
            message.toLowerCase().includes("react")
          ) {
            response =
              "Great! I can help with JavaScript and React. Some topics I can assist with:\n- React hooks and components\n- State management\n- API integration\n- Performance optimization\n- Best practices\n\nWhat specific question do you have?";
          } else if (files.length > 0) {
            response = `I received ${files.length} file(s). In a real implementation, I would analyze these files and provide insights. Currently in mock mode - when the backend is connected, I'll process the files and provide AI-generated analysis.`;
          } else {
            response = `I understand you're asking about "${message}". Let me help you with that. This is a mock response - when the backend is connected, I'll provide actual AI-generated responses based on your question.`;
          }

          resolve({
            data: {
              response,
              timestamp: new Date().toISOString(),
            },
          });
        } else {
          reject({
            response: {
              data: {
                message: "Message cannot be empty",
              },
            },
          });
        }
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds to simulate real API
    });
  },
};

/**
=========================================================
* useChatBot Hook
=========================================================
* Custom hook for managing chat conversation with LLM
*/

import { useState, useCallback } from "react";
import { chatAPI } from "../api";

export const useChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (userMessage, files = []) => {
      if (!userMessage.trim() && files.length === 0) {
        return;
      }

      // Prepare file data
      const fileData = files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      // Add user message immediately
      const userMsg = {
        role: "user",
        content: userMessage || (files.length > 0 ? `Sent ${files.length} file(s)` : ""),
        files: fileData,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        // Get conversation history for context
        const history = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await chatAPI.sendMessage(userMessage, history, files);
        const assistantMsg = {
          role: "assistant",
          content: response.data.response,
          timestamp: response.data.timestamp || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
        const errorMsg = {
          role: "assistant",
          content:
            error.response?.data?.message || "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
          error: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    loading,
    clearMessages,
  };
};

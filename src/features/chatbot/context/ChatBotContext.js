/**
=========================================================
* ChatBot Context
=========================================================
* Global chat state management using React Context
* Persists messages across route changes
*/

import PropTypes from "prop-types";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { chatAPI } from "../api";

const ChatBotContext = createContext(null);

export const ChatBotProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(messages);

  // Keep ref in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(async (userMessage, files = []) => {
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

    // Update messages state
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Get conversation history for context (including the new user message)
      // Use ref to get the latest messages including the one we just added
      const currentMessages = [...messagesRef.current, userMsg];
      const history = currentMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await chatAPI.sendMessage(userMessage, history, files);
      const assistantMsg = {
        role: "assistant",
        content: response.data.response,
        timestamp: response.data.timestamp,
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
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value = {
    messages,
    sendMessage,
    loading,
    clearMessages,
  };

  return <ChatBotContext.Provider value={value}>{children}</ChatBotContext.Provider>;
};

export const useChatBotContext = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error("useChatBotContext must be used within a ChatBotProvider");
  }
  return context;
};

ChatBotProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

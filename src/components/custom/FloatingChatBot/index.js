/**
=========================================================
* Floating ChatBot Component
=========================================================
* Floating button and minimized chatbot window
*/

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// @mui material components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";

// @mui icons
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PersonIcon from "@mui/icons-material/Person";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";
import MKAvatar from "components/base/MKAvatar";
import MKSnackbar from "components/base/MKSnackbar";

// Shared hooks
import { useSnackbar } from "shared/hooks";

// Features
import { useChatBot } from "features/chatbot";

// Core
import { useAuth } from "core/context";
import { ROUTES } from "core/config";

// React Router
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

function FloatingChatBot() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFullscreenChatbot = location.pathname === ROUTES.CHATBOT_FULLSCREEN;
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const { messages, sendMessage, loading, clearMessages } = useChatBot();
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when window opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [messages, isOpen]);

  // Auto-open floating chatbot if URL has openChat parameter
  useEffect(() => {
    const shouldOpenChat = searchParams.get("openChat") === "true";
    if (shouldOpenChat && isAuthenticated && !isFullscreenChatbot) {
      setIsOpen(true);
      // Remove the query parameter from URL
      searchParams.delete("openChat");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, isAuthenticated, isFullscreenChatbot, setSearchParams]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        showSnackbar(
          "error",
          "error",
          "File Too Large",
          `${file.name} is too large. Maximum size is 10MB.`
        );
        return false;
      }
      return true;
    });

    setAttachedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!inputMessage.trim() && attachedFiles.length === 0) {
      showSnackbar(
        "warning",
        "warning",
        "Empty Message",
        "Please enter a message or attach a file before sending."
      );
      return;
    }

    try {
      await sendMessage(inputMessage, attachedFiles);
      setInputMessage("");
      setAttachedFiles([]);
      inputRef.current?.focus();
    } catch (error) {
      showSnackbar("error", "error", "Error", "Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenFullscreen = () => {
    navigate(ROUTES.CHATBOT_FULLSCREEN);
    setIsOpen(false);
  };

  // Only show for authenticated users and not on fullscreen chatbot page
  if (!isAuthenticated || isFullscreenChatbot) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <Fab
        color="info"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          width: 56,
          height: 56,
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          "&:hover": {
            boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
            transform: "scale(1.05)",
          },
          transition: "all 0.3s ease",
          "& .MuiSvgIcon-root": {
            fontSize: "28px",
          },
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatBubbleIcon />}
      </Fab>

      {/* Minimized Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 380,
            height: 600,
            maxHeight: "calc(100vh - 140px)",
            zIndex: 1299,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          {/* Header */}
          <MKBox
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MKBox display="flex" alignItems="center" gap={1}>
              <SmartToyIcon />
              <MKTypography variant="h6" fontWeight="bold">
                Chat Assistant
              </MKTypography>
            </MKBox>
            <MKBox display="flex" gap={0.5}>
              <IconButton
                size="small"
                onClick={handleOpenFullscreen}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
                title="Open in fullscreen"
              >
                <OpenInFullIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
                title="Close"
              >
                <CloseIcon />
              </IconButton>
            </MKBox>
          </MKBox>

          {/* Messages Area */}
          <MKBox
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              backgroundColor: "#f5f5f5",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
              },
            }}
          >
            {messages.length === 0 ? (
              <MKBox
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%", textAlign: "center", p: 3 }}
              >
                <SmartToyIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <MKTypography variant="h6" color="text.secondary" mb={1}>
                  Start a conversation
                </MKTypography>
                <MKTypography variant="body2" color="text.secondary">
                  Ask me anything or attach files for assistance
                </MKTypography>
              </MKBox>
            ) : (
              <>
                {messages.map((message, index) => (
                  <MKBox
                    key={index}
                    display="flex"
                    justifyContent={message.role === "user" ? "flex-end" : "flex-start"}
                    mb={2}
                  >
                    <MKBox
                      sx={{
                        maxWidth: "75%",
                        display: "flex",
                        gap: 1,
                        flexDirection: message.role === "user" ? "row-reverse" : "row",
                      }}
                    >
                      <MKAvatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor:
                            message.role === "user"
                              ? "info.main"
                              : message.error
                              ? "error.main"
                              : "success.main",
                        }}
                      >
                        {message.role === "user" ? (
                          <PersonIcon fontSize="small" />
                        ) : (
                          <SmartToyIcon fontSize="small" />
                        )}
                      </MKAvatar>
                      <Card
                        sx={{
                          p: 1.5,
                          backgroundColor:
                            message.role === "user"
                              ? "info.main"
                              : message.error
                              ? "error.lighter"
                              : "white",
                          color: message.role === "user" ? "white" : "text.primary",
                          borderRadius: 2,
                        }}
                      >
                        {message.files && message.files.length > 0 && (
                          <MKBox mb={1}>
                            {message.files.map((file, fileIndex) => (
                              <MKBox
                                key={fileIndex}
                                display="flex"
                                alignItems="center"
                                gap={0.5}
                                mb={0.5}
                              >
                                <InsertDriveFileIcon
                                  fontSize="small"
                                  sx={{ color: message.role === "user" ? "white" : "inherit" }}
                                />
                                <MKTypography
                                  variant="caption"
                                  sx={{
                                    color: message.role === "user" ? "white" : "inherit",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {file.name}
                                </MKTypography>
                              </MKBox>
                            ))}
                          </MKBox>
                        )}
                        <MKTypography
                          variant="body2"
                          sx={{
                            color: message.role === "user" ? "white" : "inherit",
                            fontSize: "0.8rem",
                            "& *": {
                              color: message.role === "user" ? "white !important" : "inherit",
                            },
                            "& p": {
                              margin: 0,
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontSize: "0.8rem",
                            },
                            "& strong": {
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontWeight: "bold",
                              fontSize: "0.8rem",
                            },
                            "& em": {
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontSize: "0.8rem",
                            },
                            "& li": {
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontSize: "0.8rem",
                            },
                            "& ul, & ol": {
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontSize: "0.8rem",
                            },
                            "& h1, & h2, & h3, & h4, & h5, & h6": {
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontSize: "0.9rem",
                            },
                            "& a": {
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontSize: "0.8rem",
                            },
                            "& pre": {
                              backgroundColor:
                                message.role === "user"
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.05)",
                              padding: 1,
                              borderRadius: 1,
                              overflow: "auto",
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontSize: "0.75rem",
                            },
                            "& code": {
                              backgroundColor:
                                message.role === "user"
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.05)",
                              padding: "2px 4px",
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              color: message.role === "user" ? "white !important" : "inherit",
                            },
                            "& .katex": {
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontSize: "0.8rem",
                            },
                            "& .katex-display": {
                              color: message.role === "user" ? "white !important" : "inherit",
                              fontSize: "0.8rem",
                            },
                          }}
                        >
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {message.content}
                          </ReactMarkdown>
                        </MKTypography>
                      </Card>
                    </MKBox>
                  </MKBox>
                ))}
                {loading && (
                  <MKBox display="flex" justifyContent="flex-start" mb={2}>
                    <MKBox display="flex" gap={1} alignItems="center">
                      <MKAvatar sx={{ width: 32, height: 32, bgcolor: "success.main" }}>
                        <SmartToyIcon fontSize="small" />
                      </MKAvatar>
                      <Card sx={{ p: 1.5 }}>
                        <CircularProgress size={20} />
                      </Card>
                    </MKBox>
                  </MKBox>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </MKBox>

          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <MKBox
              sx={{
                p: 1,
                borderTop: "1px solid rgba(0,0,0,0.1)",
                backgroundColor: "white",
                maxHeight: 100,
                overflowY: "auto",
              }}
            >
              <MKBox display="flex" flexWrap="wrap" gap={1}>
                {attachedFiles.map((file, index) => (
                  <MKBox
                    key={index}
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    sx={{
                      p: 0.5,
                      backgroundColor: "grey.100",
                      borderRadius: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    <InsertDriveFileIcon fontSize="small" />
                    <MKTypography variant="caption" sx={{ maxWidth: 150, overflow: "hidden" }}>
                      {file.name}
                    </MKTypography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                      sx={{ p: 0.25 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </MKBox>
                ))}
              </MKBox>
            </MKBox>
          )}

          {/* Input Area */}
          <MKBox
            sx={{
              p: 1.5,
              borderTop: "1px solid rgba(0,0,0,0.1)",
              backgroundColor: "white",
            }}
          >
            <MKBox display="flex" gap={1} alignItems="flex-end">
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                sx={{ color: "text.secondary" }}
              >
                <AttachFileIcon />
              </IconButton>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <TextField
                inputRef={inputRef}
                multiline
                maxRows={4}
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                color="info"
                onClick={handleSend}
                disabled={loading || (!inputMessage.trim() && attachedFiles.length === 0)}
                sx={{
                  backgroundColor: "info.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "info.dark",
                  },
                  "&:disabled": {
                    backgroundColor: "grey.300",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </MKBox>
          </MKBox>
        </Paper>
      </Slide>

      {/* Snackbar */}
      <MKSnackbar
        color={snackbar.color}
        icon={<SmartToyIcon />}
        title={snackbar.title}
        content={snackbar.content}
        dateTime={snackbar.dateTime}
        open={snackbar.open}
        close={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}

export default FloatingChatBot;

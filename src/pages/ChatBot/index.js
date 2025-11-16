/**
=========================================================
* ChatBot Page
=========================================================
* LLM Chat Interface
*/

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// @mui material components
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

// @mui icons
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Icon from "@mui/material/Icon";

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

// React Router
import { useNavigate, useLocation } from "react-router-dom";

// Core config
import { ROUTES } from "core/config";

function ChatBot() {
  const [inputMessage, setInputMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isFullscreen = location.pathname === ROUTES.CHATBOT_FULLSCREEN;

  const { messages, sendMessage, loading, clearMessages } = useChatBot();
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      // When collapsing from fullscreen, navigate to home and open floating chatbot
      navigate(`${ROUTES.HOME}?openChat=true`, { replace: true });
    } else {
      navigate(ROUTES.CHATBOT_FULLSCREEN);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      // Check file size (max 10MB)
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
    // Reset file input
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

  const ContainerComponent = isFullscreen ? Box : Container;
  const containerProps = isFullscreen
    ? {
        component: "div",
        sx: {
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "calc(100% - 300px)", // Adjust width for left panel
          margin: 0,
          padding: 0,
          marginLeft: "300px", // Account for left panel
        },
      }
    : {
        sx: {
          height: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
          py: 2,
          px: { xs: 2, sm: 3 },
        },
      };

  return (
    <ContainerComponent {...containerProps}>
      {/* Header */}
      <MKBox
        mb={isFullscreen ? 0 : 2}
        p={2}
        borderRadius={isFullscreen ? 0 : 2}
        sx={{
          background: ({ palette: { info } }) =>
            `linear-gradient(135deg, ${info.main} 0%, ${info.dark || info.main} 100%)`,
          color: "white",
          boxShadow: ({ boxShadows: { md } }) => md,
        }}
      >
        <MKBox display="flex" alignItems="center" justifyContent="space-between" gap={2}>
          <MKBox display="flex" alignItems="center" gap={2}>
            <MKAvatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "rgba(255,255,255,0.2)",
                boxShadow: ({ boxShadows: { sm } }) => sm,
              }}
            >
              <SmartToyIcon sx={{ fontSize: 28 }} />
            </MKAvatar>
            <MKBox>
              <MKTypography variant="h5" fontWeight="bold" color="white">
                AI Chat Assistant
              </MKTypography>
              <MKTypography variant="body2" color="white" sx={{ opacity: 0.9, mt: 0.25 }}>
                Ask me anything! I&apos;m here to help.
              </MKTypography>
            </MKBox>
          </MKBox>
          <IconButton
            onClick={handleFullscreenToggle}
            sx={{
              color: "white !important",
              bgcolor: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: ({ boxShadows: { sm } }) => sm,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.5)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
              "& .MuiSvgIcon-root": {
                color: "white !important",
              },
            }}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <FullscreenExitIcon sx={{ color: "white !important" }} />
            ) : (
              <FullscreenIcon sx={{ color: "white !important" }} />
            )}
          </IconButton>
        </MKBox>
      </MKBox>

      <Card
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          boxShadow: ({ boxShadows: { lg } }) => lg,
          borderRadius: isFullscreen ? 0 : 3,
          overflow: "hidden",
          margin: isFullscreen ? 0 : undefined,
          width: isFullscreen ? "100%" : "auto",
        }}
      >
        {/* Messages Area */}
        <MKBox
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: ({ palette: { grey } }) => grey[50],
            minHeight: 0,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: ({ palette: { grey } }) => grey[400],
              borderRadius: "4px",
              "&:hover": {
                background: ({ palette: { grey } }) => grey[500],
              },
            },
          }}
        >
          {messages.length === 0 ? (
            <MKBox
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ flex: 1, textAlign: "center", py: 6 }}
            >
              <MKBox
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: ({ palette: { info } }) =>
                    `linear-gradient(135deg, ${info.main} 0%, ${info.dark || info.main} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  boxShadow: ({ boxShadows: { md } }) => md,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 40, color: "white" }} />
              </MKBox>
              <MKTypography variant="h5" fontWeight="bold" mb={1} color="text.primary">
                Start a conversation
              </MKTypography>
              <MKTypography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 400, lineHeight: 1.6 }}
              >
                Ask me anything! I&apos;m here to help you with questions, explanations, coding
                help, or just have a friendly chat.
              </MKTypography>
            </MKBox>
          ) : (
            messages.map((message, index) => (
              <MKBox
                key={index}
                display="flex"
                justifyContent={message.role === "user" ? "flex-end" : "flex-start"}
                alignItems="flex-end"
                gap={1.5}
                sx={{
                  animation: "fadeIn 0.3s ease-in",
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                {message.role === "assistant" && (
                  <MKAvatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: ({ palette: { info } }) => info.main,
                      flexShrink: 0,
                      boxShadow: ({ boxShadows: { sm } }) => sm,
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 18 }} />
                  </MKAvatar>
                )}

                <MKBox
                  sx={{
                    maxWidth: "70%",
                    p: 2,
                    borderRadius: ({ borders: { borderRadius } }) =>
                      message.role === "user"
                        ? `${borderRadius.lg} ${borderRadius.lg} ${borderRadius.xs} ${borderRadius.lg}`
                        : `${borderRadius.lg} ${borderRadius.lg} ${borderRadius.lg} ${borderRadius.xs}`,
                    backgroundColor:
                      message.role === "user" ? ({ palette: { info } }) => info.main : "white",
                    color: message.role === "user" ? "white !important" : "text.primary",
                    fontWeight: message.role === "user" ? 500 : 400,
                    boxShadow: ({ boxShadows: { sm } }) => sm,
                    position: "relative",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: ({ boxShadows: { md } }) => md,
                    },
                    "& *": {
                      color: message.role === "user" ? "white !important" : "inherit",
                      fontWeight: message.role === "user" ? "500 !important" : "inherit",
                    },
                    "& p": {
                      margin: 0,
                      marginBottom: 0.75,
                      color: message.role === "user" ? "white !important" : "inherit",
                      fontWeight: message.role === "user" ? "500 !important" : "inherit",
                      "&:last-child": {
                        marginBottom: 0,
                      },
                    },
                    "& ul, & ol": {
                      margin: 0,
                      paddingLeft: 1.5,
                      marginBottom: 0.75,
                      color: message.role === "user" ? "white !important" : "inherit",
                    },
                    "& li": {
                      marginBottom: 0.25,
                      color: message.role === "user" ? "white !important" : "inherit",
                      fontWeight: message.role === "user" ? "500 !important" : "inherit",
                    },
                    "& strong": {
                      fontWeight: "bold",
                      color: message.role === "user" ? "white !important" : "inherit",
                    },
                    "& em": {
                      fontStyle: "italic",
                      color: message.role === "user" ? "white !important" : "inherit",
                    },
                    "& code": {
                      backgroundColor:
                        message.role === "user" ? "rgba(255,255,255,0.2)" : "grey.200",
                      padding: "2px 4px",
                      borderRadius: 1,
                      fontSize: "0.875em",
                      fontFamily: "monospace",
                      color: message.role === "user" ? "white !important" : "inherit",
                      fontWeight: message.role === "user" ? "500 !important" : "inherit",
                    },
                    "& pre": {
                      backgroundColor:
                        message.role === "user" ? "rgba(255,255,255,0.2)" : "grey.200",
                      padding: 1,
                      borderRadius: 1,
                      overflow: "auto",
                      marginBottom: 1,
                      color: message.role === "user" ? "white !important" : "inherit",
                      "& code": {
                        backgroundColor: "transparent",
                        padding: 0,
                        color: message.role === "user" ? "white !important" : "inherit",
                      },
                    },
                    // KaTeX math styling
                    "& .katex": {
                      fontSize: "1.1em",
                      color: message.role === "user" ? "white !important" : "inherit",
                    },
                    "& .katex-display": {
                      margin: "1em 0",
                      overflowX: "auto",
                      overflowY: "hidden",
                      color: message.role === "user" ? "white !important" : "inherit",
                    },
                  }}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[[remarkMath, { singleDollarTextMath: false }]]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({ children }) => (
                          <MKTypography
                            variant="body2"
                            component="p"
                            sx={{
                              wordBreak: "break-word",
                              color: "inherit",
                              marginBottom: 0.75,
                              fontSize: "0.875rem",
                              lineHeight: 1.5,
                              fontWeight: 400,
                              "&:last-child": { marginBottom: 0 },
                            }}
                          >
                            {children}
                          </MKTypography>
                        ),
                        strong: ({ children }) => (
                          <MKTypography
                            component="strong"
                            variant="body2"
                            fontWeight="bold"
                            sx={{ color: "inherit" }}
                          >
                            {children}
                          </MKTypography>
                        ),
                        em: ({ children }) => (
                          <MKTypography
                            component="em"
                            variant="body2"
                            sx={{ fontStyle: "italic", color: "inherit" }}
                          >
                            {children}
                          </MKTypography>
                        ),
                        ul: ({ children }) => (
                          <MKBox
                            component="ul"
                            sx={{ margin: 0, paddingLeft: 1.5, marginBottom: 0.75 }}
                          >
                            {children}
                          </MKBox>
                        ),
                        ol: ({ children }) => (
                          <MKBox
                            component="ol"
                            sx={{ margin: 0, paddingLeft: 1.5, marginBottom: 0.75 }}
                          >
                            {children}
                          </MKBox>
                        ),
                        li: ({ children }) => (
                          <MKTypography
                            component="li"
                            variant="body2"
                            sx={{
                              color: "inherit",
                              marginBottom: 0.25,
                              wordBreak: "break-word",
                              fontSize: "0.875rem",
                              lineHeight: 1.5,
                            }}
                          >
                            {children}
                          </MKTypography>
                        ),
                        code: ({ children, className }) => {
                          // Check if this is a math code block (from remark-math)
                          const isMath =
                            className?.includes("language-math") ||
                            className?.includes("language-katex");
                          const isInline = !className || className.startsWith("language-");

                          // For math expressions, let rehype-katex handle it
                          if (isMath) {
                            return <span>{children}</span>;
                          }

                          if (isInline && !className?.startsWith("language-")) {
                            return (
                              <MKBox
                                component="code"
                                sx={{
                                  backgroundColor: "rgba(0,0,0,0.1)",
                                  padding: "2px 4px",
                                  borderRadius: 1,
                                  fontSize: "0.875em",
                                  fontFamily: "monospace",
                                  color: "inherit",
                                }}
                              >
                                {children}
                              </MKBox>
                            );
                          }
                          return (
                            <MKBox
                              component="pre"
                              sx={{
                                backgroundColor: "rgba(0,0,0,0.1)",
                                padding: 1,
                                borderRadius: 1,
                                overflow: "auto",
                                marginBottom: 1,
                              }}
                            >
                              <MKTypography
                                component="code"
                                variant="body2"
                                sx={{
                                  fontFamily: "monospace",
                                  color: "inherit",
                                }}
                              >
                                {children}
                              </MKTypography>
                            </MKBox>
                          );
                        },
                        h1: ({ children }) => (
                          <MKTypography
                            variant="h6"
                            component="h1"
                            sx={{ color: "inherit", marginBottom: 0.75, fontSize: "1.1rem" }}
                          >
                            {children}
                          </MKTypography>
                        ),
                        h2: ({ children }) => (
                          <MKTypography
                            variant="body1"
                            component="h2"
                            fontWeight="bold"
                            sx={{ color: "inherit", marginBottom: 0.75, fontSize: "1rem" }}
                          >
                            {children}
                          </MKTypography>
                        ),
                        h3: ({ children }) => (
                          <MKTypography
                            variant="body2"
                            component="h3"
                            fontWeight="bold"
                            sx={{ color: "inherit", marginBottom: 0.75, fontSize: "0.9375rem" }}
                          >
                            {children}
                          </MKTypography>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <MKTypography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        color: "white",
                        fontWeight: 500,
                      }}
                    >
                      {message.content}
                    </MKTypography>
                  )}
                  {message.files && message.files.length > 0 && (
                    <MKBox mt={0.75} display="flex" flexDirection="column" gap={0.5}>
                      {message.files.map((file, fileIndex) => (
                        <MKBox
                          key={fileIndex}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor:
                              message.role === "user" ? "rgba(255,255,255,0.1)" : "grey.100",
                            color: message.role === "user" ? "white !important" : "inherit",
                            "& *": {
                              color: message.role === "user" ? "white !important" : "inherit",
                            },
                          }}
                        >
                          <InsertDriveFileIcon
                            fontSize="small"
                            sx={{ color: message.role === "user" ? "white !important" : "inherit" }}
                          />
                          <MKTypography
                            variant="caption"
                            sx={{
                              flex: 1,
                              wordBreak: "break-word",
                              color: message.role === "user" ? "white !important" : "inherit",
                            }}
                          >
                            {file.name || file.fileName}
                          </MKTypography>
                          {file.size && (
                            <MKTypography
                              variant="caption"
                              sx={{
                                opacity: message.role === "user" ? 0.9 : 0.7,
                                color: message.role === "user" ? "white !important" : "inherit",
                              }}
                            >
                              {(file.size / 1024).toFixed(1)} KB
                            </MKTypography>
                          )}
                        </MKBox>
                      ))}
                    </MKBox>
                  )}
                </MKBox>

                {message.role === "user" && (
                  <MKAvatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: ({ palette: { secondary } }) => secondary.main,
                      flexShrink: 0,
                      boxShadow: ({ boxShadows: { sm } }) => sm,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 18 }} />
                  </MKAvatar>
                )}
              </MKBox>
            ))
          )}

          {loading && (
            <MKBox display="flex" justifyContent="flex-start" alignItems="flex-end" gap={1.5}>
              <MKAvatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: ({ palette: { info } }) => info.main,
                  flexShrink: 0,
                  boxShadow: ({ boxShadows: { sm } }) => sm,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 18 }} />
              </MKAvatar>
              <MKBox
                sx={{
                  p: 2,
                  borderRadius: ({ borders: { borderRadius } }) =>
                    `${borderRadius.lg} ${borderRadius.lg} ${borderRadius.lg} ${borderRadius.xs}`,
                  backgroundColor: "white",
                  boxShadow: ({ boxShadows: { sm } }) => sm,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <CircularProgress size={16} thickness={4} />
                <MKTypography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                  Thinking...
                </MKTypography>
              </MKBox>
            </MKBox>
          )}

          <div ref={messagesEndRef} />
        </MKBox>

        {/* Input Area */}
        <MKBox
          sx={{
            p: 2.5,
            borderTop: ({ borders: { borderWidth, borderColor } }) =>
              `${borderWidth[1]} solid ${borderColor}`,
            backgroundColor: "white",
            boxShadow: ({ palette: { grey } }) => `0 -2px 8px ${grey[300]}`,
          }}
        >
          {/* Attached Files Preview */}
          {attachedFiles.length > 0 && (
            <MKBox mb={2} display="flex" flexWrap="wrap" gap={1}>
              {attachedFiles.map((file, index) => (
                <MKBox
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: ({ palette: { info, grey } }) => `${info.main}15`,
                    border: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                    maxWidth: "250px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: ({ palette: { info } }) => `${info.main}25`,
                      transform: "translateY(-2px)",
                      boxShadow: ({ boxShadows: { sm } }) => sm,
                    },
                  }}
                >
                  <InsertDriveFileIcon
                    sx={{ fontSize: 20, color: ({ palette: { info } }) => info.main }}
                  />
                  <MKTypography
                    variant="body2"
                    sx={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.8125rem",
                    }}
                    title={file.name}
                  >
                    {file.name}
                  </MKTypography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{
                      p: 0.5,
                      ml: 0.5,
                      "&:hover": {
                        backgroundColor: ({ palette: { error } }) => `${error.main}20`,
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </MKBox>
              ))}
            </MKBox>
          )}

          <MKBox display="flex" gap={2} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              inputRef={inputRef}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: ({ palette: { grey } }) => grey[50],
                  fontSize: "0.9375rem",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: ({ palette: { grey } }) => grey[100],
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                    boxShadow: ({ boxShadows: { sm } }) => sm,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px 16px",
                },
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              sx={{
                bgcolor: ({ palette: { grey } }) => grey[100],
                color: ({ palette: { info } }) => info.main,
                height: "48px",
                width: "48px",
                "&:hover": {
                  bgcolor: ({ palette: { info } }) => `${info.main}15`,
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
              title="Attach file"
            >
              <AttachFileIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <MKBox display="flex" flexDirection="column" gap={1}>
              <IconButton
                onClick={handleSend}
                disabled={loading || (!inputMessage.trim() && attachedFiles.length === 0)}
                sx={{
                  bgcolor: ({ palette: { info } }) => info.main,
                  color: "white",
                  height: "48px",
                  width: "48px",
                  boxShadow: ({ boxShadows: { sm } }) => sm,
                  "&:hover": {
                    bgcolor: ({ palette: { info } }) => info.dark || info.main,
                    transform: "scale(1.05)",
                    boxShadow: ({ boxShadows: { md } }) => md,
                  },
                  "&.Mui-disabled": {
                    bgcolor: ({ palette: { grey } }) => grey[300],
                    color: ({ palette: { grey } }) => grey[500],
                  },
                  transition: "all 0.2s ease",
                }}
                title="Send message"
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon sx={{ fontSize: 22 }} />
                )}
              </IconButton>
              {messages.length > 0 && (
                <MKButton
                  variant="text"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    clearMessages();
                    setAttachedFiles([]);
                  }}
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.5,
                    fontSize: "0.75rem",
                    "&:hover": {
                      bgcolor: ({ palette: { error } }) => `${error.main}10`,
                      color: ({ palette: { error } }) => error.main,
                    },
                  }}
                >
                  Clear
                </MKButton>
              )}
            </MKBox>
          </MKBox>
        </MKBox>
      </Card>

      {/* Snackbar */}
      <MKSnackbar
        color={snackbar.color}
        icon={<Icon>{snackbar.icon}</Icon>}
        title={snackbar.title}
        content={snackbar.content}
        dateTime={snackbar.dateTime}
        open={snackbar.open}
        close={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </ContainerComponent>
  );
}

export default ChatBot;

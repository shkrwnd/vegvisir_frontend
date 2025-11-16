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
  const [hasAnimated, setHasAnimated] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const { messages, sendMessage, loading, clearMessages, botName } = useChatBot();
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

  // Track when chatbot opens for the first time to trigger animation
  // Delay setting hasAnimated to allow animations to complete (longest animation is ~3s)
  useEffect(() => {
    if (isOpen && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 3500); // Wait for all animations to complete
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasAnimated]);

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
      {/* Sci-Fi Holographic Animation Overlay - Only show once on first open when chat is empty */}
      {isOpen && !hasAnimated && messages.length === 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 380,
            height: 600,
            maxHeight: "calc(100vh - 140px)",
            zIndex: 1298,
            pointerEvents: "none",
            overflow: "visible",
            borderRadius: 3,
          }}
        >
          {/* Holographic Grid Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
              opacity: 0,
              animation: "luminaGridFade 2s ease-out forwards",
              "@keyframes luminaGridFade": {
                "0%": { opacity: 0 },
                "30%": { opacity: 0.3 },
                "70%": { opacity: 0.2 },
                "100%": { opacity: 0 },
              },
            }}
          />
          {/* Energy Rays - Sci-Fi Style */}
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "2px",
                height: "250px",
                background: `linear-gradient(to bottom, 
                  rgba(102, 126, 234, 0.4) 0%, 
                  rgba(118, 75, 162, 0.3) 20%,
                  rgba(102, 126, 234, 0.2) 40%, 
                  rgba(118, 75, 162, 0.15) 60%,
                  transparent 100%)`,
                transformOrigin: "top center",
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                boxShadow: `
                  0 0 5px rgba(102, 126, 234, 0.3),
                  0 0 10px rgba(102, 126, 234, 0.2)
                `,
                animation: `luminaEnergyRay 2s ease-out ${i * 0.1}s forwards`,
                "@keyframes luminaEnergyRay": {
                  "0%": {
                    opacity: 0,
                    height: "0px",
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) scaleX(0)`,
                  },
                  "40%": {
                    opacity: 0.5,
                    height: "250px",
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) scaleX(1)`,
                  },
                  "70%": {
                    opacity: 0.4,
                  },
                  "100%": {
                    opacity: 0,
                    height: "250px",
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) scaleX(1.1)`,
                  },
                },
              }}
            />
          ))}
          {/* Holographic Core */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 30%, rgba(102, 126, 234, 0.1) 50%, transparent 70%)",
              boxShadow: `
                0 0 20px rgba(102, 126, 234, 0.4),
                0 0 40px rgba(102, 126, 234, 0.3),
                0 0 60px rgba(118, 75, 162, 0.2),
                inset 0 0 30px rgba(102, 126, 234, 0.15)
              `,
              animation: "luminaHologramCore 2.5s ease-out forwards",
              "@keyframes luminaHologramCore": {
                "0%": {
                  opacity: 0,
                  transform: "translate(-50%, -50%) scale(0) rotate(0deg)",
                },
                "30%": {
                  opacity: 0.6,
                  transform: "translate(-50%, -50%) scale(1) rotate(180deg)",
                },
                "60%": {
                  opacity: 0.4,
                  transform: "translate(-50%, -50%) scale(1.2) rotate(360deg)",
                },
                "100%": {
                  opacity: 0,
                  transform: "translate(-50%, -50%) scale(1.5) rotate(540deg)",
                },
              },
            }}
          />
          {/* Scanning Ring */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              border: "1.5px solid rgba(102, 126, 234, 0.5)",
              borderTopColor: "rgba(255, 255, 255, 0.7)",
              boxShadow: `
                0 0 15px rgba(102, 126, 234, 0.4),
                inset 0 0 15px rgba(102, 126, 234, 0.15)
              `,
              animation: "luminaScanRing 2s ease-out 0.2s forwards",
              "@keyframes luminaScanRing": {
                "0%": {
                  opacity: 0,
                  transform: "translate(-50%, -50%) scale(0) rotate(0deg)",
                },
                "50%": {
                  opacity: 0.6,
                  transform: "translate(-50%, -50%) scale(1.1) rotate(180deg)",
                },
                "100%": {
                  opacity: 0,
                  transform: "translate(-50%, -50%) scale(1.5) rotate(360deg)",
                },
              },
            }}
          />
          {/* Particle Effects */}
          {[...Array(15)].map((_, i) => (
            <Box
              key={`particle-${i}`}
              sx={{
                position: "absolute",
                top: `${20 + i * 5}%`,
                left: `${10 + i * 6}%`,
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: `rgba(102, 126, 234, ${0.3 + (i % 3) * 0.1})`,
                boxShadow: `0 0 4px rgba(102, 126, 234, 0.4), 0 0 8px rgba(118, 75, 162, 0.3)`,
                animation: `luminaParticle ${1 + (i % 3) * 0.5}s ease-out ${i * 0.1}s forwards`,
                "@keyframes luminaParticle": {
                  "0%": {
                    opacity: 0,
                    transform: "scale(0) translate(0, 0)",
                  },
                  "30%": {
                    opacity: 0.5,
                    transform: `scale(1.2) translate(${(Math.random() - 0.5) * 80}px, ${
                      (Math.random() - 0.5) * 80
                    }px)`,
                  },
                  "100%": {
                    opacity: 0,
                    transform: `scale(0) translate(${(Math.random() - 0.5) * 150}px, ${
                      (Math.random() - 0.5) * 150
                    }px)`,
                  },
                },
              }}
            />
          ))}
        </Box>
      )}

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
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.2),
              0 0 40px rgba(102, 126, 234, 0.3),
              inset 0 0 20px rgba(102, 126, 234, 0.1)
            `,
            animation: "luminaSciFiEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            "@keyframes luminaSciFiEntrance": {
              "0%": {
                opacity: 0,
                transform: "translateY(30px) scale(0.85) perspective(1000px) rotateX(15deg)",
                filter: "blur(10px) brightness(0.5)",
              },
              "50%": {
                filter: "blur(2px) brightness(1.2)",
                boxShadow: `
                  0 8px 32px rgba(0,0,0,0.2),
                  0 0 60px rgba(102, 126, 234, 0.5),
                  inset 0 0 30px rgba(102, 126, 234, 0.2)
                `,
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0) scale(1) perspective(1000px) rotateX(0deg)",
                filter: "blur(0px) brightness(1)",
                boxShadow: `
                  0 8px 32px rgba(0,0,0,0.2),
                  0 0 40px rgba(102, 126, 234, 0.3),
                  inset 0 0 20px rgba(102, 126, 234, 0.1)
                `,
              },
            },
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
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                inset 0 0 30px rgba(102, 126, 234, 0.3),
                0 0 20px rgba(102, 126, 234, 0.2)
              `,
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(102, 126, 234, 0.15) 30%, transparent 70%)",
                animation: hasAnimated ? "none" : "luminaHologramShimmer 3s ease-out forwards",
                "@keyframes luminaHologramShimmer": {
                  "0%": {
                    transform: "rotate(0deg) translate(-50%, -50%)",
                    opacity: 0.3,
                  },
                  "50%": {
                    opacity: 0.8,
                  },
                  "100%": {
                    transform: "rotate(360deg) translate(-50%, -50%)",
                    opacity: 0,
                  },
                },
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)",
                animation: hasAnimated ? "none" : "luminaScanLine 2s ease-out forwards",
                "@keyframes luminaScanLine": {
                  "0%": {
                    top: "0%",
                    opacity: 0,
                  },
                  "10%": {
                    opacity: 1,
                  },
                  "90%": {
                    opacity: 1,
                  },
                  "100%": {
                    top: "100%",
                    opacity: 0,
                  },
                },
              },
            }}
          >
            <MKBox
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ position: "relative", zIndex: 1 }}
            >
              <SmartToyIcon
                sx={{
                  animation: hasAnimated ? "none" : "luminaSciFiIcon 2s ease-out forwards",
                  filter:
                    "drop-shadow(0 0 8px rgba(102, 126, 234, 0.8)) drop-shadow(0 0 16px rgba(118, 75, 162, 0.6))",
                  "@keyframes luminaSciFiIcon": {
                    "0%": {
                      filter:
                        "drop-shadow(0 0 4px rgba(102, 126, 234, 0.4)) drop-shadow(0 0 8px rgba(118, 75, 162, 0.3))",
                      transform: "scale(0.8) rotate(0deg)",
                      opacity: 0,
                    },
                    "25%": {
                      filter:
                        "drop-shadow(0 0 12px rgba(102, 126, 234, 1)) drop-shadow(0 0 24px rgba(118, 75, 162, 0.8)) drop-shadow(0 0 32px rgba(102, 126, 234, 0.4))",
                      transform: "scale(1.08) rotate(2deg)",
                      opacity: 1,
                    },
                    "50%": {
                      filter:
                        "drop-shadow(0 0 16px rgba(102, 126, 234, 1)) drop-shadow(0 0 32px rgba(118, 75, 162, 0.9)) drop-shadow(0 0 48px rgba(102, 126, 234, 0.6))",
                      transform: "scale(1.12) rotate(0deg)",
                      opacity: 1,
                    },
                    "75%": {
                      filter:
                        "drop-shadow(0 0 12px rgba(102, 126, 234, 1)) drop-shadow(0 0 24px rgba(118, 75, 162, 0.8)) drop-shadow(0 0 32px rgba(102, 126, 234, 0.4))",
                      transform: "scale(1.08) rotate(-2deg)",
                      opacity: 1,
                    },
                    "100%": {
                      filter:
                        "drop-shadow(0 0 8px rgba(102, 126, 234, 0.8)) drop-shadow(0 0 16px rgba(118, 75, 162, 0.6))",
                      transform: "scale(1) rotate(0deg)",
                      opacity: 1,
                    },
                  },
                }}
              />
              <MKTypography
                variant="h6"
                fontWeight="bold"
                sx={{
                  textShadow: `
                    0 0 10px rgba(102, 126, 234, 0.8),
                    0 0 20px rgba(118, 75, 162, 0.6),
                    0 2px 4px rgba(0, 0, 0, 0.3)
                  `,
                  animation: hasAnimated ? "none" : "luminaSciFiText 2.5s ease-out forwards",
                  "@keyframes luminaSciFiText": {
                    "0%": {
                      textShadow: `
                        0 0 4px rgba(102, 126, 234, 0.4),
                        0 0 8px rgba(118, 75, 162, 0.3),
                        0 2px 4px rgba(0, 0, 0, 0.3)
                      `,
                      opacity: 0,
                      transform: "translateY(10px)",
                    },
                    "50%": {
                      textShadow: `
                        0 0 15px rgba(102, 126, 234, 1),
                        0 0 30px rgba(118, 75, 162, 0.8),
                        0 0 45px rgba(102, 126, 234, 0.5),
                        0 2px 4px rgba(0, 0, 0, 0.3)
                      `,
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                    "100%": {
                      textShadow: `
                        0 0 10px rgba(102, 126, 234, 0.8),
                        0 0 20px rgba(118, 75, 162, 0.6),
                        0 2px 4px rgba(0, 0, 0, 0.3)
                      `,
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                Chat Assistant - {botName}
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
              position: "relative",
              "&::before": {
                content: messages.length === 0 && !hasAnimated ? '""' : "none",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at center, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 30%, transparent 60%),
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(102, 126, 234, 0.01) 2px,
                    rgba(102, 126, 234, 0.01) 4px
                  )
                `,
                animation: "luminaHologramField 3s ease-out forwards",
                pointerEvents: "none",
                zIndex: 0,
                "@keyframes luminaHologramField": {
                  "0%": {
                    opacity: 0,
                    transform: "scale(0.8)",
                    filter: "blur(10px)",
                  },
                  "30%": {
                    opacity: 0.4,
                    transform: "scale(1.05)",
                    filter: "blur(3px)",
                  },
                  "60%": {
                    opacity: 0.3,
                    transform: "scale(1.1)",
                    filter: "blur(1px)",
                  },
                  "100%": {
                    opacity: 0,
                    transform: "scale(1.2)",
                    filter: "blur(0px)",
                  },
                },
              },
              "&::after": {
                content: messages.length === 0 && !hasAnimated ? '""' : "none",
                position: "absolute",
                top: "0%",
                left: "-100%",
                width: "100%",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 20%, rgba(255, 255, 255, 0.4) 50%, rgba(102, 126, 234, 0.3) 80%, transparent 100%)",
                boxShadow: `
                  0 0 5px rgba(102, 126, 234, 0.3),
                  0 0 10px rgba(118, 75, 162, 0.2)
                `,
                animation: "luminaEnergySweep 2.5s ease-out 0.3s forwards",
                pointerEvents: "none",
                zIndex: 0,
                "@keyframes luminaEnergySweep": {
                  "0%": {
                    left: "-100%",
                    top: "0%",
                    opacity: 0,
                  },
                  "20%": {
                    opacity: 0.5,
                  },
                  "80%": {
                    opacity: 0.5,
                  },
                  "100%": {
                    left: "100%",
                    top: "100%",
                    opacity: 0,
                  },
                },
              },
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
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <SmartToyIcon
                  sx={{
                    fontSize: 64,
                    color: ({ palette: { info } }) => info.main,
                    mb: 2,
                    animation: hasAnimated ? "none" : "luminaWelcomeIcon 2s ease-out forwards",
                    filter: "drop-shadow(0 0 8px rgba(102, 126, 234, 0.4))",
                    "@keyframes luminaWelcomeIcon": {
                      "0%": {
                        transform: "scale(0.5) translateY(20px) rotate(0deg)",
                        opacity: 0,
                        filter: "drop-shadow(0 0 4px rgba(102, 126, 234, 0.2))",
                      },
                      "50%": {
                        transform: "scale(1.15) translateY(-8px) rotate(5deg)",
                        opacity: 1,
                        filter:
                          "drop-shadow(0 0 16px rgba(102, 126, 234, 0.7)) drop-shadow(0 0 24px rgba(118, 75, 162, 0.5))",
                      },
                      "100%": {
                        transform: "scale(1) translateY(0) rotate(0deg)",
                        opacity: 1,
                        filter: "drop-shadow(0 0 8px rgba(102, 126, 234, 0.4))",
                      },
                    },
                  }}
                />
                <MKTypography
                  variant="h6"
                  color="text.secondary"
                  mb={1}
                  fontWeight="bold"
                  sx={{
                    animation: "luminaWelcomeText 1s ease-out forwards",
                    opacity: 0,
                    "@keyframes luminaWelcomeText": {
                      "0%": {
                        opacity: 0,
                        transform: "translateY(20px) scale(0.9)",
                      },
                      "60%": {
                        transform: "translateY(-5px) scale(1.05)",
                      },
                      "100%": {
                        opacity: 1,
                        transform: "translateY(0) scale(1)",
                      },
                    },
                  }}
                >
                  Start a conversation
                </MKTypography>
                <MKTypography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    animation: "luminaWelcomeSubtext 1s ease-out 0.2s forwards",
                    opacity: 0,
                    "@keyframes luminaWelcomeSubtext": {
                      "0%": {
                        opacity: 0,
                        transform: "translateY(15px) scale(0.95)",
                      },
                      "100%": {
                        opacity: 1,
                        transform: "translateY(0) scale(1)",
                      },
                    },
                  }}
                >
                  Ask me anything or attach files for assistance
                </MKTypography>
              </MKBox>
            ) : (
              <MKBox sx={{ position: "relative", zIndex: 1 }}>
                {messages.map((message, index) => (
                  <MKBox
                    key={index}
                    display="flex"
                    justifyContent={message.role === "user" ? "flex-end" : "flex-start"}
                    mb={2}
                    sx={{
                      animation: `luminaMessageFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                        index * 0.08
                      }s forwards`,
                      opacity: 0,
                      "@keyframes luminaMessageFadeIn": {
                        "0%": {
                          opacity: 0,
                          transform: "translateY(20px) scale(0.9)",
                        },
                        "60%": {
                          transform: "translateY(-3px) scale(1.02)",
                        },
                        "100%": {
                          opacity: 1,
                          transform: "translateY(0) scale(1)",
                        },
                      },
                    }}
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
                  <MKBox
                    display="flex"
                    justifyContent="flex-start"
                    mb={2}
                    sx={{
                      animation:
                        "luminaLoadingFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                      opacity: 0,
                      "@keyframes luminaLoadingFadeIn": {
                        "0%": {
                          opacity: 0,
                          transform: "translateY(15px) scale(0.95)",
                        },
                        "100%": {
                          opacity: 1,
                          transform: "translateY(0) scale(1)",
                        },
                      },
                    }}
                  >
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
              </MKBox>
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

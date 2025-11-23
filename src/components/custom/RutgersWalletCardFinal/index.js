import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useMediaQuery, useTheme } from "@mui/material";

const RutgersWalletCardFinal = forwardRef(
  (
    {
      userName = "User",
      balance = "$0.00",
      expiryDate = null,
      onLoadMoney,
      onRefresh,
      onSendMoney,
      isLoading = false,
      onAddClubCard,
      hideButtons = false,
      walletType = "VIRTUAL WALLET",
      cardTheme = "white",
      defaultBackground = null,
    },
    ref
  ) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardBackground, setCardBackground] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const backgroundInputRef = useRef(null);

    // Sync defaultBackground prop with state
    useEffect(() => {
      if (defaultBackground) {
        setCardBackground(defaultBackground);
      } else {
        setCardBackground(null);
      }
    }, [defaultBackground]);

    // Expose background upload trigger to parent
    useImperativeHandle(ref, () => ({
      triggerBackgroundUpload: () => {
        backgroundInputRef.current?.click();
      },
    }));

    // Calculate expiry date (2 years from now) if not provided
    const cardExpiryDate =
      expiryDate ||
      (() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 2);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);
        return `${month}/${year}`;
      })();

    const handleCardClick = (e) => {
      if (e.target.closest(".background-upload-area")) {
        return;
      }
      setIsFlipped(!isFlipped);
    };

    const handleBackgroundUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCardBackground(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const triggerBackgroundInput = () => {
      backgroundInputRef.current?.click();
    };

    return (
      <div
        style={{
          padding: "20px",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: "relative",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(204, 0, 0, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "float 8s ease-in-out infinite",
          }}
        />

        <style>
          {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
          }


          @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes slotRoll {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
          }


          @keyframes slide-up {
            0% { transform: translateY(10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes pulse-text {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
        </style>

        {/* Add Club Card Button - Small floating button */}
        {onAddClubCard && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 10,
            }}
          >
            <button
              onClick={onAddClubCard}
              style={{
                padding: "8px 12px",
                background: "rgba(204, 0, 0, 0.9)",
                border: "none",
                borderRadius: "20px",
                color: "#ffffff",
                fontSize: "0.7rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(204, 0, 0, 1)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(204, 0, 0, 0.9)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Club Card
            </button>
          </div>
        )}

        {/* Card Container */}
        <div
          style={{
            perspective: "1500px",
            width: isMobile ? "calc(100vw - 120px)" : "480px",
            maxWidth: isMobile ? "calc(100vw - 120px)" : "480px",
            margin: "0 auto 20px",
            position: "relative",
            zIndex: 2,
            boxSizing: "border-box",
            flexShrink: 0,
            overflow: "visible",
            padding: isMobile ? "0" : "0 4px",
          }}
        >
          <div
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: "relative",
              width: "100%",
              height: isMobile ? "calc((100vw - 120px) / 1.586)" : "calc(480px / 1.586)",
              minHeight: isMobile ? "calc((100vw - 120px) / 1.586)" : "calc(480px / 1.586)",
              maxHeight: isMobile ? "calc((100vw - 120px) / 1.586)" : "calc(480px / 1.586)",
              transition: "transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)",
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              cursor: "pointer",
            }}
          >
            {/* FRONT */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                borderRadius: isMobile ? "12px" : "16px",
                overflow: "hidden",
                // Theme-based styling
                background: cardBackground
                  ? cardTheme === "black"
                    ? "rgba(0, 0, 0, 0.9)"
                    : "rgba(255, 255, 255, 0.1)"
                  : cardTheme === "black"
                  ? "rgba(0, 0, 0, 0.95)"
                  : "rgba(255, 255, 255, 0.1)",
                ...(cardTheme === "white" && cardBackground
                  ? {}
                  : {
                      backdropFilter: "blur(25px) saturate(200%)",
                      WebkitBackdropFilter: "blur(25px) saturate(200%)",
                    }),
                border:
                  cardTheme === "black"
                    ? "2px solid rgba(255, 255, 255, 0.1)"
                    : "2px solid rgba(0, 0, 0, 0.1)",
                boxShadow:
                  isHovered && !isFlipped
                    ? cardTheme === "black"
                      ? isMobile
                        ? `0 4px 12px 0 rgba(0, 0, 0, 0.4),
                   inset 0 1px 2px 0 rgba(255, 255, 255, 0.1),
                   inset 0 -1px 2px 0 rgba(0, 0, 0, 0.2)`
                        : `0 12px 40px 0 rgba(0, 0, 0, 0.8),
                   inset 0 2px 4px 0 rgba(255, 255, 255, 0.1),
                   inset 0 -2px 4px 0 rgba(0, 0, 0, 0.3),
                   0 0 80px rgba(255, 255, 255, 0.1)`
                      : isMobile
                      ? `0 4px 12px 0 rgba(0, 0, 0, 0.2),
                   inset 0 1px 2px 0 rgba(255, 255, 255, 0.3),
                   inset 0 -1px 2px 0 rgba(0, 0, 0, 0.05)`
                      : `0 12px 40px 0 rgba(0, 0, 0, 0.2),
                   inset 0 2px 4px 0 rgba(255, 255, 255, 0.5),
                   inset 0 -2px 4px 0 rgba(0, 0, 0, 0.05),
                   0 0 80px rgba(204, 0, 0, 0.1)`
                    : cardTheme === "black"
                    ? isMobile
                      ? `0 2px 8px 0 rgba(0, 0, 0, 0.3),
                   inset 0 1px 2px 0 rgba(255, 255, 255, 0.05),
                   inset 0 -1px 2px 0 rgba(0, 0, 0, 0.15)`
                      : `0 8px 32px 0 rgba(0, 0, 0, 0.6),
                   inset 0 2px 4px 0 rgba(255, 255, 255, 0.05),
                   inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2),
                   0 0 60px rgba(255, 255, 255, 0.05)`
                    : isMobile
                    ? `0 2px 8px 0 rgba(0, 0, 0, 0.15),
                   inset 0 1px 2px 0 rgba(255, 255, 255, 0.2),
                   inset 0 -1px 2px 0 rgba(0, 0, 0, 0.05)`
                    : `0 8px 32px 0 rgba(0, 0, 0, 0.15),
                   inset 0 2px 4px 0 rgba(255, 255, 255, 0.3),
                   inset 0 -2px 4px 0 rgba(0, 0, 0, 0.05),
                   0 0 60px rgba(204, 0, 0, 0.08)`,
                transition: "all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)",
                transform:
                  isHovered && !isFlipped
                    ? "translateY(-8px) scale(1.02)"
                    : "translateY(0) scale(1)",
              }}
            >
              {/* Background Image or White */}
              {cardBackground ? (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${cardBackground})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: cardTheme === "white" ? "brightness(1)" : "brightness(0.8)",
                    }}
                  />
                  {cardTheme === "black" ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4))",
                      }}
                    />
                  ) : null}
                </>
              ) : (
                <>
                  {/* Theme-based gradient overlay */}
                  {cardTheme === "black" ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(20, 20, 20, 0.5) 100%)",
                        opacity: 0.8,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "transparent",
                        opacity: 0,
                      }}
                    />
                  )}
                </>
              )}

              {/* Glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  right: "-50%",
                  width: "200%",
                  height: "200%",
                  background: "radial-gradient(circle, rgba(204, 0, 0, 0.15) 0%, transparent 60%)",
                  animation: "pulse-glow 4s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "clamp(20px, 5vw, 32px)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Header with Rutgers Logo */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Rutgers Logo */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(8px, 2vw, 12px)",
                      background: cardBackground
                        ? cardTheme === "black"
                          ? "rgba(0, 0, 0, 0.85)"
                          : "rgba(255, 255, 255, 0.95)"
                        : cardTheme === "black"
                        ? "rgba(0, 0, 0, 0.7)"
                        : "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(15px) saturate(180%)",
                      WebkitBackdropFilter: "blur(15px) saturate(180%)",
                      padding: "clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 16px)",
                      borderRadius: "16px",
                      border:
                        cardTheme === "black"
                          ? "1px solid rgba(255, 255, 255, 0.3)"
                          : "1px solid rgba(0, 0, 0, 0.2)",
                      boxShadow: cardBackground
                        ? cardTheme === "black"
                          ? "0 4px 16px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
                          : "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.5)"
                        : cardTheme === "black"
                        ? "0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
                        : "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    <svg
                      width="clamp(28px, 7vw, 32px)"
                      height="clamp(28px, 7vw, 32px)"
                      viewBox="0 0 100 100"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <circle cx="50" cy="50" r="48" fill="#CC0000" />
                      <path
                        d="M30 35h20c8 0 12 4 12 11 0 5-2 8-6 10l8 19h-8l-7-17h-11v17h-8V35zm8 18h10c4 0 6-2 6-5s-2-5-6-5H38v10z"
                        fill="white"
                      />
                    </svg>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          color: "#CC0000",
                          fontWeight: 900,
                          fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                          letterSpacing: "0.5px",
                          lineHeight: 1.2,
                          textShadow: "none",
                        }}
                      >
                        RUTGERS
                      </div>
                      <div
                        style={{
                          color: cardTheme === "black" ? "#ffffff" : "#1f2937",
                          fontSize: "clamp(0.65rem, 2vw, 0.7rem)",
                          fontWeight: 600,
                          letterSpacing: "1px",
                          textShadow: "none",
                        }}
                      >
                        {walletType}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Name and Balance */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: "clamp(8px, 2vw, 12px)",
                    flexWrap: "nowrap",
                    minWidth: 0,
                  }}
                >
                  {/* User Name */}
                  <div
                    style={{
                      background: cardBackground
                        ? cardTheme === "black"
                          ? "rgba(0, 0, 0, 0.85)"
                          : "rgba(255, 255, 255, 0.95)"
                        : cardTheme === "black"
                        ? "rgba(0, 0, 0, 0.7)"
                        : "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(15px) saturate(180%)",
                      WebkitBackdropFilter: "blur(15px) saturate(180%)",
                      padding: "clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 16px)",
                      borderRadius: "16px",
                      border:
                        cardTheme === "black"
                          ? "1px solid rgba(255, 255, 255, 0.3)"
                          : "1px solid rgba(0, 0, 0, 0.2)",
                      flex: "1 1 auto",
                      minWidth: 0,
                      maxWidth: "none",
                      boxShadow: cardBackground
                        ? cardTheme === "black"
                          ? "0 4px 16px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
                          : "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.5)"
                        : cardTheme === "black"
                        ? "0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
                        : "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    <div
                      style={{
                        color: cardTheme === "black" ? "#ffffff" : "#1f2937",
                        fontWeight: 800,
                        fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                        lineHeight: 1.2,
                        textShadow: "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {userName}
                    </div>
                  </div>

                  {/* Balance */}
                  <div
                    style={{
                      textAlign: "right",
                      background: cardBackground
                        ? cardTheme === "black"
                          ? "rgba(0, 0, 0, 0.85)"
                          : "rgba(255, 255, 255, 0.95)"
                        : cardTheme === "black"
                        ? "rgba(0, 0, 0, 0.7)"
                        : "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(15px) saturate(180%)",
                      WebkitBackdropFilter: "blur(15px) saturate(180%)",
                      padding: "clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 16px)",
                      borderRadius: "16px",
                      border:
                        cardTheme === "black"
                          ? "1px solid rgba(255, 255, 255, 0.3)"
                          : "1px solid rgba(0, 0, 0, 0.2)",
                      boxShadow: cardBackground
                        ? cardTheme === "black"
                          ? "0 4px 16px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
                          : "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.5)"
                        : cardTheme === "black"
                        ? "0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
                        : "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                      flex: "0 1 auto",
                      minWidth: 0,
                      maxWidth: "none",
                      overflow: "visible",
                      width: "auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          color: cardTheme === "black" ? "rgba(255, 255, 255, 0.9)" : "#6b7280",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                          fontWeight: 600,
                          textShadow: "none",
                        }}
                      >
                        Flex Dollars
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInfoDialog(true);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: cardTheme === "black" ? "rgba(255, 255, 255, 0.9)" : "#6b7280",
                          transition: "all 0.2s ease",
                          textShadow: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#CC0000";
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            cardTheme === "black" ? "rgba(255, 255, 255, 0.7)" : "#6b7280";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                      </button>
                    </div>
                    <div
                      style={{
                        color: "#CC0000",
                        fontWeight: 900,
                        fontSize: "clamp(0.9rem, 3vw, 1.3rem)",
                        textShadow:
                          cardTheme === "black"
                            ? "0 3px 6px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.7), 0 1px 2px rgba(255, 255, 255, 0.3)"
                            : "0 3px 6px rgba(255, 255, 255, 0.9), 0 2px 4px rgba(255, 255, 255, 0.7), 0 1px 2px rgba(0, 0, 0, 0.2)",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "visible",
                        textOverflow: "clip",
                        minWidth: 0,
                        wordBreak: "keep-all",
                      }}
                    >
                      {balance || "$0.00"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                borderRadius: isMobile ? "12px" : "16px",
                padding: "32px",
                overflow: "hidden",
                // Glassmorphism styling
                background: cardBackground
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(25px) saturate(200%)",
                WebkitBackdropFilter: "blur(25px) saturate(200%)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4),
                inset 0 2px 4px 0 rgba(255, 255, 255, 0.15),
                inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1),
                0 0 60px rgba(204, 0, 0, 0.15)`,
                transform: "rotateY(180deg)",
              }}
            >
              {cardBackground ? (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${cardBackground})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "brightness(0.7)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5))",
                    }}
                  />
                </>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(255, 255, 255, 0.95)",
                  }}
                />
              )}

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      color: cardBackground ? "#ffffff" : "#1f2937",
                      fontWeight: 800,
                      fontSize: "1.4rem",
                      marginBottom: "6px",
                      textShadow: "none",
                    }}
                  >
                    Rutgers Wallet
                  </div>
                  <div
                    style={{
                      color: cardBackground ? "rgba(255, 255, 255, 0.9)" : "#6b7280",
                      fontSize: "0.8rem",
                      letterSpacing: "1px",
                      fontWeight: 600,
                    }}
                  >
                    Virtual Payment Card
                  </div>
                </div>

                <div
                  style={{
                    background: cardBackground ? "rgba(0, 0, 0, 0.6)" : "#ffffff",
                    borderRadius: "20px",
                    padding: "28px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: cardBackground
                      ? "2px solid rgba(255, 255, 255, 0.2)"
                      : "2px solid rgba(204, 0, 0, 0.15)",
                  }}
                >
                  <div
                    style={{
                      background: cardBackground
                        ? "rgba(255, 255, 255, 0.1)"
                        : "linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)",
                      padding: "16px",
                      borderRadius: "16px",
                      marginBottom: "12px",
                      border: cardBackground
                        ? "1px solid rgba(255, 255, 255, 0.2)"
                        : "1px solid rgba(204, 0, 0, 0.1)",
                    }}
                  >
                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 24 24"
                      fill={cardBackground ? "#ffffff" : "#CC0000"}
                    >
                      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z" />
                    </svg>
                  </div>
                  <div
                    style={{
                      color: cardBackground ? "#ffffff" : "#374151",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      textShadow: "none",
                    }}
                  >
                    Scan to Pay
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: cardBackground ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.02)",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: cardBackground
                      ? "1px solid rgba(255, 255, 255, 0.2)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: cardBackground ? "rgba(255, 255, 255, 0.7)" : "#6b7280",
                        fontSize: "0.7rem",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      Valid Thru
                    </div>
                    <div
                      style={{
                        color: cardBackground ? "#ffffff" : "#1f2937",
                        fontFamily: "monospace",
                        fontWeight: 800,
                        fontSize: "1rem",
                        textShadow: "none",
                      }}
                    >
                      {cardExpiryDate}
                    </div>
                  </div>
                  <div
                    style={{
                      color: cardBackground ? "rgba(255, 255, 255, 0.8)" : "#6b7280",
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                      fontWeight: 600,
                    }}
                  >
                    Tap to flip
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Below Card */}
        {!hideButtons && (
          <div
            style={{
              maxWidth: "480px",
              margin: "20px auto 0",
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Pay Button - Main Button */}
            {onSendMoney && (
              <button
                onClick={onSendMoney}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
                  border: "2px solid rgba(204, 0, 0, 0.3)",
                  borderRadius: "16px",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(204, 0, 0, 0.3)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #8b0000 0%, #CC0000 100%)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(204, 0, 0, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(204, 0, 0, 0.3)";
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                Pay
              </button>
            )}

            {/* Refresh, Load Money, and Background Upload Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    background: "rgba(204, 0, 0, 0.1)",
                    border: "2px solid rgba(204, 0, 0, 0.3)",
                    borderRadius: "16px",
                    color: "#CC0000",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1,
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = "rgba(204, 0, 0, 0.2)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(204, 0, 0, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = "rgba(204, 0, 0, 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                      animation: isLoading ? "spin 1s linear infinite" : "none",
                    }}
                  >
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                  </svg>
                  Refresh
                </button>
              )}
              {onLoadMoney && (
                <button
                  onClick={onLoadMoney}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    background: "rgba(204, 0, 0, 0.1)",
                    border: "2px solid rgba(204, 0, 0, 0.3)",
                    borderRadius: "16px",
                    color: "#CC0000",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1,
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = "rgba(204, 0, 0, 0.2)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(204, 0, 0, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = "rgba(204, 0, 0, 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  Load Money
                </button>
              )}
              <button
                className="background-upload-area"
                onClick={triggerBackgroundInput}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "rgba(204, 0, 0, 0.15)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(204, 0, 0, 0.3)",
                  borderRadius: "16px",
                  color: "#1f2937",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(204, 0, 0, 0.25)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(204, 0, 0, 0.3)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(204, 0, 0, 0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.color = "#1f2937";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
                {cardBackground ? "Change Background" : "Add Background"}
              </button>
            </div>
          </div>
        )}

        {/* File input - Always rendered for background upload functionality */}
        <input
          ref={backgroundInputRef}
          type="file"
          accept="image/*"
          onChange={handleBackgroundUpload}
          style={{ display: "none" }}
        />

        {/* Flex Dollars Info Dialog */}
        {showInfoDialog && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={() => setShowInfoDialog(false)}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "32px",
                maxWidth: "500px",
                width: "100%",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowInfoDialog(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
                  color: "#6b7280",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.color = "#1f2937";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                ×
              </button>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#1f2937",
                  marginBottom: "16px",
                  marginRight: "32px",
                }}
              >
                About Flex Dollars
              </h2>
              <div style={{ color: "#6b7280", lineHeight: "1.6", marginBottom: "20px" }}>
                <p style={{ marginBottom: "12px" }}>
                  Flex Dollars is your campus currency that can be used for various services and
                  purchases.
                </p>
                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                  <li style={{ marginBottom: "8px" }}>Load money from your registered cards</li>
                  <li style={{ marginBottom: "8px" }}>Maximum $10,000 per transaction</li>
                  <li>Use Flex Dollars for campus services</li>
                </ul>
              </div>
              <button
                onClick={() => setShowInfoDialog(false)}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #8b0000 0%, #CC0000 100%)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(204, 0, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

RutgersWalletCardFinal.propTypes = {
  userName: PropTypes.string,
  balance: PropTypes.string,
  previousBalance: PropTypes.string,
  expiryDate: PropTypes.string,
  onLoadMoney: PropTypes.func,
  onRefresh: PropTypes.func,
  onSendMoney: PropTypes.func,
  isLoading: PropTypes.bool,
  onAddClubCard: PropTypes.func,
  hideButtons: PropTypes.bool,
  walletType: PropTypes.string,
  cardTheme: PropTypes.string,
  defaultBackground: PropTypes.string,
};

RutgersWalletCardFinal.displayName = "RutgersWalletCardFinal";

export default RutgersWalletCardFinal;

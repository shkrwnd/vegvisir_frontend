import React, { useState, useRef } from "react";

const RutgersWalletCardFinal = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userName] = useState("Admin User");
  const [balance] = useState("$2,450.00");
  const [expiryDate] = useState("12/26");
  const [cardBackground, setCardBackground] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const backgroundInputRef = useRef(null);

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
        padding: "40px 20px",
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
          
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
        `}
      </style>

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#1f2937",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "10px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #cc0000 0%, #8b0000 50%, #cc0000 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Rutgers Virtual Wallet
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#6b7280",
            fontWeight: "300",
          }}
        >
          Clean & Sleek Design • Click &quot;Add Background&quot; for personalization
        </p>
      </div>

      {/* Background Upload Button */}
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto 20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          className="background-upload-area"
          onClick={triggerBackgroundInput}
          style={{
            width: "100%",
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
          {cardBackground ? "Change Card Background" : "Add Personalized Background"}
        </button>
        <input
          ref={backgroundInputRef}
          type="file"
          accept="image/*"
          onChange={handleBackgroundUpload}
          style={{ display: "none" }}
        />
      </div>

      {/* Card Container */}
      <div
        style={{
          perspective: "1500px",
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto 40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          onClick={handleCardClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: "relative",
            width: "100%",
            height: "280px",
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
              borderRadius: "28px",
              overflow: "hidden",
              border: "2px solid rgba(255, 255, 255, 1)",
              boxShadow: `
              0 8px 32px 0 rgba(0, 0, 0, 0.15),
              0 20px 60px 0 rgba(204, 0, 0, ${isHovered ? "0.25" : "0.15"}),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.3)
            `,
              transition: "all 0.4s ease",
              transform:
                isHovered && !isFlipped ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
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
                    filter: "brightness(0.8)",
                  }}
                />
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
              </>
            ) : (
              <>
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
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(248, 250, 252, 0.3) 100%)",
                    opacity: 0.8,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "60%",
                    height: "100%",
                    background:
                      "linear-gradient(135deg, transparent 0%, rgba(204, 0, 0, 0.08) 100%)",
                    opacity: 0.6,
                  }}
                />
              </>
            )}

            {/* Shimmer */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: cardBackground
                  ? "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
                backgroundSize: "1000px 100%",
                animation: "shimmer 4s infinite",
                pointerEvents: "none",
              }}
            />

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
                padding: "32px",
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
                    gap: "12px",
                    background: cardBackground ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    padding: "12px 16px",
                    borderRadius: "16px",
                    border: cardBackground
                      ? "1px solid rgba(255, 255, 255, 0.3)"
                      : "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="48" fill="#CC0000" />
                    <path
                      d="M30 35h20c8 0 12 4 12 11 0 5-2 8-6 10l8 19h-8l-7-17h-11v17h-8V35zm8 18h10c4 0 6-2 6-5s-2-5-6-5H38v10z"
                      fill="white"
                    />
                  </svg>
                  <div>
                    <div
                      style={{
                        color: cardBackground ? "#ffffff" : "#CC0000",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        letterSpacing: "0.5px",
                        lineHeight: 1.2,
                      }}
                    >
                      RUTGERS
                    </div>
                    <div
                      style={{
                        color: cardBackground ? "rgba(255, 255, 255, 0.8)" : "#1f2937",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "1px",
                      }}
                    >
                      VIRTUAL WALLET
                    </div>
                  </div>
                </div>

                {/* Contactless Icon */}
                <div
                  style={{
                    background: cardBackground
                      ? "rgba(0, 0, 0, 0.5)"
                      : "linear-gradient(135deg, rgba(204, 0, 0, 0.1) 0%, rgba(204, 0, 0, 0.1) 100%)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    padding: "8px",
                    border: cardBackground
                      ? "2px solid rgba(255, 255, 255, 0.3)"
                      : "2px solid rgba(204, 0, 0, 0.3)",
                    boxShadow: cardBackground
                      ? "0 0 20px rgba(255, 255, 255, 0.2)"
                      : "0 0 20px rgba(204, 0, 0, 0.2)",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill={cardBackground ? "#ffffff" : "#CC0000"}
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
                  </svg>
                </div>
              </div>

              {/* Bottom Section - Name and Balance */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "20px",
                }}
              >
                {/* User Name */}
                <div
                  style={{
                    background: cardBackground ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    padding: "14px 20px",
                    borderRadius: "16px",
                    border: cardBackground
                      ? "1px solid rgba(255, 255, 255, 0.2)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                    flex: "0 0 auto",
                  }}
                >
                  <div
                    style={{
                      color: cardBackground ? "rgba(255, 255, 255, 0.7)" : "#6b7280",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      marginBottom: "6px",
                      fontWeight: 600,
                    }}
                  >
                    Card Holder
                  </div>
                  <div
                    style={{
                      color: cardBackground ? "#ffffff" : "#1f2937",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      lineHeight: 1.2,
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
                      ? "rgba(204, 0, 0, 0.7)"
                      : "linear-gradient(135deg, rgba(204, 0, 0, 0.08) 0%, rgba(204, 0, 0, 0.08) 100%)",
                    backdropFilter: "blur(10px)",
                    padding: "14px 20px",
                    borderRadius: "16px",
                    border: cardBackground
                      ? "2px solid rgba(255, 255, 255, 0.3)"
                      : "2px solid rgba(204, 0, 0, 0.2)",
                    boxShadow: cardBackground
                      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                      : "0 4px 12px rgba(204, 0, 0, 0.1)",
                    flex: "0 0 auto",
                  }}
                >
                  <div
                    style={{
                      color: cardBackground ? "rgba(255, 255, 255, 0.9)" : "#6b7280",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      marginBottom: "6px",
                      fontWeight: 600,
                    }}
                  >
                    Balance
                  </div>
                  <div
                    style={{
                      color: cardBackground ? "#ffffff" : "#CC0000",
                      fontWeight: 900,
                      fontSize: "1.6rem",
                      textShadow: cardBackground
                        ? "0 2px 8px rgba(0, 0, 0, 0.5)"
                        : "0 0 15px rgba(204, 0, 0, 0.3)",
                      lineHeight: 1.2,
                    }}
                  >
                    {balance}
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
              borderRadius: "28px",
              padding: "32px",
              overflow: "hidden",
              border: "2px solid rgba(255, 255, 255, 1)",
              boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.15), 0 20px 60px 0 rgba(204, 0, 0, 0.2)`,
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
                    textShadow: cardBackground ? "0 2px 8px rgba(0, 0, 0, 0.5)" : "none",
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
                    textShadow: cardBackground ? "0 2px 4px rgba(0, 0, 0, 0.3)" : "none",
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
                      textShadow: cardBackground ? "0 2px 4px rgba(0, 0, 0, 0.3)" : "none",
                    }}
                  >
                    {expiryDate}
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
    </div>
  );
};

export default RutgersWalletCardFinal;

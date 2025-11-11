/**
=========================================================
* Resizable Split Pane Component
=========================================================
* Vertically resizable split pane with two panels
*/

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

function ResizableSplitPane({ topContent, bottomContent, initialTopHeight = 200 }) {
  const [topHeight, setTopHeight] = useState(initialTopHeight);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const startTopHeightRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newTopHeight = startTopHeightRef.current + (e.clientY - startYRef.current);

      // Constrain between min and max heights
      const minHeight = 100;
      const maxHeight = containerRect.height - 100;

      setTopHeight(Math.max(minHeight, Math.min(maxHeight, newTopHeight)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startTopHeightRef.current = topHeight;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "300px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        backgroundColor: "transparent",
      }}
    >
      {/* Top Panel */}
      <Paper
        elevation={3}
        sx={{
          height: `${topHeight}px`,
          minHeight: "100px",
          maxHeight: "calc(100% - 100px)",
          borderRadius: "0 8px 0 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent Paper from scrolling
        }}
      >
        <Box
          sx={{
            p: 2,
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0, // Important for flex children to respect parent constraints
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
          {topContent}
        </Box>
      </Paper>

      {/* Resizer */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          height: "4px",
          backgroundColor: ({ palette: { grey } }) => grey[400],
          cursor: "row-resize",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            backgroundColor: ({ palette: { primary } }) => primary.main,
            height: "6px",
          },
          transition: "background-color 0.2s, height 0.2s",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-2px",
            left: 0,
            right: 0,
            height: "8px",
          },
        }}
      >
        <Box
          sx={{
            width: "40px",
            height: "2px",
            backgroundColor: ({ palette: { grey } }) => grey[600],
            borderRadius: 1,
          }}
        />
      </Box>

      {/* Bottom Panel */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          minHeight: "100px",
          borderRadius: "0 0 8px 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent Paper from scrolling
        }}
      >
        <Box
          sx={{
            p: 2,
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0, // Important for flex children to respect parent constraints
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
          {bottomContent}
        </Box>
      </Paper>
    </Box>
  );
}

ResizableSplitPane.propTypes = {
  topContent: PropTypes.node.isRequired,
  bottomContent: PropTypes.node.isRequired,
  initialTopHeight: PropTypes.number,
};

export default ResizableSplitPane;

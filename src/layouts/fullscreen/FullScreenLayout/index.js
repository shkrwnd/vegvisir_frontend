/**
=========================================================
* FullScreen Layout
=========================================================
* FullScreen layout for chat interface (no navbar/sidebar)
*/

import PropTypes from "prop-types";

// @mui material components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";

// Components
import ResizableSplitPane from "components/custom/ResizableSplitPane";

// Features
import { useChatBot } from "features/chatbot";

function FullScreenLayout({ children }) {
  const { memories, memoriesLoading } = useChatBot();

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  // Memories content for top panel
  const topPanelContent = (
    <>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ fontSize: "0.95rem" }}>
        Memories
      </Typography>
      <Box sx={{ mt: 1 }}>
        {memoriesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={20} />
          </Box>
        ) : memories.length === 0 ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: "italic", fontSize: "0.75rem" }}
          >
            No memories saved yet
          </Typography>
        ) : (
          memories.map((memory) => (
            <Box
              key={memory.id}
              sx={{
                p: 0.75,
                mb: 0.75,
                backgroundColor: ({ palette: { grey } }) => grey[100],
                borderRadius: 0.5,
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
                <Typography variant="caption" fontWeight="bold" sx={{ fontSize: "0.75rem" }}>
                  {memory.key}
                </Typography>
                {memory.category && (
                  <Chip
                    label={memory.category}
                    size="small"
                    sx={{
                      height: "16px",
                      fontSize: "0.65rem",
                      backgroundColor: ({ palette: { info } }) => `${info.main}20`,
                      color: ({ palette: { info } }) => info.main,
                      "& .MuiChip-label": {
                        padding: "0 4px",
                      },
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.75rem", display: "block", mb: 0.25 }}
              >
                {memory.value}
              </Typography>
              {memory.timestamp && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                  {formatTimestamp(memory.timestamp)}
                </Typography>
              )}
            </Box>
          ))
        )}
      </Box>
    </>
  );

  // Dummy data for bottom panel
  const bottomPanelContent = (
    <>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Bottom Panel
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This is the bottom resizable panel. Drag the divider above to resize.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Sample Data:
        </Typography>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
          <Box
            key={item}
            sx={{
              p: 1.5,
              mb: 1,
              backgroundColor: ({ palette: { grey } }) => grey[100],
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">
              Item {item}: Sample content here with some additional text to make it longer
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        backgroundColor: ({ palette: { grey } }) => grey[50],
        position: "relative",
      }}
    >
      {/* Resizable Split Pane in left corner */}
      <ResizableSplitPane
        topContent={topPanelContent}
        bottomContent={bottomPanelContent}
        initialTopHeight={200}
      />

      {/* Main content */}
      {children}
    </Box>
  );
}

FullScreenLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FullScreenLayout;

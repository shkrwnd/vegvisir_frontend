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

// Components
import ResizableSplitPane from "components/custom/ResizableSplitPane";

function FullScreenLayout({ children }) {
  // Top panel content (empty for now)
  const topPanelContent = (
    <Typography variant="body2" color="text.secondary">
      Top panel content
    </Typography>
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

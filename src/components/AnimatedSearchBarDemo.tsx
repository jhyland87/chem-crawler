import { Box } from "@mui/material";
import AnimatedSearchBar from "./AnimatedSearchBar";

/**
 * Demo component to showcase the AnimatedSearchBar
 */
const AnimatedSearchBarDemo: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // In a real application, you would perform the search here
    // and update the results state
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f5f5f5",
      }}
    >
      <AnimatedSearchBar onSearch={handleSearch} placeholder="Search for chemicals..." />
    </Box>
  );
};

export default AnimatedSearchBarDemo;

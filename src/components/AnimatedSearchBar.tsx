import SearchIcon from "@mui/icons-material/Search";
import { Box, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import "./AnimatedSearchBar.css";

interface AnimatedSearchBarProps {
  docked: boolean;
  value: string;
  onSearch: (query: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

/**
 * AnimatedSearchBar component that transforms from a centered search bar to a toolbar header
 * when the user submits a search query.
 */
const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
  docked,
  value,
  onSearch,
  onSubmit,
  placeholder = "Search...",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Animation for the search bar container
  const containerSpring = useSpring({
    top: "50%", //docked ? 0 : "50%",
    /*
    transform: docked ? "translate(-50%, 0)" : "translate(-50%, -50%)",
    width: docked ? "60%" : "80%",
    maxWidth: docked ? "600px" : "600px",
    height: docked ? "48px" : "60px",
    borderRadius: docked ? "8px" : "8px",
    boxShadow: docked ? "0 2px 4px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: 99999,
    config: { tension: 30, friction: 30 },
    */
    zIndex: 99999,
    from: docked ? { y: 100 } : { y: 0 },
    to: docked ? { y: 0 } : { y: 100 },
  });

  // Animation for the search icon
  const iconSpring = useSpring({
    fontSize: docked ? "20px" : "24px",
    //marginRight: docked ? "4px" : "8px",
    config: { tension: 30, friction: 30 },
  });

  // Animation for the input field
  const inputSpring = useSpring({
    fontSize: docked ? "14px" : "16px",
    width: docked ? "calc(100% - 80px)" : "100%",
    config: { tension: 30, friction: 30 },
  });

  // Focus the input when component mounts or when undocked
  useEffect(() => {
    if (inputRef.current && !docked) {
      inputRef.current.focus();
    }
  }, [docked]);

  // Handle key press (Enter key)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!docked) {
        onSubmit();
      }
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (!docked) {
      onSubmit();
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: docked ? "48px" : "100vh" }}>
      {/* Animated search bar container */}
      <animated.div
        style={{
          ...containerSpring,
          position: "absolute",
          left: "50%",
          right: "auto",
          margin: "auto",
        }}
        className="animated-search-container"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            px: 2,
            py: 1,
          }}
        >
          {/* Search icon */}
          <animated.div style={iconSpring}>
            <SearchIcon
              onClick={handleSearchClick}
              style={{ cursor: !docked ? "pointer" : "default" }}
            />
          </animated.div>

          {/* Search input */}
          <animated.div style={inputSpring} className="search-input-container">
            <TextField
              inputRef={inputRef}
              fullWidth
              variant="standard"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-field"
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: "inherit",
                  height: "100%",
                },
              }}
              sx={{ height: "100%" }}
            />
          </animated.div>
        </Box>
      </animated.div>
    </Box>
  );
};

export default AnimatedSearchBar;

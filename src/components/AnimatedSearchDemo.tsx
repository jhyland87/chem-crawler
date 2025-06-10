import React from "react";
import AnimatedSearchComponent from "./AnimatedSearchComponent";

const AnimatedSearchDemo: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
      }}
    >
      <AnimatedSearchComponent />
    </div>
  );
};

export default AnimatedSearchDemo;

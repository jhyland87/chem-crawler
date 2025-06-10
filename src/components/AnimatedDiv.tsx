import { useState } from "react";
import { animated, useSpring } from "react-spring";
import "./AnimatedDiv.css";
function AnimatedDiv() {
  const [isVisible, setIsVisible] = useState(true);

  const props = useSpring({
    transform: isVisible ? "translateY(160%)" : "translateY(0%)",
    //opacity: isVisible ? 1 : 0,
  });

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button className="slide-div-button" onClick={handleClick}>
        Slide Div
      </button>
      <animated.div style={props} className="slide-div">
        This div will slide from the top
      </animated.div>
    </div>
  );
}

export default AnimatedDiv;

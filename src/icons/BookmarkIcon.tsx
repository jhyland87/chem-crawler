/** @internal */
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";
import React from "react";

/**
 * A Material-UI icon component that renders a bookmark icon.
 * This icon is typically used to represent saving, bookmarking, or marking items for later reference.
 *
 * @component
 * @param props - The props passed to the underlying SvgIcon component
 * @returns A React component that renders the bookmark icon
 */
const BookmarkIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <svg
        {...props}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V5H17V18Z"
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
};

export default BookmarkIcon;

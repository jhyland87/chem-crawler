/** @internal */
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";
import React from "react";

/**
 * A Material-UI icon component that renders the GitHub logo.
 * This icon is typically used to represent GitHub integration, repository links, or source code.
 *
 * @component
 * @param props - The props passed to the underlying SvgIcon component
 * @returns A React component that renders the GitHub icon
 */
const GitHubIcon: React.FC<SvgIconProps> = (props) => {
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
          d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.581 9.521 21.277 9.521 21.01C9.521 20.778 9.512 20.145 9.508 19.214C6.726 19.908 6.139 17.95 6.139 17.95C5.685 16.81 5.029 16.504 5.029 16.504C4.121 15.88 5.097 15.892 5.097 15.892C6.101 15.965 6.629 16.927 6.629 16.927C7.521 18.455 8.97 18.013 9.539 17.757C9.631 17.11 9.889 16.67 10.175 16.42C7.954 16.167 5.62 15.31 5.62 11.477C5.62 10.386 6.01 9.488 6.649 8.793C6.546 8.541 6.203 7.524 6.747 6.148C6.747 6.148 7.586 5.882 9.497 7.164C10.299 6.95 11.15 6.842 12 6.838C12.85 6.842 13.701 6.95 14.503 7.164C16.414 5.882 17.251 6.148 17.251 6.148C17.797 7.524 17.454 8.541 17.351 8.793C17.991 9.488 18.377 10.386 18.377 11.477C18.377 15.322 16.041 16.167 13.817 16.417C14.172 16.723 14.491 17.326 14.491 18.31C14.491 19.791 14.479 21.035 14.479 21.01C14.479 21.277 14.659 21.583 15.167 21.489C19.137 20.164 22 16.416 22 12C22 6.477 17.523 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
};

export default GitHubIcon;

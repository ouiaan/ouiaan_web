
import * as React from "react";

export const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM14.8 19.2c-1.3 1.1-3 1.6-4.7 1.4-1.4-.2-2.8-.8-3.9-1.8-1-.9-1.7-2-2.1-3.3-.4-1.3-.5-2.6-.2-3.9.2-1.4.8-2.7 1.8-3.7 1.3-1.4 3.2-2.1 5.1-1.8 1.8.3 3.4 1.4 4.4 2.9 1 1.5 1.5 3.2 1.2 5-0.2 1.9-.9 3.1-1.7 4z"
    />
  </svg>
);

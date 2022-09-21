import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type: "primary" | "secondary" | "tertiary";
  size: "small" | "large";
  onButtonClick?: () => void;
};

const Button = ({ children, type, size, onButtonClick }: ButtonProps) => {
  return (
    <button
      className={`flex flex-row items-center justify-center group sm:gap-x-1 font-semibold rounded-lg leading-[14.52px] sm:leading-[17px] transition duration-200 ${
        size == "small"
          ? "py-2 px-[18px] sm:py-3 sm:px-6 text-xs sm:text-base"
          : "py-4 px-8 text-base"
      } ${
        type == "primary"
          ? "bg-primaryWhite dark:bg-primaryBlue hover:ring-[3px] dark:hover:bg-primaryWhite dark:hover:ring-0 ring-[#82B0FF] active:ring-0 dark:active:bg-primaryBlue text-primaryBlue dark:text-white dark:hover:text-baseBlueDark dark:active:text-white transition duration-200"
          : type == "secondary"
          ? "bg-primaryBlue dark:bg-blueSilver w-full sm:w-max hover:ring-[3px] active:ring-2 dark:active:ring-0 ring-[#82B0FF] dark:ring-primaryBlue text-primaryWhite dark:text-baseBlueDark transition duration-200"
          : "bg-bodyGray dark:bg-baseBlueMid text-primaryBlue dark:text-blueSilver"
      } `}
      onClick={onButtonClick}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);

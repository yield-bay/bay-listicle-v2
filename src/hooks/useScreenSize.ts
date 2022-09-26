import { useState, useEffect } from "react";
import debounce from "@utils/debounce";

function calculateScreenWidth(windowWidth: number) {
  if (windowWidth >= 1536) {
    return "2xl";
  } else if (windowWidth >= 1280) {
    return "xl";
  } else if (windowWidth >= 1024) {
    return "lg";
  } else if (windowWidth >= 768) {
    return "md";
  } else if (windowWidth >= 640) {
    return "sm";
  } else {
    return "xs";
  }
}

const useScreenSize = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [responsiveWidth, setResponsiveWidth] = useState("xs");

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 500);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setResponsiveWidth(
      calculateScreenWidth(windowWidth == 0 ? window.innerWidth : windowWidth)
    );
  }, [windowWidth]);

  return responsiveWidth;
};

export default useScreenSize;

import { useState, useEffect } from "react";

// Define breakpoints same as Tailwind (you can tweak as needed)
const breakpoints = {
  sm: 640,  // mobile < 640px
  md: 768,  // tablet < 768px
  lg: 1024, // desktop < 1024px
};

export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width,
    isMobile: width < breakpoints.sm,
    isTablet: width >= breakpoints.sm && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
  };
}

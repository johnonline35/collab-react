import { useLayoutEffect } from "react";

export const useScrollToTop = (loadingState) => {
  useLayoutEffect(() => {
    if (loadingState === "loaded") {
      window.scrollTo(0, 0);
    }
  }, [loadingState]);
};

import { useEffect } from "react";

export const useImageLoaded = (companyInfo, loadedImages, setLoadedImages) => {
  useEffect(() => {
    if (companyInfo) {
      companyInfo.forEach((info) => {
        if (info.workspace_avatar) {
          const image = new Image();
          const src = info.workspace_avatar.logo;

          if (src) {
            image.src = src;
            image.onload = () => {
              setLoadedImages((prevLoadedImages) => ({
                ...prevLoadedImages,
                [src]: true,
              }));
            };
          }
        }
      });
    }
  }, [companyInfo, setLoadedImages]);

  return loadedImages;
};

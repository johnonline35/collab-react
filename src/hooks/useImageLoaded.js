import { useEffect } from "react";

export const useImageLoaded = (companyInfo, loadedImages, setLoadedImages) => {
  useEffect(() => {
    if (companyInfo) {
      companyInfo.forEach((info) => {
        const image = new Image();
        const src = info.workspace_avatar.logo;

        image.src = src;
        image.onload = () => {
          setLoadedImages((prevLoadedImages) => ({
            ...prevLoadedImages,
            [src]: true,
          }));
        };
      });
    }
  }, [companyInfo, setLoadedImages]);

  return loadedImages;
};

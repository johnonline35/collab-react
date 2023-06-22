import { useState, useEffect } from "react";

export default function useFullUrl(initialUrl) {
  const [fullUrl, setFullUrl] = useState(undefined);

  useEffect(() => {
    if (initialUrl) {
      if (
        initialUrl.startsWith("http://") ||
        initialUrl.startsWith("https://")
      ) {
        setFullUrl(initialUrl);
      } else {
        setFullUrl(`https://${initialUrl}`);
      }
    } else {
      setFullUrl(undefined);
    }
  }, [initialUrl]);

  return fullUrl;
}

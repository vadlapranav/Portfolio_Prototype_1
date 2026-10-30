import { useEffect, useState } from "react";
import { TextureLoader, SRGBColorSpace, LinearMipmapLinearFilter } from "three";

// Nonessential textures fail locally; they never reject the entire Canvas suspense boundary.
export function useLocalTexture(file) {
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    let cancelled = false,
      loaded = null;
    setTexture(null);
    const loader = new TextureLoader();
    loader.load(
      file,
      (result) => {
        if (cancelled) {
          result.dispose();
          return;
        }
        loaded = result;
        result.colorSpace = SRGBColorSpace;
        result.minFilter = LinearMipmapLinearFilter;
        result.anisotropy = 4;
        setTexture(result);
      },
      undefined,
      () => {
        if (!cancelled) setTexture(null);
      },
    );
    return () => {
      cancelled = true;
      loaded?.dispose();
    };
  }, [file]);
  return texture;
}

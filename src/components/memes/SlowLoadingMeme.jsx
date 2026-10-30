import { useEffect, useState } from "react";
import { memeTiming } from "../../data/memeTiming";
import MemeImage from "./MemeImage";
export default function SlowLoadingMeme() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), memeTiming.slowLoadMs);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={`scene-loading ${slow ? "scene-loading-slow" : ""}`}
      role="status"
    >
      <span />
      Charting the galaxy…{slow && <MemeImage id="waiting" />}
    </div>
  );
}

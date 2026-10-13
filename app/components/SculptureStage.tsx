"use client";

import dynamic from "next/dynamic";
import SculptureFallback from "./SculptureFallback";

const ChromeStarburstScene = dynamic(() => import("./ChromeStarburstScene"), {
  ssr: false,
  loading: () => <SculptureFallback />,
});

export default function SculptureStage() {
  return (
    <div className="sculpture-stage">
      <ChromeStarburstScene />
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import SculptureFallback from "./SculptureFallback";

const VinylRecordScene = dynamic(() => import("./VinylRecordScene"), {
  ssr: false,
  loading: () => <SculptureFallback />,
});

export default function SculptureStage() {
  return (
    <div className="sculpture-stage" aria-hidden="true">
      <VinylRecordScene />
    </div>
  );
}

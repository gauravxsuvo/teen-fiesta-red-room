"use client";
import dynamic from "next/dynamic";
import SculptureFallback from "./SculptureFallback";
const ChromeKnotScene = dynamic(() => import("./ChromeKnotScene"), {
    ssr: false,
    loading: () => <SculptureFallback />,
});
export default function SculptureStage() {
    return (<div className="sculpture-stage">
      <ChromeKnotScene />
    </div>);
}

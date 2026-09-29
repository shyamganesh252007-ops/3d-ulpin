"use client";

import dynamic from "next/dynamic";

const CesiumMap = dynamic(
  () => import("./CesiumMap"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#05070b]">
        <div className="liquid-glass rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />

            <span className="text-xs text-white/60">
              Loading 3D spatial engine...
            </span>
          </div>
        </div>
      </div>
    ),
  }
);

type CesiumMapWrapperProps = {
  onPropertySelect?: (property: any) => void;
  parcelsVisible?: boolean;
  buildingsVisible?: boolean;
  infrastructureVisible?: boolean;
};

export default function CesiumMapWrapper({
  onPropertySelect,
  parcelsVisible = true,
  buildingsVisible = true,
  infrastructureVisible = false,
}: CesiumMapWrapperProps) {
  return (
    <CesiumMap
      onPropertySelect={onPropertySelect}
      parcelsVisible={parcelsVisible}
      buildingsVisible={buildingsVisible}
      infrastructureVisible={infrastructureVisible}
    />
  );
}
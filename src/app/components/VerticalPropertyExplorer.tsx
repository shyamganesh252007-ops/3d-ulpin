"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowDown,
  ArrowUp,
  Building2,
  CheckCircle2,
  ChevronRight,
  DoorOpen,
  Layers3,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

type Property = {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  width: number;
  depth: number;
  height: number;
  floors: number;
};

type VerticalPropertyExplorerProps = {
  property: Property;
  onClose: () => void;
};

// ============================================================
// COMPONENT
// ============================================================

export default function VerticalPropertyExplorer({
  property,
  onClose,
}: VerticalPropertyExplorerProps) {
  const [selectedFloor, setSelectedFloor] =
    useState(5);

  const [selectedUnit, setSelectedUnit] =
    useState<string | null>(null);

  // ==========================================================
  // DEMO DATA
  // ==========================================================

  const unitsPerFloor = 4;

  const floorHeight =
    property.height / property.floors;

  const selectedFloorUnits = useMemo(() => {
    return Array.from(
      { length: unitsPerFloor },
      (_, index) => ({
        id: `${selectedFloor}0${index + 1}`,
        area:
          index === 0
            ? "620 m²"
            : index === 1
              ? "580 m²"
              : index === 2
                ? "610 m²"
                : "590 m²",
        type:
          index === 0
            ? "Corner Unit"
            : "Residential",
        status:
          index === 3
            ? "Available"
            : "Registered",
      })
    );
  }, [selectedFloor]);

  const totalUnits =
    property.floors * unitsPerFloor;

  // ==========================================================
  // FLOOR SELECTION
  // ==========================================================

  const goToFloor = (floor: number) => {
    const safeFloor = Math.max(
      1,
      Math.min(property.floors, floor)
    );

    setSelectedFloor(safeFloor);
    setSelectedUnit(null);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl md:p-8"
    >
      {/* ================================================== */}
      {/* BACKDROP */}
      {/* ================================================== */}

      <button
        aria-label="Close property explorer"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* ================================================== */}
      {/* MAIN PANEL */}
      {/* ================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 35,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 25,
          scale: 0.98,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 flex h-[92vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-[32px] border border-white/[0.10] bg-[#060a0f]/95 shadow-[0_30px_120px_rgba(0,0,0,.65)]"
      >
        {/* ================================================== */}
        {/* TOP BAR */}
        {/* ================================================== */}

        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4 md:px-7">
          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-200/10 bg-cyan-300/[0.06]">
              <Building2 className="h-5 w-5 text-cyan-200" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-cyan-200/45">
                  Vertical Cadastral Explorer
                </p>

                <span className="rounded-full border border-emerald-300/10 bg-emerald-300/[0.06] px-2 py-0.5 text-[8px] text-emerald-200">
                  DEMO
                </span>
              </div>

              <h2 className="mt-1 text-lg font-semibold tracking-tight md:text-xl">
                {property.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/50 transition hover:bg-white/[0.07] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* ================================================== */}
        {/* CONTENT */}
        {/* ================================================== */}

        <div className="grid min-h-0 flex-1 lg:grid-cols-[1.05fr_.95fr]">

          {/* ================================================= */}
          {/* LEFT — VERTICAL BUILDING */}
          {/* ================================================= */}

          <section className="relative min-h-0 overflow-hidden border-b border-white/[0.07] lg:border-b-0 lg:border-r">

            {/* Ambient glow */}

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[0.035] blur-[100px]" />

            {/* Grid */}

            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:48px_48px]" />

            <div className="relative flex h-full min-h-[500px] flex-col">

              {/* Section title */}

              <div className="flex items-center justify-between px-6 pt-6 md:px-8">

                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                    Vertical Property Structure
                  </p>

                  <p className="mt-2 text-xs text-white/45">
                    Building → Floors → Units
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-cyan-200/10 bg-cyan-300/[0.04] px-3 py-1.5">
                  <Layers3 className="h-3.5 w-3.5 text-cyan-200/70" />

                  <span className="text-[9px] text-cyan-100/60">
                    {property.floors} levels
                  </span>
                </div>
              </div>

              {/* ================================================= */}
              {/* BUILDING VISUAL */}
              {/* ================================================= */}

              <div className="relative flex min-h-0 flex-1 items-center justify-center px-10 py-8">

                {/* Vertical elevation ruler */}

                <div className="absolute left-6 top-1/2 hidden h-[72%] -translate-y-1/2 flex-col justify-between md:flex">

                  {Array.from(
                    { length: property.floors },
                    (_, index) => {
                      const floor =
                        property.floors -
                        index;

                      return (
                        <button
                          key={floor}
                          onClick={() =>
                            goToFloor(floor)
                          }
                          className={`group flex items-center gap-2 text-[8px] transition ${
                            selectedFloor === floor
                              ? "text-cyan-200"
                              : "text-white/20 hover:text-white/50"
                          }`}
                        >
                          <span>
                            F{String(floor).padStart(2, "0")}
                          </span>

                          <span
                            className={`h-px w-4 ${
                              selectedFloor === floor
                                ? "bg-cyan-300"
                                : "bg-white/10"
                            }`}
                          />
                        </button>
                      );
                    }
                  )}

                </div>

                {/* Building */}

                <motion.div
                  layout
                  className="relative flex w-[210px] flex-col overflow-hidden rounded-[8px] border border-cyan-200/20 bg-gradient-to-b from-cyan-200/[0.10] via-blue-400/[0.06] to-cyan-300/[0.025] shadow-[0_0_70px_rgba(70,210,255,.08)] md:w-[250px]"
                >

                  {/* Building top */}

                  <div className="absolute -top-3 left-4 right-4 h-3 rounded-t-lg border border-cyan-200/20 bg-cyan-200/[0.08]" />

                  {/* Floors */}

                  {Array.from(
                    {
                      length: property.floors,
                    },
                    (_, index) => {
                      const floor =
                        property.floors -
                        index;

                      const isSelected =
                        selectedFloor === floor;

                      return (
                        <motion.button
                          key={floor}
                          onClick={() =>
                            goToFloor(floor)
                          }
                          whileHover={{
                            scaleX: 1.025,
                          }}
                          whileTap={{
                            scaleX: 0.99,
                          }}
                          className={`group relative flex h-[42px] items-center border-b border-white/[0.08] px-4 text-left transition ${
                            isSelected
                              ? "bg-cyan-300/[0.16]"
                              : "hover:bg-white/[0.045]"
                          }`}
                        >

                          {/* Floor number */}

                          <span
                            className={`w-10 text-[9px] font-semibold ${
                              isSelected
                                ? "text-cyan-100"
                                : "text-white/30"
                            }`}
                          >
                            F
                            {String(floor).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          {/* Unit blocks */}

                          <div className="flex flex-1 gap-1.5">
                            {Array.from(
                              {
                                length:
                                  unitsPerFloor,
                              },
                              (_, unitIndex) => (
                                <span
                                  key={unitIndex}
                                  className={`h-5 flex-1 rounded-[3px] border ${
                                    isSelected
                                      ? "border-cyan-200/20 bg-cyan-200/[0.12]"
                                      : "border-white/[0.06] bg-white/[0.025]"
                                  }`}
                                />
                              )
                            )}
                          </div>

                          {/* Selected marker */}

                          <ChevronRight
                            className={`ml-2 h-3 w-3 transition ${
                              isSelected
                                ? "text-cyan-200"
                                : "text-transparent group-hover:text-white/20"
                            }`}
                          />

                        </motion.button>
                      );
                    }
                  )}

                  {/* Ground */}

                  <div className="h-7 border-t border-cyan-200/15 bg-white/[0.025]" />

                </motion.div>

                {/* Right elevation information */}

                <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-2 md:flex">

                  <p className="text-[8px] uppercase tracking-[0.18em] text-white/20">
                    Total Height
                  </p>

                  <p className="text-sm font-semibold text-white/65">
                    {property.height} m
                  </p>

                  <div className="mt-3 h-px w-10 bg-white/10" />

                  <p className="text-[8px] text-white/25">
                    ~{floorHeight.toFixed(1)} m / floor
                  </p>

                </div>

              </div>

              {/* Bottom building information */}

              <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] p-5 md:p-6">

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[8px] text-white/25">
                    FLOORS
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {property.floors}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[8px] text-white/25">
                    UNITS
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {totalUnits}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[8px] text-white/25">
                    HEIGHT
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {property.height}m
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* RIGHT — PROPERTY DATA */}
          {/* ================================================= */}

          <section className="min-h-0 overflow-y-auto">

            <div className="p-6 md:p-8">

              {/* Property identity */}

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                    3D Property Identity
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-tight">
                    {property.id}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-emerald-300/10 bg-emerald-300/[0.05] px-3 py-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-300" />

                  <span className="text-[8px] text-emerald-200/80">
                    Spatially mapped
                  </span>
                </div>

              </div>

              {/* ULPIN */}

              <div className="mt-6 rounded-2xl border border-cyan-200/10 bg-cyan-300/[0.035] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/[0.08]">
                    <ShieldCheck className="h-4 w-4 text-cyan-200" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[8px] uppercase tracking-[0.18em] text-white/25">
                      3D ULPIN
                    </p>

                    <p className="mt-1 truncate font-mono text-[10px] text-cyan-100/75">
                      DEMO-TN-CHN-P042-{property.id}
                    </p>
                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* PROPERTY DETAILS */}
              {/* ================================================= */}

              <div className="mt-6 grid grid-cols-2 gap-3">

                <InfoCard
                  icon={Building2}
                  label="Property Type"
                  value="Residential"
                />

                <InfoCard
                  icon={Layers3}
                  label="Vertical Levels"
                  value={`${property.floors} floors`}
                />

                <InfoCard
                  icon={DoorOpen}
                  label="Mapped Units"
                  value={`${totalUnits} units`}
                />

                <InfoCard
                  icon={Ruler}
                  label="Building Height"
                  value={`${property.height} m`}
                />

                <InfoCard
                  icon={MapPin}
                  label="Latitude"
                  value={property.latitude.toFixed(5)}
                />

                <InfoCard
                  icon={MapPin}
                  label="Longitude"
                  value={property.longitude.toFixed(5)}
                />

              </div>

              {/* ================================================= */}
              {/* FLOOR CONTROL */}
              {/* ================================================= */}

              <div className="mt-8">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                      Vertical Level
                    </p>

                    <h4 className="mt-1 text-sm font-semibold">
                      Floor {selectedFloor}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">

                    <button
                      onClick={() =>
                        goToFloor(
                          selectedFloor - 1
                        )
                      }
                      disabled={
                        selectedFloor === 1
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-white/40 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        goToFloor(
                          selectedFloor + 1
                        )
                      }
                      disabled={
                        selectedFloor ===
                        property.floors
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-white/40 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                  </div>

                </div>

                {/* Floor slider */}

                <input
                  type="range"
                  min={1}
                  max={property.floors}
                  value={selectedFloor}
                  onChange={(event) =>
                    goToFloor(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="mt-4 w-full accent-cyan-300"
                />

                <div className="mt-2 flex justify-between text-[8px] text-white/20">
                  <span>Ground</span>
                  <span>
                    Level {property.floors}
                  </span>
                </div>

              </div>

              {/* ================================================= */}
              {/* UNITS */}
              {/* ================================================= */}

              <div className="mt-8">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                      Unit Registry
                    </p>

                    <h4 className="mt-1 text-sm font-semibold">
                      Floor {selectedFloor} Units
                    </h4>
                  </div>

                  <span className="text-[9px] text-white/25">
                    {selectedFloorUnits.length} units
                  </span>

                </div>

                <div className="mt-4 space-y-2">

                  {selectedFloorUnits.map(
                    (unit, index) => {
                      const active =
                        selectedUnit ===
                        unit.id;

                      return (
                        <motion.button
                          key={unit.id}
                          whileTap={{
                            scale: 0.99,
                          }}
                          onClick={() =>
                            setSelectedUnit(
                              active
                                ? null
                                : unit.id
                            )
                          }
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            active
                              ? "border-cyan-200/20 bg-cyan-300/[0.07]"
                              : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10] hover:bg-white/[0.035]"
                          }`}
                        >

                          <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                  active
                                    ? "bg-cyan-300/[0.10]"
                                    : "bg-white/[0.035]"
                                }`}
                              >
                                <DoorOpen
                                  className={`h-4 w-4 ${
                                    active
                                      ? "text-cyan-200"
                                      : "text-white/30"
                                  }`}
                                />
                              </div>

                              <div>
                                <p className="text-[10px] font-semibold">
                                  Unit{" "}
                                  {unit.id}
                                </p>

                                <p className="mt-1 text-[8px] text-white/25">
                                  {unit.type}
                                </p>
                              </div>

                            </div>

                            <ChevronRight
                              className={`h-4 w-4 transition ${
                                active
                                  ? "rotate-90 text-cyan-200"
                                  : "text-white/15"
                              }`}
                            />

                          </div>

                          <AnimatePresence>
                            {active && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  height: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                  height: "auto",
                                }}
                                exit={{
                                  opacity: 0,
                                  height: 0,
                                }}
                                className="overflow-hidden"
                              >

                                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3">

                                  <div>
                                    <p className="text-[8px] text-white/20">
                                      AREA
                                    </p>

                                    <p className="mt-1 text-[9px] text-white/60">
                                      {unit.area}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[8px] text-white/20">
                                      STATUS
                                    </p>

                                    <p className="mt-1 text-[9px] text-emerald-200/70">
                                      {unit.status}
                                    </p>
                                  </div>

                                  <div className="col-span-2">
                                    <p className="text-[8px] text-white/20">
                                      UNIT 3D ID
                                    </p>

                                    <p className="mt-1 font-mono text-[8px] text-cyan-100/50">
                                      DEMO-TN-CHN-P042-
                                      {property.id}-
                                      U{unit.id}
                                    </p>
                                  </div>

                                </div>

                              </motion.div>
                            )}
                          </AnimatePresence>

                        </motion.button>
                      );
                    }
                  )}

                </div>
              </div>

              {/* ================================================= */}
              {/* DEMO INTELLIGENCE */}
              {/* ================================================= */}

              <div className="mt-8 rounded-2xl border border-violet-300/10 bg-violet-300/[0.025] p-4">

                <div className="flex gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-300/[0.07]">
                    <Sparkles className="h-4 w-4 text-violet-200" />
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold text-violet-100/70">
                      Vertical Cadastre
                    </p>

                    <p className="mt-1 text-[9px] leading-5 text-white/35">
                      This prototype demonstrates how a
                      single spatial property identity can
                      connect the land parcel, building,
                      floors and individual vertical units.
                    </p>
                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* DISCLAIMER */}
              {/* ================================================= */}

              <div className="mt-6 flex items-start gap-2 border-t border-white/[0.06] pt-5">

                <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-white/20" />

                <p className="text-[8px] leading-4 text-white/20">
                  Prototype cadastral data · Not an
                  official land record. Unit and floor
                  information is demonstration data.
                </p>

              </div>

            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

      <div className="flex items-center gap-2">

        <Icon className="h-3.5 w-3.5 text-cyan-200/45" />

        <p className="text-[8px] uppercase tracking-[0.14em] text-white/25">
          {label}
        </p>

      </div>

      <p className="mt-2 text-[10px] font-medium text-white/70">
        {value}
      </p>

    </div>
  );
}
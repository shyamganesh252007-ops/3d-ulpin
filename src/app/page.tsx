"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Activity,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Database,
  Layers3,
  Map,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useState } from "react";

import CesiumMapWrapper from "./components/CesiumMapWrapper";
import VerticalPropertyExplorer from "./components/VerticalPropertyExplorer";

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

const defaultProperty: Property = {
  id: "B-102",
  name: "Property B-102",
  longitude: 80.211,
  latitude: 13.0833,
  width: 46,
  depth: 34,
  height: 55,
  floors: 10,
};

const modules = [
  {
    title: "3D Cadastral Map",
    description:
      "Explore parcels, buildings, floors and vertical property structures.",
    icon: Map,
    accent: "cyan",
  },
  {
    title: "AI Mapping",
    description:
      "Extract building footprints and spatial structures from imagery.",
    icon: ScanLine,
    accent: "blue",
  },
  {
    title: "Topology Validation",
    description:
      "Detect spatial overlaps, invalid boundaries and geometry conflicts.",
    icon: ShieldCheck,
    accent: "emerald",
  },
  {
    title: "Property Registry",
    description:
      "Manage 3D property identities, units and cadastral relationships.",
    icon: Database,
    accent: "violet",
  },
];

export default function Home() {
  const [selectedProperty, setSelectedProperty] =
    useState<Property>(defaultProperty);

  const [explorerOpen, setExplorerOpen] =
    useState(false);

  const [activeModule, setActiveModule] =
    useState("Dashboard");

  // ============================================================
  // MAP LAYER STATE
  // ============================================================

  const [parcelsVisible, setParcelsVisible] =
    useState(true);

  const [buildingsVisible, setBuildingsVisible] =
    useState(true);

  const [infrastructureVisible, setInfrastructureVisible] =
    useState(false);

  const navigation = [
    {
      label: "Dashboard",
      icon: Activity,
    },
    {
      label: "3D Map",
      icon: Map,
    },
    {
      label: "Properties",
      icon: Building2,
    },
    {
      label: "AI Mapping",
      icon: ScanLine,
    },
    {
      label: "Validation",
      icon: ShieldCheck,
    },
    {
      label: "Data Registry",
      icon: Database,
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05070b] text-white">
      {/* ======================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[20%] top-[-250px] h-[600px] w-[600px] rounded-full bg-cyan-400/[0.035] blur-[140px]" />

        <div className="absolute right-[-150px] top-[25%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.025] blur-[140px]" />

        <div className="absolute bottom-[-250px] left-[35%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.02] blur-[150px]" />
      </div>

      {/* ======================================================
          MAIN APPLICATION
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen">
        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[270px] border-r border-white/[0.06] bg-[#080b10]/75 backdrop-blur-2xl lg:block">
          <div className="flex h-full flex-col px-5 py-5">
            {/* Brand */}

            <div className="flex items-center gap-3 px-2">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-[15px] border border-cyan-200/15 bg-cyan-200/[0.045] shadow-[0_0_30px_rgba(90,220,255,.06)]">
                <Building2 className="h-5 w-5 text-cyan-200" />

                <div className="absolute -right-1 -top-1">
                  <Sparkles className="h-3 w-3 text-cyan-100/70" />
                </div>
              </div>

              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  3D ULPIN
                </h1>

                <p className="mt-0.5 text-[8px] uppercase tracking-[0.24em] text-white/25">
                  Spatial Intelligence
                </p>
              </div>
            </div>

            {/* Navigation */}

            <div className="mt-12 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                const active =
                  activeModule === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() =>
                      setActiveModule(item.label)
                    }
                    className={`group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
                      active
                        ? "border border-white/[0.08] bg-white/[0.065] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.04)]"
                        : "text-white/35 hover:bg-white/[0.035] hover:text-white/75"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(120,230,255,.8)]"
                      />
                    )}

                    <Icon
                      className={`h-4 w-4 transition ${
                        active
                          ? "text-cyan-200"
                          : "text-white/30 group-hover:text-white/60"
                      }`}
                    />

                    <span className="text-xs">
                      {item.label}
                    </span>

                    {active && (
                      <ArrowUpRight className="ml-auto h-3 w-3 text-white/25" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* System status */}

            <div className="mt-auto rounded-[25px] border border-white/[0.07] bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.025)]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                  System
                </span>

                <Sparkles className="h-3.5 w-3.5 text-cyan-200/60" />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(100,255,180,.7)]" />

                <span className="text-[10px] text-white/55">
                  Cadastral engine online
                </span>
              </div>

              <div className="mt-3 h-px bg-white/[0.05]" />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[8px] text-white/20">
                  Engine
                </span>

                <span className="font-mono text-[8px] text-cyan-200/45">
                  3D-SPATIAL
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <section className="min-w-0 flex-1 lg:ml-[270px]">
          {/* ==================================================
              TOP BAR
          ================================================== */}

          <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-[#05070b]/70 px-5 py-4 backdrop-blur-2xl md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[0.22em] text-white/25">
                  Cadastral Intelligence Platform
                </p>

                <p className="mt-1 text-[11px] text-white/45">
                  Urban spatial property management
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 md:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                  <span className="text-[8px] text-white/40">
                    Prototype environment
                  </span>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035]">
                  <Sparkles className="h-4 w-4 text-cyan-200/60" />
                </div>
              </div>
            </div>
          </header>

          {/* ==================================================
              PAGE CONTENT
          ================================================== */}

          <div className="px-4 pb-16 pt-6 md:px-8 lg:px-10">
            {/* =================================================
                HERO
            ================================================= */}

            <motion.section
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-white/[0.035] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] md:p-10"
            >
              <div className="pointer-events-none absolute right-[-100px] top-[-180px] h-[500px] w-[500px] rounded-full bg-cyan-300/[0.045] blur-[100px]" />

              <div className="pointer-events-none absolute bottom-[-180px] left-[30%] h-[400px] w-[400px] rounded-full bg-blue-500/[0.035] blur-[110px]" />

              <div className="relative z-10 max-w-[850px]">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/10 bg-cyan-200/[0.035] px-3 py-2">
                  <Sparkles className="h-3 w-3 text-cyan-200" />

                  <span className="text-[9px] uppercase tracking-[0.16em] text-cyan-100/60">
                    3D Property Intelligence Platform
                  </span>
                </div>

                <h2 className="mt-7 max-w-[850px] text-4xl font-semibold leading-[1.05] tracking-[-0.045em] md:text-6xl">
                  From 2D land parcels to{" "}
                  <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                    3D property intelligence.
                  </span>
                </h2>

                <p className="mt-6 max-w-[720px] text-sm leading-7 text-white/35 md:text-base">
                  Map land, buildings, floors, units and
                  underground infrastructure as connected
                  three-dimensional cadastral entities.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      document
                        .getElementById("3d-map")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        })
                    }
                    className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-200 to-blue-400 px-5 py-3 text-[10px] font-semibold text-[#031018] shadow-[0_10px_40px_rgba(80,210,255,.12)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_15px_50px_rgba(80,210,255,.2)]"
                  >
                    Open 3D Map

                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() =>
                      setActiveModule("AI Mapping")
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[10px] font-medium text-white/60 transition duration-300 hover:bg-white/[0.07] hover:text-white"
                  >
                    Start AI Mapping
                  </button>
                </div>
              </div>
            </motion.section>

            {/* =================================================
                METRICS
            ================================================= */}

            <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Mapped Parcels",
                  value: "12,482",
                  change: "+8.4%",
                  icon: Map,
                },
                {
                  label: "3D Buildings",
                  value: "3,241",
                  change: "+12.1%",
                  icon: Building2,
                },
                {
                  label: "Vertical Units",
                  value: "18,934",
                  change: "+6.7%",
                  icon: Layers3,
                },
                {
                  label: "Validated",
                  value: "96.8%",
                  change: "+2.3%",
                  icon: ShieldCheck,
                },
              ].map((metric, index) => {
                const Icon = metric.icon;

                return (
                  <motion.div
                    key={metric.label}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.1 + index * 0.06,
                      duration: 0.45,
                    }}
                    className="group relative overflow-hidden rounded-[25px] border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                        <Icon className="h-4 w-4 text-cyan-200/70" />
                      </div>

                      <span className="rounded-full bg-emerald-300/[0.07] px-2 py-1 text-[8px] text-emerald-300">
                        {metric.change}
                      </span>
                    </div>

                    <p className="mt-6 text-[9px] text-white/30">
                      {metric.label}
                    </p>

                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                      {metric.value}
                    </p>
                  </motion.div>
                );
              })}
            </section>

            {/* =================================================
                MAP + PROPERTY PANEL
            ================================================= */}

            <section
              id="3d-map"
              className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]"
            >
              {/* MAP */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.25,
                  duration: 0.55,
                }}
                className="relative h-[650px] overflow-hidden rounded-[32px] border border-white/[0.09] bg-[#070a0f] shadow-[inset_0_1px_0_rgba(255,255,255,.035)]"
              >
                <div className="absolute left-6 top-6 z-20 rounded-full border border-white/[0.1] bg-black/25 px-4 py-2 backdrop-blur-xl">
                  <span className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                    Demo Region · Chennai
                  </span>
                </div>

                {/* Map zoom controls */}

                <div className="absolute right-5 top-5 z-20 flex flex-col gap-2">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-white/60 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white"
                    aria-label="Zoom in"
                  >
                    +
                  </button>

                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-white/60 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white"
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                </div>

                {/* =================================================
                    ACTUAL CESIUM MAP
                ================================================= */}

                <div className="absolute inset-0">
                  <CesiumMapWrapper
                    onPropertySelect={(
                      property: Property
                    ) => {
                      setSelectedProperty(property);
                    }}
                    parcelsVisible={
                      parcelsVisible
                    }
                    buildingsVisible={
                      buildingsVisible
                    }
                    infrastructureVisible={
                      infrastructureVisible
                    }
                  />
                </div>

                {/* =================================================
                    MAP LAYER CONTROLS
                ================================================= */}

                <div className="absolute bottom-5 left-5 z-20 flex gap-2">
                  {/* PARCELS */}

                  <button
                    onClick={() =>
                      setParcelsVisible(
                        (visible) => !visible
                      )
                    }
                    className={`rounded-xl border px-4 py-2 text-[9px] backdrop-blur-xl transition ${
                      parcelsVisible
                        ? "border-cyan-200/20 bg-cyan-200/[0.12] text-cyan-100 shadow-[0_0_20px_rgba(90,220,255,.08)]"
                        : "border-white/10 bg-black/25 text-white/35 hover:bg-white/[0.07] hover:text-white/70"
                    }`}
                  >
                    Parcels
                  </button>

                  {/* BUILDINGS */}

                  <button
                    onClick={() =>
                      setBuildingsVisible(
                        (visible) => !visible
                      )
                    }
                    className={`rounded-xl border px-4 py-2 text-[9px] backdrop-blur-xl transition ${
                      buildingsVisible
                        ? "border-blue-200/20 bg-blue-200/[0.12] text-blue-100 shadow-[0_0_20px_rgba(80,140,255,.08)]"
                        : "border-white/10 bg-black/25 text-white/35 hover:bg-white/[0.07] hover:text-white/70"
                    }`}
                  >
                    Buildings
                  </button>

                  {/* INFRASTRUCTURE */}

                  <button
                    onClick={() =>
                      setInfrastructureVisible(
                        (visible) => !visible
                      )
                    }
                    className={`rounded-xl border px-4 py-2 text-[9px] backdrop-blur-xl transition ${
                      infrastructureVisible
                        ? "border-violet-200/20 bg-violet-200/[0.12] text-violet-100 shadow-[0_0_20px_rgba(150,100,255,.08)]"
                        : "border-white/10 bg-black/25 text-white/35 hover:bg-white/[0.07] hover:text-white/70"
                    }`}
                  >
                    Infrastructure
                  </button>
                </div>

                {/* ENGINE STATUS */}

                <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-xl">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />

                  <span className="text-[8px] text-white/40">
                    3D ENGINE ACTIVE
                  </span>
                </div>
              </motion.div>

              {/* =================================================
                  PROPERTY PANEL
              ================================================= */}

              <motion.aside
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.55,
                }}
                className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-white/[0.025] p-7"
              >
                <div className="absolute right-[-80px] top-[-80px] h-[250px] w-[250px] rounded-full bg-cyan-300/[0.025] blur-[70px]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                        Selected Property
                      </p>

                      <h3 className="mt-3 text-xl font-semibold tracking-tight">
                        {selectedProperty.name}
                      </h3>
                    </div>

                    <span className="flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-300/[0.05] px-3 py-1.5 text-[8px] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      Verified
                    </span>
                  </div>

                  <div className="mt-8">
                    {[
                      {
                        label: "3D ULPIN",
                        value: `DEMO-TN-CHN-P042-${selectedProperty.id}`,
                      },
                      {
                        label: "Property Type",
                        value: "Residential",
                      },
                      {
                        label: "Floors",
                        value: String(
                          selectedProperty.floors
                        ),
                      },
                      {
                        label: "Units",
                        value: "40",
                      },
                      {
                        label: "Land Area",
                        value: "2,400 m²",
                      },
                      {
                        label: "Building Height",
                        value: `${selectedProperty.height} m`,
                      },
                      {
                        label: "Coordinates",
                        value: `${selectedProperty.latitude.toFixed(
                          5
                        )}, ${selectedProperty.longitude.toFixed(
                          5
                        )}`,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between border-b border-white/[0.055] py-4"
                      >
                        <span className="text-[9px] text-white/30">
                          {item.label}
                        </span>

                        <span className="max-w-[180px] truncate text-right text-[9px] text-white/65">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Explore button */}

                  <button
                    onClick={() =>
                      setExplorerOpen(true)
                    }
                    className="group mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-200 to-blue-400 py-3.5 text-[10px] font-semibold text-[#031018] shadow-[0_10px_40px_rgba(80,210,255,.08)] transition duration-300 hover:scale-[1.015] hover:shadow-[0_15px_50px_rgba(80,210,255,.18)]"
                  >
                    Explore Property

                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <p className="mt-5 text-center text-[8px] leading-4 text-white/20">
                    Prototype cadastral data · Not an
                    official land record
                  </p>
                </div>
              </motion.aside>
            </section>

            {/* =================================================
                PLATFORM MODULES
            ================================================= */}

            <section className="mt-12">
              <div className="mb-5">
                <p className="text-[9px] uppercase tracking-[0.22em] text-cyan-200/40">
                  Platform Modules
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                  Cadastral intelligence tools
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {modules.map((module, index) => {
                  const Icon = module.icon;

                  return (
                    <motion.button
                      key={module.title}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      onClick={() =>
                        setActiveModule(
                          module.title
                        )
                      }
                      whileHover={{
                        y: -4,
                      }}
                      className="group rounded-[25px] border border-white/[0.08] bg-white/[0.025] p-6 text-left transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] transition duration-300 group-hover:border-cyan-200/15 group-hover:bg-cyan-200/[0.05]">
                        <Icon className="h-5 w-5 text-cyan-200/70" />
                      </div>

                      <h4 className="mt-7 text-sm font-semibold">
                        {module.title}
                      </h4>

                      <p className="mt-2 text-[10px] leading-5 text-white/30">
                        {module.description}
                      </p>

                      <div className="mt-6 flex items-center gap-1 text-[9px] text-white/25 transition group-hover:text-cyan-200/60">
                        Open module

                        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* =================================================
                DATA FLOW
            ================================================= */}

            <section className="mt-12 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.02] p-7 md:p-9">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-cyan-200/40">
                    Spatial Intelligence Pipeline
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    From spatial data to property identity
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-[9px] text-white/25">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Prototype workflow
                </div>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-5">
                {[
                  "Drone / LiDAR",
                  "AI Extraction",
                  "3D Geometry",
                  "Topology Validation",
                  "3D ULPIN",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-cyan-200/50">
                        0{index + 1}
                      </span>

                      {index < 4 && (
                        <ChevronRight className="hidden h-3 w-3 text-white/15 md:block" />
                      )}
                    </div>

                    <p className="mt-5 text-[10px] font-medium text-white/60">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="mt-12 border-t border-white/[0.06] py-7">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="text-[8px] text-white/20">
                  3D ULPIN · Spatial Intelligence Prototype
                </p>

                <p className="text-[8px] text-white/15">
                  Smart India Hackathon 2026 · Demo environment
                </p>
              </div>
            </footer>
          </div>
        </section>
      </div>

      {/* ======================================================
          VERTICAL PROPERTY EXPLORER
      ====================================================== */}

      <AnimatePresence>
        {explorerOpen && (
          <VerticalPropertyExplorer
            property={selectedProperty}
            onClose={() =>
              setExplorerOpen(false)
            }
          />
        )}
      </AnimatePresence>
    </main>
  );
}
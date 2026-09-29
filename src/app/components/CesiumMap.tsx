"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArcType,
  Cartesian2,
  Cartesian3,
  Color,
  createOsmBuildingsAsync,
  Entity,
  HeightReference,
  Ion,
  LabelStyle,
  Math as CesiumMath,
  OpenStreetMapImageryProvider,
  ShadowMode,
  Terrain,
  VerticalOrigin,
  Viewer,
} from "cesium";

import "cesium/Build/Cesium/Widgets/widgets.css";

// ============================================================
// TYPES
// ============================================================

type DemoProperty = {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  width: number;
  depth: number;
  height: number;
  floors: number;
};

type CesiumMapProps = {
  onPropertySelect?: (property: DemoProperty) => void;

  parcelsVisible?: boolean;
  buildingsVisible?: boolean;
  infrastructureVisible?: boolean;
};

// ============================================================
// DEMO PROPERTIES
// ============================================================
//
// These are PROTOTYPE cadastral properties.
//
// They are deliberately kept compact so they visually sit
// alongside the surrounding real-world OSM buildings.
//
// B-102 is the primary highlighted property.
//

const properties: DemoProperty[] = [
  {
    id: "B-101",
    name: "Property B-101",

    longitude: 80.21055,
    latitude: 13.08375,

    width: 20,
    depth: 16,
    height: 32,

    floors: 7,
  },

  {
    id: "B-102",
    name: "Property B-102",

    longitude: 80.21115,
    latitude: 13.08378,

    // Smaller footprint so it sits naturally
    // among the surrounding OSM buildings.
    width: 22,
    depth: 18,

    // 10-floor demo building.
    height: 44,

    floors: 10,
  },

  {
    id: "B-103",
    name: "Property B-103",

    longitude: 80.21205,
    latitude: 13.08295,

    width: 19,
    depth: 15,
    height: 28,

    floors: 6,
  },
];

// ============================================================
// PRIMARY DEMO LOCATION
// ============================================================

const CHENNAI_ANCHOR = {
  longitude: 80.21115,
  latitude: 13.08378,
};

// ============================================================
// COMPONENT
// ============================================================

export default function CesiumMap({
  onPropertySelect,

  parcelsVisible = true,
  buildingsVisible = true,
  infrastructureVisible = false,
}: CesiumMapProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const viewerRef =
    useRef<Viewer | null>(null);

  const osmBuildingsRef =
    useRef<any>(null);

  const propertyEntitiesRef =
    useRef<Entity[]>([]);

  const parcelEntitiesRef =
    useRef<Entity[]>([]);

  const infrastructureEntitiesRef =
    useRef<Entity[]>([]);

  // ----------------------------------------------------------
  // Keep callback in a ref.
  //
  // This prevents Cesium from reinitializing whenever
  // React creates a new callback function.
  // ----------------------------------------------------------

  const onPropertySelectRef =
    useRef(onPropertySelect);

  useEffect(() => {
    onPropertySelectRef.current =
      onPropertySelect;
  }, [onPropertySelect]);

  const [ready, setReady] =
    useState(false);

  // ==========================================================
  // VISIBILITY CONTROLS
  // ==========================================================

  useEffect(() => {
    for (const entity of propertyEntitiesRef.current) {
      entity.show = buildingsVisible;
    }
  }, [buildingsVisible]);

  useEffect(() => {
    for (const entity of parcelEntitiesRef.current) {
      entity.show = parcelsVisible;
    }
  }, [parcelsVisible]);

  useEffect(() => {
    if (osmBuildingsRef.current) {
      osmBuildingsRef.current.show =
        buildingsVisible;
    }
  }, [buildingsVisible]);

  useEffect(() => {
    for (const entity of infrastructureEntitiesRef.current) {
      entity.show = infrastructureVisible;
    }
  }, [infrastructureVisible]);

  // ==========================================================
  // CESIUM INITIALIZATION
  // ==========================================================

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let cancelled = false;

    async function initializeCesium() {
      try {
        // ------------------------------------------------------
        // CESIUM STATIC ASSET LOCATION
        // ------------------------------------------------------

        (
          globalThis as typeof globalThis & {
            CESIUM_BASE_URL?: string;
          }
        ).CESIUM_BASE_URL = "/cesium";

        // ------------------------------------------------------
        // CESIUM ION TOKEN
        // ------------------------------------------------------

        const cesiumIonToken =
          process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;

        if (cesiumIonToken) {
          Ion.defaultAccessToken =
            cesiumIonToken;
        } else {
          console.warn(
            "NEXT_PUBLIC_CESIUM_ION_TOKEN is missing. " +
              "OSM 3D Buildings and World Terrain may not load."
          );
        }

        // ------------------------------------------------------
        // CREATE CESIUM VIEWER
        // ------------------------------------------------------

        const viewer = new Viewer(
          containerRef.current !,
          {
            animation: false,
            timeline: false,

            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            fullscreenButton: false,

            infoBox: false,
            selectionIndicator: false,

            // We add OSM imagery manually.
            baseLayer: false,

            // Real-world terrain when Cesium Ion
            // authentication is available.
            terrain: cesiumIonToken
              ? Terrain.fromWorldTerrain()
              : undefined,
          }
        );

        // ------------------------------------------------------
        // CANCELLED INITIALIZATION
        // ------------------------------------------------------

        if (cancelled) {
          if (!viewer.isDestroyed()) {
            viewer.destroy();
          }

          return;
        }

        viewerRef.current = viewer;

        // ======================================================
        // OPENSTREETMAP BASE MAP
        // ======================================================

        const osmProvider =
          new OpenStreetMapImageryProvider({
            url:
              "https://tile.openstreetmap.org/",
          });

        viewer.imageryLayers.addImageryProvider(
          osmProvider
        );

        // ======================================================
        // VISUAL SETTINGS
        // ======================================================

        // Lighting gives the buildings stronger depth.
        viewer.scene.globe.enableLighting = true;

        // Prevent objects from visually passing
        // through terrain.
        viewer.scene.globe.depthTestAgainstTerrain =
          true;

        // Fog makes the distant city feel more natural.
        viewer.scene.fog.enabled = true;
        viewer.scene.fog.density = 0.000045;

        viewer.scene.backgroundColor =
          Color.fromCssColorString("#05070B");

        // Slight vertical exaggeration makes the
        // real OSM buildings easier to read.
        //
        // This does NOT move our cadastral buildings.
        viewer.scene.verticalExaggeration = 1.35;

        viewer.scene.verticalExaggerationRelativeHeight = 0;

        viewer.scene.screenSpaceCameraController
          .enableCollisionDetection = true;

        // ======================================================
        // REAL OSM 3D BUILDINGS
        // ======================================================
        //
        // IMPORTANT:
        //
        // We do NOT translate, rotate or manually position
        // this tileset.
        //
        // It is already globally georeferenced.
        //
        // ======================================================

        if (cesiumIonToken) {
          try {
            const osmBuildings =
              await createOsmBuildingsAsync();

            if (!cancelled) {
              osmBuildingsRef.current =
                osmBuildings;

              osmBuildings.show =
                buildingsVisible;

              osmBuildings.shadows =
                ShadowMode.ENABLED;

              viewer.scene.primitives.add(
                osmBuildings
              );
            }
          } catch (error) {
            console.error(
              "Failed to load OSM 3D Buildings:",
              error
            );
          }
        }

        if (cancelled) {
          return;
        }

        // ======================================================
        // DEMO CADASTRAL BUILDINGS
        // ======================================================

        const buildingEntities: Entity[] = [];

        for (const property of properties) {
          // ----------------------------------------------------
          // IMPORTANT GROUNDING LOGIC
          // ----------------------------------------------------
          //
          // A Cesium Box is centered on its Entity position.
          //
          // Therefore:
          //
          // 44m building
          //      ↓
          // center = 22m
          //
          // This puts:
          //
          // bottom = 0m
          // top    = 44m
          //
          // RELATIVE_TO_GROUND makes that 0m reference
          // follow the actual terrain.
          // ----------------------------------------------------

          const centerHeight =
            property.height / 2;

          const entity =
            viewer.entities.add({
              id: property.id,

              name: property.name,

              // IMPORTANT:
              // No orientation/quaternion.
              //
              // This keeps the building perfectly upright.
              position:
                Cartesian3.fromDegrees(
                  property.longitude,
                  property.latitude,
                  centerHeight
                ),

              box: {
                dimensions:
                  new Cartesian3(
                    property.width,
                    property.depth,
                    property.height
                  ),

                // B-102 is highlighted cyan.
                // Other properties use blue.
                material:
                  property.id === "B-102"
                    ? Color.fromCssColorString(
                        "#70E7FF"
                      ).withAlpha(0.68)
                    : Color.fromCssColorString(
                        "#5C8DFF"
                      ).withAlpha(0.58),

                outline: true,

                outlineColor:
                  Color.fromCssColorString(
                    "#D5FAFF"
                  ).withAlpha(0.95),

                outlineWidth: 2,

                // THIS IS THE IMPORTANT FIX.
                //
                // The building is positioned relative
                // to the actual ground/terrain.
                heightReference:
                  HeightReference.RELATIVE_TO_GROUND,

                shadows:
                  ShadowMode.ENABLED,
              },

              // =================================================
              // PROPERTY LABEL
              // =================================================

              label: {
                text:
                  `${property.id}\n` +
                  `${property.floors} FLOORS`,

                font:
                  "600 13px Inter, Arial",

                fillColor:
                  Color.WHITE,

                outlineColor:
                  Color.BLACK,

                outlineWidth: 4,

                style:
                  LabelStyle.FILL_AND_OUTLINE,

                verticalOrigin:
                  VerticalOrigin.BOTTOM,

                pixelOffset:
                  new Cartesian2(
                    0,
                    -8
                  ),

                showBackground: true,

                backgroundColor:
                  Color.fromCssColorString(
                    "#071018"
                  ).withAlpha(0.86),

                backgroundPadding:
                  new Cartesian2(
                    8,
                    5
                  ),

                heightReference:
                  HeightReference.RELATIVE_TO_GROUND,

                // Keep labels readable.
                disableDepthTestDistance:
                  250,
              },
            });

          // ====================================================
          // METADATA
          // ====================================================

          

          buildingEntities.push(
            entity
          );
        }

        propertyEntitiesRef.current =
          buildingEntities;

        // ======================================================
        // PARCEL BOUNDARIES
        // ======================================================

        const parcelEntities: Entity[] = [];

        for (const property of properties) {
          const halfWidth =
            property.width / 2;

          const halfDepth =
            property.depth / 2;

          // Approximate metres → degrees.
          //
          // Good enough for this prototype's
          // small cadastral parcels.

          const longitudeMeters =
            halfWidth /
            (
              111000 *
              Math.cos(
                CesiumMath.toRadians(
                  property.latitude
                )
              )
            );

          const latitudeMeters =
            halfDepth / 111000;

          const parcel =
            viewer.entities.add({
              id:
                `PARCEL-${property.id}`,

              name:
                `${property.name} Parcel`,

              polygon: {
                hierarchy: [
                  Cartesian3.fromDegrees(
                    property.longitude -
                      longitudeMeters,

                    property.latitude -
                      latitudeMeters,

                    0
                  ),

                  Cartesian3.fromDegrees(
                    property.longitude +
                      longitudeMeters,

                    property.latitude -
                      latitudeMeters,

                    0
                  ),

                  Cartesian3.fromDegrees(
                    property.longitude +
                      longitudeMeters,

                    property.latitude +
                      latitudeMeters,

                    0
                  ),

                  Cartesian3.fromDegrees(
                    property.longitude -
                      longitudeMeters,

                    property.latitude +
                      latitudeMeters,

                    0
                  ),
                ],

                material:
                  Color.fromCssColorString(
                    "#52D8FF"
                  ).withAlpha(0.045),

                outline: true,

                outlineColor:
                  Color.fromCssColorString(
                    "#6CEBFF"
                  ).withAlpha(0.5),

                height: 0,

                heightReference:
                  HeightReference.CLAMP_TO_GROUND,
              },
            });

          parcel.show =
            parcelsVisible;

          parcelEntities.push(
            parcel
          );
        }

        parcelEntitiesRef.current =
          parcelEntities;

        // ======================================================
        // UNDERGROUND INFRASTRUCTURE
        // ======================================================

        const infrastructureEntities:
          Entity[] = [];

        const utilityHeight = -8;

        const utilityPositions = [
          Cartesian3.fromDegrees(
            80.2055,
            13.0798,
            utilityHeight
          ),

          Cartesian3.fromDegrees(
            80.2080,
            13.0805,
            utilityHeight
          ),

          Cartesian3.fromDegrees(
            80.2110,
            13.0833,
            utilityHeight
          ),

          Cartesian3.fromDegrees(
            80.2140,
            13.0840,
            utilityHeight
          ),

          Cartesian3.fromDegrees(
            80.2170,
            13.0848,
            utilityHeight
          ),
        ];

        const utilityCorridor =
          viewer.entities.add({
            id:
              "UNDERGROUND-UTILITY-CORRIDOR",

            name:
              "Underground Utility Corridor",

            polyline: {
              positions:
                utilityPositions,

              width: 4,

              material:
                Color.fromCssColorString(
                  "#62E9FF"
                ).withAlpha(0.75),

              clampToGround: false,

              arcType:
                ArcType.GEODESIC,
            },
          });

        utilityCorridor.show =
          infrastructureVisible;

        infrastructureEntities.push(
          utilityCorridor
        );

        // ======================================================
        // SECOND UTILITY NETWORK
        // ======================================================

        const secondaryUtility =
          viewer.entities.add({
            id:
              "UNDERGROUND-UTILITY-BRANCH",

            name:
              "Underground Utility Branch",

            polyline: {
              positions: [
                Cartesian3.fromDegrees(
                  80.2085,
                  13.0845,
                  -8
                ),

                Cartesian3.fromDegrees(
                  80.2110,
                  13.0833,
                  -8
                ),

                Cartesian3.fromDegrees(
                  80.2115,
                  13.0805,
                  -8
                ),
              ],

              width: 3,

              material:
                Color.fromCssColorString(
                  "#B98CFF"
                ).withAlpha(0.65),

              clampToGround: false,

              arcType:
                ArcType.GEODESIC,
            },
          });

        secondaryUtility.show =
          infrastructureVisible;

        infrastructureEntities.push(
          secondaryUtility
        );

        infrastructureEntitiesRef.current =
          infrastructureEntities;

        // ======================================================
        // CHENNAI CAMERA
        // ======================================================

        await viewer.camera.flyTo({
          destination:
            Cartesian3.fromDegrees(
              CHENNAI_ANCHOR.longitude,
              CHENNAI_ANCHOR.latitude,
              900
            ),

          orientation: {
            heading:
              CesiumMath.toRadians(0),

            pitch:
              CesiumMath.toRadians(-48),

            roll: 0,
          },

          duration: 2.2,
        });

        // ======================================================
        // PROPERTY SELECTION
        // ======================================================

        viewer.screenSpaceEventHandler.setInputAction(
          (movement: any) => {
            const picked =
              viewer.scene.pick(
                movement.position
              );

            if (
              !picked ||
              !picked.id
            ) {
              return;
            }

            const entity =
              picked.id as Entity;

            const selectedProperty =
              properties.find(
                (property) =>
                  property.id ===
                  entity.id
              );

            // Ignore OSM buildings,
            // parcels and infrastructure.

            if (!selectedProperty) {
              return;
            }

            // --------------------------------------------------
            // CAMERA TO PROPERTY
            // --------------------------------------------------

            viewer.flyTo(entity, {
              duration: 1.4,

              offset: {
                heading:
                  CesiumMath.toRadians(
                    25
                  ),

                pitch:
                  CesiumMath.toRadians(
                    -30
                  ),

                range: 220,
              },
            });

            // --------------------------------------------------
            // DASHBOARD SELECTION
            // --------------------------------------------------

            onPropertySelectRef.current?.(
              selectedProperty
            );
          },
          0
        );

        // ======================================================
        // READY
        // ======================================================

        if (!cancelled) {
          setReady(true);
        }
      } catch (error) {
        console.error(
          "Cesium initialization failed:",
          error
        );
      }
    }

    initializeCesium();

    // ==========================================================
    // CLEANUP
    // ==========================================================

    return () => {
      cancelled = true;

      if (
        viewerRef.current &&
        !viewerRef.current.isDestroyed()
      ) {
        viewerRef.current.destroy();
      }

      viewerRef.current = null;

      osmBuildingsRef.current = null;

      propertyEntitiesRef.current = [];

      parcelEntitiesRef.current = [];

      infrastructureEntitiesRef.current = [];

      setReady(false);
    };
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="absolute inset-0">

      <div
        ref={containerRef}
        className="absolute inset-0"
      />

      {!ready && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05070b]/70 backdrop-blur-sm">

          <div className="liquid-glass rounded-2xl px-5 py-4">

            <div className="flex items-center gap-3">

              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />

              <span className="text-xs text-white/60">
                Initializing Chennai spatial engine...
              </span>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
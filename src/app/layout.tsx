import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D ULPIN — Spatial Intelligence",
  description:
    "AI-assisted 3D cadastral and vertical property mapping platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.CESIUM_BASE_URL = "/cesium";
            `,
          }}
        />
      </body>
    </html>
  );
}
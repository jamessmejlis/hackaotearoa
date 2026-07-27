import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "HackAotearoa — the co-working community for NZ startup builders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirrors the hero band: wordmark with the accent asterisk, on ink.
export default async function OpengraphImage() {
  const archivoBlack = await readFile(
    join(process.cwd(), "assets/ArchivoBlack-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#1A1B17",
          color: "#F4F4EE",
          fontFamily: "Archivo Black",
          padding: "0 88px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 116,
            letterSpacing: "-0.032em",
            lineHeight: 1,
          }}
        >
          <span>HackAotearoa</span>
          <span style={{ color: "#D8F24B" }}>*</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 44,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            marginTop: 28,
          }}
        >
          The co-working community for NZ startup builders.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.14em",
            color: "#B9BCA9",
            marginTop: 40,
          }}
        >
          EST. MARCH 2026 · AUCKLAND
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Archivo Black",
          data: archivoBlack,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// "HA*" — asterisk in accent on ink.
export default async function Icon() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1B17",
          color: "#F4F4EE",
          fontFamily: "Archivo Black",
          fontSize: 30,
          letterSpacing: "-0.04em",
        }}
      >
        <span>HA</span>
        <span style={{ color: "#D8F24B" }}>*</span>
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

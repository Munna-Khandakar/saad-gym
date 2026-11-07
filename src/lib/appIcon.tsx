import { ImageResponse } from "next/og";

/** Manifest icon sizes, served by `app/icon.tsx` at /icon/192 and /icon/512. */
export const ICON_SIZES = [192, 512] as const;

const BACKGROUND = "#09090B";
const LIME = "#A3E635";

/**
 * The app icon: a lime dumbbell on the app background. Drawn full-bleed with
 * the mark inside the central safe zone, so it also works as a maskable icon.
 */
export function renderAppIcon(size: number): ImageResponse {
  const u = size / 100;
  const plate = (height: number, width = 9) => (
    <div style={{ width: width * u, height: height * u, borderRadius: 2.5 * u, background: LIME }} />
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
          gap: 1.5 * u,
          background: BACKGROUND,
        }}
      >
        {plate(36)}
        {plate(26)}
        <div style={{ width: 22 * u, height: 6 * u, borderRadius: 3 * u, background: LIME }} />
        {plate(26)}
        {plate(36)}
      </div>
    ),
    { width: size, height: size },
  );
}

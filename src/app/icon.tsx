import { ICON_SIZES, renderAppIcon } from "@/lib/appIcon";

export function generateImageMetadata() {
  return ICON_SIZES.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id);
  return renderAppIcon(ICON_SIZES.find((s) => s === size) ?? ICON_SIZES[0]);
}

"use client";
// react-bits FluidGlass requires user-provided 3D assets (lens.glb,
// arrow.glb, bar.glb) at `/assets/3d/*.glb` that are NOT shipped with
// the registry. Original component reference at
// https://reactbits.dev/components/FluidGlass - copy it back into this
// file and drop the .glb files under `public/assets/3d/` when needed.
// For now this is a no-op render so the registry test page stays green.
export function FluidGlass(_props: { className?: string }) {
  return null;
}
export default FluidGlass;

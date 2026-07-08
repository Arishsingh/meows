"use client";
// MagicUI FileTree requires shadcn primitives (`@/components/ui/scroll-area`,
// `@radix-ui/react-accordion`) that are NOT in the starter scaffold. Adding
// them would bloat every generated project; instead this is a no-op stub.
// To use FileTree in a generated project, install the missing primitives via
// `npx shadcn@latest add scroll-area accordion` and re-pull the original
// component from https://magicui.design/docs/components/file-tree.
import type { ReactNode } from "react";
export function Tree(_props: { children?: ReactNode; className?: string }) {
  return null;
}
export function Folder(_props: { children?: ReactNode; className?: string; element?: string; value?: string }) {
  return null;
}
export function File(_props: { children?: ReactNode; className?: string; value?: string }) {
  return null;
}
export default Tree;

"use client";

import { useEffect } from "react";

export default function BubbleCursor() {
  useEffect(() => {
    let instance: { destroy?: () => void } | null = null;

    import("cursor-effects").then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instance = new (mod.bubbleCursor as any)();
    });

    return () => {
      instance?.destroy?.();
    };
  }, []);

  return null;
}

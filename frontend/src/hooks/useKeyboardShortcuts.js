import { useEffect } from "react";

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handler = (event) => {
      shortcuts.forEach(({ key, metaKey, ctrlKey, shiftKey, callback }) => {
        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          Boolean(event.metaKey) === Boolean(metaKey) &&
          Boolean(event.ctrlKey) === Boolean(ctrlKey) &&
          Boolean(event.shiftKey) === Boolean(shiftKey)
        ) {
          event.preventDefault();
          callback(event);
        }
      });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}


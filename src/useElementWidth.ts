import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export function useElementWidth<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setWidth(element.getBoundingClientRect().width);
    };

    updateWidth();

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      const boxSize = Array.isArray(entry.borderBoxSize)
        ? entry.borderBoxSize[0]
        : entry.borderBoxSize;

      setWidth(boxSize?.inlineSize ?? entry.contentRect.width);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return width;
}

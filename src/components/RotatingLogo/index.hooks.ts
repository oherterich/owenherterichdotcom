import { RefObject, useRef } from "react";

const MAX_ROTATE_DEG = 15;
const MAX_DISTANCE = 800;
const TRANSLATION_FACTOR = 0.05;
const INNER_LIGHT_FACTOR = 20;

interface IUseLogoAnimation {
  containerRef: RefObject<HTMLDivElement | null>;
  logoRef: RefObject<HTMLButtonElement | null>;
  onMouseMove: (lastMousePos: { x: number; y: number }) => void;
}

export const useLogoAnimation = (): IUseLogoAnimation => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number | null>(null);

  const applyTransforms = (normalized: { x: number; y: number }) => {
    if (!containerRef.current) return;

    // Rotation (inverted Y for natural feel)
    const rotateX = -normalized.y * MAX_ROTATE_DEG;
    const rotateY = normalized.x * MAX_ROTATE_DEG;

    // Translation (component follows input slightly)
    const translateX = normalized.x * MAX_DISTANCE * TRANSLATION_FACTOR;
    const translateY = normalized.y * MAX_DISTANCE * TRANSLATION_FACTOR;

    // Drop shadow (follows rotation)
    const shadowX = -normalized.x * MAX_ROTATE_DEG;
    const shadowY = -normalized.y * MAX_ROTATE_DEG;

    // Inner light gradient movement
    const innerX = normalized.x * INNER_LIGHT_FACTOR;
    const innerY = -normalized.y * INNER_LIGHT_FACTOR;

    // Apply CSS variables directly to container element
    const el = containerRef.current;
    el.style.setProperty("--rotate-x", `${rotateX}deg`);
    el.style.setProperty("--rotate-y", `${rotateY}deg`);
    el.style.setProperty("--translate-x", `${translateX}px`);
    el.style.setProperty("--translate-y", `${translateY}px`);
    el.style.setProperty("--ds-x", `${shadowX}px`);
    el.style.setProperty("--ds-y", `${shadowY}px`);
    el.style.setProperty("--inner-x", `${innerX}px`);
    el.style.setProperty("--inner-y", `${-innerY}px`);
  };

  const updateFromMouse = (lastMousePos: { x: number; y: number }) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Mouse position relative to center
    const offsetX = lastMousePos.x - centerX;
    const offsetY = lastMousePos.y - centerY;

    const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);
    const circleSize = logoRef.current?.offsetWidth || 1;
    const radius = circleSize / 2;

    if (distance < radius) {
      applyTransforms({ x: 0, y: 0 });
    } else {
      // Normalized values for rotation
      const normalizedX = offsetX / MAX_DISTANCE;
      const normalizedY = offsetY / MAX_DISTANCE;

      applyTransforms({ x: normalizedX, y: normalizedY });
    }
    rafRef.current = null;
  };

  const onMouseMove = (lastMousePos: { x: number; y: number }) => {
    // Throttle using requestAnimationFrame
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() =>
        updateFromMouse(lastMousePos),
      );
    }
  };

  return {
    containerRef,
    logoRef,
    onMouseMove,
  };
};

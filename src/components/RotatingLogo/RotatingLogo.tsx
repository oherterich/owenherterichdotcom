"use client";

import { useEffect, useRef } from "react";
import styles from "./RotatingLogo.module.scss";
import TextRing from "@/components/TextRing/TextRing";

const MAX_ROTATE_DEG = 30;
const MAX_DISTANCE = 800;
const TRANSLATION_FACTOR = 0.05;
const INNER_LIGHT_FACTOR = 20;

const RotatingLogo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleThemeToggle = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    root.setAttribute(
      "data-theme",
      currentTheme === "inverted" ? "" : "inverted",
    );
  };

  useEffect(() => {
    let lastMousePos = { x: 0, y: 0 };

    const applyTransforms = (normalizedX: number, normalizedY: number) => {
      if (!containerRef.current) return;

      // Rotation (inverted Y for natural feel)
      const rotateX = -normalizedY * MAX_ROTATE_DEG;
      const rotateY = normalizedX * MAX_ROTATE_DEG;

      // Translation (component follows input slightly)
      const translateX = normalizedX * MAX_DISTANCE * TRANSLATION_FACTOR;
      const translateY = normalizedY * MAX_DISTANCE * TRANSLATION_FACTOR;

      // Drop shadow (follows rotation)
      const shadowX = -normalizedX * MAX_ROTATE_DEG;
      const shadowY = -normalizedY * MAX_ROTATE_DEG;

      // Inner light gradient movement
      const innerX = normalizedX * INNER_LIGHT_FACTOR;
      const innerY = -normalizedY * INNER_LIGHT_FACTOR;

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

    const updateFromMouse = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Mouse position relative to center
      const offsetX = lastMousePos.x - centerX;
      const offsetY = lastMousePos.y - centerY;

      const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);
      const circleSize = containerRef.current?.offsetWidth || 1;
      const radius = circleSize / 2;

      if (distance < radius) {
        applyTransforms(0, 0);
      } else {
        // Normalized values for rotation
        const normalizedX = offsetX / MAX_DISTANCE;
        const normalizedY = offsetY / MAX_DISTANCE;

        applyTransforms(normalizedX, normalizedY);
      }
      rafRef.current = null;
    };

    const handleMouseMove = (evt: MouseEvent) => {
      lastMousePos = { x: evt.clientX, y: evt.clientY };

      // Throttle using requestAnimationFrame
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateFromMouse);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onClick={handleThemeToggle}
    >
      <div className={styles.sphere} aria-hidden="true">
        <div className={styles.inner} />
        <div className={styles.text}>
          OH
          <span className={styles.exclamation}>!</span>
        </div>
      </div>
      <div className={styles.srInfo}>
        <h1>Owen Herterich</h1>
        <a tabIndex={-1} href="mailto:hi@owenherterich.com">
          hi@owenherterich.com
        </a>
      </div>
      <TextRing
        text="hi@owenherterich.com ★ hi@owenherterich.com ★ "
        fontSize={3}
        characterWidth={2.5}
        rotateRingDeg={104}
      />
    </div>
  );
};

export default RotatingLogo;

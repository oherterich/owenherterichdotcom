'use client';

import { useEffect, useRef } from 'react';
import styles from './RotatingLogo.module.scss';

const MAX_ROTATE_DEG = 30;
const MAX_DISTANCE = 800;
const TRANSLATION_FACTOR = 0.05;
const INNER_LIGHT_FACTOR = 20;
const MAX_DEVICE_TILT = 30; // Max degrees for device orientation

export default function RotatingLogo() {
  const containerRef = useRef<HTMLUListElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let lastMousePos = { x: 0, y: 0 };
    let lastOrientation = { beta: 0, gamma: 0 };
    let isUsingOrientation = false;

    const applyTransforms = (normalizedX: number, normalizedY: number) => {
      // Rotation (inverted Y for natural feel)
      const rotateX = -normalizedY * MAX_ROTATE_DEG;
      const rotateY = normalizedX * MAX_ROTATE_DEG;

      // Translation (component follows input slightly)
      const translateX = normalizedX * MAX_DISTANCE * TRANSLATION_FACTOR;
      const translateY = normalizedY * MAX_DISTANCE * TRANSLATION_FACTOR;

      // Drop shadow (follows rotation)
      const shadowX = -normalizedX * MAX_ROTATE_DEG;
      const shadowY = normalizedY * MAX_ROTATE_DEG;

      // Inner light gradient movement
      const innerX = normalizedX * INNER_LIGHT_FACTOR;
      const innerY = normalizedY * INNER_LIGHT_FACTOR;

      // Apply CSS variables
      document.documentElement.style.setProperty('--rotate-x', `${rotateX}deg`);
      document.documentElement.style.setProperty('--rotate-y', `${rotateY}deg`);
      document.documentElement.style.setProperty('--translate-x', `${translateX}px`);
      document.documentElement.style.setProperty('--translate-y', `${translateY}px`);
      document.documentElement.style.setProperty('--ds-x', `${shadowX}px`);
      document.documentElement.style.setProperty('--ds-y', `${shadowY}px`);
      document.documentElement.style.setProperty('--inner-x', `${innerX}px`);
      document.documentElement.style.setProperty('--inner-y', `${-innerY}px`);
    };

    const updateFromMouse = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Mouse position relative to center
      const offsetX = lastMousePos.x - centerX;
      const offsetY = lastMousePos.y - centerY;

      // Normalized values for rotation
      const normalizedX = offsetX / MAX_DISTANCE;
      const normalizedY = offsetY / MAX_DISTANCE;

      applyTransforms(normalizedX, normalizedY);
      rafRef.current = null;
    };

    const updateFromOrientation = () => {
      // beta: front-to-back tilt (-180 to 180, 0 is flat)
      // gamma: left-to-right tilt (-90 to 90, 0 is flat)
      const normalizedX = Math.max(-1, Math.min(1, lastOrientation.gamma / MAX_DEVICE_TILT));
      const normalizedY = Math.max(-1, Math.min(1, lastOrientation.beta / MAX_DEVICE_TILT));

      applyTransforms(normalizedX, normalizedY);
      rafRef.current = null;
    };

    const handleMouseMove = (evt: MouseEvent) => {
      if (isUsingOrientation) return;

      lastMousePos = { x: evt.clientX, y: evt.clientY };

      // Throttle using requestAnimationFrame
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateFromMouse);
      }
    };

    const handleOrientation = (evt: DeviceOrientationEvent) => {
      if (evt.beta === null || evt.gamma === null) return;

      isUsingOrientation = true;
      lastOrientation = { beta: evt.beta, gamma: evt.gamma };

      // Throttle using requestAnimationFrame
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateFromOrientation);
      }
    };

    // Type for iOS DeviceOrientationEvent with requestPermission
    interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    }

    // Request permission for iOS 13+ devices
    const requestOrientationPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission === 'function'
      ) {
        try {
          const permission = await (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission!();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          console.error('Device orientation permission denied:', error);
        }
      } else {
        // Non-iOS or older browsers - add listener directly
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    // Set up event listeners
    window.addEventListener('mousemove', handleMouseMove);

    // For iOS, we need to request permission on user interaction
    // For other devices, start listening immediately
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission === 'function'
    ) {
      // iOS - wait for user interaction (tap on the sphere)
      const handleUserInteraction = () => {
        requestOrientationPermission();
        containerRef.current?.removeEventListener('click', handleUserInteraction);
      };
      containerRef.current?.addEventListener('click', handleUserInteraction);
    } else {
      // Non-iOS - start immediately
      requestOrientationPermission();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <ul ref={containerRef} className={styles.container}>
      <div className={styles.sphere}>
        <div className={styles.inner} />
        <li className={styles.text}>OH</li>
      </div>
    </ul>
  );
}

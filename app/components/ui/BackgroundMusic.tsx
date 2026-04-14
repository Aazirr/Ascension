"use client";

import { useEffect } from "react";

const BACKGROUND_MUSIC_PATH = "/sfx/background-music.wav";
const BACKGROUND_MUSIC_VOLUME = 0.06;
const LOOP_RESTART_OFFSET_SECONDS = 1;

export default function BackgroundMusic() {
  useEffect(() => {
    const audio = new Audio(BACKGROUND_MUSIC_PATH);
    audio.loop = false;
    audio.volume = BACKGROUND_MUSIC_VOLUME;
    audio.preload = "auto";

    let disposed = false;

    const startPlayback = () => {
      if (disposed) {
        return;
      }

      void audio.play().catch(() => {
        // Some browsers block autoplay until first user interaction.
      });
    };

    const interactionEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
    ];

    const handleTimeUpdate = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= LOOP_RESTART_OFFSET_SECONDS) {
        return;
      }

      if (audio.currentTime >= audio.duration - LOOP_RESTART_OFFSET_SECONDS) {
        audio.currentTime = 0;
      }
    };

    const handleFirstInteraction = () => {
      startPlayback();

      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleFirstInteraction, { once: true });
    });
    audio.addEventListener("timeupdate", handleTimeUpdate);

    startPlayback();

    return () => {
      disposed = true;
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return null;
}
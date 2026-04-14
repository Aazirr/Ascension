"use client";

import { useEffect, useRef, useState } from "react";

const BACKGROUND_MUSIC_PATH = "/sfx/background-music.wav";
const BACKGROUND_MUSIC_VOLUME = 0.06;
const CROSSFADE_DURATION_SECONDS = 1;

function lerp(start: number, end: number, alpha: number) {
  return start + (end - start) * alpha;
}

export default function BackgroundMusic() {
  const deckRef = useRef<[HTMLAudioElement | null, HTMLAudioElement | null]>([null, null]);
  const activeDeckIndexRef = useRef<0 | 1>(0);
  const startEngineRef = useRef<() => void>(() => {});
  const loopTimeoutRef = useRef<number | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const isMutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const deckA = new Audio(BACKGROUND_MUSIC_PATH);
    const deckB = new Audio(BACKGROUND_MUSIC_PATH);

    deckA.loop = false;
    deckB.loop = false;
    deckA.preload = "auto";
    deckB.preload = "auto";
    deckA.volume = 0;
    deckB.volume = 0;

    deckRef.current = [deckA, deckB];

    let disposed = false;
    const maxVolume = () => (isMutedRef.current ? 0 : BACKGROUND_MUSIC_VOLUME);

    const clearLoopTimeout = () => {
      if (loopTimeoutRef.current !== null) {
        window.clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }
    };

    const clearFadeAnimation = () => {
      if (fadeRafRef.current !== null) {
        window.cancelAnimationFrame(fadeRafRef.current);
        fadeRafRef.current = null;
      }
    };

    const fadeBetweenDecks = (
      incoming: HTMLAudioElement,
      outgoing: HTMLAudioElement | null,
      onComplete: () => void,
    ) => {
      clearFadeAnimation();

      const fadeStartTime = performance.now();
      const initialIncomingVolume = incoming.volume;
      const initialOutgoingVolume = outgoing?.volume ?? 0;

      const tick = (now: number) => {
        if (disposed) {
          return;
        }

        const progress = Math.min(
          (now - fadeStartTime) / (CROSSFADE_DURATION_SECONDS * 1000),
          1,
        );
        const targetMax = maxVolume();

        incoming.volume = lerp(initialIncomingVolume, targetMax, progress);
        if (outgoing) {
          outgoing.volume = lerp(initialOutgoingVolume, 0, progress);
        }

        if (progress < 1) {
          fadeRafRef.current = window.requestAnimationFrame(tick);
          return;
        }

        fadeRafRef.current = null;
        onComplete();
      };

      fadeRafRef.current = window.requestAnimationFrame(tick);
    };

    const scheduleNextCrossfade = () => {
      clearLoopTimeout();

      const [deck0, deck1] = deckRef.current;
      const activeDeck = activeDeckIndexRef.current === 0 ? deck0 : deck1;
      if (!activeDeck || !Number.isFinite(activeDeck.duration)) {
        return;
      }

      const restartLeadMs = Math.max(
        0,
        (activeDeck.duration - CROSSFADE_DURATION_SECONDS) * 1000,
      );

      loopTimeoutRef.current = window.setTimeout(() => {
        if (disposed) {
          return;
        }

        const outgoingIndex = activeDeckIndexRef.current;
        const incomingIndex: 0 | 1 = outgoingIndex === 0 ? 1 : 0;
        const [audio0, audio1] = deckRef.current;
        const outgoingDeck = outgoingIndex === 0 ? audio0 : audio1;
        const incomingDeck = incomingIndex === 0 ? audio0 : audio1;

        if (!outgoingDeck || !incomingDeck) {
          return;
        }

        incomingDeck.currentTime = 0;
        incomingDeck.volume = 0;

        void incomingDeck.play().then(() => {
          if (disposed) {
            return;
          }

          fadeBetweenDecks(incomingDeck, outgoingDeck, () => {
            if (disposed) {
              return;
            }

            outgoingDeck.pause();
            outgoingDeck.currentTime = 0;
            outgoingDeck.volume = 0;
            activeDeckIndexRef.current = incomingIndex;
            scheduleNextCrossfade();
          });
        }).catch(() => {
          // Ignore blocked playback; next interaction or toggle will retry.
        });
      }, restartLeadMs);
    };

    const startEngine = () => {
      if (disposed || startedRef.current) {
        return;
      }

      const [deck0] = deckRef.current;
      if (!deck0) {
        return;
      }

      deck0.currentTime = 0;
      deck0.volume = 0;

      void deck0.play().then(() => {
        if (disposed || startedRef.current) {
          return;
        }

        startedRef.current = true;
        activeDeckIndexRef.current = 0;

        fadeBetweenDecks(deck0, null, () => {
          if (disposed) {
            return;
          }

          scheduleNextCrossfade();
        });
      }).catch(() => {
        // Some browsers block autoplay until first user interaction.
      });
    };

    startEngineRef.current = startEngine;

    const interactionEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
    ];

    const handleFirstInteraction = () => {
      startEngine();

      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleFirstInteraction, { once: true });
    });

    startEngine();

    return () => {
      disposed = true;
      clearLoopTimeout();
      clearFadeAnimation();
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });

      const [audio0, audio1] = deckRef.current;
      [audio0, audio1].forEach((audio) => {
        if (!audio) {
          return;
        }

        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      });

      deckRef.current = [null, null];
      startEngineRef.current = () => {};
      startedRef.current = false;
    };
  }, []);

  useEffect(() => {
    isMutedRef.current = isMuted;

    const [audio0, audio1] = deckRef.current;
    const activeDeck = activeDeckIndexRef.current === 0 ? audio0 : audio1;
    const inactiveDeck = activeDeckIndexRef.current === 0 ? audio1 : audio0;

    if (activeDeck) {
      activeDeck.volume = isMuted ? 0 : BACKGROUND_MUSIC_VOLUME;
    }

    if (inactiveDeck) {
      inactiveDeck.volume = 0;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((previous) => {
      const nextMuted = !previous;

      if (!nextMuted) {
        startEngineRef.current();
      }

      return nextMuted;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={isMuted}
      aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      className="fixed bottom-4 left-4 z-[70] rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs font-medium tracking-[0.12em] text-white backdrop-blur-md transition hover:bg-black/70"
    >
      {isMuted ? "Music Off" : "Music On"}
    </button>
  );
}
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoUrl from "@assets/unlock_logo_transparent.png";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          {/* Vault doors splitting open on exit */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black via-zinc-950 to-zinc-900 border-r border-primary/30 z-30"
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1], delay: 0.05 }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(255,46,46,0.8)]" />
          </motion.div>
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black via-zinc-950 to-zinc-900 border-l border-primary/30 z-30"
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1], delay: 0.05 }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(255,46,46,0.8)]" />
          </motion.div>

          {/* Ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,46,46,0.18),transparent_60%)] z-10" />

          {/* Center content */}
          <div className="relative z-20 flex flex-col items-center">
            {/* Outer rotating dial */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(12)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-3 bg-white/30"
                    style={{ transform: `rotate(${i * 30}deg) translateY(0)`, transformOrigin: "50% 112px" }}
                  />
                ))}
              </motion.div>

              {/* Middle dashed ring */}
              <motion.div
                className="absolute inset-6 rounded-full border-2 border-dashed border-primary/60"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />

              {/* Inner solid ring with glow */}
              <motion.div
                className="absolute inset-12 rounded-full border-2 border-amber-400/70 shadow-[0_0_40px_rgba(255,195,0,0.35),inset_0_0_30px_rgba(255,46,46,0.25)]"
                animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Logo in center */}
              <motion.img
                src={logoUrl}
                alt="Unlock Food"
                className="relative w-24 h-24 object-contain drop-shadow-[0_0_30px_rgba(255,46,46,0.7)]"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "backOut" }}
              />
            </div>

            {/* Tag */}
            <motion.div
              className="mt-10 flex items-center gap-3"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <span className="h-px w-10 bg-primary" />
              <span className="text-[10px] font-bold tracking-[0.45em] text-amber-300 uppercase">Cracking the vault</span>
              <span className="h-px w-10 bg-primary" />
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="mt-6 h-[3px] bg-white/10 rounded-full overflow-hidden w-64 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-amber-400 to-primary bg-[length:200%_100%]"
                initial={{ width: "0%" }}
                animate={{ width: "100%", backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{
                  width: { duration: 1.4, ease: [0.65, 0, 0.35, 1] },
                  backgroundPosition: { duration: 1.4, ease: "linear" },
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

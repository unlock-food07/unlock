import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ParticleBurst({ isActive, onComplete }: { isActive: boolean; onComplete?: () => void }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; scale: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const colors = ["#FF2E2E", "#FFC300", "#ffffff"];
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: Math.random() * 0.5 + 0.5,
      }));
      setParticles(newParticles);
      
      if (onComplete) {
        const timer = setTimeout(onComplete, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setParticles([]);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }}
        />
      ))}
    </div>
  );
}

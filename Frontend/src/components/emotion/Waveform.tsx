import { motion } from "framer-motion";

interface WaveformProps {
  active: boolean;
  bars?: number;
}

export const Waveform = ({ active, bars = 28 }: WaveformProps) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-gradient-primary"
          animate={
            active
              ? { scaleY: [0.3, 1, 0.5, 0.9, 0.3] }
              : { scaleY: 0.3 }
          }
          transition={{
            duration: 0.9 + (i % 5) * 0.12,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
            delay: (i % 7) * 0.05,
          }}
          style={{ height: "100%", transformOrigin: "center" }}
        />
      ))}
    </div>
  );
};

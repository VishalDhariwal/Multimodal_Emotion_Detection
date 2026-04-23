import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type EmotionLabel = "happy" | "sad" | "angry" | "neutral" | "excited" | string;

export interface PredictionResult {
  emotion: EmotionLabel;
  confidence?: number;
}

const EMOJI: Record<string, string> = {
  happy: "😄",
  sad: "😢",
  angry: "😠",
  neutral: "😐",
  excited: "🤩",
  fear: "😨",
  surprise: "😮",
  disgust: "🤢",
};

const colorFor = (e: string) => {
  const k = e.toLowerCase();
  if (k.includes("happy")) return "emotion-happy";
  if (k.includes("sad")) return "emotion-sad";
  if (k.includes("angry")) return "emotion-angry";
  if (k.includes("excited")) return "emotion-excited";
  return "emotion-neutral";
};

interface ResultCardProps {
  result: PredictionResult | null;
}

export const ResultCard = ({ result }: ResultCardProps) => {
  return (
    <AnimatePresence mode="wait">
      {result && (
        <motion.div
          key={result.emotion}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="rounded-3xl border bg-card shadow-card p-6 md:p-8"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Predicted Emotion
              </p>
              <div className="mt-2 flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 260 }}
                  className="text-4xl md:text-5xl"
                >
                  {EMOJI[result.emotion.toLowerCase()] ?? "✨"}
                </motion.span>
                <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">
                  {result.emotion}
                </h2>
              </div>
            </div>

            <span
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold text-primary-foreground shadow-soft",
                "bg-[hsl(var(--" + colorFor(result.emotion) + "))]"
              )}
            >
              {result.emotion.toUpperCase()}
            </span>
          </div>

          {typeof result.confidence === "number" && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-mono font-medium">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(1, result.confidence)) * 100}%` }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-gradient-primary rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

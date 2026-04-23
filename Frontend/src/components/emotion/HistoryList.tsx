import { motion } from "framer-motion";
import { History, Clock } from "lucide-react";
import { PredictionResult } from "./ResultCard";

export interface HistoryItem extends PredictionResult {
  id: string;
  timestamp: number;
  textSnippet: string;
  fileName?: string;
}

interface HistoryListProps {
  items: HistoryItem[];
}

const EMOJI: Record<string, string> = {
  happy: "😄", sad: "😢", angry: "😠", neutral: "😐", excited: "🤩",
};

export const HistoryList = ({ items }: HistoryListProps) => {
  return (
    <div className="rounded-3xl border bg-card shadow-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-lg">Recent Predictions</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No predictions yet. Run your first analysis to see history here.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-smooth"
            >
              <span className="text-2xl">{EMOJI[item.emotion.toLowerCase()] ?? "✨"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold capitalize">{item.emotion}</span>
                  {typeof item.confidence === "number" && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {item.fileName ? `${item.fileName} · ` : ""}
                  {item.textSnippet || "—"}
                </p>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                <Clock className="h-3 w-3" />
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

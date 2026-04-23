import { motion } from "framer-motion";
import { Brain, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header = ({ isDark, onToggleTheme }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-lg opacity-60" />
            <div className="relative bg-gradient-primary p-2.5 rounded-xl shadow-glow">
              <Brain className="h-6 w-6 text-primary-foreground" strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">
              Emotion Detection <span className="text-gradient">AI</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Detect emotions from video and text using AI
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="rounded-full hover:bg-secondary"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </motion.header>
  );
};

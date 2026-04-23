import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/emotion/Header";
import { VideoUpload } from "@/components/emotion/VideoUpload";
import { Waveform } from "@/components/emotion/Waveform";
import { ResultCard, PredictionResult } from "@/components/emotion/ResultCard";
import { HistoryList, HistoryItem } from "@/components/emotion/HistoryList";

const EMOTIONS = ["happy", "sad", "angry", "neutral", "excited"];

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleAnalyze = async () => {
    if (!file && !text.trim()) {
      toast({
        title: "Add some input",
        description: "Upload a video or enter text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    let prediction: PredictionResult;
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("text", text);

      const res = await fetch("/predict", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Request failed");
      prediction = await res.json();
    } catch {
      // Graceful fallback for demo: synthesize a plausible prediction
      await new Promise((r) => setTimeout(r, 1800));
      const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      prediction = { emotion, confidence: 0.6 + Math.random() * 0.39 };
      toast({
        title: "Demo mode",
        description: "Backend /predict not reachable — showing a sample result.",
      });
    }

    setResult(prediction);
    setHistory((h) => [
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        textSnippet: text.slice(0, 80),
        fileName: file?.name,
        ...prediction,
      },
      ...h,
    ].slice(0, 8));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <Header isDark={isDark} onToggleTheme={() => setIsDark((v) => !v)} />

      <main className="container pb-20 pt-4">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-2xl mx-auto mt-6 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by multimodal AI
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Understand the <span className="text-gradient">emotion</span> behind any moment
          </h2>
          <p className="text-muted-foreground mt-4 text-base md:text-lg">
            Upload a short video and add context. Our model analyzes audio features and your text to
            predict the underlying emotion in seconds.
          </p>
        </motion.section>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Input Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl border bg-card shadow-elegant p-6 md:p-8 space-y-6"
          >
            <VideoUpload file={file} onFileChange={setFile} />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Type className="h-4 w-4" /> Context text
              </label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text describing emotion or context..."
                className="min-h-[140px] resize-none rounded-2xl bg-secondary/40 border-border focus-visible:ring-primary text-base"
              />
            </div>

            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-2xl bg-gradient-hero border border-primary/20 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">Processing video & text...</p>
                    <p className="text-xs text-muted-foreground">
                      Extracting audio features and analyzing context
                    </p>
                  </div>
                  <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                </div>
                <div className="mt-3">
                  <Waveform active />
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={loading}
              size="lg"
              className="w-full h-12 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-95 hover:shadow-elegant transition-smooth text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Analyze Emotion
                </>
              )}
            </Button>

            <ResultCard result={result} />
          </motion.section>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 lg:sticky lg:top-6"
          >
            <HistoryList items={history} />
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default Index;

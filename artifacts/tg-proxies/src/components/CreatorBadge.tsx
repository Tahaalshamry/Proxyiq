import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

interface CreatorBadgeProps {
  lang: "ar" | "en";
}

export function CreatorBadge({ lang }: CreatorBadgeProps) {
  const isAr = lang === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full flex justify-center pt-6 px-4 relative z-20"
    >
      <a
        href="https://www.instagram.com/_t9ln"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 via-fuchsia-500/10 to-primary/10 backdrop-blur-md hover:border-primary/60 hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.6)] transition-all duration-300"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
          {isAr ? "موقع" : "Site by"}
        </span>
        <span className="h-3 w-px bg-white/15" />
        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
          {isAr ? "طه الشمري" : "Taha Alshamry"}
        </span>
        <Instagram className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-mono text-primary/90">@_t9ln</span>
      </a>
    </motion.div>
  );
}

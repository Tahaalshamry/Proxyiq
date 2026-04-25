import { motion } from "framer-motion";
import { Instagram, Sparkles } from "lucide-react";

interface FooterProps {
  lang: "ar" | "en";
}

export function Footer({ lang }: FooterProps) {
  const isAr = lang === "ar";

  return (
    <footer className="w-full mt-20 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex flex-col items-center text-center gap-6 p-8 md:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-primary/5 to-white/5 backdrop-blur-xl shadow-[0_0_60px_-20px_rgba(168,85,247,0.4)]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs uppercase tracking-[0.3em]">
              <Sparkles className="w-3.5 h-3.5" />
              {isAr ? "تصميم وتطوير" : "Designed & Developed by"}
            </div>

            <div className="space-y-1">
              <h3 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-fuchsia-300 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                {isAr ? "طه الشمري" : "Taha Alshamry"}
              </h3>
              <p className="text-lg text-muted-foreground font-light tracking-wide">
                {isAr ? "Taha Alshamry" : "طه الشمري"}
              </p>
            </div>

            <a
              href="https://www.instagram.com/_t9ln"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 via-fuchsia-500/20 to-primary/20 border border-primary/40 hover:border-primary hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.7)] transition-all duration-300 hover:scale-105"
            >
              <Instagram className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
              <span className="text-base font-mono font-bold text-foreground">@_t9ln</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {isAr ? "تابعني على إنستغرام" : "Follow on Instagram"}
              </span>
            </a>

            <div className="w-full pt-6 mt-2 border-t border-white/5">
              <p className="text-xs text-muted-foreground font-mono tracking-wider">
                &copy; {new Date().getFullYear()} {isAr ? "جميع الحقوق محفوظة" : "All Rights Reserved"} ·{" "}
                <span className="text-primary/80">Taha Alshamry</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

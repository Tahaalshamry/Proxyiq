import { Instagram } from "lucide-react";

interface FooterProps {
  lang: "ar" | "en";
}

export function Footer({ lang }: FooterProps) {
  const isAr = lang === "ar";

  return (
    <footer className="w-full py-8 mt-12 border-t border-white/10 relative z-10 backdrop-blur-md bg-background/50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm font-mono tracking-wide">
            &copy; {new Date().getFullYear()} Telegram Proxies.
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground/80">
            {isAr ? "تصميم وتطوير:" : "Designed & Built by:"}
          </span>
          <span className="text-primary font-bold tracking-wide">
            {isAr ? "طه الشمري" : "Taha Alshamry"}
          </span>
        </div>

        <a 
          href="https://www.instagram.com/t9ln" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 group"
        >
          <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-sm font-mono text-muted-foreground group-hover:text-primary transition-colors">@t9ln</span>
        </a>
      </div>
    </footer>
  );
}

import { motion } from "framer-motion";
import { Copy, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Proxy, getFlagEmoji } from "@/lib/store";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ProxyCardProps {
  proxy: Proxy;
  lang: "ar" | "en";
  index: number;
}

export function ProxyCard({ proxy, lang, index }: ProxyCardProps) {
  const isAr = lang === "ar";
  const isOnline = proxy.status === "online";

  const proxyUrl = `https://t.me/proxy?server=${proxy.server}&port=${proxy.port}&secret=${proxy.secret}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(proxyUrl);
    toast.success(isAr ? "تم النسخ بنجاح!" : "Copied to clipboard!", {
      description: proxy.server,
    });
  };

  const handleConnect = () => {
    // 🔥 فتح Telegram مباشرة فقط (بدون fallback نهائياً)
    const tgUrl = `tg://proxy?server=${proxy.server}&port=${proxy.port}&secret=${proxy.secret}`;
    window.location.assign(tgUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ y: -5 }}
      className="relative group rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm overflow-hidden flex flex-col gap-4 shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">{proxy.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-base">{getFlagEmoji(proxy.countryCode)}</span>
            <span>{proxy.country}</span>
          </div>
        </div>

        <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground flex items-center gap-1">
          {proxy.ping} <span className="text-[10px]">ms</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground/70 font-mono flex gap-2">
          <span>{isAr ? "الخادم:" : "Server:"}</span>
          <span className="text-foreground/90">
            {proxy.server}:{proxy.port}
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-xs font-mono text-primary/70 bg-primary/5 border border-primary/10 rounded px-2 py-1 truncate cursor-help group-hover:text-primary transition-colors">
              {proxy.secret}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] break-all font-mono text-xs">
            {proxy.secret}
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-auto pt-2 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleCopy}
          className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground"
        >
          <Copy className="w-4 h-4 mr-2" />
          {isAr ? "نسخ" : "Copy"}
        </Button>

        <Button
          onClick={handleConnect}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_-3px_rgba(var(--primary),0.5)]"
        >
          <Send className="w-4 h-4 mr-2" />
          {isAr ? "تشغيل" : "Connect"}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5">
        <div className="relative flex items-center justify-center">
          {isOnline && (
            <div className="absolute w-3 h-3 rounded-full bg-green-500/40 animate-ping" />
          )}
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline
                ? "bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]"
                : "bg-red-500"
            }`}
          />
        </div>

        <span
          className={`text-xs font-medium ${
            isOnline ? "text-green-500" : "text-red-500"
          }`}
        >
          {isOnline ? (isAr ? "يعمل" : "Online") : isAr ? "متوقف" : "Offline"}
        </span>
      </div>
    </motion.div>
  );
}
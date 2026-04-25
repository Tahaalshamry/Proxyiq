import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, User, Globe, Instagram, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";
import creatorPhoto from "@assets/IMG_5839_1777110228239.jpeg";

interface LoginProps {
  lang: "ar" | "en";
}

export default function Login({ lang }: LoginProps) {
  const isAr = lang === "ar";
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setLang = (l: "ar" | "en") => {
    const setter = (window as any).__setLang;
    if (typeof setter === "function") setter(l);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error(isAr ? "يرجى إدخال جميع الحقول" : "Please fill all fields");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const result = login(username, password);
    setIsLoading(false);

    if (result.success) {
      if (result.isOwner) {
        toast.success(isAr ? "أهلاً بك أيها المالك" : "Welcome back, owner");
        setLocation("/admin");
      } else {
        toast.success(isAr ? "تم الدخول بنجاح" : "Logged in successfully");
        setLocation("/");
      }
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(168,85,247,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_80%,_rgba(217,70,239,0.15),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent,_rgba(0,0,0,0.6))]" />
      </div>

      {/* Top language toggle */}
      <div className="relative z-10 flex justify-end p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLang(isAr ? "en" : "ar")}
          className="font-mono"
        >
          <Globe className="w-4 h-4 mr-2" />
          {isAr ? "EN" : "AR"}
        </Button>
      </div>

      {/* === TOP CREDIT BAR === */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex justify-center px-4"
      >
        <a
          href="https://www.instagram.com/_t9ln"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 via-fuchsia-500/10 to-primary/10 backdrop-blur-md hover:border-primary/60 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground">
            {isAr ? "تصميم وتطوير: طه الشمري" : "Built by Taha Alshamry"}
          </span>
          <Instagram className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-mono text-primary/90">@_t9ln</span>
        </a>
      </motion.div>

      {/* === MAIN CARD === */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl border border-white/10 bg-card/60 backdrop-blur-2xl shadow-[0_0_80px_-20px_rgba(168,85,247,0.5)] overflow-hidden"
        >
          {/* Left: creator photo */}
          <div className="lg:col-span-2 relative min-h-[260px] lg:min-h-[560px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-fuchsia-500/40" />
            <img
              src={creatorPhoto}
              alt="Taha Alshamry"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/40" />

            {/* Owner name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/70 border border-primary/40 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                  {isAr ? "مالك الموقع" : "Site Owner"}
                </span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-fuchsia-300 drop-shadow-2xl">
                {isAr ? "طه الشمري" : "Taha Alshamry"}
              </h3>
              <a
                href="https://www.instagram.com/_t9ln"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-fuchsia-300 transition-colors font-mono"
              >
                <Instagram className="w-4 h-4" />
                @_t9ln
              </a>
            </div>
          </div>

          {/* Right: login form */}
          <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 relative">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 rounded-2xl border border-primary/40 animate-ping opacity-20" />
              </div>

              <h1 className="text-3xl lg:text-4xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-fuchsia-300">
                {isAr ? "مرحباً بك" : "Welcome"}
              </h1>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                {isAr
                  ? "للوصول إلى بروكسيات تيليجرام في العراق، يرجى تسجيل الدخول أولاً"
                  : "Sign in to access Telegram proxies for Iraq"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  {isAr ? "اسم المستخدم" : "Username"}
                </label>
                <Input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/30 border-white/10 h-12 focus:border-primary/50 font-mono"
                  placeholder={isAr ? "اكتب اسم المستخدم" : "Enter your username"}
                  dir="ltr"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  {isAr ? "كلمة المرور" : "Password"}
                </label>
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/30 border-white/10 h-12 focus:border-primary/50 font-mono"
                  placeholder="••••••••"
                  dir="ltr"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-primary via-fuchsia-500 to-primary text-primary-foreground font-bold shadow-[0_0_25px_-5px_rgba(168,85,247,0.7)] hover:shadow-[0_0_35px_-5px_rgba(168,85,247,0.9)] transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    {isAr ? "دخول الموقع" : "Enter Site"}
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
              {isAr
                ? "بدخولك أنت توافق على استخدام البروكسيات لأغراض شخصية فقط"
                : "By signing in you agree to use proxies for personal use only"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* === BOTTOM CREDIT === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 text-center pb-6 px-4"
      >
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} —{" "}
          <a
            href="https://www.instagram.com/_t9ln"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-fuchsia-300 font-bold"
          >
            {isAr ? "طه الشمري" : "Taha Alshamry"} · @_t9ln
          </a>
        </p>
      </motion.div>
    </div>
  );
}

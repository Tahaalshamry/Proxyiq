import { Link, useLocation } from "wouter";
import { ShieldCheck, LogOut, Globe } from "lucide-react";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  lang: "ar" | "en";
  setLang: (l: "ar" | "en") => void;
}

export function Header({ lang, setLang }: HeaderProps) {
  const { isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const isAr = lang === "ar";

  return (
    <header className="sticky top-0 w-full z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Proxy<span className="text-primary">Vault</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Owner
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="flex items-center gap-2 font-mono"
          >
            <Globe className="w-4 h-4" />
            {isAr ? "EN" : "AR"}
          </Button>

          {isAuthenticated && (
            <>
              {location !== "/admin" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-white/10">
                    {isAr ? "لوحة التحكم" : "Dashboard"}
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" />
                {isAr ? "خروج" : "Logout"}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

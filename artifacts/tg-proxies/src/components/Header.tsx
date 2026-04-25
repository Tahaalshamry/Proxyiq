import { Link, useLocation } from "wouter";
import { ShieldCheck, LogOut, Globe, User } from "lucide-react";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  lang: "ar" | "en";
}

export function Header({ lang }: HeaderProps) {
  const { isAuthenticated, isOwner, user, logout } = useAuth();
  const [location] = useLocation();
  const isAr = lang === "ar";

  const setLang = (l: "ar" | "en") => {
    const setter = (window as any).__setLang;
    if (typeof setter === "function") setter(l);
  };

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

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono max-w-[180px] truncate">
              {isOwner ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
                  <span>Owner</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 shrink-0" />
                  <span className="truncate">{user}</span>
                </>
              )}
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

          {isAuthenticated && isOwner && location !== "/admin" && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-white/10">
                {isAr ? "لوحة التحكم" : "Dashboard"}
              </Button>
            </Link>
          )}

          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{isAr ? "خروج" : "Logout"}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

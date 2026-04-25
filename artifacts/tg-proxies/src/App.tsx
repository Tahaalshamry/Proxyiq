import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/store";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function ProtectedRoutes({ lang }: { lang: "ar" | "en" }) {
  const { isAuthenticated, isOwner, isLoaded } = useAuth();
  const [location, setLocation] = useLocation();

  // كافة الـ Hooks يجب أن تبقى هنا في الأعلى دائماً
  useEffect(() => {
    if (!isLoaded) return;
    if (!isAuthenticated && location !== "/login") {
      setLocation("/login");
    }
    if (isAuthenticated && location === "/login") {
      setLocation(isOwner ? "/admin" : "/");
    }
  }, [isLoaded, isAuthenticated, isOwner, location, setLocation]);

  // حالة التحميل
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // التعديل الجذري: نستخدم return واحد ونقسم بداخله لمنع خطأ الـ Hooks
  return (
    <>
      {!isAuthenticated ? (
        <Login lang={lang} />
      ) : (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/30">
          <Header lang={lang} />
          <main className="flex-1 w-full relative">
            <Switch>
              <Route path="/">
                <Home lang={lang} />
              </Route>
              <Route path="/admin">
                {isOwner ? <Admin lang={lang} /> : <Home lang={lang} />}
              </Route>
              <Route path="/login">
                <Home lang={lang} />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </main>
          <Footer lang={lang} />
        </div>
      )}
    </>
  );
}

function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    (window as any).__setLang = setLang;
    (window as any).__lang = lang;
  }, [lang]);

  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <ProtectedRoutes lang={lang} />
      </WouterRouter>
      <Toaster theme="dark" position={lang === "ar" ? "top-left" : "top-right"} />
    </TooltipProvider>
  );
}

export default App;

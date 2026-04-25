import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router({ lang }: { lang: "ar" | "en" }) {
  return (
    <Switch>
      <Route path="/">
        <Home lang={lang} />
      </Route>
      <Route path="/login">
        <Login lang={lang} />
      </Route>
      <Route path="/admin">
        <Admin lang={lang} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/30">
          <Header lang={lang} setLang={setLang} />
          <main className="flex-1 w-full relative">
            <Router lang={lang} />
          </main>
          <Footer lang={lang} />
        </div>
      </WouterRouter>
      <Toaster theme="dark" position={lang === "ar" ? "top-left" : "top-right"} />
    </TooltipProvider>
  );
}

export default App;

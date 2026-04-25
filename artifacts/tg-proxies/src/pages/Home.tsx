import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Activity, Globe2, Shield, SortAsc, SortDesc, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProxyCard } from "@/components/ProxyCard";
import { useProxies } from "@/lib/store";

interface HomeProps {
  lang: "ar" | "en";
}

export default function Home({ lang }: HomeProps) {
  const isAr = lang === "ar";
  const { proxies, isLoaded } = useProxies();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline">("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"ping_asc" | "newest" | "name">("ping_asc");

  const countries = useMemo(() => {
    const set = new Set(proxies.map(p => p.country));
    return Array.from(set).sort();
  }, [proxies]);

  const filteredProxies = useMemo(() => {
    let result = proxies;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.server.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter);
    }

    if (countryFilter !== "all") {
      result = result.filter(p => p.country === countryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "ping_asc") return a.ping - b.ping;
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [proxies, search, statusFilter, countryFilter, sortBy]);

  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isLoaded) return null;

  const onlineCount = proxies.filter(p => p.status === "online").length;

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
        
        {/* Floating background blobs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-accent/10 blur-[100px] pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md text-primary font-mono text-sm mb-4 shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)]">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{onlineCount} {isAr ? "بروكسي يعمل الآن" : "Active Proxies"}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-primary/50">
            {isAr ? "شبكة اتصالك الخفية" : "Your Invisible Network"}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isAr 
              ? "مجموعة مميزة من بروكسيات MTProto عالية الأداء لتيليجرام. سرعة، استقرار، وأمان."
              : "A premium collection of high-performance MTProto proxies for Telegram. Fast, stable, and secure."}
          </p>

          <div className="pt-8">
            <Button 
              size="lg" 
              onClick={scrollToCatalog}
              className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-[0_0_30px_-5px_rgba(var(--primary),0.6)] hover:shadow-[0_0_40px_-5px_rgba(var(--primary),0.8)] transition-all duration-300"
            >
              {isAr ? "تصفح البروكسيات" : "Browse Proxies"}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-md mb-8 flex flex-col gap-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
              <Input
                placeholder={isAr ? "ابحث عن بروكسي، دولة، خادم..." : "Search proxy, country, server..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`bg-black/20 border-white/10 h-12 ${isAr ? 'pr-10' : 'pl-10'} text-lg`}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-primary text-primary-foreground" : "border-white/10 bg-black/20"}
              >
                {isAr ? "الكل" : "All"}
              </Button>
              <Button
                variant={statusFilter === "online" ? "default" : "outline"}
                onClick={() => setStatusFilter("online")}
                className={statusFilter === "online" ? "bg-green-600/20 text-green-500 border-green-500/50" : "border-white/10 bg-black/20"}
              >
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                {isAr ? "يعمل" : "Online"}
              </Button>
              <Button
                variant={statusFilter === "offline" ? "default" : "outline"}
                onClick={() => setStatusFilter("offline")}
                className={statusFilter === "offline" ? "bg-red-600/20 text-red-500 border-red-500/50" : "border-white/10 bg-black/20"}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                {isAr ? "متوقف" : "Offline"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Globe2 className="w-4 h-4" />
                {isAr ? "الدولة:" : "Country:"}
              </span>
              <select 
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-md text-sm p-1.5 focus:outline-none focus:border-primary/50 text-foreground"
              >
                <option value="all">{isAr ? "كل الدول" : "All Countries"}</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <SortAsc className="w-4 h-4" />
                {isAr ? "ترتيب حسب:" : "Sort by:"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/20 border border-white/10 rounded-md text-sm p-1.5 focus:outline-none focus:border-primary/50 text-foreground"
              >
                <option value="ping_asc">{isAr ? "الأسرع (Ping)" : "Fastest (Ping)"}</option>
                <option value="newest">{isAr ? "الأحدث" : "Newest"}</option>
                <option value="name">{isAr ? "الاسم" : "Name"}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground font-mono">
          <span>
            {isAr ? `عرض ${filteredProxies.length} من أصل ${proxies.length}` : `Showing ${filteredProxies.length} of ${proxies.length}`}
          </span>
        </div>

        {filteredProxies.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center border border-white/5 bg-white/5 rounded-2xl border-dashed">
            <Activity className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">{isAr ? "لا توجد نتائج" : "No results found"}</h3>
            <p className="text-muted-foreground text-sm text-center max-w-sm">
              {isAr ? "حاول تغيير كلمات البحث أو إزالة بعض الفلاتر لرؤية المزيد من البروكسيات." : "Try changing your search terms or removing some filters to see more proxies."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProxies.map((proxy, idx) => (
              <ProxyCard key={proxy.id} proxy={proxy} lang={lang} index={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

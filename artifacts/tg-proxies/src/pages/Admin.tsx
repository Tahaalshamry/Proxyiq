import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Users,
  Server,
  ShieldCheck,
  Trash,
  Eye,
  EyeOff,
  Crown,
  Copy as CopyIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useProxies,
  useAuth,
  useLoginRecords,
  Proxy,
  getFlagEmoji,
} from "@/lib/store";
import { toast } from "sonner";

interface AdminProps {
  lang: "ar" | "en";
}

type Tab = "proxies" | "visitors";

export default function Admin({ lang }: AdminProps) {
  const isAr = lang === "ar";
  const [, setLocation] = useLocation();
  const { isAuthenticated, isOwner, isLoaded: authLoaded } = useAuth();
  const { proxies, addProxy, updateProxy, deleteProxy, isLoaded: proxiesLoaded } = useProxies();
  const { records, clearAll, deleteOne } = useLoginRecords();

  const [tab, setTab] = useState<Tab>("proxies");
  const [search, setSearch] = useState("");
  const [visitorSearch, setVisitorSearch] = useState("");
  const [revealAll, setRevealAll] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Proxy>>({
    name: "",
    server: "",
    port: 443,
    secret: "",
    country: "",
    countryCode: "",
    ping: 50,
    status: "online",
  });

  useEffect(() => {
    if (authLoaded && (!isAuthenticated || !isOwner)) {
      setLocation("/login");
    }
  }, [authLoaded, isAuthenticated, isOwner, setLocation]);

  if (!authLoaded || !proxiesLoaded || !isAuthenticated || !isOwner) return null;

  const filteredProxies = proxies.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.server.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRecords = useMemo(() => {
    const q = visitorSearch.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.username.toLowerCase().includes(q) ||
        r.password.toLowerCase().includes(q)
    );
  }, [records, visitorSearch]);

  const stats = useMemo(() => {
    const total = records.length;
    const owners = records.filter((r) => r.isOwner).length;
    const visitors = total - owners;
    const uniqueUsers = new Set(records.map((r) => r.username.toLowerCase())).size;
    return { total, owners, visitors, uniqueUsers };
  }, [records]);

  const handleOpenDialog = (proxy?: Proxy) => {
    if (proxy) {
      setEditingId(proxy.id);
      setFormData(proxy);
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        server: "",
        port: 443,
        secret: "",
        country: "",
        countryCode: "",
        ping: 50,
        status: "online",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProxy(editingId, formData);
      toast.success(isAr ? "تم التحديث بنجاح" : "Proxy updated successfully");
    } else {
      addProxy(formData as Omit<Proxy, "id" | "createdAt">);
      toast.success(isAr ? "تمت الإضافة بنجاح" : "Proxy added successfully");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        isAr ? `هل أنت متأكد من حذف ${name}؟` : `Are you sure you want to delete ${name}?`
      )
    ) {
      deleteProxy(id);
      toast.success(isAr ? "تم الحذف بنجاح" : "Proxy deleted successfully");
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isRevealed = (id: string) => revealAll || revealedIds.has(id);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(isAr ? `تم نسخ ${label}` : `${label} copied`);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString(isAr ? "ar-IQ" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono mb-3">
            <Crown className="w-3.5 h-3.5" />
            {isAr ? "المالك" : "Owner"}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            {isAr ? "لوحة التحكم" : "Owner Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {isAr
              ? "إدارة البروكسيات ومتابعة الزوار"
              : "Manage proxies and monitor visitor logins"}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Server}
          label={isAr ? "إجمالي البروكسيات" : "Total Proxies"}
          value={proxies.length}
          accent="primary"
        />
        <StatCard
          icon={ShieldCheck}
          label={isAr ? "تعمل الآن" : "Online"}
          value={proxies.filter((p) => p.status === "online").length}
          accent="green"
        />
        <StatCard
          icon={Users}
          label={isAr ? "إجمالي تسجيلات الدخول" : "Total Logins"}
          value={stats.total}
          accent="primary"
        />
        <StatCard
          icon={Users}
          label={isAr ? "مستخدمين فريدين" : "Unique Users"}
          value={stats.uniqueUsers}
          accent="primary"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10">
        <TabButton
          active={tab === "proxies"}
          onClick={() => setTab("proxies")}
          icon={Server}
          label={isAr ? "البروكسيات" : "Proxies"}
          count={proxies.length}
        />
        <TabButton
          active={tab === "visitors"}
          onClick={() => setTab("visitors")}
          icon={Users}
          label={isAr ? "الزوار وتسجيلات الدخول" : "Visitors & Logins"}
          count={records.length}
        />
      </div>

      {/* === PROXIES TAB === */}
      {tab === "proxies" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold">
              {isAr ? "إدارة البروكسيات" : "Manage Proxies"}
            </h2>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAr ? "إضافة بروكسي" : "Add Proxy"}
            </Button>
          </div>

          <div className="bg-card border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="relative max-w-md">
                <Search
                  className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`}
                />
                <Input
                  placeholder={isAr ? "بحث..." : "Search..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`bg-black/20 border-white/10 ${isAr ? "pr-9" : "pl-9"} h-10`}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-muted-foreground bg-white/5 uppercase border-b border-white/10">
                  <tr>
                    <th className={`px-6 py-4 font-medium ${isAr ? "text-right" : "text-left"}`}>
                      {isAr ? "الاسم" : "Name"}
                    </th>
                    <th className={`px-6 py-4 font-medium ${isAr ? "text-right" : "text-left"}`}>
                      {isAr ? "الخادم" : "Server"}
                    </th>
                    <th className={`px-6 py-4 font-medium ${isAr ? "text-right" : "text-left"}`}>
                      {isAr ? "الدولة" : "Country"}
                    </th>
                    <th className={`px-6 py-4 font-medium ${isAr ? "text-right" : "text-left"}`}>
                      {isAr ? "الحالة" : "Status"}
                    </th>
                    <th className={`px-6 py-4 font-medium ${isAr ? "text-left" : "text-right"}`}>
                      {isAr ? "إجراءات" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProxies.map((proxy) => (
                    <tr key={proxy.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{proxy.name}</td>
                      <td className="px-6 py-4 font-mono text-muted-foreground" dir="ltr">
                        {proxy.server}:{proxy.port}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{getFlagEmoji(proxy.countryCode)}</span>
                          {proxy.country}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${proxy.status === "online" ? "bg-green-500" : "bg-red-500"}`}
                          />
                          <span
                            className={proxy.status === "online" ? "text-green-500" : "text-red-500"}
                          >
                            {proxy.status === "online"
                              ? isAr
                                ? "يعمل"
                                : "Online"
                              : isAr
                              ? "متوقف"
                              : "Offline"}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${isAr ? "text-left" : "text-right"}`}>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(proxy)}
                            className="hover:text-primary"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(proxy.id, proxy.name)}
                            className="hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProxies.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-muted-foreground"
                      >
                        {isAr ? "لا توجد نتائج" : "No results found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* === VISITORS TAB === */}
      {tab === "visitors" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {isAr ? "زوار الموقع" : "Site Visitors"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isAr
                  ? `كل من سجّل دخوله إلى الموقع · المجموع: ${stats.total}`
                  : `Everyone who signed in · Total: ${stats.total}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevealAll((v) => !v)}
                className="border-white/10"
              >
                {revealAll ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" /> {isAr ? "إخفاء الكل" : "Hide all"}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" /> {isAr ? "إظهار الكل" : "Reveal all"}
                  </>
                )}
              </Button>
              {records.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (
                      window.confirm(
                        isAr ? "حذف جميع السجلات؟" : "Clear all records?"
                      )
                    ) {
                      clearAll();
                      toast.success(isAr ? "تم حذف السجلات" : "Records cleared");
                    }
                  }}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  {isAr ? "مسح الكل" : "Clear all"}
                </Button>
              )}
            </div>
          </div>

          <div className="bg-card border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="relative max-w-md">
                <Search
                  className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`}
                />
                <Input
                  placeholder={
                    isAr ? "ابحث باسم المستخدم أو كلمة المرور..." : "Search by username or password..."
                  }
                  value={visitorSearch}
                  onChange={(e) => setVisitorSearch(e.target.value)}
                  className={`bg-black/20 border-white/10 ${isAr ? "pr-9" : "pl-9"} h-10`}
                />
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Users className="w-10 h-10 mx-auto opacity-30 mb-3" />
                <p className="text-sm">
                  {records.length === 0
                    ? isAr
                      ? "لا يوجد أي تسجيل دخول حتى الآن"
                      : "No login attempts yet"
                    : isAr
                    ? "لا توجد نتائج للبحث"
                    : "No matching records"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-muted-foreground bg-white/5 uppercase border-b border-white/10">
                    <tr>
                      <th className={`px-6 py-4 font-medium ${isAr ? "text-right" : "text-left"}`}>
                        #
                      </th>
                      <th className={`px-6 py-4 font-medium ${isAr ? "text-right" : "text-left"}`}>
                        {isAr ? "اسم المستخدم" : "Username"}
                      </th>
                      <th className={`px-6 py-4 font-medium ${isAr ? "text-right" : "text-left"}`}>
                        {isAr ? "كلمة المرور" : "Password"}
                      </th>
                      <th className={`px-6 py-4 font-medium ${isAr ? "text-right" : "text-left"}`}>
                        {isAr ? "النوع" : "Type"}
                      </th>
                      <th className={`px-6 py-4 font-medium ${isAr ? "text-right" : "text-left"}`}>
                        {isAr ? "الوقت" : "Time"}
                      </th>
                      <th className={`px-6 py-4 font-medium ${isAr ? "text-left" : "text-right"}`}>
                        {isAr ? "إجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRecords.map((r, idx) => (
                      <tr
                        key={r.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="font-mono" dir="ltr">{r.username}</span>
                            <button
                              onClick={() => copyToClipboard(r.username, isAr ? "اسم المستخدم" : "Username")}
                              className="opacity-50 hover:opacity-100 transition-opacity"
                            >
                              <CopyIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-foreground/90 select-all"
                              dir="ltr"
                            >
                              {isRevealed(r.id) ? r.password : "•".repeat(Math.min(r.password.length, 12))}
                            </span>
                            <button
                              onClick={() => toggleReveal(r.id)}
                              className="opacity-50 hover:opacity-100 transition-opacity"
                              title={isRevealed(r.id) ? "Hide" : "Reveal"}
                            >
                              {isRevealed(r.id) ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(r.password, isAr ? "كلمة المرور" : "Password")}
                              className="opacity-50 hover:opacity-100 transition-opacity"
                            >
                              <CopyIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {r.isOwner ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-mono">
                              <Crown className="w-3 h-3" />
                              {isAr ? "مالك" : "Owner"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs font-mono">
                              <Users className="w-3 h-3" />
                              {isAr ? "زائر" : "Visitor"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {formatDate(r.loggedAt)}
                        </td>
                        <td className={`px-6 py-4 ${isAr ? "text-left" : "text-right"}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteOne(r.id)}
                            className="hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            {isAr
              ? "ملاحظة: السجلات تُحفظ محلياً على هذا المتصفح فقط."
              : "Note: Records are stored locally in this browser only."}
          </p>
        </motion.div>
      )}

      {/* === ADD/EDIT DIALOG === */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-white/10 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className={isAr ? "text-right font-sans" : ""}>
              {editingId
                ? isAr
                  ? "تعديل بروكسي"
                  : "Edit Proxy"
                : isAr
                ? "إضافة بروكسي"
                : "Add Proxy"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-4" dir={isAr ? "rtl" : "ltr"}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">
                  {isAr ? "الاسم" : "Name"}
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/20 border-white/10"
                  placeholder="e.g. Aurora-01"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">
                  {isAr ? "البينج (ms)" : "Ping (ms)"}
                </label>
                <Input
                  required
                  type="number"
                  value={formData.ping}
                  onChange={(e) => setFormData({ ...formData, ping: Number(e.target.value) })}
                  className="bg-black/20 border-white/10"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-medium text-foreground/80">
                  {isAr ? "الخادم (IP أو Domain)" : "Server"}
                </label>
                <Input
                  required
                  value={formData.server}
                  onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                  className="bg-black/20 border-white/10 font-mono"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">
                  {isAr ? "المنفذ" : "Port"}
                </label>
                <Input
                  required
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
                  className="bg-black/20 border-white/10 font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground/80">
                {isAr ? "السر (Secret)" : "Secret"}
              </label>
              <Input
                required
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                className="bg-black/20 border-white/10 font-mono text-xs"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">
                  {isAr ? "الدولة" : "Country"}
                </label>
                <Input
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-black/20 border-white/10"
                  placeholder="e.g. Iraq"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">
                  {isAr ? "رمز الدولة (حرفين)" : "Country Code (2 letters)"}
                </label>
                <Input
                  required
                  value={formData.countryCode}
                  onChange={(e) =>
                    setFormData({ ...formData, countryCode: e.target.value.toUpperCase() })
                  }
                  maxLength={2}
                  className="bg-black/20 border-white/10 font-mono uppercase"
                  dir="ltr"
                  placeholder="IQ"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground/80">
                {isAr ? "الحالة" : "Status"}
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Proxy["status"] })
                }
                className="w-full h-10 px-3 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:border-primary/50"
              >
                <option value="online">{isAr ? "يعمل" : "Online"}</option>
                <option value="offline">{isAr ? "متوقف" : "Offline"}</option>
              </select>
            </div>

            <DialogFooter className="pt-4 border-t border-white/10 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isAr ? "حفظ البروكسي" : "Save Proxy"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  accent: "primary" | "green";
}) {
  const accentClass =
    accent === "green"
      ? "from-green-500/10 to-emerald-500/5 border-green-500/20 text-green-400"
      : "from-primary/10 to-fuchsia-500/5 border-primary/20 text-primary";
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${accentClass} backdrop-blur-md p-4 flex items-center gap-3`}
    >
      <div className="w-10 h-10 rounded-xl bg-background/40 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-black text-foreground leading-none">{value}</div>
        <div className="text-[11px] text-muted-foreground mt-1 truncate">{label}</div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Users;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      <span
        className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${
          active ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
        }`}
      >
        {count}
      </span>
      {active && (
        <motion.div
          layoutId="adminTabIndicator"
          className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary"
        />
      )}
    </button>
  );
}

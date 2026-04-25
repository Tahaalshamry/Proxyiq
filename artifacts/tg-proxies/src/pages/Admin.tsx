import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useProxies, useAuth, Proxy, getFlagEmoji } from "@/lib/store";
import { toast } from "sonner";

interface AdminProps {
  lang: "ar" | "en";
}

export default function Admin({ lang }: AdminProps) {
  const isAr = lang === "ar";
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoaded: authLoaded } = useAuth();
  const { proxies, addProxy, updateProxy, deleteProxy, isLoaded: proxiesLoaded } = useProxies();
  const [search, setSearch] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Proxy>>({
    name: "",
    server: "",
    port: 443,
    secret: "",
    country: "",
    countryCode: "",
    ping: 50,
    status: "online"
  });

  useEffect(() => {
    if (authLoaded && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoaded, isAuthenticated, setLocation]);

  if (!authLoaded || !proxiesLoaded || !isAuthenticated) return null;

  const filteredProxies = proxies.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.server.toLowerCase().includes(search.toLowerCase()) ||
    p.country.toLowerCase().includes(search.toLowerCase())
  );

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
        status: "online"
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
    if (window.confirm(isAr ? `هل أنت متأكد من حذف ${name}؟` : `Are you sure you want to delete ${name}?`)) {
      deleteProxy(id);
      toast.success(isAr ? "تم الحذف بنجاح" : "Proxy deleted successfully");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {isAr ? "إدارة وتحديث قائمة البروكسيات" : "Manage and update proxy list"}
          </p>
        </div>
        
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAr ? "إضافة بروكسي" : "Add Proxy"}
        </Button>
      </div>

      <div className="bg-card border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="relative max-w-md">
            <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
            <Input
              placeholder={isAr ? "بحث..." : "Search..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`bg-black/20 border-white/10 ${isAr ? 'pr-9' : 'pl-9'} h-10`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground bg-white/5 uppercase border-b border-white/10">
              <tr>
                <th className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الاسم" : "Name"}</th>
                <th className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الخادم" : "Server"}</th>
                <th className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الدولة" : "Country"}</th>
                <th className={`px-6 py-4 font-medium ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الحالة" : "Status"}</th>
                <th className={`px-6 py-4 font-medium ${isAr ? 'text-left' : 'text-right'}`}>{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProxies.map((proxy) => (
                <tr key={proxy.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {proxy.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">
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
                      <div className={`w-2 h-2 rounded-full ${proxy.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={proxy.status === 'online' ? 'text-green-500' : 'text-red-500'}>
                        {proxy.status === 'online' ? (isAr ? "يعمل" : "Online") : (isAr ? "متوقف" : "Offline")}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>
                    <div className={`flex items-center gap-2 ${isAr ? 'justify-end' : 'justify-end'}`}>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(proxy)} className="hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(proxy.id, proxy.name)} className="hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProxies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    {isAr ? "لا توجد نتائج" : "No results found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-white/10 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className={isAr ? "text-right font-sans" : ""}>
              {editingId ? (isAr ? "تعديل بروكسي" : "Edit Proxy") : (isAr ? "إضافة بروكسي" : "Add Proxy")}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="space-y-4 py-4" dir={isAr ? "rtl" : "ltr"}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">{isAr ? "الاسم" : "Name"}</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black/20 border-white/10" placeholder="e.g. Aurora-01" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">{isAr ? "البينج (ms)" : "Ping (ms)"}</label>
                <Input required type="number" value={formData.ping} onChange={e => setFormData({...formData, ping: Number(e.target.value)})} className="bg-black/20 border-white/10" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-medium text-foreground/80">{isAr ? "الخادم (IP أو Domain)" : "Server"}</label>
                <Input required value={formData.server} onChange={e => setFormData({...formData, server: e.target.value})} className="bg-black/20 border-white/10 font-mono" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">{isAr ? "المنفذ" : "Port"}</label>
                <Input required type="number" value={formData.port} onChange={e => setFormData({...formData, port: Number(e.target.value)})} className="bg-black/20 border-white/10 font-mono" dir="ltr" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground/80">{isAr ? "السر (Secret)" : "Secret"}</label>
              <Input required value={formData.secret} onChange={e => setFormData({...formData, secret: e.target.value})} className="bg-black/20 border-white/10 font-mono text-xs" dir="ltr" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">{isAr ? "الدولة" : "Country"}</label>
                <Input required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="bg-black/20 border-white/10" placeholder="e.g. Germany" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/80">{isAr ? "رمز الدولة (حرفين)" : "Country Code (2 letters)"}</label>
                <Input required value={formData.countryCode} onChange={e => setFormData({...formData, countryCode: e.target.value.toUpperCase()})} maxLength={2} className="bg-black/20 border-white/10 font-mono uppercase" dir="ltr" placeholder="DE" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground/80">{isAr ? "الحالة" : "Status"}</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value as any})}
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
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isAr ? "حفظ البروكسي" : "Save Proxy"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

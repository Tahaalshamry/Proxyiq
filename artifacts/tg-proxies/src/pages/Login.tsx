import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate slight network delay for feel
    await new Promise(r => setTimeout(r, 800));
    
    const success = login(username, password);
    setIsLoading(false);

    if (success) {
      toast.success(isAr ? "تم تسجيل الدخول بنجاح" : "Logged in successfully");
      setLocation("/admin");
    } else {
      toast.error(isAr ? "بيانات الدخول غير صحيحة" : "Invalid credentials");
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 relative">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">
              {isAr ? "تسجيل دخول المشرف" : "Admin Login"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isAr ? "يرجى إدخال بيانات الدخول الخاصة بك" : "Please enter your credentials to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                {isAr ? "اسم المستخدم" : "Username"}
              </label>
              <Input
                required
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="bg-black/20 border-white/10 h-12 focus:border-primary/50 font-mono"
                placeholder="admin"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                {isAr ? "كلمة المرور" : "Password"}
              </label>
              <Input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-black/20 border-white/10 h-12 focus:border-primary/50 font-mono"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  {isAr ? "دخول" : "Sign In"}
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

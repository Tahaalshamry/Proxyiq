import { motion } from "framer-motion";
import { Instagram, Sparkles, Code2, ShieldCheck } from "lucide-react";
import creatorPhoto from "@assets/IMG_5839_1777110228239.jpeg";

interface CreatorSectionProps {
  lang: "ar" | "en";
}

export function CreatorSection({ lang }: CreatorSectionProps) {
  const isAr = lang === "ar";

  const stats = [
    {
      icon: Code2,
      label: isAr ? "تطوير" : "Development",
      value: isAr ? "كامل" : "Full-stack",
    },
    {
      icon: ShieldCheck,
      label: isAr ? "أمان" : "Security",
      value: isAr ? "موثوق" : "Trusted",
    },
    {
      icon: Sparkles,
      label: isAr ? "تصميم" : "Design",
      value: isAr ? "حصري" : "Exclusive",
    },
  ];

  return (
    <section id="creator" className="w-full px-4 py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 via-primary/5 to-fuchsia-500/5 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(168,85,247,0.4)] overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="md:col-span-2 relative min-h-[400px] md:min-h-[520px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-fuchsia-500/30" />
              <img
                src={creatorPhoto}
                alt="Taha Alshamry"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/40" />

              {/* Floating badge over photo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-primary/40 text-primary text-xs font-mono uppercase tracking-wider shadow-lg"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {isAr ? "صانع الموقع" : "The Maker"}
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-3"
              >
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-primary/80">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAr ? "تصميم وتطوير" : "Designed & Developed by"}
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-fuchsia-300 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                    {isAr ? "طه الشمري" : "Taha Alshamry"}
                  </span>
                  <span className="block mt-2 text-base md:text-lg font-light text-muted-foreground tracking-wide">
                    {isAr ? "Taha Alshamry" : "طه الشمري"}
                  </span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                {isAr
                  ? "صنعت هذا الموقع بكل عناية لأقدم لك بروكسيات تيليجرام موثوقة وسريعة داخل العراق. الجودة، الأمان، والتجربة العصرية كانت أولويتي في كل تفصيل."
                  : "I crafted this site with care to bring you trusted, high-speed Telegram proxies inside Iraq. Quality, security, and a modern experience were the priority in every detail."}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-3 pt-2"
              >
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/30 hover:bg-white/10 transition-all"
                  >
                    <s.icon className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {s.value}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Instagram CTA */}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                href="https://www.instagram.com/_t9ln"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary via-fuchsia-500 to-primary text-primary-foreground font-bold shadow-[0_0_30px_-5px_rgba(168,85,247,0.7)] hover:shadow-[0_0_45px_-5px_rgba(168,85,247,0.9)] hover:scale-[1.02] transition-all duration-300 self-start"
              >
                <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>{isAr ? "تابعني على إنستغرام" : "Follow on Instagram"}</span>
                <span className="font-mono text-sm opacity-90">@_t9ln</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

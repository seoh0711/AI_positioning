"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Zap, Cpu, Palette, Loader2, Briefcase,
  Target, Lightbulb, TrendingUp, ChevronRight,
  Copy, Check, Languages, Sparkles, Search, BrainCircuit, Rocket, RotateCcw,
  ExternalLink, LogIn, LogOut, User, ArrowRight
} from "lucide-react";
import { translations, Language } from "@/lib/translations";

interface DualText { ko: string; en: string; }

interface AutomationTask {
  title: DualText;
  reason: DualText;
  automation_prompt: DualText;
}
interface AIEnhancedTask {
  title: DualText;
  scenario: DualText;
  tool_recommendation: DualText;
}
interface CreativeTask {
  title: DualText;
  human_value: DualText;
}
interface PositioningResult {
  job_title: DualText;
  definition: DualText;
  positioning_summary: DualText;
  categories: {
    automation: AutomationTask[];
    ai_enhanced: AIEnhancedTask[];
    creative: CreativeTask[];
  };
  career_advice: DualText[];
}

// ── Job Theme System ─────────────────────────────────────────────
const JOB_THEMES: Record<string, { background: string; cursor: string; glowColor: string }> = {
  default: {
    background: "#0a0a0a",
    cursor: "🔍",
    glowColor: "rgba(255,255,255,0.15)",
  },
  tech: {
    background: "radial-gradient(ellipse at 20% 30%, rgba(59,130,246,0.15) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.1) 0%, transparent 50%), #0a0a0a",
    cursor: "💻",
    glowColor: "rgba(59,130,246,0.6)",
  },
  design: {
    background: "radial-gradient(ellipse at 70% 20%, rgba(236,72,153,0.15) 0%, transparent 55%), radial-gradient(ellipse at 25% 80%, rgba(168,85,247,0.1) 0%, transparent 50%), #0a0a0a",
    cursor: "🎨",
    glowColor: "rgba(236,72,153,0.6)",
  },
  medical: {
    background: "radial-gradient(ellipse at 30% 40%, rgba(16,185,129,0.14) 0%, transparent 55%), radial-gradient(ellipse at 70% 65%, rgba(6,182,212,0.1) 0%, transparent 50%), #0a0a0a",
    cursor: "🩺",
    glowColor: "rgba(16,185,129,0.6)",
  },
  finance: {
    background: "radial-gradient(ellipse at 60% 25%, rgba(245,158,11,0.14) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(234,179,8,0.09) 0%, transparent 50%), #0a0a0a",
    cursor: "📊",
    glowColor: "rgba(245,158,11,0.6)",
  },
  education: {
    background: "radial-gradient(ellipse at 25% 35%, rgba(139,92,246,0.14) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(99,102,241,0.1) 0%, transparent 50%), #0a0a0a",
    cursor: "📚",
    glowColor: "rgba(139,92,246,0.6)",
  },
  legal: {
    background: "radial-gradient(ellipse at 40% 30%, rgba(71,85,105,0.2) 0%, transparent 55%), radial-gradient(ellipse at 65% 70%, rgba(51,65,85,0.15) 0%, transparent 50%), #07080f",
    cursor: "⚖️",
    glowColor: "rgba(148,163,184,0.5)",
  },
  marketing: {
    background: "radial-gradient(ellipse at 65% 25%, rgba(244,63,94,0.15) 0%, transparent 55%), radial-gradient(ellipse at 30% 75%, rgba(251,113,133,0.1) 0%, transparent 50%), #0a0a0a",
    cursor: "📢",
    glowColor: "rgba(244,63,94,0.6)",
  },
  food: {
    background: "radial-gradient(ellipse at 50% 25%, rgba(249,115,22,0.15) 0%, transparent 55%), radial-gradient(ellipse at 25% 70%, rgba(234,179,8,0.1) 0%, transparent 50%), #0a0a0a",
    cursor: "🍳",
    glowColor: "rgba(249,115,22,0.6)",
  },
  creative: {
    background: "radial-gradient(ellipse at 35% 30%, rgba(168,85,247,0.14) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(217,70,239,0.1) 0%, transparent 50%), #0a0a0a",
    cursor: "✨",
    glowColor: "rgba(168,85,247,0.6)",
  },
  science: {
    background: "radial-gradient(ellipse at 20% 60%, rgba(52,211,153,0.14) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(34,211,238,0.1) 0%, transparent 50%), #0a0a0a",
    cursor: "🔬",
    glowColor: "rgba(52,211,153,0.6)",
  },
  sports: {
    background: "radial-gradient(ellipse at 40% 25%, rgba(74,222,128,0.14) 0%, transparent 55%), radial-gradient(ellipse at 65% 70%, rgba(163,230,53,0.1) 0%, transparent 50%), #0a0a0a",
    cursor: "🏋️",
    glowColor: "rgba(74,222,128,0.6)",
  },
  business: {
    background: "radial-gradient(ellipse at 55% 35%, rgba(107,114,128,0.12) 0%, transparent 55%), radial-gradient(ellipse at 30% 65%, rgba(75,85,99,0.09) 0%, transparent 50%), #080808",
    cursor: "📋",
    glowColor: "rgba(156,163,175,0.5)",
  },
};

function detectJobTheme(jobTitle: string): string {
  const t = jobTitle.toLowerCase();
  if (/개발|엔지니어|프로그래머|software|developer|engineer|programmer|코딩|데이터|sre|devops|backend|frontend|fullstack/.test(t)) return "tech";
  if (/디자인|designer|ux|ui|그래픽|graphic|일러스트|motion|figma/.test(t)) return "design";
  if (/의사|간호|약사|의료|doctor|nurse|medical|health|병원|치과|수의|한의/.test(t)) return "medical";
  if (/회계|금융|finance|accounting|analyst|투자|증권|펀드|trader|banker/.test(t)) return "finance";
  if (/교사|교수|teacher|professor|강사|튜터|instructor|교육|학원|코치/.test(t)) return "education";
  if (/변호사|검사|판사|법|lawyer|attorney|legal|paralegal/.test(t)) return "legal";
  if (/마케터|marketing|광고|brand|홍보|pr |sns|콘텐츠|content creator/.test(t)) return "marketing";
  if (/요리|셰프|chef|cook|baker|culinary|바리스타|barista|제과/.test(t)) return "food";
  if (/작가|음악|musician|writer|author|창작|문학|시인|소설|작곡|illustrator/.test(t)) return "creative";
  if (/과학|연구|scientist|researcher|biology|chemistry|물리|화학|생물|공학/.test(t)) return "science";
  if (/운동|피트니스|fitness|trainer|sports|athlete|선수|감독/.test(t)) return "sports";
  if (/경영|매니저|manager|executive|ceo|cto|기획|전략|컨설턴트|consultant|pm/.test(t)) return "business";
  return "default";
}

export default function Home() {
  const { data: session } = useSession();
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PositioningResult | null>(null);
  const [lang, setLang] = useState<Language>("ko");
  const [showToast, setShowToast] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [refreshingCategories, setRefreshingCategories] = useState<Record<string, boolean>>({});
  const [jobTheme, setJobTheme] = useState<string>("default");

  // Custom cursor
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 250, damping: 22 });
  const springY = useSpring(cursorY, { stiffness: 250, damping: 22 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [cursorX, cursorY]);

  useEffect(() => {
    if (result) {
      const title = `${result.job_title?.ko || ""} ${result.job_title?.en || ""}`;
      setJobTheme(detectJobTheme(title));
    } else {
      setJobTheme("default");
    }
  }, [result]);

  const currentTheme = JOB_THEMES[jobTheme] ?? JOB_THEMES.default;

  const t = translations[lang];

  const loadingMessages = t.loading ? [
    t.loading.step1, t.loading.step2, t.loading.step3,
    t.loading.step4, t.loading.final
  ] : [];

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => prev < loadingMessages.length - 1 ? prev + 1 : prev);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  const toggleLanguage = () => setLang(prev => prev === "ko" ? "en" : "ko");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const transformAdviceToPrompt = (advice: DualText) => {
    const text = advice[lang];
    if (lang === "ko") return text.replace(/(하세요|하시오|세요)\.?$/, "하는 방법을 알려주세요");
    return `Please tell me more about how to ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  };

  const openAITool = (text: string, tool: "openai" | "claude" | "gemini") => {
    copyToClipboard(text);
    const urls = {
      openai: `https://chatgpt.com/?q=${encodeURIComponent(text)}`,
      claude: `https://claude.ai/`,
      gemini: `https://gemini.google.com/app`
    };
    window.open(urls[tool], "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/positioning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      setResult(await res.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCategory = async (category: "automation" | "ai_enhanced" | "creative") => {
    if (!result || refreshingCategories[category]) return;
    setRefreshingCategories(prev => ({ ...prev, [category]: true }));
    try {
      const res = await fetch("/api/positioning/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, category }),
      });
      if (!res.ok) throw new Error("Refresh failed");
      const newData = await res.json();
      setResult(prev => prev ? { ...prev, categories: { ...prev.categories, [category]: newData } } : prev);
    } catch (error) {
      console.error("Refresh Error:", error);
    } finally {
      setRefreshingCategories(prev => ({ ...prev, [category]: false }));
    }
  };

  return (
    <main className="min-h-screen text-[#f0f0f0] p-6 md:p-12 relative" style={{ background: "#0a0a0a" }}>

      {/* ── Dynamic Background Overlay ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            key={jobTheme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="fixed inset-0 pointer-events-none"
            style={{ background: currentTheme.background, zIndex: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto space-y-14 relative" style={{ zIndex: 1 }}>

        {/* ── Header ──────────────────────────────────── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pt-4">
          <div className="space-y-5">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ background: "#161616", border: "1px solid #242424", color: "#5a5a5a" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#444]" />
              {t.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none" style={{ color: "#f0f0f0" }}>
              AI{" "}
              <span style={{ color: "#3a3a3a" }}>{t.title}</span>
            </h1>
            <p className="text-sm font-medium max-w-xl leading-relaxed" style={{ color: "#5a5a5a" }}>
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{ background: "#111", border: "1px solid #242424" }}
              >
                {session.user?.image
                  ? <img src={session.user.image} alt={session.user.name || ""} className="w-8 h-8 rounded-lg" />
                  : <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1e1e1e" }}><User size={16} style={{ color: "#5a5a5a" }} /></div>
                }
                <span className="text-sm font-bold hidden sm:block" style={{ color: "#888" }}>{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="p-1.5 rounded-lg transition-colors ml-1"
                  style={{ color: "#444" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#888")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#444")}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
                style={{ background: "#111", border: "1px solid #242424", color: "#888" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#333"; (e.currentTarget as HTMLButtonElement).style.color = "#f0f0f0"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#242424"; (e.currentTarget as HTMLButtonElement).style.color = "#888"; }}
              >
                <LogIn size={16} />
                Sign In
              </button>
            )}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
              style={{ background: "#111", border: "1px solid #242424", color: "#888" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#333"; (e.currentTarget as HTMLButtonElement).style.color = "#f0f0f0"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#242424"; (e.currentTarget as HTMLButtonElement).style.color = "#888"; }}
            >
              <Languages size={16} />
              {lang === "ko" ? "English" : "한국어"}
            </button>
          </div>
        </header>

        {/* ── Divider ─────────────────────────────────── */}
        <div style={{ height: "1px", background: "#1a1a1a" }} />

        {/* ── Input ───────────────────────────────────── */}
        <section className="max-w-3xl mx-auto">
          {!session ? (
            <div
              className="text-center py-24 px-10 rounded-2xl space-y-6"
              style={{ background: "#111", border: "1px solid #1e1e1e" }}
            >
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ background: "#161616", border: "1px solid #222" }}>
                <BrainCircuit size={32} style={{ color: "#3a3a3a" }} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: "#888" }}>Access Restricted</h3>
                <p className="text-sm max-w-sm mx-auto" style={{ color: "#444" }}>
                  {lang === "ko"
                    ? "@hanbit.co.kr 계정으로 로그인해 주세요."
                    : "Please sign in with your @hanbit.co.kr account."}
                </p>
              </div>
              <button
                onClick={() => signIn("google")}
                className="px-10 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all"
                style={{ background: "#f0f0f0", color: "#0a0a0a" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.background = "#f0f0f0")}
              >
                Sign In with Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={job}
                onChange={e => setJob(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full px-8 py-6 text-lg font-medium rounded-2xl outline-none transition-all"
                style={{
                  background: "#111",
                  border: "1px solid #242424",
                  color: "#f0f0f0",
                  caretColor: "#f0f0f0",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "#444")}
                onBlur={e => (e.currentTarget.style.borderColor = "#242424")}
              />
              <button
                disabled={loading}
                className="absolute right-3 top-3 bottom-3 px-8 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-40"
                style={{ background: "#f0f0f0", color: "#0a0a0a" }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#f0f0f0"}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                <span>{loading ? t.analyzing : t.searchButton}</span>
              </button>
            </form>
          )}
        </section>

        {/* ── Results ─────────────────────────────────── */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* Job Summary + Core Advice */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

              {/* Job Info */}
              <div className="rounded-2xl p-10 space-y-8" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
                <div>
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase mb-5"
                    style={{ background: "#161616", border: "1px solid #222", color: "#444" }}
                  >
                    Target Profile
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: "#f0f0f0" }}>
                    {result?.job_title?.[lang] || ""}
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: "#666" }}>
                    {result?.definition?.[lang] || ""}
                  </p>
                </div>

                <div className="pt-4" style={{ borderTop: "1px solid #1a1a1a" }}>
                  <p className="text-lg font-medium leading-relaxed italic" style={{ color: "#888" }}>
                    &ldquo;{result?.positioning_summary?.[lang] || ""}&rdquo;
                  </p>
                </div>
              </div>

              {/* Core Advice */}
              <div className="rounded-2xl p-8 flex flex-col gap-6" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#161616", border: "1px solid #222" }}>
                    <Lightbulb size={18} style={{ color: "#7a7a7a" }} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-[0.15em]" style={{ color: "#888" }}>{t.coreAdvice}</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                  {result?.career_advice?.map((advice, i) => {
                    const prompt = transformAdviceToPrompt(advice);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * i }}
                        className="p-4 rounded-xl space-y-3 transition-all"
                        style={{ background: "#161616", border: "1px solid #1e1e1e" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
                          {advice?.[lang] || ""}
                        </p>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => copyToClipboard(prompt)}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: "#3a3a3a" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#888")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#3a3a3a")}
                          >
                            <Copy size={14} />
                          </button>
                          <div style={{ width: 1, height: 14, background: "#222" }} />
                          {(["openai", "claude", "gemini"] as const).map(tool => (
                            <button
                              key={tool}
                              onClick={() => openAITool(prompt, tool)}
                              className="w-4 h-4 transition-opacity opacity-30 hover:opacity-70"
                            >
                              <img src={`/logos/${tool}.svg`} alt={tool} className="w-full h-full object-contain filter brightness-0 invert" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:grid-rows-[repeat(6,auto)]">
              <CategorySection
                title={t.automation.title}
                description={t.automation.desc}
                accentClass="accent-auto"
                accentText="accent-auto-text"
                accentBg="accent-auto-bg"
                icon={<Cpu size={20} style={{ color: "#6a9fc0" }} />}
                items={result.categories.automation}
                isRefreshing={refreshingCategories.automation}
                onRefresh={() => handleRefreshCategory("automation")}
                renderItem={(item: AutomationTask, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <p className="font-bold text-base leading-tight" style={{ color: "#e0e0e0" }}>
                      {item?.title?.[lang] || ""}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                      {item?.reason?.[lang] || ""}
                    </p>
                    <div className="p-3 rounded-xl space-y-2 accent-auto-bg" style={{ border: "1px solid #1e2830" }}>
                      <div className="text-[9px] font-black tracking-[0.2em] uppercase flex items-center justify-between" style={{ color: "#4a7a9a" }}>
                        AI Automation Prompt
                        <div className="flex items-center gap-2">
                          <button onClick={() => copyToClipboard(item?.automation_prompt?.[lang] || "")} className="p-1 rounded transition-opacity opacity-40 hover:opacity-100">
                            <Copy size={12} style={{ color: "#6a9fc0" }} />
                          </button>
                          <div style={{ width: 1, height: 10, background: "#2a3a4a" }} />
                          {(["openai", "claude", "gemini"] as const).map(tool => (
                            <button key={tool} onClick={() => openAITool(item?.automation_prompt?.[lang] || "", tool)} className="w-3.5 h-3.5 opacity-30 hover:opacity-80 transition-opacity">
                              <img src={`/logos/${tool}.svg`} alt={tool} className="w-full h-full object-contain filter brightness-0 invert" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-mono leading-relaxed" style={{ color: "#555" }}>
                        &ldquo;{item?.automation_prompt?.[lang] || ""}&rdquo;
                      </p>
                    </div>
                  </div>
                )}
                delay={0}
              />

              <CategorySection
                title={t.aiEnhanced.title}
                description={t.aiEnhanced.desc}
                accentClass="accent-ai"
                accentText="accent-ai-text"
                accentBg="accent-ai-bg"
                icon={<Zap size={20} style={{ color: "#9a8ac0" }} />}
                items={result.categories.ai_enhanced}
                isRefreshing={refreshingCategories.ai_enhanced}
                onRefresh={() => handleRefreshCategory("ai_enhanced")}
                renderItem={(item: AIEnhancedTask, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <p className="font-bold text-base leading-tight" style={{ color: "#e0e0e0" }}>
                      {item?.title?.[lang] || ""}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                      {item?.scenario?.[lang] || ""}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest" style={{ background: "#1a1826", border: "1px solid #2a2640", color: "#7a6aaa" }}>
                        Tool
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "#888" }}>
                        {item?.tool_recommendation?.[lang] || ""}
                      </span>
                    </div>
                  </div>
                )}
                delay={0.05}
              />

              <CategorySection
                title={t.creative.title}
                description={t.creative.desc}
                accentClass="accent-create"
                accentText="accent-create-text"
                accentBg="accent-create-bg"
                icon={<Palette size={20} style={{ color: "#c08a8a" }} />}
                items={result.categories.creative}
                isRefreshing={refreshingCategories.creative}
                onRefresh={() => handleRefreshCategory("creative")}
                renderItem={(item: CreativeTask, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <p className="font-bold text-base leading-tight" style={{ color: "#e0e0e0" }}>
                      {item?.title?.[lang] || ""}
                    </p>
                    <div className="p-3 rounded-xl accent-create-bg" style={{ border: "1px solid #2a1e1e" }}>
                      <div className="text-[9px] font-black tracking-[0.2em] uppercase mb-1.5" style={{ color: "#8a5a5a" }}>Human Value</div>
                      <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
                        {item?.human_value?.[lang] || ""}
                      </p>
                    </div>
                  </div>
                )}
                delay={0.1}
              />
            </div>

            {/* Philosophical Section */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-12 md:p-20 text-center space-y-12"
              style={{ background: "#0e0e0e", border: "1px solid #1a1a1a" }}
            >
              <div className="space-y-5">
                <span className="text-[9px] font-black tracking-[0.5em] uppercase block" style={{ color: "#333" }}>
                  {t.philosophical.tag}
                </span>
                <blockquote className="text-2xl md:text-4xl font-black italic leading-tight max-w-4xl mx-auto" style={{ color: "#c0c0c0" }}>
                  &ldquo;{t.philosophical.quote}&rdquo;
                </blockquote>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[t.philosophical.bullet1, t.philosophical.bullet2, t.philosophical.bullet3].map((text, i) => (
                  <div key={i} className="p-6 rounded-xl text-sm leading-relaxed" style={{ background: "#111", border: "1px solid #1e1e1e", color: "#666" }}>
                    {text}
                  </div>
                ))}
              </div>

              <div className="space-y-8 max-w-3xl mx-auto">
                <p className="text-base leading-relaxed" style={{ color: "#555" }}>
                  {t.philosophical.convenience}
                  <br />
                  <span className="font-bold" style={{ color: "#888" }}>{t.philosophical.warning}</span>
                </p>

                <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: "#2a2a2a" }}>
                  <span>{t.philosophical.history1}</span>
                  <span>{t.philosophical.history2}</span>
                  <span>{t.philosophical.history3}</span>
                </div>

                <p className="text-xl md:text-3xl font-black leading-tight" style={{ color: "#888" }}>
                  {t.philosophical.final1}
                  <br />
                  {t.philosophical.final2}
                  <br />
                  <span style={{ color: "#f0f0f0" }}>
                    {lang === "ko" ? "배우느냐에 의해 결정됩니다." : "is built by what you learn today."}
                  </span>
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const query = result?.job_title?.[lang] || job;
                    if (!query) return;
                    const url = lang === "ko"
                      ? `https://www.hanbit.co.kr/search/result?q=${encodeURIComponent(query)}`
                      : `https://www.amazon.com/s?k=${encodeURIComponent(query)}&i=stripbooks-intl-ship`;
                    window.open(url, "_blank");
                  }}
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all"
                  style={{ background: "#f0f0f0", color: "#0a0a0a" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#f0f0f0")}
                >
                  {t.philosophical.cta}
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </div>

      {/* ── Job Emoji Follower ── */}
      {result && (
        <motion.div
          style={{
            position: "fixed",
            left: springX,
            top: springY,
            marginLeft: 14,
            marginTop: -28,
            pointerEvents: "none",
            zIndex: 9999,
            fontSize: 28,
            lineHeight: 1,
            userSelect: "none",
            filter: `drop-shadow(0 0 8px ${currentTheme.glowColor})`,
          }}
        >
          {currentTheme.cursor}
        </motion.div>
      )}

      {/* Toast */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm pointer-events-auto"
              style={{ background: "#161616", border: "1px solid #2a2a2a", color: "#aaa" }}
            >
              <Check size={16} style={{ color: "#6a6a6a" }} />
              <span>
                {t.toast.copied}{" "}
                <span style={{ color: "#888" }}>{t.toast.instruction}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && <LoadingOverlay message={loadingMessages[loadingStep]} />}
      </AnimatePresence>
    </main>
  );
}

function LoadingOverlay({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(8px)" }}
    >
      <div className="text-center space-y-10 max-w-md px-6">
        <div className="relative w-20 h-20 mx-auto">
          <div
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{ border: "1px solid #1e1e1e", borderTopColor: "#3a3a3a" }}
          />
          <div className="absolute inset-4 rounded-xl flex items-center justify-center" style={{ background: "#161616", border: "1px solid #222" }}>
            <Sparkles size={22} style={{ color: "#444" }} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black tracking-[0.4em] uppercase" style={{ color: "#333" }}>
            Strategic Positioning Analysis
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-base font-medium leading-relaxed"
              style={{ color: "#666" }}
            >
              {message}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="w-48 h-px mx-auto overflow-hidden rounded-full" style={{ background: "#1a1a1a" }}>
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1/2 h-full"
            style={{ background: "linear-gradient(90deg, transparent, #3a3a3a, transparent)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function CategorySection({
  title, description, icon, items, renderItem,
  accentClass, accentText, accentBg,
  delay, isRefreshing, onRefresh
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl overflow-hidden grid grid-rows-subgrid row-span-1 md:row-span-6"
      style={{ background: "#111", border: "1px solid #1e1e1e" }}
    >
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(4px)" }}
          >
            <div className="w-8 h-8 rounded-full border border-[#333] border-t-[#666] animate-spin-slow" />
            <p className="mt-3 text-[10px] font-black tracking-widest uppercase" style={{ color: "#444" }}>Regenerating...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div className="p-8 flex items-center justify-between" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#161616", border: "1px solid #1e1e1e" }}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight uppercase" style={{ color: "#d0d0d0" }}>{title}</h3>
            <p className="text-xs" style={{ color: "#444" }}>{description}</p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "#161616", border: "1px solid #1e1e1e", color: "#3a3a3a" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#333"; (e.currentTarget as HTMLButtonElement).style.color = "#888"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e1e1e"; (e.currentTarget as HTMLButtonElement).style.color = "#3a3a3a"; }}
            title="Refresh"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      {/* Items */}
      <ul className="grid grid-rows-subgrid row-span-1 md:row-span-5 list-none p-0 m-0">
        {items?.map((item: any, i: number) => (
          <li
            key={i}
            className="p-8 row-span-1"
            style={{ borderBottom: i !== items.length - 1 ? "1px solid #161616" : "none" }}
          >
            {renderItem(item, i)}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

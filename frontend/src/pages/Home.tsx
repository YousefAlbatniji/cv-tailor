import { useState } from "react";
import {
  Sparkles, Loader2, AlertCircle, Upload, ClipboardPaste, Download,
  FileText, Mail, Layout, ArrowRight, Check, Zap, ShieldCheck,
} from "lucide-react";
import { FileUpload } from "../components/FileUpload";
import { Background } from "../components/Background";
import { Logo } from "../components/Logo";
import { uploadCV, generateContent } from "../services/api";
import type { GenerateResponse } from "../types";

interface Props {
  onResults: (results: GenerateResponse) => void;
}

export function Home({ onResults }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!file || !jobDescription.trim()) {
      setError("Please upload your CV and paste the job description.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      setStatus("Uploading your CV...");
      const { session_id } = await uploadCV(file);

      setStatus("AI is tailoring your application — this takes ~15 seconds...");
      const results = await generateContent(session_id, jobDescription);

      onResults(results);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const canSubmit = !!file && jobDescription.trim().length > 0 && !loading;

  const steps = [
    { icon: Upload, title: "Upload your CV", text: "PDF or DOCX. Your design is kept exactly as it is." },
    { icon: ClipboardPaste, title: "Paste the job", text: "Add the job description you are applying for." },
    { icon: Download, title: "Download & apply", text: "Get a tailored CV (PDF or Word) and 3 cover letters." },
  ];

  const features = [
    { icon: FileText, title: "Tailored CV", text: "Summary and bullets rewritten to match the role, with your layout untouched." },
    { icon: Mail, title: "3 cover letters", text: "Professional, Creative and Concise, filled in with your real details." },
    { icon: Layout, title: "PDF & Word", text: "Download in the format the employer wants. Same template, new content." },
    { icon: ShieldCheck, title: "Only your facts", text: "The AI uses what is in your CV and never invents experience." },
  ];

  return (
    <div className="relative min-h-screen text-gray-200">
      <Background />

      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between animate-fade-up">
        <a href="#top"><Logo /></a>
        <a href="#try" className="btn-ghost text-sm px-5 py-2.5">Try it free</a>
      </header>

      {/* Hero */}
      <section id="top" className="max-w-6xl mx-auto px-6 pt-14 pb-28 grid lg:grid-cols-2 gap-14 items-center">
        <div className="text-center lg:text-left">
          <p className="animate-fade-up inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-sm font-medium text-violet-200 mb-7">
            <Zap className="w-4 h-4 text-amber-300" />
            AI-powered job applications
          </p>
          <h1 className="animate-fade-up [animation-delay:.1s] text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.02] text-white mb-6">
            One CV.
            <br />
            <span className="text-gradient">Every job.</span>
          </h1>
          <p className="animate-fade-up [animation-delay:.2s] text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-9">
            Upload your CV, paste a job description, and get a tailored CV in
            your original design plus three cover letters. In seconds.
          </p>
          <div className="animate-fade-up [animation-delay:.3s] flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="#try" className="btn-primary px-7 py-3.5">
              Get started <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#how" className="btn-ghost px-7 py-3.5">How it works</a>
          </div>
        </div>

        {/* Hero visual: before -> after */}
        <div className="animate-fade-up [animation-delay:.25s] relative max-w-md mx-auto w-full">
          <div className="absolute -inset-6 bg-gradient-to-tr from-indigo-500/30 via-violet-500/20 to-cyan-400/30 blur-3xl rounded-full" />
          <div className="relative glass rounded-3xl p-6 shadow-2xl shadow-violet-900/30">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-amber-300/80" />
              <span className="w-3 h-3 rounded-full bg-green-400/80" />
              <span className="ml-auto text-xs text-gray-500">your_cv.pdf</span>
            </div>
            <div className="space-y-3">
              <div className="h-3 w-1/3 rounded bg-white/25" />
              <div className="h-2 w-full rounded bg-white/10" />
              <div className="h-2 w-5/6 rounded bg-white/10" />
            </div>
            <div className="my-5 rounded-xl border border-violet-400/30 bg-violet-500/10 p-4 relative overflow-hidden">
              <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
              <p className="text-[11px] uppercase tracking-wider text-violet-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Rewritten for: AI Engineer
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Built a RAG-based assistant with LLM orchestration and vector
                search, automating 50+ workflows.
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full rounded bg-white/10" />
              <div className="h-2 w-4/6 rounded bg-white/10" />
            </div>
          </div>
          <div className="absolute -bottom-5 -left-4 glass rounded-2xl px-4 py-3 flex items-center gap-2 text-sm animate-floaty shadow-xl">
            <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
            Layout preserved
          </div>
          <div className="absolute -top-9 -right-2 glass rounded-2xl px-4 py-3 flex items-center gap-2 text-sm animate-floaty [animation-delay:-3s] shadow-xl">
            <Mail className="w-4 h-4 text-cyan-300" /> 3 cover letters
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-6 pb-24 scroll-mt-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-3 tracking-tight">How it works</h2>
        <p className="text-gray-500 text-center mb-12">Three steps. No sign up.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="glass rounded-2xl p-7 hover:bg-white/[0.07] hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/30">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-5xl font-extrabold text-white/[0.06]">0{i + 1}</span>
              </div>
              <h3 className="font-semibold text-white mb-1.5">{s.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover:border-violet-400/40 transition-colors">
              <f.icon className="w-5 h-5 text-violet-300 mb-4" />
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool */}
      <section id="try" className="max-w-2xl mx-auto px-6 pb-28 scroll-mt-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-3 tracking-tight">
          Try it <span className="text-gradient">now</span>
        </h2>
        <p className="text-gray-500 text-center mb-10">Upload, paste, generate.</p>

        <div className="glass rounded-3xl p-8 space-y-6 shadow-2xl shadow-violet-900/20">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-3">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-violet-500/25 text-violet-200 text-xs font-bold rounded-full">1</span>
              Upload your CV
            </label>
            <FileUpload
              selectedFile={file}
              onFileSelect={(f) => { setFile(f); setError(""); }}
              onClear={() => setFile(null)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-3">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-violet-500/25 text-violet-200 text-xs font-bold rounded-full">2</span>
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => { setJobDescription(e.target.value); setError(""); }}
              placeholder="Paste the full job description here. The more detail, the better the tailoring..."
              rows={8}
              className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button onClick={handleGenerate} disabled={!canSubmit} className="btn-primary w-full py-4 text-sm">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" />{status}</>
            ) : (
              <><Sparkles className="w-5 h-5" />Generate Tailored Application</>
            )}
          </button>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-600 py-10 border-t border-white/5">
        CV Tailor · Built with React, FastAPI and Groq
      </footer>
    </div>
  );
}

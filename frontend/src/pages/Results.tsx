import { useState } from "react";
import { ArrowLeft, Download, Check, FileText, Loader2, Mail, Sparkles, Wand2 } from "lucide-react";
import { CoverLetterTabs } from "../components/CoverLetterTabs";
import { Background } from "../components/Background";
import { Logo } from "../components/Logo";
import type { GenerateResponse } from "../types";

interface Props {
  results: GenerateResponse;
  onBack: () => void;
}

async function saveFile(url: string, filename: string) {
  const blob = await (await fetch(url)).blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function Results({ results, onBack }: Props) {
  const [busy, setBusy] = useState<"pdf" | "docx" | null>(null);

  const download = async (kind: "pdf" | "docx") => {
    const url = kind === "pdf" ? results.cv_pdf_url : results.cv_modified_url;
    if (!url) return;
    setBusy(kind);
    try {
      await saveFile(url, `tailored_cv.${kind}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="relative min-h-screen text-gray-200">
      <Background />

      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />
        <button onClick={onBack} className="btn-ghost text-sm px-5 py-2.5">
          <ArrowLeft className="w-4 h-4" />
          Start over
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8 pb-24">
        <div className="text-center mb-12">
          <div className="animate-pop w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <Check className="w-8 h-8" strokeWidth={3} />
          </div>
          <h1 className="animate-fade-up text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Your application is <span className="text-gradient">ready</span>
          </h1>
          <p className="animate-fade-up [animation-delay:.1s] text-gray-400 max-w-lg mx-auto">
            Pick a cover letter style, copy it, then download your tailored CV.
          </p>
          <div className="animate-fade-up [animation-delay:.2s] flex flex-wrap justify-center gap-3 mt-6 text-sm">
            <span className="glass rounded-full px-4 py-1.5 inline-flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-300" />3 cover letters</span>
            <span className="glass rounded-full px-4 py-1.5 inline-flex items-center gap-2"><FileText className="w-4 h-4 text-violet-300" />Original layout kept</span>
            <span className="glass rounded-full px-4 py-1.5 inline-flex items-center gap-2"><Download className="w-4 h-4 text-emerald-300" />{results.cv_pdf_url ? "PDF + Word" : "Word"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <section className="animate-fade-up [animation-delay:.2s] lg:col-span-3 glass rounded-3xl p-7 shadow-2xl shadow-violet-900/20">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Mail className="w-5 h-5 text-violet-300" /> Cover letter
            </h2>
            <CoverLetterTabs coverLetters={results.cover_letters} />
          </section>

          <section className="animate-fade-up [animation-delay:.3s] lg:col-span-2 glass rounded-3xl p-7 space-y-6 shadow-2xl shadow-violet-900/20">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-300" /> Tailored CV
            </h2>

            {results.modification_summary && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" /> What changed
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{results.modification_summary}</p>
              </div>
            )}

            <div className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
              <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
              <p>Your design and formatting are unchanged. Only the summary and bullet points were rewritten.</p>
            </div>

            <div className="space-y-3">
              {results.cv_pdf_url && (
                <button onClick={() => download("pdf")} disabled={busy !== null} className="btn-primary w-full py-4 text-sm">
                  {busy === "pdf" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  Download PDF
                </button>
              )}
              <button
                onClick={() => download("docx")}
                disabled={busy !== null}
                className={`${results.cv_pdf_url ? "btn-ghost" : "btn-primary"} w-full py-4 text-sm`}
              >
                {busy === "docx" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                Download Word (.docx)
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { CoverLetters, CoverLetterTemplate } from "../types";

interface Props {
  coverLetters: CoverLetters;
}

const TEMPLATES: { key: CoverLetterTemplate; label: string; description: string }[] = [
  { key: "professional", label: "Professional", description: "Formal" },
  { key: "creative", label: "Creative", description: "Personal" },
  { key: "concise", label: "Concise", description: "Short" },
];

export function CoverLetterTabs({ coverLetters }: Props) {
  const [active, setActive] = useState<CoverLetterTemplate>("professional");
  const [copied, setCopied] = useState(false);

  const text = coverLetters[active];
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 p-1 mb-4 bg-black/30 border border-white/5 rounded-xl">
        {TEMPLATES.map(({ key, label, description }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
              active === key
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-violet-600/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {label}
            <span className={`block text-xs font-normal ${active === key ? "text-violet-100/80" : "text-gray-600"}`}>
              {description}
            </span>
          </button>
        ))}
      </div>

      <div
        key={active}
        className="animate-fade-up bg-black/30 rounded-xl p-5 text-gray-300 text-sm leading-relaxed min-h-64 max-h-96 overflow-y-auto whitespace-pre-line border border-white/5"
      >
        {text}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-500">{words} words</span>
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            copied
              ? "bg-green-500/15 text-green-300 border-green-400/30"
              : "bg-white/5 text-gray-200 border-white/10 hover:bg-white/10"
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy letter"}
        </button>
      </div>
    </div>
  );
}

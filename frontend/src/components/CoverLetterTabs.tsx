import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { CoverLetters, CoverLetterTemplate } from "../types";

interface Props {
  coverLetters: CoverLetters;
}

const TEMPLATES: { key: CoverLetterTemplate; label: string; description: string }[] = [
  { key: "professional", label: "Professional", description: "Formal & structured" },
  { key: "creative", label: "Creative", description: "Storytelling & personality" },
  { key: "concise", label: "Concise", description: "Short & impactful" },
];

export function CoverLetterTabs({ coverLetters }: Props) {
  const [active, setActive] = useState<CoverLetterTemplate>("professional");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetters[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {TEMPLATES.map(({ key, label, description }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
              ${
                active === key
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
          >
            <span>{label}</span>
            <span
              className={`block text-xs font-normal ${
                active === key ? "text-indigo-200" : "text-gray-400"
              }`}
            >
              {description}
            </span>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="bg-gray-50 rounded-xl p-5 text-gray-700 text-sm leading-relaxed min-h-56 max-h-80 overflow-y-auto whitespace-pre-line border border-gray-100">
          {coverLetters[active]}
        </div>
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}

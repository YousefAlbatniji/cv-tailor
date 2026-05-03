import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { FileUpload } from "../components/FileUpload";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4" />
            Powered by Gemini AI
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            CV Tailor
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Upload your CV and paste a job description. Get a tailored cover
            letter in three styles and a modified CV — in seconds.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Step 1 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                1
              </span>
              Upload your CV
            </label>
            <FileUpload
              selectedFile={file}
              onFileSelect={(f) => {
                setFile(f);
                setError("");
              }}
              onClear={() => setFile(null)}
            />
          </div>

          {/* Step 2 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                2
              </span>
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setError("");
              }}
              placeholder="Paste the full job description here — the more detail, the better the tailoring..."
              rows={9}
              className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {status}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Tailored Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

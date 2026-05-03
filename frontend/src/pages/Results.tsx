import { ArrowLeft, Download, CheckCircle2, FileText } from "lucide-react";
import { CoverLetterTabs } from "../components/CoverLetterTabs";
import type { GenerateResponse } from "../types";

interface Props {
  results: GenerateResponse;
  onBack: () => void;
}

export function Results({ results, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Nav */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Start over
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your tailored application is ready
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Choose a cover letter style, copy it, then download your modified CV.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Cover Letters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Cover Letter
            </h2>
            <CoverLetterTabs coverLetters={results.cover_letters} />
          </div>

          {/* Modified CV */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-800">
              Modified CV
            </h2>

            {results.modification_summary && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 leading-relaxed">
                  {results.modification_summary}
                </p>
              </div>
            )}

            <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-700 leading-relaxed">
                The layout and structure of your CV are unchanged. Only the
                content (summary and bullet points) has been rewritten to match
                the job description.
              </p>
            </div>

            <a
              href={results.cv_modified_url}
              download="modified_cv.docx"
              className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm"
            >
              <Download className="w-5 h-5" />
              Download Modified CV (.docx)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

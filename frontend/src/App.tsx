import { useState } from "react";
import { Home } from "./pages/Home";
import { Results } from "./pages/Results";
import type { GenerateResponse } from "./types";

export default function App() {
  const [results, setResults] = useState<GenerateResponse | null>(null);

  return results ? (
    <Results results={results} onBack={() => setResults(null)} />
  ) : (
    <Home onResults={setResults} />
  );
}

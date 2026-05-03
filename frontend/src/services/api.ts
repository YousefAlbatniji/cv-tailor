import axios from "axios";
import type { UploadResponse, GenerateResponse } from "../types";

const api = axios.create({ baseURL: "/api" });

export async function uploadCV(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<UploadResponse>("/upload", form);
  return data;
}

export async function generateContent(
  sessionId: string,
  jobDescription: string
): Promise<GenerateResponse> {
  const { data } = await api.post<GenerateResponse>("/generate", {
    session_id: sessionId,
    job_description: jobDescription,
  });
  return data;
}

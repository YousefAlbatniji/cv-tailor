export interface UploadResponse {
  session_id: string;
  file_name: string;
  file_type: string;
}

export interface CoverLetters {
  professional: string;
  creative: string;
  concise: string;
}

export interface GenerateResponse {
  application_id: string;
  cover_letters: CoverLetters;
  cv_modified_url: string;
  modification_summary: string;
}

export type CoverLetterTemplate = keyof CoverLetters;

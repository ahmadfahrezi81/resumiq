import { Resume } from "@/types/resume";

export function buildPrompt(resume: Resume, jobDescription: string): string {
    return `
You are an expert resume writer and ATS optimization specialist.

You will be given a master resume in JSON format and a job description.
The input JSON may use different field names or structure than the output — normalize it.

Your task is to tailor the resume to the job by:
1. Rewriting the summary to align with the role — mention international experience and language certifications if relevant
2. Prioritizing and keeping only the most relevant experience (max 4 bullets per role, max 4 roles)
3. Reordering and filtering skills to match what the job asks for
4. Mapping certifications and language proficiency into education if present in the input
5. Preserving specific metrics, numbers, and achievements verbatim — never soften or generalize them
6. Never fabricating or hallucinating experience that isn't in the master resume
7. Keeping language concise and action-verb driven
8. Extracting 2–4 standout achievements from the resume that are most relevant to the job — these should be specific, quantified, or particularly impressive facts that deserve to stand alone (e.g. "Scaled sales to 5,000+ cups/month", "IELTS Band 6.0", "8 years working professionally in English in Canada"). Only include achievements that genuinely exist in the source resume.

Input field mapping guide (normalize these into the output schema):
- "contact.email" or "email" → email
- "contact.phone" or "phone" → phone
- "responsibilities" or "bullets" → bullets
- "period.start/end" or "startDate/endDate" → startDate/endDate
- "employer" or "company" → company
- "qualification" or "degree" → degree
- "certifications" → add as education entries AND consider for achievements
- "languages" → add relevant ones to skills or education
- "international_experience" → weave into summary, experience bullets, and achievements

Return ONLY a valid JSON object that matches this TypeScript type exactly:
{
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  summary: string;
  skills: string[];
  achievements?: Array<{
    title: string;
    description: string;
  }>;
  experience: Array<{
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    bullets: string[];
    url?: string;
  }>;
}

Do not include markdown, backticks, or any explanation. JSON only.

MASTER RESUME:
${JSON.stringify(resume, null, 2)}

JOB DESCRIPTION:
${jobDescription}
  `.trim();
}

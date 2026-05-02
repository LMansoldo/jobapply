# Prompt — jobapply-app: implement Resume generation in tailoring workspace

## Context

The API now has two new resume generation endpoints:

- `POST /cv/:id/generate-resume` — uses CV id + `cvMarkdown` + `jobDescription`/`jobId`
- `POST /cv/generate-resume/direct` — uses `cvMarkdown` + `jobDescription` directly

**Response shape:**
```json
{
  "resume": "string",   // full markdown of a 1-page ATS-optimized resume
  "locale": "en" | "pt-BR"
}
```

The resume is a condensed, keyword-optimized 1-page markdown document tailored to the JD. It is different from the full CV — it selects only the most relevant experiences, restructures skills around JD keywords, and integrates ATS analysis signals (rephrases, keyword phrases, semantic gaps).

---

## Files to change

### 1. `src/infrastructure/repositories/cvRepository.ts`

Add a new response interface and function after `analyzeCV`:

```ts
export interface GenerateResumeResponse {
  resume: string
  locale: 'en' | 'pt-BR'
}

export async function generateResume(
  cvId: string,
  jobId: string | undefined,
  locale: 'en' | 'pt-BR',
  jobDescription: string,
  cvMarkdown: string,
): Promise<GenerateResumeResponse> {
  if (USE_MOCK) {
    await delay(2500)
    return {
      resume: `# CV Mock — Tailored Resume\n\n## Summary\nThis is a mock ATS-optimized resume generated for the target role.\n\n## Skills\n**Frontend:** React, TypeScript, Svelte\n\n## Experience\n### Senior Engineer | Mock Company\n**Jan 2023 – Present**\n- Built scalable frontend systems using React and TypeScript.\n`,
      locale,
    }
  }

  const body: Record<string, string> = { locale, jobDescription, cvMarkdown }
  if (jobId) body.jobId = jobId
  const { data } = await api.post<GenerateResumeResponse>(`/cv/${cvId}/generate-resume`, body)
  return data
}
```

---

### 2. `src/domain/cv/hooks/useTailoringWorkspace.ts`

#### Imports
Add `generateResume` to the import from `cvRepository`:
```ts
import {
  getCV,
  analyzeCV,
  generateCoverLetter,
  generateVideoScript,
  generateInterviewPrep,
  generateResume,          // ← add this
} from '../../../infrastructure/repositories/cvRepository'
```

#### `TailoringWorkspaceState` interface
Add two new fields:
```ts
resumeContent: string
resumeLoading: boolean
handleGenerateResume: () => Promise<void>
```

#### Inside the hook body
Add state:
```ts
const [resumeContent, setResumeContent] = useState('')
```

Add mutation (after the existing `interviewMutation`):
```ts
const resumeMutation = useMutation({
  mutationFn: () =>
    generateResume(cvId, job?._id, detectedLocale, editedJobDescription!, tailoredContent),
  onSuccess: (result) => setResumeContent(result.resume),
  onError: () => onErrorRef.current('tailoring.resumeError'),
})

const handleGenerateResume = useCallback(async () => {
  if (!cvId || (!job && !manualMode)) return
  await resumeMutation.mutateAsync()
}, [cvId, job, manualMode, resumeMutation])
```

#### Return value
Add to the returned object:
```ts
resumeContent,
resumeLoading: resumeMutation.isPending,
handleGenerateResume,
```

---

### 3. UI — Resume tab/section in the tailoring workspace

Find the component that renders the tailoring workspace tabs (the one that uses `useTailoringWorkspace`). Add a new "Resume" tab/section alongside Cover Letter, Video Script, and Interview Prep.

The section should:

**Trigger:**
- A button "Generate Resume" (or equivalent label in the active locale)
- Shows a loading indicator while `resumeLoading` is true
- Disabled when `resumeLoading` is true or when there is no `editedJobDescription`

**Output:**
- When `resumeContent` is set, render it as formatted markdown (use the same markdown renderer already used for `coverContent` or `tailoredContent`)
- Provide a "Copy" button that copies the raw markdown to clipboard
- Provide a "Download .md" button that triggers a file download of the markdown content with filename `resume-tailored.md`

**Empty state:**
- Before generation, show a brief description: "Generate a 1-page ATS-optimized resume tailored to this job. Keywords, rephrases and semantic improvements are applied automatically."

**Error handling:**
- The `onError` key `'tailoring.resumeError'` should be added to your i18n/error message map with an appropriate message (e.g. "Failed to generate resume. Please try again.")

---

## Notes

- `tailoredContent` (current editor state) is the `cvMarkdown` sent to the API — same pattern as `analyzeCV` and `generateInterviewPrep`
- `detectedLocale` (set after ATS analysis runs) is the locale sent — same pattern as other mutations
- The resume is regenerated on each button click (no caching) — same pattern as cover letter
- Do not add a `queryKey` / `useQuery` for resume — it must be on-demand like the other mutations
- If `editedJobDescription` is null or empty, the button should be disabled (cannot generate without a JD)

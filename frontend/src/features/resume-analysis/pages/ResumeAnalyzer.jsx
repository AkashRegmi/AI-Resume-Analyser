import { useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  LoaderCircle,
  MessageSquareText,
  ScanSearch,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { analyzeResume } from "../api/resumeAnalysis.api";
import { getError } from "../../../utils/errorHandler";

const maxFileSize = 5 * 1024 * 1024;
const maxDescriptionLength = 10_000;
const allowedMimeTypes = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function validateResume(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !allowedMimeTypes[extension]) {
    return "Choose a PDF or DOCX resume.";
  }
  if (file.type !== allowedMimeTypes[extension]) {
    return "This file type could not be verified. Choose a valid PDF or DOCX.";
  }
  if (file.size > maxFileSize) {
    return "Your resume must be 5 MB or smaller.";
  }

  return "";
}

function formatFileSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function SkillGroup({ title, skills, tone }) {
  return (
    <section className="border-t border-gray-100 py-4 first:border-0 first:pt-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="text-xs tabular-nums text-gray-500">
          {skills.length}
        </span>
      </div>
      {skills.length ? (
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${tone}`}
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-500">No items identified.</p>
      )}
    </section>
  );
}

function FeedbackList({ title, items, icon: Icon, tone }) {
  return (
    <section className="min-w-0">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Icon className={`h-4 w-4 ${tone}`} />
        {title}
      </h3>
      {items.length ? (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm leading-6 text-gray-700"
            >
              <Check className={`mt-1 h-4 w-4 shrink-0 ${tone}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No items identified.</p>
      )}
    </section>
  );
}

function AnalysisResults({ analysis }) {
  const score = Math.round(analysis.matchScore);
  const skillGroups = [
    {
      title: "Matched skills",
      skills: analysis.skills?.matched ?? [],
      tone: "bg-emerald-50 text-emerald-800",
    },
    {
      title: "Partial matches",
      skills: analysis.skills?.partial ?? [],
      tone: "bg-amber-50 text-amber-800",
    },
    {
      title: "Missing skills",
      skills: analysis.skills?.missing ?? [],
      tone: "bg-rose-50 text-rose-800",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Analysis complete
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold text-gray-900">
              {analysis.resume?.originalName || "Resume analysis"}
            </h2>
          </div>
          <div
            className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full"
            role="meter"
            aria-label="Resume match score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            style={{
              background: `conic-gradient(#d94c37 ${score}%, #eee9e2 ${score}% 100%)`,
            }}
          >
            <span className="absolute inset-[7px] rounded-full bg-white" />
            <span className="relative text-center">
              <strong className="block text-xl leading-5 text-gray-900">
                {score}
              </strong>
              <span className="text-[10px] text-gray-500">out of 100</span>
            </span>
          </div>
        </div>
        <div className="mt-5 border-t border-gray-100 pt-4">
          {skillGroups.map((group) => (
            <SkillGroup key={group.title} {...group} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
        <FeedbackList
          title="Strengths"
          items={analysis.strengths ?? []}
          icon={Check}
          tone="text-emerald-700"
        />
        <FeedbackList
          title="Suggested improvements"
          items={analysis.improvements ?? []}
          icon={Sparkles}
          tone="text-rose-700"
        />
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <MessageSquareText className="h-4 w-4 text-finance-primary" />
          Interview questions
        </h3>
        {analysis.interviewQuestions?.length ? (
          <ol className="divide-y divide-gray-100">
            {analysis.interviewQuestions.map(
              ({ question, category }, index) => (
                <li
                  key={`${category}-${question}`}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="pt-0.5 text-xs font-semibold tabular-nums text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-6 text-gray-800">
                      {question}
                    </p>
                    <span className="mt-1 inline-block text-[11px] capitalize text-gray-500">
                      {category.replaceAll("-", " ")}
                    </span>
                  </div>
                </li>
              ),
            )}
          </ol>
        ) : (
          <p className="text-sm text-gray-500">
            No interview questions returned.
          </p>
        )}
      </section>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;
    if (!selectedFile) return;

    const fileError = validateResume(selectedFile);
    if (fileError) {
      setResume(null);
      setError(fileError);
      event.target.value = "";
      return;
    }

    setResume(selectedFile);
    setAnalysis(null);
    setError("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!resume) {
      setError("Choose a PDF or DOCX resume to continue.");
      return;
    }

    const description = jobDescription.trim();
    if (description.length < 20) {
      setError("The job description must be at least 20 characters.");
      return;
    }
    if (description.length > maxDescriptionLength) {
      setError("The job description must be 10,000 characters or fewer.");
      return;
    }

    setIsSubmitting(true);
    setAnalysis(null);
    try {
      const result = await analyzeResume({
        resume,
        jobDescription: description,
      });
      setAnalysis(result);
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-finance-primary">
          Akrio Resume Match
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">
          Analyze a resume
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Compare a resume with a specific job description to see a match score,
          skill gaps, improvement ideas, and interview questions.
        </p>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-gray-900">
            Your materials
          </h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            The original file is removed after processing; extracted resume text
            is saved with the analysis.
          </p>

          <form className="mt-5 space-y-5" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="resume-file"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Resume file
              </label>
              <label
                htmlFor="resume-file"
                className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center transition hover:border-finance-primary hover:bg-orange-50/40"
              >
                <Upload className="mb-2 h-5 w-5 text-finance-primary" />
                <span className="text-sm font-medium text-gray-800">
                  Choose a PDF or DOCX
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  Maximum file size: 5 MB
                </span>
              </label>
              <input
                id="resume-file"
                className="sr-only"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onFileChange}
                aria-describedby="resume-file-note"
              />
              <p id="resume-file-note" className="sr-only">
                PDF or DOCX, up to 5 MB.
              </p>
              {resume && (
                <div className="mt-3 flex min-w-0 items-center gap-3 rounded-md border border-gray-200 px-3 py-2.5">
                  <FileText className="h-5 w-5 shrink-0 text-finance-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {resume.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(resume.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Remove selected resume"
                    onClick={() => {
                      setResume(null);
                      setAnalysis(null);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="job-description"
                  className="block text-sm font-medium text-gray-800"
                >
                  Job description
                </label>
                <span className="text-xs tabular-nums text-gray-500">
                  {jobDescription.length.toLocaleString()} /{" "}
                  {maxDescriptionLength.toLocaleString()}
                </span>
              </div>
              <textarea
                id="job-description"
                rows={9}
                minLength={20}
                maxLength={maxDescriptionLength}
                placeholder="Paste the responsibilities and qualifications from the job posting..."
                value={jobDescription}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  setAnalysis(null);
                }}
                className="w-full resize-y rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400 focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/15"
                required
              />
              <p className="mt-1.5 text-xs text-gray-500">
                At least 20 characters.
              </p>
            </div>

            {error && (
              <div
                className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800"
                role="alert"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-finance-dark px-4 text-sm font-semibold text-white transition hover:bg-finance-primary disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Analyzing
                  resume...
                </>
              ) : (
                <>
                  Analyze resume <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            {isSubmitting && (
              <p className="-mt-3 text-center text-xs text-gray-500">
                This can take a little while.
              </p>
            )}
          </form>
        </section>

        <div aria-live="polite" aria-busy={isSubmitting}>
          {analysis ? (
            <AnalysisResults analysis={analysis} />
          ) : (
            <section className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-orange-50 text-finance-primary">
                <ScanSearch size={23} />
              </span>
              <h2 className="text-base font-semibold text-gray-900">
                {isSubmitting
                  ? "Reviewing your resume"
                  : "Your analysis will appear here"}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {isSubmitting
                  ? "We are comparing your resume with the job description and preparing your results."
                  : "Add a resume and job description to see your match score, skills, feedback, and interview questions."}
              </p>
              {isSubmitting && (
                <LoaderCircle className="mt-5 h-5 w-5 animate-spin text-finance-primary" />
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import JobForm from "../components/JobForm";

const statusConfig = {
  Applied: { badge: "bg-blue-500/15 text-blue-400 border border-blue-500/20", accent: "from-blue-500 to-blue-600" },
  Interview: { badge: "bg-amber-500/15 text-amber-400 border border-amber-500/20", accent: "from-amber-500 to-amber-600" },
  Offer: { badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", accent: "from-emerald-500 to-emerald-600" },
  Rejected: { badge: "bg-red-500/15 text-red-400 border border-red-500/20", accent: "from-red-500 to-red-600" },
};

const ScoreRing = ({ score }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#bb86fc" : score >= 40 ? "#f59e0b" : "#cf6679";

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#2e2e2e" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-on-surface">{score}%</span>
        <span className="text-[10px] font-medium text-on-surface-dim">MATCH</span>
      </div>
    </div>
  );
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [provider, setProvider] = useState("claude");
  const [showAnalyze, setShowAnalyze] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      const { data } = await API.put(`/jobs/${id}`, formData);
      setJob(data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/jobs/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete job");
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) return;
    setAnalyzing(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobId", id);
      formData.append("provider", provider);
      const { data } = await API.post("/ai/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setJob((prev) => ({
        ...prev,
        aiScore: data.score,
        aiFeedback: data.feedback,
      }));
      setShowAnalyze(false);
      setResumeFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-dim text-sm">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-error/15 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-on-surface">Job not found</p>
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-sm text-primary hover:text-primary-bright font-medium">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const config = statusConfig[job.status] || statusConfig.Applied;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      {/* Back link */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1.5 text-sm text-on-surface-dim hover:text-primary font-medium mb-6 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Dashboard
      </button>

      {error && (
        <div className="flex items-center gap-2 bg-error/10 text-error p-3 rounded-xl mb-6 text-sm border border-error/20">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </div>
      )}

      {editing ? (
        <div className="bg-surface rounded-2xl border border-outline-dim p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-on-surface">Edit Application</h2>
          </div>
          <JobForm onSubmit={handleUpdate} initialData={job} loading={saving} />
          <button
            onClick={() => setEditing(false)}
            className="mt-4 text-sm text-on-surface-dim hover:text-on-surface font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main card */}
          <div className="bg-surface rounded-2xl border border-outline-dim overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${config.accent}`} />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-on-surface">{job.position}</h1>
                  <p className="text-on-surface-dim mt-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                    {job.company}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${config.badge}`}>
                  {job.status}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-sm text-on-surface-dim/60">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                Applied {new Date(job.appliedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-5 border-t border-outline-dim flex gap-2 flex-wrap">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-surface-bright text-on-surface-dim hover:bg-surface-high hover:text-on-surface transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Edit
                </button>
                {job.jobDescription && (
                  <button
                    onClick={() => setShowAnalyze(!showAnalyze)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                    AI Analyze
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-all ml-auto"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Job Description */}
          {job.jobDescription && (
            <div className="bg-surface rounded-2xl border border-outline-dim p-6">
              <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider mb-3">
                Job Description
              </h3>
              <p className="text-sm text-on-surface-dim whitespace-pre-wrap leading-relaxed">
                {job.jobDescription}
              </p>
            </div>
          )}

          {/* Notes */}
          {job.notes && (
            <div className="bg-surface rounded-2xl border border-outline-dim p-6">
              <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider mb-3">
                Notes
              </h3>
              <p className="text-sm text-on-surface-dim whitespace-pre-wrap leading-relaxed">
                {job.notes}
              </p>
            </div>
          )}

          {/* AI Analysis Results */}
          {job.aiScore !== null && job.aiScore !== undefined && (
            <div className="bg-primary/10 rounded-2xl border border-primary/20 p-6">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-5">
                AI Match Analysis
              </h3>
              <div className="flex items-start gap-6">
                <ScoreRing score={job.aiScore} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface-dim whitespace-pre-wrap leading-relaxed">
                    {job.aiFeedback}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Analyze Form */}
          {showAnalyze && (
            <div className="bg-surface rounded-2xl border border-outline-dim p-6 animate-slide-down">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-on-surface">AI Resume Analysis</h3>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-on-surface-dim mb-1.5">
                  Upload Resume
                </label>
                {!resumeFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 bg-surface-bright border-2 border-dashed border-outline-dim rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <svg className="w-8 h-8 text-on-surface-dim/50 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm text-on-surface-dim/50">Click to upload PDF or DOCX</span>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files[0] || null)}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-surface-bright border border-outline-dim rounded-xl">
                    <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span className="text-sm text-on-surface truncate flex-1">{resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="text-on-surface-dim hover:text-error transition-colors shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-on-surface-dim mb-1.5">
                  AI Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-bright border border-outline-dim rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                >
                  <option value="claude">Claude (Anthropic)</option>
                  <option value="openai">OpenAI (GPT)</option>
                  <option value="gemini">Gemini (Google)</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !resumeFile}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-bright text-on-primary px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                      </svg>
                      Analyze Match
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAnalyze(false)}
                  className="px-4 py-2.5 text-sm text-on-surface-dim hover:text-on-surface font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import JobForm from "../components/JobForm";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resume, setResume] = useState("");
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
    if (!resume.trim()) return;
    setAnalyzing(true);
    setError("");
    try {
      const { data } = await API.post("/ai/analyze", {
        resume,
        jobId: id,
        provider,
      });
      setJob((prev) => ({
        ...prev,
        aiScore: data.score,
        aiFeedback: data.feedback,
      }));
      setShowAnalyze(false);
      setResume("");
    } catch (err) {
      setError(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-red-600">Job not found.</p>
      </div>
    );
  }

  const statusColors = {
    Applied: "bg-blue-100 text-blue-800",
    Interview: "bg-yellow-100 text-yellow-800",
    Offer: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-blue-600 hover:underline text-sm mb-4 inline-block"
      >
        &larr; Back to Dashboard
      </button>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {editing ? (
        <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Edit Job
          </h2>
          <JobForm
            onSubmit={handleUpdate}
            initialData={job}
            loading={saving}
          />
          <button
            onClick={() => setEditing(false)}
            className="mt-3 text-sm text-slate-500 hover:underline"
          >
            Cancel editing
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-slate-200">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {job.position}
                </h1>
                <p className="text-lg text-slate-600 mt-1">{job.company}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[job.status]}`}
              >
                {job.status}
              </span>
            </div>

            <div className="mt-4 text-sm text-slate-500">
              Applied: {new Date(job.appliedDate).toLocaleDateString()}
            </div>

            {job.jobDescription && (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Job Description
                </h3>
                <p className="text-slate-600 whitespace-pre-wrap text-sm">
                  {job.jobDescription}
                </p>
              </div>
            )}

            {job.notes && (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-800 mb-2">Notes</h3>
                <p className="text-slate-600 whitespace-pre-wrap text-sm">
                  {job.notes}
                </p>
              </div>
            )}

            {/* AI Analysis Results */}
            {job.aiScore !== null && job.aiScore !== undefined && (
              <div className="mt-6 bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  AI Match Analysis
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-bold text-indigo-600">
                    {job.aiScore}%
                  </span>
                  <span className="text-sm text-indigo-700">Match Score</span>
                </div>
                <p className="text-sm text-indigo-800 whitespace-pre-wrap">
                  {job.aiFeedback}
                </p>
              </div>
            )}

            {/* AI Analyze Section */}
            {showAnalyze && (
              <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Paste Your Resume
                </h3>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                  placeholder="Paste your resume text here..."
                />
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    AI Provider
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    disabled={analyzing || !resume.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Match"}
                  </button>
                  <button
                    onClick={() => setShowAnalyze(false)}
                    className="text-slate-500 hover:text-slate-700 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3 flex-wrap">
              <button
                onClick={() => setEditing(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Edit
              </button>
              {job.jobDescription && (
                <button
                  onClick={() => setShowAnalyze(!showAnalyze)}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  AI Analyze
                </button>
              )}
              <button
                onClick={handleDelete}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;

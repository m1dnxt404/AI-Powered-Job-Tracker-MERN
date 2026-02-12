import { useState, useEffect } from "react";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import { useAuth } from "../context/AuthContext";

const statConfig = [
  { key: "total", label: "Total", accent: "bg-on-surface-dim", text: "text-on-surface" },
  { key: "applied", label: "Applied", accent: "bg-blue-500", text: "text-blue-400" },
  { key: "interview", label: "Interview", accent: "bg-amber-500", text: "text-amber-400" },
  { key: "offer", label: "Offer", accent: "bg-emerald-500", text: "text-emerald-400" },
  { key: "rejected", label: "Rejected", accent: "bg-red-500", text: "text-red-400" },
];

const filterConfig = [
  { key: "All", active: "bg-primary text-on-primary shadow-lg shadow-primary/20" },
  { key: "Applied", active: "bg-blue-500 text-white shadow-lg shadow-blue-500/20" },
  { key: "Interview", active: "bg-amber-500 text-white shadow-lg shadow-amber-500/20" },
  { key: "Offer", active: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" },
  { key: "Rejected", active: "bg-red-500 text-white shadow-lg shadow-red-500/20" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const { data } = await API.get("/jobs");
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (formData) => {
    setFormLoading(true);
    try {
      await API.post("/jobs", formData);
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredJobs =
    filter === "All" ? jobs : jobs.filter((job) => job.status === filter);

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "Applied").length,
    interview: jobs.filter((j) => j.status === "Interview").length,
    offer: jobs.filter((j) => j.status === "Offer").length,
    rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-dim text-sm">Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-on-surface-dim text-sm mt-1">
            {jobs.length === 0
              ? "Start tracking your job applications"
              : `You have ${jobs.length} application${jobs.length !== 1 ? "s" : ""} tracked`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            showForm
              ? "bg-surface-bright text-on-surface-dim hover:bg-surface-high"
              : "bg-primary text-on-primary hover:bg-primary-bright shadow-lg shadow-primary/20 hover:shadow-primary/30"
          }`}
        >
          {showForm ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Job
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {statConfig.map((s, i) => (
          <div
            key={s.key}
            className={`relative bg-surface rounded-xl border border-outline-dim p-4 animate-fade-in stagger-${i}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${s.text}`}>{stats[s.key]}</p>
                <p className="text-xs font-medium text-on-surface-dim mt-0.5">{s.label}</p>
              </div>
              <div className={`w-2 h-8 rounded-full ${s.accent} opacity-60`} />
            </div>
          </div>
        ))}
      </div>

      {/* Add Job Form */}
      {showForm && (
        <div className="bg-surface rounded-2xl border border-outline-dim p-6 mb-8 animate-slide-down">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-on-surface">New Job Application</h2>
          </div>
          <JobForm onSubmit={handleCreateJob} loading={formLoading} />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-error/10 text-error p-3 rounded-xl mb-6 text-sm border border-error/20">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filterConfig.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              filter === f.key
                ? f.active
                : "bg-surface-bright text-on-surface-dim border border-outline-dim hover:border-outline hover:text-on-surface"
            }`}
          >
            {f.key}
            {filter === f.key && f.key !== "All" && (
              <span className="ml-1.5 opacity-80">
                ({stats[f.key.toLowerCase()]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Job Grid */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-bright flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-on-surface-dim/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-on-surface">No applications yet</p>
          <p className="text-sm text-on-surface-dim mt-1 max-w-sm">
            Click &quot;Add Job&quot; to start tracking your job applications and get AI-powered insights.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job, i) => (
            <div key={job._id} className={`animate-fade-in stagger-${Math.min(i, 4)}`}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

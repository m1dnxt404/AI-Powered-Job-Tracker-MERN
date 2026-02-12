import { useState, useEffect } from "react";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";

const Dashboard = () => {
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Job"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center border border-slate-200">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
          <p className="text-sm text-slate-500">Applied</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border border-yellow-200">
          <p className="text-2xl font-bold text-yellow-600">
            {stats.interview}
          </p>
          <p className="text-sm text-slate-500">Interview</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border border-green-200">
          <p className="text-2xl font-bold text-green-600">{stats.offer}</p>
          <p className="text-sm text-slate-500">Offer</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-slate-500">Rejected</p>
        </div>
      </div>

      {/* Add Job Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Add New Job Application
          </h2>
          <JobForm onSubmit={handleCreateJob} loading={formLoading} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "Applied", "Interview", "Offer", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === s
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">No jobs found.</p>
          <p className="text-sm mt-1">
            Click "+ Add Job" to start tracking your applications.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

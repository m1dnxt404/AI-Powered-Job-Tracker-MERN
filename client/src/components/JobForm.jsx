import { useState } from "react";

const inputClass =
  "w-full px-4 py-2.5 bg-surface-bright border border-outline-dim rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-on-surface-dim/50";

const labelClass = "block text-sm font-semibold text-on-surface-dim mb-1.5";

const JobForm = ({ onSubmit, initialData = {}, loading = false }) => {
  const [formData, setFormData] = useState({
    company: initialData.company || "",
    position: initialData.position || "",
    status: initialData.status || "Applied",
    jobDescription: initialData.jobDescription || "",
    notes: initialData.notes || "",
    appliedDate: initialData.appliedDate
      ? new Date(initialData.appliedDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Company *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="e.g. Google"
          />
        </div>

        <div>
          <label className={labelClass}>Position *</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="e.g. Frontend Developer"
          />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Applied Date</label>
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Job Description</label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Paste the job description here for AI analysis..."
        />
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className={`${inputClass} resize-none`}
          placeholder="Any personal notes about this application..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-bright text-on-primary py-2.5 px-4 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving...
          </span>
        ) : (
          "Save Application"
        )}
      </button>
    </form>
  );
};

export default JobForm;

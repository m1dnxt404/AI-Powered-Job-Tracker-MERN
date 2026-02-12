import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company *
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Position *
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Applied Date
          </label>
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Job Description
        </label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste the job description here for AI analysis..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any personal notes about this application..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Job"}
      </button>
    </form>
  );
};

export default JobForm;

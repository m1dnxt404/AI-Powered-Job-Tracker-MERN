import { Link } from "react-router-dom";

const statusColors = {
  Applied: "bg-blue-100 text-blue-800",
  Interview: "bg-yellow-100 text-yellow-800",
  Offer: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const JobCard = ({ job }) => {
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 border border-slate-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-slate-900">
            {job.position}
          </h3>
          <p className="text-slate-600">{job.company}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}
        >
          {job.status}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
        <span>
          {new Date(job.appliedDate).toLocaleDateString()}
        </span>
        {job.aiScore !== null && job.aiScore !== undefined && (
          <span className="font-medium text-indigo-600">
            AI Score: {job.aiScore}%
          </span>
        )}
      </div>

      {job.notes && (
        <p className="mt-2 text-sm text-slate-500 truncate">{job.notes}</p>
      )}
    </Link>
  );
};

export default JobCard;

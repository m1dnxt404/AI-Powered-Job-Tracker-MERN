import { Link } from "react-router-dom";

const statusConfig = {
  Applied: { badge: "bg-blue-500/15 text-blue-400 border border-blue-500/20", accent: "bg-blue-500" },
  Interview: { badge: "bg-amber-500/15 text-amber-400 border border-amber-500/20", accent: "bg-amber-500" },
  Offer: { badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", accent: "bg-emerald-500" },
  Rejected: { badge: "bg-red-500/15 text-red-400 border border-red-500/20", accent: "bg-red-500" },
};

const JobCard = ({ job }) => {
  const config = statusConfig[job.status] || statusConfig.Applied;

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group block bg-surface rounded-2xl border border-outline-dim hover:border-outline hover:bg-surface-container transition-all duration-200 overflow-hidden"
    >
      <div className={`h-1 ${config.accent}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
              {job.position}
            </h3>
            <p className="text-sm text-on-surface-dim mt-0.5 truncate">{job.company}</p>
          </div>
          <span className={`shrink-0 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${config.badge}`}>
            {job.status}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-dim/60">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {new Date(job.appliedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          {job.aiScore !== null && job.aiScore !== undefined && (
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 rounded-full bg-surface-highest overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-dim to-primary transition-all"
                  style={{ width: `${job.aiScore}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-primary">{job.aiScore}%</span>
            </div>
          )}
        </div>

        {job.notes && (
          <p className="mt-3 text-xs text-on-surface-dim/50 truncate border-t border-outline-dim pt-3">
            {job.notes}
          </p>
        )}
      </div>
    </Link>
  );
};

export default JobCard;

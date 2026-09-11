import type { ReputationScore as ReputationScoreType } from "@/types/credential";
import TrustScoreBadge from "@/components/TrustScoreBadge";

interface Props {
  score: ReputationScoreType;
}

const ReputationScore = ({ score }: Props) => {
  return (
    <div className="glass-effect rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-soft-neon/60 sm:text-sm">Reputation</p>
          <h3 className="mt-1 text-2xl font-bold text-neon sm:mt-2 sm:text-3xl">{score.totalScore}</h3>
        </div>
        <div className="self-start sm:self-auto">
          <TrustScoreBadge score={score.totalScore} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
        <div className="rounded-xl border border-aqua-neon/10 bg-deep-navy/30 p-2.5 sm:p-3 text-center sm:text-left">
          <p className="text-xs text-soft-neon/60 sm:text-sm">Hackathons</p>
          <p className="mt-0.5 text-lg font-semibold text-soft-neon sm:text-xl">{score.hackathonCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-aqua-neon/10 bg-deep-navy/30 p-2.5 sm:p-3 text-center sm:text-left">
          <p className="text-xs text-soft-neon/60 sm:text-sm">Internships</p>
          <p className="mt-0.5 text-lg font-semibold text-soft-neon sm:text-xl">{score.internshipCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-aqua-neon/10 bg-deep-navy/30 p-2.5 sm:p-3 text-center sm:text-left">
          <p className="text-xs text-soft-neon/60 sm:text-sm">Courses</p>
          <p className="mt-0.5 text-lg font-semibold text-soft-neon sm:text-xl">{score.courseCount ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ReputationScore;

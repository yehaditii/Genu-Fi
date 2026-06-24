import type { ReputationScore as ReputationScoreType } from "@/types/credential";
import TrustScoreBadge from "@/components/TrustScoreBadge";

interface Props {
  score: ReputationScoreType;
}

const ReputationScore = ({ score }: Props) => {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">Reputation</p>
          <h3 className="mt-2 text-3xl font-bold text-neon">{score.totalScore}</h3>
        </div>
        <TrustScoreBadge score={score.totalScore} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm text-soft-neon/60">Hackathons</p>
          <p className="text-xl font-semibold text-soft-neon">{score.hackathonCount}</p>
        </div>
        <div>
          <p className="text-sm text-soft-neon/60">Internships</p>
          <p className="text-xl font-semibold text-soft-neon">{score.internshipCount}</p>
        </div>
        <div>
          <p className="text-sm text-soft-neon/60">Courses</p>
          <p className="text-xl font-semibold text-soft-neon">{score.courseCount}</p>
        </div>
      </div>
    </div>
  );
};

export default ReputationScore;

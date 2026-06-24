interface Props {
  score: number;
}

const TrustScoreBadge = ({ score }: Props) => {
  return (
    <span className="inline-flex rounded-full border border-aqua-neon/40 px-4 py-2 text-sm font-semibold text-aqua-neon">
      Trust Score: {score}
    </span>
  );
};

export default TrustScoreBadge;

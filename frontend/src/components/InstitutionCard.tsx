interface Props {
  name: string;
  type: string;
  isVerified: boolean;
}

const InstitutionCard = ({ name, type, isVerified }: Props) => {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">{type}</p>
      <h3 className="mt-2 text-2xl font-bold text-neon">{name}</h3>
      <p className="mt-4 text-soft-neon/80">
        {isVerified ? "Verified to issue Soroban credentials." : "Pending verification."}
      </p>
    </div>
  );
};

export default InstitutionCard;

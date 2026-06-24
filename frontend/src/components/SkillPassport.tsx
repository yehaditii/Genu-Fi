import type { Credential } from "@/types/credential";

interface Props {
  credentials: Credential[];
}

const SkillPassport = ({ credentials }: Props) => {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-neon">Skill Passport</h3>
      <div className="mt-6 space-y-4">
        {credentials.map((credential) => (
          <div key={credential.id} className="rounded-xl border border-aqua-neon/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-soft-neon">{credential.credentialType}</p>
                <p className="text-sm text-soft-neon/60">{credential.metadata}</p>
              </div>
              <span className="text-sm uppercase text-aqua-neon">{credential.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillPassport;

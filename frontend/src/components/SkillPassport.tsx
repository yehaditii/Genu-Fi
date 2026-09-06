import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import type { Credential } from "@/types/credential";

interface Props {
  credentials: Credential[];
}

const SkillPassport = ({ credentials }: Props) => {
  const trackedCredentials = useRef(new Set<string>());

  useEffect(() => {
    credentials.forEach((credential) => {
      if (trackedCredentials.current.has(credential.credentialId)) return;
      trackedCredentials.current.add(credential.credentialId);
      track("credential_viewed", { status: credential.status });
    });
  }, [credentials]);

  return (
    <div className="glass-effect rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-neon">Skill Passport</h3>
      <div className="mt-6 space-y-4">
        {credentials.length === 0 && <p className="text-soft-neon/70">No credentials have been issued to this wallet yet.</p>}
        {credentials.map((credential) => (
          <div key={credential.credentialId} className="rounded-xl border border-aqua-neon/20 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-soft-neon">{credential.credentialType}</p>
                <p className="text-sm text-soft-neon/60">Credential ID: {credential.credentialId}</p>
                <p className="text-sm text-soft-neon/60">{credential.metadata}</p>
                <p className="text-xs text-soft-neon/50">Issuer: {credential.issuerAddress || credential.issuer}</p>
                {credential.transactionHash && <p className="mt-1 break-all text-xs text-soft-neon/50">Transaction: {credential.transactionHash}</p>}
                <p className="mt-1 text-xs uppercase text-soft-neon/60">Verification: {credential.verificationStatus?.replace("_", " ") || "not available"}</p>
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

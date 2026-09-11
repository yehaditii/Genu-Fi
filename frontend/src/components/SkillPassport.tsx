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
    <div className="glass-effect rounded-2xl p-4 sm:p-6">
      <h3 className="text-xl font-bold text-neon sm:text-2xl">Skill Passport</h3>
      <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
        {credentials.length === 0 && <p className="text-sm text-soft-neon/70">No credentials have been issued to this wallet yet.</p>}
        {credentials.map((credential) => (
          <div key={credential.credentialId} className="rounded-xl border border-aqua-neon/20 p-3.5 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-semibold text-soft-neon text-base">{credential.credentialType}</p>
                <p className="break-all text-xs text-soft-neon/60 sm:text-sm">Credential ID: {credential.credentialId}</p>
                {credential.metadata && <p className="break-words text-xs text-soft-neon/70 sm:text-sm">{credential.metadata}</p>}
                <p className="break-all font-mono text-[11px] text-soft-neon/50 sm:text-xs">Issuer: {credential.issuerAddress || credential.issuer}</p>
                {credential.transactionHash && <p className="break-all font-mono text-[11px] text-soft-neon/50 sm:text-xs">Transaction: {credential.transactionHash}</p>}
                <p className="text-[11px] uppercase tracking-wide text-soft-neon/60 sm:text-xs">Verification: {credential.verificationStatus?.replace("_", " ") || "not available"}</p>
              </div>
              <span className="self-start sm:self-auto shrink-0 rounded-full border border-aqua-neon/30 bg-aqua-neon/10 px-2.5 py-1 text-xs font-semibold uppercase text-aqua-neon">{credential.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillPassport;

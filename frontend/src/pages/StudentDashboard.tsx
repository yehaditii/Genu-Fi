import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReputationScore from "@/components/ReputationScore";
import SkillPassport from "@/components/SkillPassport";
import type { Credential, ReputationScore as ReputationScoreType } from "@/types/credential";

const credentials: Credential[] = [
  {
    id: "cred-1",
    issuer: "GenuFi University",
    recipient: "student-wallet",
    credentialType: "Hackathon Win",
    issuedAt: new Date().toISOString(),
    status: "active",
    metadata: "Hackathon finalist credential",
  },
  {
    id: "cred-2",
    issuer: "GenuFi Bootcamp",
    recipient: "student-wallet",
    credentialType: "Course Completion",
    issuedAt: new Date().toISOString(),
    status: "active",
    metadata: "Soroban engineering foundations",
  },
];

const reputation: ReputationScoreType = {
  totalScore: 60,
  hackathonCount: 1,
  internshipCount: 0,
  courseCount: 1,
  lastUpdated: new Date().toISOString(),
};

const StudentDashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">Student Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold text-neon">Verifiable Skill Passport</h1>
          </div>
          <ReputationScore score={reputation} />
          <SkillPassport credentials={credentials} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;

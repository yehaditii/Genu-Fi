import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TrustScoreBadge from "@/components/TrustScoreBadge";

const RecruiterDashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">Recruiter Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold text-neon">Verify Talent and Credential Trust</h1>
          </div>

          <div className="glass-effect rounded-2xl p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neon">Candidate Overview</h2>
                <p className="mt-2 text-soft-neon/80">
                  Confirm credential validity and inspect trust indicators before outreach.
                </p>
              </div>
              <TrustScoreBadge score={86} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-xl border border-aqua-neon/20 bg-deep-navy/50 p-3" placeholder="Credential ID" />
              <input className="rounded-xl border border-aqua-neon/20 bg-deep-navy/50 p-3" placeholder="Requester Stellar address" />
            </div>

            <button className="btn-primary mt-6" type="button">
              Verify Credential
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;

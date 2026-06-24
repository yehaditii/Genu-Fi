import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InstitutionCard from "@/components/InstitutionCard";

const InstitutionDashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">Institution Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold text-neon">Issue and Manage Credentials</h1>
          </div>

          <InstitutionCard name="GenuFi University" type="University" isVerified={true} />

          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-neon">Issue Credential</h2>
            <form className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-xl border border-aqua-neon/20 bg-deep-navy/50 p-3" placeholder="Recipient Stellar address" />
              <input className="rounded-xl border border-aqua-neon/20 bg-deep-navy/50 p-3" placeholder="Credential type" />
              <input className="rounded-xl border border-aqua-neon/20 bg-deep-navy/50 p-3 md:col-span-2" placeholder="Metadata URI or description" />
              <button className="btn-primary md:w-fit" type="button">
                Submit Soroban Issuance
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstitutionDashboard;

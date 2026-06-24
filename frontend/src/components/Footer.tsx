const Footer = () => {
  return (
    <footer className="border-t border-aqua-neon/20 bg-gradient-to-t from-deep-navy to-cool-blue/20 section-padding">
      <div className="container mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-3xl font-bold text-neon">GenuFi</div>
          <p className="mt-2 max-w-xl text-soft-neon/80">
            Verifiable skill passports, institution trust, and recruiter verification on Stellar.
          </p>
        </div>

        <div className="text-sm text-soft-neon/60">
          <p>Freighter wallet for browser users</p>
          <p>Stellar Soroban contracts for credentials and reputation</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

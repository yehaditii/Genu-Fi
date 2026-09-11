const partners = ["Universities", "Bootcamps", "Employers", "Accelerators"];

const Partners = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto text-center">
        <h2 className="mb-8 text-3xl font-bold sm:mb-16 sm:text-4xl lg:text-5xl">
          <span className="gradient-text">Trusted Participants</span>
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
          {partners.map((partner) => (
            <div key={partner} className="glass-effect rounded-xl p-4 sm:p-6">
              <div className="text-base font-bold text-aqua-neon sm:text-2xl">{partner}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;

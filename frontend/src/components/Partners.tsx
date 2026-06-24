const partners = ["Universities", "Bootcamps", "Employers", "Accelerators"];

const Partners = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto text-center">
        <h2 className="mb-16 text-4xl font-bold lg:text-5xl">
          <span className="gradient-text">Trusted Participants</span>
        </h2>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {partners.map((partner) => (
            <div key={partner} className="glass-effect rounded-xl p-6">
              <div className="text-2xl font-bold text-aqua-neon">{partner}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;

const stats = [
  { label: "Credential Types", value: "4" },
  { label: "Role Dashboards", value: "3" },
  { label: "Soroban Contracts", value: "4" },
  { label: "Live Event Domains", value: "4" },
];

const Stats = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-effect rounded-2xl p-4 sm:p-8 text-center">
            <div className="mb-1 text-2xl font-bold text-neon sm:mb-2 sm:text-4xl">{stat.value}</div>
            <div className="text-xs text-soft-neon/80 sm:text-base">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;

const stats = [
  { label: "Credential Types", value: "4" },
  { label: "Role Dashboards", value: "3" },
  { label: "Soroban Contracts", value: "4" },
  { label: "Live Event Domains", value: "4" },
];

const Stats = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-effect rounded-2xl p-8 text-center">
            <div className="mb-2 text-4xl font-bold text-neon">{stat.value}</div>
            <div className="text-soft-neon/80">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;

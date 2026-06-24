import { BookOpen, Shield, Trophy } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Learn",
    description: "Learners complete real projects, bootcamps, internships, and hackathons.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Trust",
    description: "Institutions issue tamper-resistant credentials through Soroban contracts.",
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    title: "Grow",
    description: "Reputation scores help recruiters quickly understand verified achievements.",
  },
];

const About = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-deep-navy to-cool-blue/20">
      <div className="container mx-auto text-center">
        <h2 className="mb-6 text-4xl font-bold lg:text-6xl">
          <span className="gradient-text">About GenuFi</span>
        </h2>
        <p className="mx-auto mb-16 max-w-3xl text-xl text-soft-neon/80">
          GenuFi is evolving from certificate minting into a full verifiable skill passport and
          recruiter trust network built on Stellar.
        </p>

        <div className="mb-16 text-3xl font-bold text-neon lg:text-5xl">
          "Learn it. Prove it. Share it."
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass-effect rounded-2xl p-8">
              <div className="mb-4 flex justify-center text-aqua-neon">{feature.icon}</div>
              <h3 className="mb-4 text-2xl font-bold text-neon">{feature.title}</h3>
              <p className="leading-relaxed text-soft-neon/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

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
        <h2 className="mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl lg:text-6xl">
          <span className="gradient-text">About GenuFi</span>
        </h2>
        <p className="mx-auto mb-10 max-w-3xl text-base text-soft-neon/80 sm:mb-16 sm:text-xl">
          GenuFi is evolving from certificate minting into a full verifiable skill passport and
          recruiter trust network built on Stellar.
        </p>

        <div className="mb-10 text-2xl font-bold text-neon sm:mb-16 sm:text-3xl lg:text-5xl">
          "Learn it. Prove it. Share it."
        </div>

        <div className="grid gap-6 md:grid-cols-3 sm:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="glass-effect rounded-2xl p-6 sm:p-8">
              <div className="mb-4 flex justify-center text-aqua-neon">{feature.icon}</div>
              <h3 className="mb-3 text-xl font-bold text-neon sm:mb-4 sm:text-2xl">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-soft-neon/80 sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

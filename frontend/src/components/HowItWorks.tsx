import { Award, CheckCircle, User } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <User className="h-10 w-10" />,
    title: "Register and Connect",
    description: "Learners and institutions connect Freighter and create their on-chain identity.",
  },
  {
    step: "02",
    icon: <CheckCircle className="h-10 w-10" />,
    title: "Issue Credentials",
    description: "Verified institutions issue skill credentials that update learner reputation.",
  },
  {
    step: "03",
    icon: <Award className="h-10 w-10" />,
    title: "Verify with Confidence",
    description: "Recruiters inspect reputation, activity, and verification history in one flow.",
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold lg:text-6xl">
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-soft-neon/80">
            A three-part workflow for institutions, learners, and recruiters.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="absolute left-4 top-0 text-6xl font-bold text-aqua-neon/20">
                {step.step}
              </div>
              <div className="glass-effect relative z-10 h-full rounded-2xl p-8">
                <div className="mb-6 flex justify-center text-aqua-neon">{step.icon}</div>
                <h3 className="mb-4 text-center text-2xl font-bold text-neon">{step.title}</h3>
                <p className="text-center leading-relaxed text-soft-neon/80">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute -right-6 top-1/2 hidden h-0.5 w-12 bg-gradient-to-r from-aqua-neon to-transparent lg:block"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

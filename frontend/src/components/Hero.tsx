import { ArrowRight, Play } from "lucide-react";
import RotatingCube from "@/components/RotatingCube";
import LaptopIllustration from "@/components/LaptopIllustration";
import { useStellar } from "@/context/StellarContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const { connectWallet, isConnected } = useStellar();

  return (
    <section className="section-padding pt-24">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -left-16 -top-20 z-0">
                <RotatingCube />
              </div>
              <div className="relative z-10 space-y-6">
                <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                  <span className="text-neon">Learn</span>{" "}
                  <span className="text-soft-neon">something</span>{" "}
                  <span className="gradient-text">real.</span>
                  <br />
                  <span className="text-neon">Prove</span>{" "}
                  <span className="text-soft-neon">your</span>{" "}
                  <span className="gradient-text">skills.</span>
                </h1>

                <p className="max-w-2xl text-xl leading-relaxed text-soft-neon/80">
                  Build a verifiable skill passport on Stellar. Institutions issue trusted
                  credentials, learners grow reputation, and recruiters verify talent in real time.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button className="btn-primary flex items-center justify-center gap-3" onClick={() => void connectWallet()}>
                    {isConnected ? "Open Passport" : "Connect Freighter"}
                    <ArrowRight size={20} />
                  </button>
                  <Link to="/activity" className="btn-secondary flex items-center justify-center gap-3">
                    <Play size={20} />
                    View Live Activity
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LaptopIllustration />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

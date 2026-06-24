import About from "@/components/About";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Partners from "@/components/Partners";
import Stats from "@/components/Stats";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Stats />
        <Partners />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

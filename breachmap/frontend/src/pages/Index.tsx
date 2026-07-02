import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ScanTypes from '@/components/ScanTypes';
import TerminalAnimation from '@/components/TerminalAnimation';
import Methodology from '@/components/Methodology';
import GitHubCTA from '@/components/GitHubCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ScanTypes />
      <TerminalAnimation />
      <Methodology />
      <GitHubCTA />
      <Footer />
    </div>
  );
};

export default Index;

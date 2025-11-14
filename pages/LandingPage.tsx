
import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Briefcase, BookOpen, CheckCircle } from '../components/icons';

const LandingNavbar: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm">
    <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="text-3xl font-bold text-orange-500">Career Connect</Link>
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#features" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Features</a>
        <a href="#about" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">About Us</a>
      </nav>
      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
          Login
        </Link>
        <Link
          to="/register"
          className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors shadow-sm"
        >
          Sign Up
        </Link>
      </div>
    </div>
  </header>
);

const HeroSection: React.FC = () => (
  <section className="relative bg-white pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight animate-fadeInUp">
            Find Your Future, <span className="text-orange-500">Faster.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 animate-fadeInUp animation-delay-200">
            Career Connect uses AI to create a personalized roadmap to your dream job. Get matched with the right roles, discover learning resources, and accelerate your career.
          </p>
          <div className="mt-8 flex justify-center lg:justify-start gap-4 animate-fadeInUp animation-delay-400">
            <Link
              to="/register"
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-transform hover:scale-105 shadow-lg"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
        <div className="relative animate-fadeInUp animation-delay-200">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-white transform -skew-y-3 rounded-2xl"></div>
            <img 
                src="https://img.freepik.com/premium-photo/cheerful-young-man-standing-isolated-orange-wall-one-color-background_953680-3876.jpg?w=360"
                alt="Person working on a laptop" 
                className="relative rounded-2xl shadow-2xl mx-auto"
            />
        </div>
      </div>
    </div>
  </section>
);

const PartnersSection: React.FC = () => (
    <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-4xl font-semibold text-gray-700">
                    Learn from 350+ top universities and companies
                </h2>
                <div className="mt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-gray-500">
                    <div className="flex items-center gap-8">
                        <img src="https://logo.clearbit.com/google.com" alt="Google" className="h-20" />
                        <img src="https://logo.clearbit.com/coursera.org" alt="Coursera" className="h-20" />
                        <img src="https://logo.clearbit.com/stanford.edu" alt="Stanford" className="h-20" />
                        <img src="https://logo.clearbit.com/mit.edu" alt="MIT" className="h-20" />
                        <img src="https://logo.clearbit.com/udemy.com" alt="Udemy" className="h-20" />
                        <img src="https://logo.clearbit.com/freecodecamp.org" alt="freeCodeCamp" className="h-20" />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string, delay: string }> = ({ icon, title, description, delay }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md text-center opacity-0 animate-fadeInUp ${delay}`}>
    <div className="bg-orange-100 text-orange-500 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
      {icon}
    </div>
    <h3 className="mt-4 text-xl font-bold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => (
  <section id="features" className="bg-gray-50 py-20 sm:py-24">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Your Personal Career Co-Pilot</h2>
        <p className="mt-4 text-lg text-gray-600">
          Everything you need to navigate your career path with confidence.
        </p>
      </div>
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <Feature
          icon={<Rocket className="w-8 h-8" />}
          title="AI-Powered Roadmap"
          description="Get a step-by-step, personalized plan to reach your career goals, powered by intelligent AI."
          delay="animation-delay-200"
        />
        <Feature
          icon={<Briefcase className="w-8 h-8" />}
          title="Personalized Job Matches"
          description="Stop searching. We bring the best job opportunities to you based on your unique skills and profile."
          delay="animation-delay-400"
        />
        <Feature
          icon={<BookOpen className="w-8 h-8" />}
          title="Curated Learning Resources"
          description="Bridge your skill gaps with targeted courses and resources recommended just for you."
          delay="animation-delay-200"
        />
      </div>
    </div>
  </section>
);

const AboutUsSection: React.FC = () => (
  <section id="about" className="py-20 sm:py-24 bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-5 items-center">
        <div className="opacity-0 animate-fadeInUp">
          <img 
            src="https://kavyainfoweb.com/wp-content/uploads/2025/07/mision-vision-tour-in-peru.png" 
            alt="Diverse team collaborating" 
            className="rounded-2xl shadow-xl"
          />
        </div>
        <div className="opacity-0 animate-fadeInUp animation-delay-200">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600">
            At Career Connect, we believe everyone deserves a clear path to a fulfilling career. The journey from education to employment is often confusing and filled with uncertainty. We're here to change that.
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
              <span><strong className="text-gray-800">For Freshers:</strong> We provide clarity by connecting your academic knowledge to real-world job requirements.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
              <span><strong className="text-gray-800">For Job Seekers:</strong> We empower you with personalized recommendations for jobs and skills, eliminating the guesswork.</span>
            </li>
          </ul>
          <p className="mt-6 text-lg text-gray-600">
            Our goal is to be your trusted co-pilot, guiding you with AI-driven insights to help you land your dream job faster.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const CtaSection: React.FC = () => (
  <section className="bg-orange-500">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to Accelerate Your Career?</h2>
      <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto">
        Join thousands of others who are taking control of their professional future. Your personalized roadmap is just a few clicks away.
      </p>
      <div className="mt-8">
        <Link
          to="/register"
          className="inline-block bg-white text-orange-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-transform hover:scale-105 shadow-2xl"
        >
          Sign Up Now - It's Free!
        </Link>
      </div>
    </div>
  </section>
);

const LandingFooter: React.FC = () => (
  <footer className="bg-white py-8">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
      <p>&copy; {new Date().getFullYear()} Career Connect. All rights reserved.</p>
    </div>
  </footer>
);


const LandingPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
        <PartnersSection />
        <FeaturesSection />
        <AboutUsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, ArrowRightLeft, Shield, Zap, Globe, ChevronRight } from 'lucide-react';
import freyaIcon from '../assets/freya.png';

const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-orange-900/20 to-rose-900/20" />
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-orange-500/30"
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  </div>
);

const GlowingCard = ({ children, className }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
    <div className="relative bg-black rounded-lg">
      {children}
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <GlowingCard className="h-full">
      <div className="p-8 h-full">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{description}</p>
      </div>
    </GlowingCard>
  </motion.div>
);

const StatsCard = ({ value, label }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-gradient-to-br from-orange-500/10 to-purple-600/10 p-6 rounded-lg backdrop-blur-sm"
  >
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className="text-gray-400">{label}</div>
  </motion.div>
);

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <BackgroundAnimation />
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">
                <img src={freyaIcon} alt="Freya" className="w-14 h-14" />
              </span>
            </div>
            <div className="flex items-center space-x-8">
              <a href="https://github.com/PureBl00d/Freya/blob/main/README.md" className="hover:text-gray-400 transition-colors">Docs</a>
              <Link 
                to="/app" 
                className="bg-gradient-to-r from-orange-500 to-purple-600 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600">
              Cross-Chain ETH Bridge
              <br />
              Powered by AI
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Transfer ETH seamlessly across different blockchains with our revolutionary AI-powered bridge. 
              Fast, secure, and decentralized.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/app"
                className="bg-gradient-to-r from-orange-500 to-purple-600 px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center"
              >
                Get Started <ChevronRight className="ml-2" />
              </Link>
              <button className="px-8 py-4 rounded-lg font-semibold border border-orange-500/30 hover:bg-orange-500/10 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose SuperETH?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the future of cross-chain transfers with our innovative features
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Secure Transfers"
              description="AI-powered security checks and validations ensure your assets are protected throughout the transfer process"
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Experience near-instant transfers across chains with our optimized bridge architecture"
            />
            <FeatureCard
              icon={Globe}
              title="Multi-Chain Support"
              description="Seamlessly bridge your ETH across multiple networks including Arbitrum, Base, and Ethereum"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <StatsCard value="$100M+" label="Total Value Locked" />
            <StatsCard value="3" label="Supported Chains" />
            <StatsCard value="10k+" label="Daily Transactions" />
            <StatsCard value="100%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered bridge makes cross-chain transfers simple and efficient
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <GlowingCard>
                <div className="p-8">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-4 mt-4">Deposit ETH</h3>
                  <p className="text-gray-400">
                    Connect your wallet and deposit ETH to receive SuperETH tokens at a 1:1 ratio
                  </p>
                </div>
              </GlowingCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <GlowingCard>
                <div className="p-8">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-4 mt-4">Choose Network</h3>
                  <p className="text-gray-400">
                    Select your target blockchain network where you want to receive your ETH
                  </p>
                </div>
              </GlowingCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <GlowingCard>
                <div className="p-8">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-4 mt-4">Receive ETH</h3>
                  <p className="text-gray-400">
                    Our AI agent processes your transfer and delivers ETH to your wallet on the target chain
                  </p>
                </div>
              </GlowingCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <GlowingCard>
            <div className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust SuperETH for their cross-chain transfers. 
                Experience the future of blockchain interoperability today.
              </p>
              <Link
                to="/app"
                className="bg-gradient-to-r from-orange-500 to-purple-600 px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center"
              >
                Launch App <ChevronRight className="ml-2" />
              </Link>
            </div>
          </GlowingCard>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
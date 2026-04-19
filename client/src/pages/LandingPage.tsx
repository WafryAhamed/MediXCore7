
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  FingerprintIcon,
  ZapIcon,
  LockIcon,
  WalletIcon,
  UploadIcon,
  LinkIcon,
  ShareIcon,
  CheckCircleIcon,
  GithubIcon,
  TwitterIcon,
  ActivityIcon,
  ArrowRightIcon,
  DatabaseIcon,
  ServerIcon } from
'lucide-react';
import { Navbar } from '../components/Navbar';
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0
  }
};
const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};
const features = [
{
  icon: FingerprintIcon,
  title: 'Patient Control',
  description:
  'You own your medical data. Grant or revoke access to healthcare providers at any time.'
},
{
  icon: ShieldCheckIcon,
  title: 'Tamper-Proof Records',
  description:
  'Every record is hashed and stored on the blockchain, making alterations impossible.'
},
{
  icon: ZapIcon,
  title: 'Instant Access',
  description:
  'Doctors get immediate access to shared records — no delays, no paperwork.'
},
{
  icon: LockIcon,
  title: 'End-to-End Encryption',
  description:
  'Military-grade encryption ensures your sensitive health data stays private.'
}];

const steps = [
{
  icon: WalletIcon,
  title: 'Connect Wallet',
  description: 'Link your MetaMask wallet to get started securely.'
},
{
  icon: UploadIcon,
  title: 'Upload Records',
  description: 'Upload medical documents, prescriptions, and lab results.'
},
{
  icon: LinkIcon,
  title: 'Store on Blockchain',
  description: 'Records are hashed and stored immutably on-chain.'
},
{
  icon: ShareIcon,
  title: 'Share Securely',
  description: 'Grant time-limited access to your healthcare providers.'
}];

const securityPoints = [
'Zero-knowledge proof verification',
'Decentralized storage architecture',
'HIPAA-compliant data handling',
'Multi-signature access control',
'Automated audit trails',
'Real-time threat monitoring'];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-primary w-full">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.08, 0.15, 0.08]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl" />
          
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2
            }}
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-highlight/10 blur-3xl" />
          
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
              'linear-gradient(rgba(226,232,240,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
          
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div
                variants={fadeUp}
                transition={{
                  duration: 0.5
                }}>
                
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Powered by Blockchain Technology
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{
                  duration: 0.5
                }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-textLight leading-tight">
                
                Your Medical Records,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-highlight">
                  Secured by Blockchain
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{
                  duration: 0.5
                }}
                className="mt-6 text-lg text-textMuted max-w-lg leading-relaxed">
                
                Take full control of your health data. MediXChain empowers
                patients with tamper-proof, decentralized medical records that
                you own and control.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{
                  duration: 0.5
                }}
                className="mt-8 flex flex-wrap gap-4">
                
                <Link to="/auth">
                  <motion.button
                    whileHover={{
                      scale: 1.03
                    }}
                    whileTap={{
                      scale: 0.97
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-primary font-semibold rounded-xl transition-colors shadow-lg shadow-accent/20">
                    
                    <WalletIcon className="w-5 h-5" />
                    Connect Wallet
                  </motion.button>
                </Link>
                <a href="#features">
                  <motion.button
                    whileHover={{
                      scale: 1.03
                    }}
                    whileTap={{
                      scale: 0.97
                    }}
                    className="flex items-center gap-2 px-6 py-3 border border-textMuted/30 text-textLight font-semibold rounded-xl hover:bg-white/5 transition-colors">
                    
                    Learn More
                    <ArrowRightIcon className="w-4 h-4" />
                  </motion.button>
                </a>
              </motion.div>

              {/* Trust stats */}
              <motion.div
                variants={fadeUp}
                transition={{
                  duration: 0.5
                }}
                className="mt-12 flex gap-8">
                
                {[
                {
                  value: '50K+',
                  label: 'Records Secured'
                },
                {
                  value: '10K+',
                  label: 'Active Users'
                },
                {
                  value: '99.9%',
                  label: 'Uptime'
                }].
                map((stat) =>
                <div key={stat.label}>
                    <p className="text-2xl font-bold text-textLight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-textMuted mt-1">{stat.label}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 0.8,
                delay: 0.3
              }}
              className="hidden lg:flex items-center justify-center">
              
              <div className="relative w-full max-w-md">
                {/* Main card */}
                <motion.div
                  animate={{
                    y: [0, -8, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/20">
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-textLight">
                        Medical Record
                      </p>
                      <p className="text-xs text-textMuted">
                        Verified on Blockchain
                      </p>
                    </div>
                    <span className="ml-auto px-2 py-1 text-[10px] font-medium bg-accent/10 text-accent rounded-full">
                      Secured
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-white/5 rounded-full w-full" />
                    <div className="h-3 bg-white/5 rounded-full w-4/5" />
                    <div className="h-3 bg-white/5 rounded-full w-3/5" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DatabaseIcon className="w-4 h-4 text-highlight" />
                      <span className="text-xs text-textMuted">
                        Hash: 0x7f3a...e9b2
                      </span>
                    </div>
                    <span className="text-xs text-accent">✓ Immutable</span>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  animate={{
                    y: [0, -12, 0],
                    x: [0, 5, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1
                  }}
                  className="absolute -top-6 -right-6 glass-card rounded-xl p-3 shadow-lg shadow-black/20">
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-highlight/20 flex items-center justify-center">
                      <ServerIcon className="w-4 h-4 text-highlight" />
                    </div>
                    <div>
                      <p className="text-[10px] text-textMuted">Block #4,291</p>
                      <p className="text-xs font-semibold text-textLight">
                        Confirmed
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    x: [0, -5, 0]
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2
                  }}
                  className="absolute -bottom-4 -left-6 glass-card rounded-xl p-3 shadow-lg shadow-black/20">
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <LockIcon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] text-textMuted">Encryption</p>
                      <p className="text-xs font-semibold text-textLight">
                        AES-256
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px'
            }}
            variants={stagger}
            className="text-center mb-16">
            
            <motion.span
              variants={fadeUp}
              transition={{
                duration: 0.5
              }}
              className="text-sm font-medium text-accent uppercase tracking-wider">
              
              Features
            </motion.span>
            <motion.h2
              variants={fadeUp}
              transition={{
                duration: 0.5
              }}
              className="mt-3 text-3xl sm:text-4xl font-bold text-textLight">
              
              Why Choose MediXChain?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{
                duration: 0.5
              }}
              className="mt-4 text-textMuted max-w-2xl mx-auto">
              
              Built with cutting-edge blockchain technology to give you complete
              control over your medical data.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-50px'
            }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  transition={{
                    duration: 0.5
                  }}
                  whileHover={{
                    y: -4
                  }}
                  className="glass-card glass-card-hover rounded-2xl p-6 transition-all cursor-default group">
                  
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-textLight mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-textMuted leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>);

            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 relative bg-secondary/30">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px'
            }}
            variants={stagger}
            className="text-center mb-16">
            
            <motion.span
              variants={fadeUp}
              transition={{
                duration: 0.5
              }}
              className="text-sm font-medium text-highlight uppercase tracking-wider">
              
              How It Works
            </motion.span>
            <motion.h2
              variants={fadeUp}
              transition={{
                duration: 0.5
              }}
              className="mt-3 text-3xl sm:text-4xl font-bold text-textLight">
              
              Simple, Secure, Decentralized
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{
                duration: 0.5
              }}
              className="mt-4 text-textMuted max-w-2xl mx-auto">
              
              Get started in minutes. Our streamlined process makes managing
              medical records effortless.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-50px'
            }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-accent/30 via-highlight/30 to-accent/30" />

            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  transition={{
                    duration: 0.5
                  }}
                  className="relative text-center">
                  
                  <div className="relative inline-flex mb-6">
                    <motion.div
                      whileHover={{
                        scale: 1.1
                      }}
                      className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center relative z-10">
                      
                      <IconComponent className="w-7 h-7 text-accent" />
                    </motion.div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center z-20">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-textLight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-textMuted leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>);

            })}
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                margin: '-100px'
              }}
              variants={stagger}>
              
              <motion.span
                variants={fadeUp}
                transition={{
                  duration: 0.5
                }}
                className="text-sm font-medium text-accent uppercase tracking-wider">
                
                Security First
              </motion.span>
              <motion.h2
                variants={fadeUp}
                transition={{
                  duration: 0.5
                }}
                className="mt-3 text-3xl sm:text-4xl font-bold text-textLight">
                
                Enterprise-Grade Security for Your Health Data
              </motion.h2>
              <motion.p
                variants={fadeUp}
                transition={{
                  duration: 0.5
                }}
                className="mt-4 text-textMuted leading-relaxed">
                
                MediXChain employs multiple layers of security to ensure your
                medical records remain private, tamper-proof, and accessible
                only to authorized parties.
              </motion.p>

              <motion.div variants={stagger} className="mt-8 space-y-4">
                {securityPoints.map((point) =>
                <motion.div
                  key={point}
                  variants={fadeUp}
                  transition={{
                    duration: 0.4
                  }}
                  className="flex items-center gap-3">
                  
                    <CheckCircleIcon className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm text-textLight">{point}</span>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                variants={fadeUp}
                transition={{
                  duration: 0.5
                }}
                className="mt-8 flex gap-6">
                
                {[
                {
                  value: '256-bit',
                  label: 'Encryption'
                },
                {
                  value: '100%',
                  label: 'Decentralized'
                },
                {
                  value: '0',
                  label: 'Data Breaches'
                }].
                map((stat) =>
                <div
                  key={stat.label}
                  className="glass-card rounded-xl px-4 py-3 text-center">
                  
                    <p className="text-xl font-bold text-accent">
                      {stat.value}
                    </p>
                    <p className="text-xs text-textMuted mt-1">{stat.label}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Security Visual */}
            <motion.div
              initial={{
                opacity: 0,
                x: 40
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.7
              }}
              className="hidden lg:flex items-center justify-center">
              
              <div className="relative w-full max-w-sm">
                <motion.div
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute inset-0 rounded-full border border-dashed border-accent/20" />
                
                <motion.div
                  animate={{
                    rotate: [360, 0]
                  }}
                  transition={{
                    duration: 45,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute inset-8 rounded-full border border-dashed border-highlight/20" />
                
                <div className="relative glass-card rounded-2xl p-8 text-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    
                    <ShieldCheckIcon className="w-10 h-10 text-accent" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-textLight">
                    Blockchain Verified
                  </h3>
                  <p className="text-sm text-textMuted mt-2">
                    Every transaction is cryptographically signed and immutable
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs text-accent font-medium">
                      Network Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <ActivityIcon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-lg font-bold text-textLight">
                  Medi<span className="text-accent">X</span>Chain
                </span>
              </Link>
              <p className="text-sm text-textMuted leading-relaxed">
                Decentralized medical records platform empowering patients with
                full control over their health data.
              </p>
              <div className="flex gap-3 mt-4">
                {[GithubIcon, TwitterIcon].map((SocialIcon, i) =>
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-textMuted hover:text-textLight hover:bg-white/10 transition-colors">
                  
                    <SocialIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Links */}
            {[
            {
              title: 'Product',
              links: ['Features', 'How it Works', 'Security', 'Pricing']
            },
            {
              title: 'Resources',
              links: ['Documentation', 'API Reference', 'Blog', 'Support']
            },
            {
              title: 'Legal',
              links: [
              'Privacy Policy',
              'Terms of Service',
              'HIPAA Compliance']

            }].
            map((col) =>
            <div key={col.title}>
                <h4 className="text-sm font-semibold text-textLight mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) =>
                <li key={link}>
                      <a
                    href="#"
                    className="text-sm text-textMuted hover:text-textLight transition-colors">
                    
                        {link}
                      </a>
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-textMuted">
              © 2026 MediXChain. All rights reserved.
            </p>
            <p className="text-xs text-textMuted">Built with ❤️ on Ethereum</p>
          </div>
        </div>
      </footer>
    </div>);

}

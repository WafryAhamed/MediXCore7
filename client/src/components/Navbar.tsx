import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WalletIcon,
  MenuIcon,
  XIcon,
  UserCircleIcon,
  LogOutIcon,
  SettingsIcon,
  ChevronDownIcon,
  ActivityIcon } from
'lucide-react';
interface NavbarProps {
  showDashboardNav?: boolean;
}
export function Navbar({ showDashboardNav = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const navLinks = [
  {
    label: 'Features',
    href: '/#features'
  },
  {
    label: 'How it Works',
    href: '/#how-it-works'
  },
  {
    label: 'Security',
    href: '/#security'
  }];

  const truncateAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <ActivityIcon className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold text-textLight tracking-tight">
              Medi<span className="text-accent">X</span>Chain
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {!showDashboardNav &&
          <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-textMuted hover:text-textLight transition-colors">
              
                  {link.label}
                </a>
            )}
            </div>
          }

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Connect Wallet Button */}
            {!walletConnected ?
            <motion.button
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              onClick={() => setWalletConnected(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-primary font-semibold text-sm rounded-lg transition-colors">
              
                <WalletIcon className="w-4 h-4" />
                Connect Wallet
              </motion.button> :

            <div className="relative">
                <motion.button
                whileHover={{
                  scale: 1.02
                }}
                whileTap={{
                  scale: 0.98
                }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 glass-card rounded-lg hover:bg-secondary/80 transition-colors">
                
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <UserCircleIcon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="hidden sm:block text-sm text-textLight font-medium">
                    {truncateAddress(
                    '0x1234567890abcdef1234567890abcdef12345678'
                  )}
                  </span>
                  <ChevronDownIcon
                  className={`w-4 h-4 text-textMuted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                
                </motion.button>

                <AnimatePresence>
                  {profileOpen &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.95
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.95
                  }}
                  transition={{
                    duration: 0.15
                  }}
                  className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden shadow-xl shadow-black/20">
                  
                      <Link
                    to="/patient/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-textMuted hover:text-textLight hover:bg-white/5 transition-colors"
                    onClick={() => setProfileOpen(false)}>
                    
                        <UserCircleIcon className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                    to="/patient/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-textMuted hover:text-textLight hover:bg-white/5 transition-colors"
                    onClick={() => setProfileOpen(false)}>
                    
                        <SettingsIcon className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                    onClick={() => {
                      setWalletConnected(false);
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors border-t border-border">
                    
                        <LogOutIcon className="w-4 h-4" />
                        Disconnect
                      </button>
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            }

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-textMuted hover:text-textLight transition-colors"
              aria-label="Toggle menu">
              
              {mobileMenuOpen ?
              <XIcon className="w-5 h-5" /> :

              <MenuIcon className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden border-t border-border overflow-hidden">
          
            <div className="px-4 py-4 space-y-2 bg-primary/95 backdrop-blur-xl">
              {!showDashboardNav &&
            navLinks.map((link) =>
            <a
              key={link.label}
              href={link.href}
              className="block px-3 py-2 text-sm text-textMuted hover:text-textLight rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(false)}>
              
                    {link.label}
                  </a>
            )}
              {!walletConnected &&
            <button
              onClick={() => {
                setWalletConnected(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-primary font-semibold text-sm rounded-lg transition-colors mt-2">
              
                  <WalletIcon className="w-4 h-4" />
                  Connect Wallet
                </button>
            }
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

}

import { ReactNode, useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both menu and button
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        closeMobileMenu();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      closeMobileMenu();
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  // Check if a link is active
  const isActiveLink = (path: string) => {
    return router.pathname === path;
  };

  return (
    <>
      <Head>
        <title>IPL T20 Live Dashboard</title>
        <meta name="description" content="Real-time IPL T20 match information" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-lg">
          <div className="w-full px-4 py-4">
            <div className="flex items-center justify-between">
              <Link legacyBehavior href="/">
                <a className="flex items-center space-x-3" onClick={closeMobileMenu}>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-800 font-bold text-lg">IPL</span>
                  </div>
                  <h1 className="text-2xl font-bold">IPL T20 Live Dashboard</h1>
                </a>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:block">
                <ul className="flex space-x-6">
                  <li>
                    <Link legacyBehavior href="/">
                      <a className={`hover:text-blue-200 transition-colors ${isActiveLink('/') ? 'text-blue-300 font-semibold' : ''}`}>
                        Home
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link legacyBehavior href="/matches">
                      <a className={`hover:text-blue-200 transition-colors ${isActiveLink('/matches') ? 'text-blue-300 font-semibold' : ''}`}>
                        Matches
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link legacyBehavior href="/points-table">
                      <a className={`hover:text-blue-200 transition-colors ${isActiveLink('/points-table') ? 'text-blue-300 font-semibold' : ''}`}>
                        Points Table
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link legacyBehavior href="/stats">
                      <a className={`hover:text-blue-200 transition-colors ${isActiveLink('/stats') ? 'text-blue-300 font-semibold' : ''}`}>
                        Stats
                      </a>
                    </Link>
                  </li>
                </ul>
              </nav>
              
              {/* Mobile Menu Button */}
              <button 
                ref={menuButtonRef}
                className="md:hidden p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div ref={mobileMenuRef} className="md:hidden mt-4 pb-4 bg-blue-800 rounded-lg">
                <div className="flex justify-between items-center px-4 py-3 border-b border-blue-700">
                  <span className="font-semibold">Menu</span>

                </div>
                <ul className="space-y-1 px-2 py-2">
                  <li>
                    <Link legacyBehavior href="/">
                      <a 
                        className={`block px-3 py-2 rounded-md transition-colors ${isActiveLink('/') ? 'bg-blue-700 text-white' : 'hover:bg-blue-700'}`}
                        onClick={closeMobileMenu}
                      >
                        Home
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link legacyBehavior href="/matches">
                      <a 
                        className={`block px-3 py-2 rounded-md transition-colors ${isActiveLink('/matches') ? 'bg-blue-700 text-white' : 'hover:bg-blue-700'}`}
                        onClick={closeMobileMenu}
                      >
                        Matches
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link legacyBehavior href="/points-table">
                      <a 
                        className={`block px-3 py-2 rounded-md transition-colors ${isActiveLink('/points-table') ? 'bg-blue-700 text-white' : 'hover:bg-blue-700'}`}
                        onClick={closeMobileMenu}
                      >
                        Points Table
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link legacyBehavior href="/stats">
                      <a 
                        className={`block px-3 py-2 rounded-md transition-colors ${isActiveLink('/stats') ? 'bg-blue-700 text-white' : 'hover:bg-blue-700'}`}
                        onClick={closeMobileMenu}
                      >
                        Stats
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1 w-full px-4 py-6">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-white py-8 mt-auto">
          <div className="w-full px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">IPL T20 Live Dashboard</h3>
                <p className="text-gray-400">Real-time match updates and statistics</p>
              </div>
              
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.150.748-.35.35-.566.683-.748 1.150-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.150.35.35.683.566 1.150.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.150-.748.350-.35.566-.683.748-1.150.137-.353.300-.882.344-1.857.048-1.055.058-1.370.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.150 3.098 3.098 0 00-1.150-.748c-.353-.137-.882-.300-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.270 5.135 5.135 0 010-10.270zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
              <p>© {new Date().getFullYear()} IPL T20 Live Dashboard. This is a fan-made project and not affiliated with the official IPL.</p>
              <p className="mt-2">Data sourced from iplt20.com</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
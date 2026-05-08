
interface LandingPageProps {
  onEnterWorkspace: () => void;
}

export default function LandingPage({ onEnterWorkspace }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">CryptoTutor</span>
            </div>
            <button 
              onClick={onEnterWorkspace}
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Open Workspace
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-emerald-200/20 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Educational Laboratory Prototype
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Master the Art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Secure Communication</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            From classical substitution ciphers to modern encryption standards like AES and RSA. 
            Explore, visualize, and interact with the math that protects the digital world.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <button 
              onClick={onEnterWorkspace}
              className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-200"
            >
              Start Learning Now
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            <a 
              href="#features" 
              className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Stats / Highlights */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">10+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Algorithms</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">Real-time</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processing</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">Visual</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Simulations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">Free</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Open Source</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Comprehensive Crypto Toolkit
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Everything you need to understand both legacy systems and modern security infrastructures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-2xl hover:shadow-indigo-100 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Classical Foundations</h3>
              <p className="text-slate-500 leading-relaxed">
                Dive into history with Caesar, Monoalphabetic, and Vigenère ciphers. Understand the origins of substitution and transposition.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-2xl hover:shadow-emerald-100 group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Modern Standards</h3>
              <p className="text-slate-500 leading-relaxed">
                Experience high-performance encryption with AES-128 and DES. Learn how block ciphers protect modern web traffic and sensitive data.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-rose-300 transition-all hover:shadow-2xl hover:shadow-rose-100 group">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Asymmetric Power</h3>
              <p className="text-slate-500 leading-relaxed">
                Explore RSA and Diffie-Hellman. Understand public/private key pairs and how they enable secure key exchange over public channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L100 0" stroke="white" strokeWidth="0.1" />
                <path d="M0 80 L80 0" stroke="white" strokeWidth="0.1" />
                <path d="M0 60 L60 0" stroke="white" strokeWidth="0.1" />
                <path d="M0 40 L40 0" stroke="white" strokeWidth="0.1" />
                <path d="M0 20 L20 0" stroke="white" strokeWidth="0.1" />
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative">
              Ready to decode the future?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative">
              Join students and researchers exploring the fascinating world of cryptography. 
              No installation required—start directly in your browser.
            </p>
            <button 
              onClick={onEnterWorkspace}
              className="px-10 py-5 bg-indigo-500 text-white rounded-2xl font-black text-xl hover:bg-indigo-400 transition-all hover:scale-[1.05] active:scale-[0.95] relative shadow-lg shadow-indigo-500/20"
            >
              Enter the Lab
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Cryptography Laboratory &bull; Educational Prototype &bull; 2025
        </p>
      </footer>
    </div>
  );
}

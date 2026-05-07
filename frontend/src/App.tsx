import React, { useState, useEffect } from 'react';
import CaesarCipher from './components/CaesarCipher';
import MonoalphabeticCipher from './components/MonoalphabeticCipher';
import HillCipher from './components/HillCipher';
import PlayfairCipher from './components/PlayfairCipher';
import OneTimePadCipher from './components/OneTimePadCipher';
import VigenereCipher from './components/VigenereCipher';
import RailFenceCipher from './components/RailFenceCipher';
import ColumnarCipher from './components/ColumnarCipher';
import DESCipher from './components/DESCipher';
import AESCipher from './components/AESCipher';
import MD5Hash from './components/MD5Hash';
import DiffieHellmanCipher from './components/DiffieHellmanCipher';
import RSACipher from './components/RSACipher';

type CipherType = 'caesar' | 'monoalphabetic' | 'playfair' | 'hill' | 'onetimepad' | 'vigenere' | 'railfence' | 'columnar' | 'des' | 'aes' | 'md5' | 'dh' | 'rsa';

function App() {
  const [activeCipher, setActiveCipher] = useState<CipherType>('rsa');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when selecting a cipher on mobile
  const handleCipherSelect = (cipher: CipherType) => {
    setActiveCipher(cipher);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const renderActiveCipher = () => {
    switch (activeCipher) {
      case 'caesar': return <CaesarCipher />;
      case 'monoalphabetic': return <MonoalphabeticCipher />;
      case 'playfair': return <PlayfairCipher />;
      case 'hill': return <HillCipher />;
      case 'onetimepad': return <OneTimePadCipher />;
      case 'vigenere': return <VigenereCipher />;
      case 'railfence': return <RailFenceCipher />;
      case 'columnar': return <ColumnarCipher />;
      case 'des': return <DESCipher />;
      case 'aes': return <AESCipher />;
      case 'md5': return <MD5Hash />;
      case 'dh': return <DiffieHellmanCipher />;
      case 'rsa': return <RSACipher />;
      default: return null;
    }
  };

  // Set default sidebar state for desktop
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transform transition-all duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:ml-[-288px]'
        }`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              CryptoTutor
            </h1>
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-4">Classical Algorithms</p>
          
          {[
            { id: 'caesar', label: 'Caesar Cipher', color: 'bg-indigo-500', activeBg: 'bg-indigo-50', activeText: 'text-indigo-700' },
            { id: 'monoalphabetic', label: 'Monoalphabetic', color: 'bg-emerald-500', activeBg: 'bg-emerald-50', activeText: 'text-emerald-700' },
            { id: 'playfair', label: 'Playfair Cipher', color: 'bg-purple-500', activeBg: 'bg-purple-50', activeText: 'text-purple-700' },
            { id: 'hill', label: 'Hill Cipher', color: 'bg-rose-500', activeBg: 'bg-rose-50', activeText: 'text-rose-700' },
            { id: 'onetimepad', label: 'One Time Pad', color: 'bg-amber-500', activeBg: 'bg-amber-50', activeText: 'text-amber-700' },
            { id: 'vigenere', label: 'Vigenère Cipher', color: 'bg-blue-500', activeBg: 'bg-blue-50', activeText: 'text-blue-700' },
            { id: 'railfence', label: 'Rail Fence', color: 'bg-orange-500', activeBg: 'bg-orange-50', activeText: 'text-orange-700' },
            { id: 'columnar', label: 'Columnar Trans.', color: 'bg-sky-500', activeBg: 'bg-sky-50', activeText: 'text-sky-700' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleCipherSelect(item.id as CipherType)}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 group ${
                  activeCipher === item.id 
                  ? `${item.activeBg} ${item.activeText} shadow-sm ring-1 ring-inset ring-black/5` 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${activeCipher === item.id ? item.color : 'bg-slate-300'}`}></span>
              {item.label}
            </button>
          ))}
          
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-6">Modern Standards</p>
          {[
            { id: 'des', label: 'DES Cipher', color: 'bg-slate-700', activeBg: 'bg-slate-100', activeText: 'text-slate-900' },
            { id: 'aes', label: 'AES-128 Cipher', color: 'bg-indigo-600', activeBg: 'bg-indigo-50', activeText: 'text-indigo-800' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleCipherSelect(item.id as CipherType)}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 group ${
                  activeCipher === item.id 
                  ? `${item.activeBg} ${item.activeText} shadow-sm ring-1 ring-inset ring-black/5` 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${activeCipher === item.id ? item.color : 'bg-slate-300'}`}></span>
              {item.label}
            </button>
          ))}

          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-6">Hashing</p>
          <button
              onClick={() => handleCipherSelect('md5')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 group ${
                  activeCipher === 'md5' 
                  ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-inset ring-black/5' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
              <span className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${activeCipher === 'md5' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
              MD5 Hash
          </button>

          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-6">Asymmetric</p>
          {[
            { id: 'dh', label: 'Diffie-Hellman', color: 'bg-teal-500', activeBg: 'bg-teal-50', activeText: 'text-teal-700' },
            { id: 'rsa', label: 'RSA Cipher', color: 'bg-violet-500', activeBg: 'bg-violet-50', activeText: 'text-violet-700' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleCipherSelect(item.id as CipherType)}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 group ${
                  activeCipher === item.id 
                  ? `${item.activeBg} ${item.activeText} shadow-sm ring-1 ring-inset ring-black/5` 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${activeCipher === item.id ? item.color : 'bg-slate-300'}`}></span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-700">Systems Active</span>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Navigation Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white border-b border-slate-200 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle Sidebar"
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M4 6h16M4 12h16M4 18h16" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <div className="h-6 w-[1px] bg-slate-200"></div>
            <h2 className="text-lg font-bold text-slate-800 hidden sm:block">
              {activeCipher.charAt(0).toUpperCase() + activeCipher.slice(1).replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Academic Year</span>
                <span className="text-xs font-bold text-slate-600">2025 / 2026</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">

            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {renderActiveCipher()}
            </div>
            
            <footer className="mt-12 py-8 border-t border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Cryptography Laboratory &bull; Educational Prototype
                </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;

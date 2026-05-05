import React, { useState } from 'react';
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

function App() {
  const [activeCipher, setActiveCipher] = useState<'caesar' | 'monoalphabetic' | 'playfair' | 'hill' | 'onetimepad' | 'vigenere' | 'railfence' | 'columnar' | 'des' | 'aes' | 'md5' | 'dh' | 'rsa'>('rsa');

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col z-10 min-h-screen">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
            CryptoTutor
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4">Classical</p>
          
          <button
            onClick={() => setActiveCipher('caesar')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                activeCipher === 'caesar' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeCipher === 'caesar' ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
            Caesar Cipher
          </button>
          
          <button
            onClick={() => setActiveCipher('monoalphabetic')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                activeCipher === 'monoalphabetic' 
                ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' 
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeCipher === 'monoalphabetic' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
            Monoalphabetic
          </button>

          <button
            onClick={() => setActiveCipher('playfair')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                activeCipher === 'playfair' 
                ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' 
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeCipher === 'playfair' ? 'bg-purple-500' : 'bg-slate-300'}`}></span>
            Playfair Cipher
          </button>
          
          <button
            onClick={() => setActiveCipher('hill')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                activeCipher === 'hill' 
                ? 'bg-rose-50 text-rose-700 shadow-sm border border-rose-100' 
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeCipher === 'hill' ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
            Hill Cipher
          </button>

          <button
            onClick={() => setActiveCipher('onetimepad')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                activeCipher === 'onetimepad' 
                ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-100' 
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeCipher === 'onetimepad' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
            One Time Pad
          </button>

          <button
            onClick={() => setActiveCipher('vigenere')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                activeCipher === 'vigenere' 
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeCipher === 'vigenere' ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
            Vigenère Cipher
          </button>

          <button
            onClick={() => setActiveCipher('railfence')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                activeCipher === 'railfence' 
                ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100' 
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeCipher === 'railfence' ? 'bg-orange-500' : 'bg-slate-300'}`}></span>
            Rail Fence
          </button>

          <button
            onClick={() => setActiveCipher('columnar')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                activeCipher === 'columnar' 
                ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-100' 
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeCipher === 'columnar' ? 'bg-sky-500' : 'bg-slate-300'}`}></span>
            Columnar Trans.
          </button>
          
          <div className="pt-4">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Modern</p>
            
            <button
                onClick={() => setActiveCipher('des')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                    activeCipher === 'des' 
                    ? 'bg-slate-800 text-white shadow-md border border-slate-900' 
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
            >
                <span className={`w-2 h-2 rounded-full ${activeCipher === 'des' ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                DES Cipher
            </button>

            <button
                onClick={() => setActiveCipher('aes')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                    activeCipher === 'aes' 
                    ? 'bg-indigo-600 text-white shadow-md border border-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
            >
                <span className={`w-2 h-2 rounded-full ${activeCipher === 'aes' ? 'bg-indigo-400' : 'bg-slate-300'}`}></span>
                AES-128 Cipher
            </button>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hashing</p>
            <button
                onClick={() => setActiveCipher('md5')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                    activeCipher === 'md5' 
                    ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-100' 
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
            >
                <span className={`w-2 h-2 rounded-full ${activeCipher === 'md5' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                MD5 Hash
            </button>
          </div>

          <div className="pt-4 pb-4">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Public Key</p>
            
            <button
                onClick={() => setActiveCipher('dh')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                    activeCipher === 'dh' 
                    ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' 
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
            >
                <span className={`w-2 h-2 rounded-full ${activeCipher === 'dh' ? 'bg-teal-500' : 'bg-slate-300'}`}></span>
                Diffie-Hellman
            </button>

            <button
                onClick={() => setActiveCipher('rsa')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                    activeCipher === 'rsa' 
                    ? 'bg-violet-50 text-violet-700 shadow-sm border border-violet-100' 
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
            >
                <span className={`w-2 h-2 rounded-full ${activeCipher === 'rsa' ? 'bg-violet-500' : 'bg-slate-300'}`}></span>
                RSA Cipher
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 mt-4 md:mt-0">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Interactive Workspace
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              Experiment with algorithms and learn how they work.
            </p>
          </header>
          {renderActiveCipher()}
        </div>
      </main>
    </div>
  )
}

export default App;

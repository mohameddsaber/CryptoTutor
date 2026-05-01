import React, { useState } from 'react';
import CaesarCipher from './components/CaesarCipher';
import MonoalphabeticCipher from './components/MonoalphabeticCipher';

function App() {
  const [activeTab, setActiveTab] = useState<'caesar' | 'monoalphabetic'>('caesar');

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4 pt-8 pb-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Cryptography Tutor
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Learn and explore classical and modern cryptographic algorithms interactively. 
            Type a message below to see the cipher in action.
          </p>
        </header>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('caesar')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'caesar'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Caesar Cipher
          </button>
          <button
            onClick={() => setActiveTab('monoalphabetic')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'monoalphabetic'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Monoalphabetic Cipher
          </button>
        </div>

        <main className="pb-12">
          {activeTab === 'caesar' && <CaesarCipher />}
          {activeTab === 'monoalphabetic' && <MonoalphabeticCipher />}
        </main>
      </div>
    </div>
  )
}

export default App

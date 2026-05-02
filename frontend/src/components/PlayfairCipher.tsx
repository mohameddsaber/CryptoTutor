import React, { useState, useEffect } from 'react';

export default function PlayfairCipher() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [loading, setLoading] = useState(false);
  const [matrix, setMatrix] = useState<string[][]>([]);

  // Generate matrix preview locally for UI feedback
  useEffect(() => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    const combined = cleanKey + alphabet;
    const unique: string[] = [];
    
    for (const char of combined) {
      if (!unique.includes(char)) {
        unique.push(char);
      }
    }

    const newMatrix: string[][] = [];
    for (let i = 0; i < 5; i++) {
      newMatrix.push(unique.slice(i * 5, (i + 1) * 5));
    }
    setMatrix(newMatrix);
  }, [key]);

  useEffect(() => {
    const processText = async () => {
      if (!text || !key) {
        setResult('');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/playfair/${mode}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, key }),
        });
        if (response.ok) {
          const data = await response.json();
          setResult(data.result);
        } else {
          setResult('Error processing request');
        }
      } catch (error) {
        console.error('API Error:', error);
        setResult('Error connecting to backend.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      processText();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text, key, mode]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Playfair Cipher
          </h2>
          <p className="text-sm text-slate-500 mt-1">A digraph substitution cipher using a 5x5 grid of letters.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Decrypt
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Keyword</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all uppercase font-medium tracking-widest text-purple-700"
                placeholder="Enter keyword (e.g. MONARCHY)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Input Message</label>
              <textarea
                className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none h-40 text-slate-800"
                placeholder={`Enter text to ${mode}...`}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2 flex flex-col items-center justify-start pt-1">
            <label className="block text-sm font-semibold text-slate-700 self-start">Matrix Visualization (5x5)</label>
            <div className="grid grid-cols-5 gap-1 bg-purple-50 p-3 rounded-xl border-2 border-purple-100 shadow-inner mt-1">
              {matrix.map((row, r) => row.map((char, c) => (
                <div 
                  key={`${r}-${c}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg border transition-all ${
                    key.toUpperCase().includes(char) 
                    ? 'bg-purple-600 text-white border-purple-700 shadow-sm scale-105' 
                    : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  {char}
                </div>
              )))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic">* 'J' is merged with 'I'</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              Result
              {loading && <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>}
            </label>
          </div>
          <div className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 min-h-24 text-slate-800 font-mono text-lg whitespace-pre-wrap break-words relative shadow-inner">
            {result ? (
              <span className={result.includes('Error') || result.includes('Invalid') ? 'text-red-500 text-base font-sans' : ''}>
                {result}
              </span>
            ) : (
              <span className="text-slate-400 italic text-base font-sans flex items-center justify-center h-full pt-4">
                Your result will appear here...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

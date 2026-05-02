import React, { useState, useEffect } from 'react';

export default function VigenereCipher() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [vigenereType, setVigenereType] = useState<'repeating' | 'autokey'>('repeating');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processText = async () => {
      if (!text || !key) {
        setResult('');
        return;
      }
      setLoading(true);
      const endpoint = vigenereType === 'repeating' ? 'vigenere' : 'autokey';
      try {
        const response = await fetch(`http://localhost:8080/api/${endpoint}/${mode}`, {
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
  }, [text, key, mode, vigenereType]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Vigenère Family
            </h2>
            <p className="text-sm text-slate-500 mt-1">Polyalphabetic substitution using a keyword.</p>
          </div>
          <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setMode('encrypt')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Encrypt
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Decrypt
            </button>
          </div>
        </div>

        {/* Sub-toggle for Repeating vs AutoKey */}
        <div className="flex gap-2 pt-2">
            <button 
                onClick={() => setVigenereType('repeating')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    vigenereType === 'repeating' 
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md translate-y-[-1px]' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-400'
                }`}
            >
                Repeating Key
            </button>
            <button 
                onClick={() => setVigenereType('autokey')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    vigenereType === 'autokey' 
                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-md translate-y-[-1px]' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-cyan-300 hover:text-cyan-400'
                }`}
            >
                Auto Key
            </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
                {vigenereType === 'repeating' ? 'Repeating Keyword' : 'Initial Seed Key'}
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-lg border border-slate-200 outline-none transition-all uppercase font-medium tracking-widest ${
                vigenereType === 'repeating' ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-700' : 'focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-cyan-700'
              }`}
              placeholder={vigenereType === 'repeating' ? "e.g. KEY" : "e.g. SECRET"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Input Message</label>
            <textarea
              className={`w-full p-4 rounded-lg border border-slate-200 outline-none transition-all resize-none h-32 text-slate-800 ${
                vigenereType === 'repeating' ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500'
              }`}
              placeholder={`Enter text to ${mode}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              Result
              {loading && <span className="flex h-3 w-3 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${vigenereType === 'repeating' ? 'bg-blue-400' : 'bg-cyan-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${vigenereType === 'repeating' ? 'bg-blue-500' : 'bg-cyan-500'}`}></span>
              </span>}
            </label>
          </div>
          <div className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 min-h-24 text-slate-800 font-mono text-lg whitespace-pre-wrap break-words relative shadow-inner">
            {result ? (
              <span className={result.includes('Error') ? 'text-red-500 text-base font-sans' : ''}>
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

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
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl mx-auto transition-all duration-300">
      <div className="bg-slate-50 border-b border-slate-100 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg text-white shadow-lg ${vigenereType === 'repeating' ? 'bg-blue-600 shadow-blue-200' : 'bg-cyan-600 shadow-cyan-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Vigenère Family</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Polyalphabetic Algorithm</p>
            </div>
          </div>
          <div className="flex bg-slate-200 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setMode('encrypt')}
              className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ENCRYPT
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
            >
              DECRYPT
            </button>
          </div>
        </div>

        <div className="flex gap-2">
            <button 
                onClick={() => setVigenereType('repeating')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    vigenereType === 'repeating' 
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-400'
                }`}
            >
                Repeating Key
            </button>
            <button 
                onClick={() => setVigenereType('autokey')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    vigenereType === 'autokey' 
                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-sm' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-cyan-300 hover:text-cyan-400'
                }`}
            >
                Auto Key
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Left Column: Input & Key */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                {vigenereType === 'repeating' ? 'Repeating Keyword' : 'Initial Seed Key'}
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-xl border border-slate-200 outline-none transition-all uppercase font-black tracking-widest bg-slate-50/30 ${
                vigenereType === 'repeating' ? 'focus:ring-2 focus:ring-blue-500 text-blue-700' : 'focus:ring-2 focus:ring-cyan-500 text-cyan-700'
              }`}
              placeholder={vigenereType === 'repeating' ? "e.g. KEY" : "e.g. SECRET"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Input Message</label>
            <textarea
              className={`w-full p-4 rounded-xl border border-slate-200 outline-none transition-all resize-none h-40 text-slate-800 font-medium ${
                vigenereType === 'repeating' ? 'focus:ring-2 focus:ring-blue-500' : 'focus:ring-2 focus:ring-cyan-500'
              }`}
              placeholder={`Enter text to ${mode}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="p-6 bg-slate-50/30 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Output Result
              {loading && <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${vigenereType === 'repeating' ? 'bg-blue-400' : 'bg-cyan-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${vigenereType === 'repeating' ? 'bg-blue-500' : 'bg-cyan-500'}`}></span>
              </span>}
            </label>
          </div>
          
          <div className="flex-1 w-full p-5 rounded-2xl bg-white border border-slate-200 shadow-inner overflow-y-auto max-h-[300px] lg:max-h-none min-h-[160px]">
            {result ? (
              <p className={`font-mono text-lg break-words whitespace-pre-wrap ${result.includes('Error') ? 'text-red-500 font-sans text-sm' : 'text-slate-800'}`}>
                {result}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-40 py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-sm font-medium text-slate-400">Keyword processing...</p>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-xl border mt-auto ${vigenereType === 'repeating' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-cyan-50 border-cyan-100 text-cyan-700'}`}>
            <p className="text-[10px] font-bold uppercase mb-1">Methodology</p>
            <p className="text-xs leading-tight">
              {vigenereType === 'repeating' 
                ? 'Repeating key uses the keyword cyclically to shift each letter.' 
                : 'Auto-key uses the message itself to generate the key stream after the seed.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

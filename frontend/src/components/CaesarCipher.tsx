import React, { useState, useEffect } from 'react';

export default function CaesarCipher() {
  const [text, setText] = useState('');
  const [key, setKey] = useState<number>(3);
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processText = async () => {
      if (!text) {
        setResult('');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/caesar/${mode}`, {
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
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl mx-auto transition-all duration-300">
      <div className="bg-slate-50 border-b border-slate-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-indigo-200 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Caesar Cipher</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Substitution Algorithm</p>
          </div>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            ENCRYPT
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            DECRYPT
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Left Column: Input & Settings */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Input Message</label>
            <textarea
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-40 text-slate-800 font-medium leading-relaxed"
              placeholder={`Type your message to ${mode}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Shift Key (N)</label>
              <span className="text-[10px] font-mono text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded">MOD 26</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center text-xl font-black text-indigo-600 bg-indigo-50/30"
                value={key}
                onChange={(e) => setKey(Number(e.target.value) || 0)}
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setKey(k => k - 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setKey(k => k + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="p-6 bg-slate-50/30 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Output Result
              {loading && <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>}
            </label>
            {result && !result.includes('Error') && (
              <button 
                onClick={() => navigator.clipboard.writeText(result)}
                className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors group"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012-2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex-1 w-full p-5 rounded-2xl bg-white border border-slate-200 shadow-inner overflow-y-auto max-h-[300px] lg:max-h-none min-h-[160px]">
            {result ? (
              <p className={`font-mono text-lg break-words whitespace-pre-wrap ${result.includes('Error') ? 'text-red-500 font-sans text-sm' : 'text-slate-800'}`}>
                {result}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-40 py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-sm font-medium text-slate-400">Waiting for input...</p>
              </div>
            )}
          </div>
          
          {result && !result.includes('Error') && (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 mt-auto">
              <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Quick Tip</p>
              <p className="text-xs text-indigo-700 leading-tight">
                The Caesar cipher is easily broken by frequency analysis or brute force. Use it for educational purposes only.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
        setResult('Error connecting to backend. Is the Spring Boot server running on port 8080?');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      processText();
    }, 300); // Debounce typing by 300ms

    return () => clearTimeout(timeoutId);
  }, [text, key, mode]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Caesar Cipher
          </h2>
          <p className="text-sm text-slate-500 mt-1">A substitution cipher that shifts characters by a fixed key.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Decrypt
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Input Message</label>
            <textarea
              className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-32 text-slate-800"
              placeholder={`Enter text to ${mode}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="space-y-2 flex flex-col">
            <label className="block text-sm font-semibold text-slate-700">Shift Key (N)</label>
            <input
              type="number"
              className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center text-2xl font-mono text-indigo-600 bg-indigo-50/30"
              value={key}
              onChange={(e) => setKey(Number(e.target.value) || 0)}
            />
            <div className="flex justify-between mt-2 px-1">
              <button 
                onClick={() => setKey(k => k - 1)}
                className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >-</button>
              <button 
                onClick={() => setKey(k => k + 1)}
                className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >+</button>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              Result
              {loading && <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>}
            </label>
            {result && !result.includes('Error') && (
              <button 
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Copy to clipboard
              </button>
            )}
          </div>
          <div className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 min-h-32 text-slate-800 font-mono text-lg whitespace-pre-wrap break-words relative shadow-inner">
            {result ? (
              <span className={result.includes('Error') ? 'text-red-500 text-base font-sans' : ''}>
                {result}
              </span>
            ) : (
              <span className="text-slate-400 italic text-base font-sans flex items-center justify-center h-full pt-8">
                Your result will appear here...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

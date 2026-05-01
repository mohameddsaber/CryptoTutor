import React, { useState, useEffect } from 'react';

export default function MonoalphabeticCipher() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('qwertyuiopasdfghjklzxcvbnm');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processText = async () => {
      if (!text) {
        setResult('');
        return;
      }
      if (key.length !== 26) {
        setResult('Key must be exactly 26 characters long.');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/monoalphabetic/${mode}`, {
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

  const shuffleKey = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
    for (let i = alphabet.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
    }
    setKey(alphabet.join(''));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Monoalphabetic Cipher
          </h2>
          <p className="text-sm text-slate-500 mt-1">A substitution cipher using a randomly shuffled 26-letter alphabet key.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-600 hover:text-slate-800'}`}
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
              className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none h-32 text-slate-800"
              placeholder={`Enter text to ${mode}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="space-y-2 flex flex-col">
            <label className="block text-sm font-semibold text-slate-700">Alphabet Key</label>
            <input
              type="text"
              maxLength={26}
              className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-center text-lg font-mono text-emerald-600 bg-emerald-50/30"
              value={key}
              onChange={(e) => setKey(e.target.value.toLowerCase())}
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
               <span>Length: {key.length}/26</span>
               <button 
                onClick={shuffleKey}
                className="text-emerald-600 hover:text-emerald-800 font-medium"
               >Randomize</button>
            </div>
            
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              Result
              {loading && <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>}
            </label>
          </div>
          <div className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 min-h-32 text-slate-800 font-mono text-lg whitespace-pre-wrap break-words relative shadow-inner">
            {result ? (
              <span className={result.includes('Error') || result.includes('must be exactly 26') ? 'text-red-500 text-base font-sans' : ''}>
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

import React, { useState, useEffect } from 'react';

export default function AESCipher() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputType, setInputType] = useState<'text' | 'hex'>('text');
  const [loading, setLoading] = useState(false);

  // Helper to convert string to hex
  const stringToHex = (str: string) => {
    return Array.from(str).map(c => 
      c.charCodeAt(0).toString(16).padStart(2, '0')
    ).join('').toUpperCase();
  };

  // Helper to convert hex to string
  const hexToString = (hex: string) => {
    try {
      let str = '';
      for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    } catch (e) {
      return hex;
    }
  };

  const generateRandomKey = () => {
    const chars = '0123456789ABCDEF';
    let res = '';
    for (let i = 0; i < 32; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    setKey(res);
  };

  useEffect(() => {
    const processText = async () => {
      if (!text || !key) {
        setResult('');
        return;
      }

      if (key.length !== 32) {
        setResult('Error: Key must be 32 hex characters (128-bit)');
        return;
      }

      setLoading(true);
      try {
        const hexText = inputType === 'text' ? stringToHex(text) : text.toUpperCase().replace(/[^0-9A-F]/g, '');
        
        const response = await fetch(`http://localhost:8080/api/aes/${mode}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: hexText, key: key.toUpperCase() }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.result.startsWith('Error')) {
            setResult(data.result);
          } else {
            if (mode === 'decrypt' && inputType === 'text') {
              setResult(`${data.result}\n\n(As Text: ${hexToString(data.result)})`);
            } else {
              setResult(data.result);
            }
          }
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
  }, [text, key, mode, inputType]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              AES-128 (Modern)
            </h2>
            <p className="text-sm text-slate-500 mt-1">Advanced Encryption Standard - The gold standard for symmetric encryption.</p>
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

        <div className="flex gap-2">
            <button 
                onClick={() => setInputType('text')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    inputType === 'text' 
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
            >
                ASCII Text
            </button>
            <button 
                onClick={() => setInputType('hex')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    inputType === 'hex' 
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
            >
                Hexadecimal
            </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">128-bit Key (32 Hex Chars)</label>
              <button 
                onClick={generateRandomKey}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded transition-colors"
              >
                Generate Key
              </button>
            </div>
            <input
              type="text"
              maxLength={32}
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase font-mono tracking-widest text-slate-700 text-center text-sm"
              placeholder="e.g. 2B7E151628AED2A6ABF7158809CF4F3C"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
                Input {inputType === 'text' ? 'Message' : 'Hex Data'}
            </label>
            <textarea
              className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-32 text-slate-800 font-mono"
              placeholder={inputType === 'text' ? "Enter plain text..." : "Enter hex chars (0-9, A-F)..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              Result (Hex)
              {loading && <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>}
            </label>
          </div>
          <div className="w-full p-4 rounded-lg bg-slate-900 border border-slate-800 min-h-24 text-indigo-400 font-mono text-lg whitespace-pre-wrap break-words relative shadow-inner">
            {result ? (
              <span className={result.includes('Error') ? 'text-rose-400' : ''}>
                {result}
              </span>
            ) : (
              <span className="text-slate-600 italic text-base font-sans flex items-center justify-center h-full pt-4">
                Encrypted/Decrypted output will appear here...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl mx-auto transition-all duration-300">
      <div className="bg-slate-50 border-b border-slate-100 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-indigo-200 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">AES-128 (Modern)</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Symmetric Block Cipher</p>
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

        <div className="flex gap-2">
            <button 
                onClick={() => setInputType('text')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    inputType === 'text' 
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
            >
                ASCII Text
            </button>
            <button 
                onClick={() => setInputType('hex')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    inputType === 'hex' 
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
            >
                Hexadecimal
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Left Column: Input & Key */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">128-bit Key (32 Hex)</label>
              <button 
                onClick={generateRandomKey}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
              >
                Generate
              </button>
            </div>
            <input
              type="text"
              maxLength={32}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase font-mono tracking-widest text-slate-700 text-center text-sm bg-slate-50/30"
              placeholder="e.g. 2B7E151628AED2A6ABF7158809CF4F3C"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Input {inputType === 'text' ? 'Message' : 'Hex Data'}
            </label>
            <textarea
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-40 text-slate-800 font-mono text-sm leading-relaxed"
              placeholder={inputType === 'text' ? "Enter plain text..." : "Enter hex chars (0-9, A-F)..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="p-6 bg-slate-900 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-400/60 uppercase tracking-wider">
              Result (HEX)
              {loading && <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>}
            </label>
            {result && !result.includes('Error') && (
              <button 
                onClick={() => navigator.clipboard.writeText(result)}
                className="p-2 rounded-lg hover:bg-slate-800 text-indigo-400 transition-colors"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012-2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex-1 w-full p-5 rounded-2xl bg-slate-950/50 border border-slate-800 shadow-inner overflow-y-auto max-h-[300px] lg:max-h-none min-h-[160px]">
            {result ? (
              <p className={`font-mono text-lg break-words whitespace-pre-wrap ${result.includes('Error') ? 'text-rose-400 text-sm font-sans' : 'text-indigo-400'}`}>
                {result}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-20 py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm font-medium text-indigo-300">Awaiting encryption...</p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 mt-auto">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Standards Info</p>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              AES (Rijndael) uses 10 rounds for 128-bit keys. It is the global standard for secure data encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

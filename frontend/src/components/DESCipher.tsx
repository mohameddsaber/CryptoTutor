import React, { useState, useEffect } from 'react';

export default function DESCipher() {
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
      return hex; // Return hex if conversion fails
    }
  };

  const generateRandomKey = () => {
    const chars = '0123456789ABCDEF';
    let res = '';
    for (let i = 0; i < 16; i++) {
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

      if (key.length !== 16) {
        setResult('Error: Key must be 16 hex characters (64-bit)');
        return;
      }

      setLoading(true);
      try {
        const hexText = inputType === 'text' ? stringToHex(text) : text.toUpperCase().replace(/[^0-9A-F]/g, '');
        
        const response = await fetch(`http://localhost:8080/api/des/${mode}`, {
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
            // For decryption, if we started with text, try to show text result
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              DES (Modern)
            </h2>
            <p className="text-sm text-slate-500 mt-1">Data Encryption Standard - 64-bit block cipher.</p>
          </div>
          <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setMode('encrypt')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Encrypt
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-800'}`}
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
                    ? 'bg-slate-800 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
            >
                ASCII Text
            </button>
            <button 
                onClick={() => setInputType('hex')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    inputType === 'hex' 
                    ? 'bg-slate-800 text-white border-slate-900 shadow-sm' 
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
              <label className="block text-sm font-semibold text-slate-700">64-bit Key (16 Hex Chars)</label>
              <button 
                onClick={generateRandomKey}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded transition-colors"
              >
                Generate Key
              </button>
            </div>
            <input
              type="text"
              maxLength={16}
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all uppercase font-mono tracking-widest text-slate-700 text-center"
              placeholder="e.g. 133457799BBCDFF1"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
                Input {inputType === 'text' ? 'Message' : 'Hex Data'}
            </label>
            <textarea
              className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all resize-none h-32 text-slate-800 font-mono"
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-500"></span>
              </span>}
            </label>
          </div>
          <div className="w-full p-4 rounded-lg bg-slate-900 border border-slate-800 min-h-24 text-emerald-400 font-mono text-lg whitespace-pre-wrap break-words relative shadow-inner">
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

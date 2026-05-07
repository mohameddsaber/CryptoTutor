import React, { useState, useEffect } from 'react';

export default function HillCipher() {
  const [text, setText] = useState('');
  const [key, setKey] = useState<number[][]>([
    [6, 24, 1],
    [13, 16, 10],
    [20, 17, 15]
  ]);
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
        const response = await fetch(`http://localhost:8080/api/hill/${mode}`, {
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

  const handleKeyChange = (row: number, col: number, value: string) => {
    const newKey = [...key.map(r => [...r])];
    newKey[row][col] = parseInt(value) || 0;
    setKey(newKey);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl mx-auto transition-all duration-300">
      <div className="bg-slate-50 border-b border-slate-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500 rounded-lg text-white shadow-rose-200 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Hill Cipher</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Polygraphic Algorithm</p>
          </div>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            ENCRYPT
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            DECRYPT
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Left Column: Input & Key */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Input Message</label>
            <textarea
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none h-40 text-slate-800 font-medium"
              placeholder={`Enter text to ${mode}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">3x3 Key Matrix</label>
            <div className="grid grid-cols-3 gap-2 bg-rose-50/30 p-3 rounded-xl border border-rose-100 shadow-inner">
              {key.map((row, rowIndex) => (
                row.map((val, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="number"
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-center font-black text-rose-600 bg-white"
                    value={val}
                    onChange={(e) => handleKeyChange(rowIndex, colIndex, e.target.value)}
                  />
                ))
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="p-6 bg-slate-50/30 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Output Result
              {loading && <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>}
            </label>
          </div>
          
          <div className="flex-1 w-full p-5 rounded-2xl bg-white border border-slate-200 shadow-inner overflow-y-auto max-h-[300px] lg:max-h-none min-h-[160px]">
            {result ? (
              <p className={`font-mono text-lg break-words whitespace-pre-wrap ${result.includes('Error') || result.includes('Invalid') ? 'text-red-500 font-sans text-sm' : 'text-slate-800'}`}>
                {result}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-40 py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium text-slate-400">Matrix calculation pending...</p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 mt-auto">
            <p className="text-[10px] font-bold text-rose-500 uppercase mb-1">Matrix Theory</p>
            <p className="text-xs text-rose-700 leading-tight">
              For decryption to work, the key matrix must be invertible modulo 26. The determinant must be coprime to 26.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

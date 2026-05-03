import React, { useState, useEffect } from 'react';

export default function RailFenceCipher() {
  const [text, setText] = useState('');
  const [depth, setDepth] = useState(2);
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
        const response = await fetch(`http://localhost:8080/api/railfence/${mode}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, key: depth }),
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
  }, [text, depth, mode]);

  // Visual representation of the transposition matrix
  const renderMatrix = () => {
    if (!text || mode !== 'encrypt') return null;
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanText) return null;

    const cols = Math.ceil(cleanText.length / depth);
    const matrix: string[][] = Array.from({ length: depth }, () => Array(cols).fill(''));
    
    let index = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < depth; r++) {
        if (index < cleanText.length) {
          matrix[r][c] = cleanText[index++];
        } else {
          matrix[r][c] = 'X';
        }
      }
    }

    return (
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="inline-block min-w-full align-middle">
          <div className="border border-orange-200 rounded-lg overflow-hidden bg-orange-50/30">
            <table className="min-w-full divide-y divide-orange-200">
              <tbody className="divide-y divide-orange-100">
                {matrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="px-3 py-2 text-xs font-bold text-orange-400 bg-orange-50 border-r border-orange-200 w-12 text-center uppercase tracking-tighter">Rail {rIdx + 1}</td>
                    {row.map((char, cIdx) => (
                      <td key={cIdx} className={`px-3 py-2 text-sm font-mono text-center border-r border-orange-100 last:border-0 ${char === 'X' ? 'text-slate-300' : 'text-orange-700 font-bold'}`}>
                        {char}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 italic flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Encrypted result is read row-by-row: Rail 1 → Rail 2 → Rail {depth}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Rail Fence
          </h2>
          <p className="text-sm text-slate-500 mt-1">A simple transposition cipher that rearranges characters in depth (rails).</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-600 hover:text-slate-800'}`}
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
              className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none h-32 text-slate-800"
              placeholder={`Enter text to ${mode}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Rails (Depth)</label>
            <input
              type="number"
              min="2"
              max="10"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-center font-bold text-orange-600 text-xl"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value) || 2)}
            />
            <p className="text-[10px] text-slate-400 text-center font-medium uppercase tracking-tight">Complexity</p>
          </div>
        </div>

        {renderMatrix()}

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              Result
              {loading && <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
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

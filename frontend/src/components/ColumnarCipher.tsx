import React, { useState, useEffect } from 'react';

export default function ColumnarCipher() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processText = async () => {
      if (!text || !key) {
        setResult('');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/columnar/${mode}`, {
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

  const renderMatrix = () => {
    if (!text || !key || mode !== 'encrypt') return null;
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanText || !cleanKey) return null;

    const cols = cleanKey.length;
    const rows = Math.ceil(cleanText.length / cols);
    const matrix: string[][] = Array.from({ length: rows }, () => Array(cols).fill(''));
    
    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (index < cleanText.length) {
          matrix[r][c] = cleanText[index++];
        } else {
          matrix[r][c] = 'X';
        }
      }
    }

    // Get alphabetical order of key characters
    const keyPairs = cleanKey.split('').map((char, idx) => ({ char, idx }));
    keyPairs.sort((a, b) => a.char.localeCompare(b.char));
    const orderMap = new Array(cols);
    keyPairs.forEach((pair, rank) => {
        orderMap[pair.idx] = rank + 1;
    });

    return (
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="inline-block min-w-full align-middle">
          <div className="border border-sky-200 rounded-lg overflow-hidden bg-sky-50/30 shadow-sm">
            <table className="min-w-full divide-y divide-sky-200">
              <thead className="bg-sky-100">
                <tr>
                  {cleanKey.split('').map((char, idx) => (
                    <th key={idx} className="px-3 py-2 text-center border-r border-sky-200 last:border-0">
                      <div className="text-sky-800 font-extrabold text-lg">{char}</div>
                      <div className="text-[10px] text-sky-500 uppercase font-bold tracking-widest mt-0.5">Pos: {orderMap[idx]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 bg-white">
                {matrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((char, cIdx) => (
                      <td key={cIdx} className={`px-3 py-2 text-sm font-mono text-center border-r border-sky-100 last:border-0 ${char === 'X' ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
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
            Columns are read in alphabetical order of the keyword: {keyPairs.map(p => p.char).join(' → ')}
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Columnar Transposition
          </h2>
          <p className="text-sm text-slate-500 mt-1">A cipher where text is written in rows and read out in columns based on a keyword.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Decrypt
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Keyword</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all uppercase font-bold tracking-widest text-sky-700"
              placeholder="e.g. HACK"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Input Message</label>
            <textarea
              className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none h-32 text-slate-800"
              placeholder={`Enter text to ${mode}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        {renderMatrix()}

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              Result
              {loading && <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
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

import React, { useState, useEffect } from 'react';

export default function MD5Hash() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const computeHash = async () => {
      if (!text) {
        setResult('');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/hash/md5`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setResult(data.result);
        } else {
          setResult('Error computing hash');
        }
      } catch (error) {
        console.error('API Error:', error);
        setResult('Error connecting to backend.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      computeHash();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.103-1.103" />
          </svg>
          MD5 Hashing
        </h2>
        <p className="text-sm text-slate-500 mt-1">Message-Digest Algorithm 5 - A widely used cryptographic hash function producing a 128-bit hash value.</p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Input Message</label>
          <textarea
            className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none h-32 text-slate-800"
            placeholder="Type any message to hash..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              MD5 Hash
              {loading && <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>}
            </label>
          </div>
          <div className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 min-h-24 text-slate-800 font-mono text-xl break-all flex items-center justify-center text-center shadow-inner">
            {result ? (
              <span className="text-amber-700 font-bold uppercase tracking-widest">{result}</span>
            ) : (
              <span className="text-slate-400 italic text-base font-sans">
                Hash will appear here...
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center uppercase font-bold tracking-tight">One-way function • 128-bit Digest</p>
        </div>
      </div>
    </div>
  );
}

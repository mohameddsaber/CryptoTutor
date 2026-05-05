import React, { useState } from 'react';

export default function DiffieHellmanCipher() {
  const [params, setParams] = useState({ q: '353', alpha: '3', xa: '97', xb: '233' });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/public-key/diffie-hellman/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Diffie-Hellman Key Exchange
        </h2>
        <p className="text-sm text-slate-500 mt-1">Establish a shared secret over an insecure channel.</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase">Prime Modulus (q)</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-mono"
              value={params.q}
              onChange={(e) => setParams({...params, q: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase">Primitive Root (α)</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-mono"
              value={params.alpha}
              onChange={(e) => setParams({...params, alpha: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-100">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-teal-700">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-xs">A</div>
              <span className="font-bold text-sm">User Alice</span>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Private Key (Xa)</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-mono text-sm"
                value={params.xa}
                onChange={(e) => setParams({...params, xa: e.target.value})}
              />
            </div>
            {results?.ya && (
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-100">
                <p className="text-[10px] font-bold text-teal-600 uppercase">Public Value (Ya)</p>
                <p className="font-mono text-lg font-bold text-teal-800">{results.ya}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-700">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-xs">B</div>
              <span className="font-bold text-sm">User Bob</span>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Private Key (Xb)</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm"
                value={params.xb}
                onChange={(e) => setParams({...params, xb: e.target.value})}
              />
            </div>
            {results?.yb && (
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <p className="text-[10px] font-bold text-orange-600 uppercase">Public Value (Yb)</p>
                <p className="font-mono text-lg font-bold text-orange-800">{results.yb}</p>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={loading}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Compute Shared Secret'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {results?.ka && (
          <div className="pt-6 border-t-2 border-dashed border-slate-100">
            <div className="bg-gradient-to-r from-teal-600 to-orange-600 p-[2px] rounded-2xl">
              <div className="bg-white rounded-[14px] p-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Final Shared Secret (K)</p>
                <div className="flex justify-center items-baseline gap-4">
                    <div className="text-center">
                        <p className="text-[10px] text-teal-500 font-bold mb-1">Alice's K</p>
                        <p className="font-mono text-3xl font-black text-slate-800">{results.ka}</p>
                    </div>
                    <div className="text-slate-300 text-2xl font-light">==</div>
                    <div className="text-center">
                        <p className="text-[10px] text-orange-500 font-bold mb-1">Bob's K</p>
                        <p className="font-mono text-3xl font-black text-slate-800">{results.kb}</p>
                    </div>
                </div>
                <p className="mt-4 text-xs text-slate-400 italic">Agreement reached! Both users now share the same key.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

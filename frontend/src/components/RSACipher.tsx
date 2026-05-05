import React, { useState } from 'react';

export default function RSACipher() {
  const [activeTab, setActiveTab] = useState<'keygen' | 'encrypt' | 'decrypt'>('keygen');
  const [keyParams, setKeyParams] = useState({ p: '61', q: '53', e: '17' });
  const [keys, setKeys] = useState<any>(null);
  const [encryptData, setEncryptData] = useState({ text: '42', e: '', n: '' });
  const [decryptData, setDecryptData] = useState({ text: '', d: '', n: '' });
  const [results, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/public-key/rsa/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyParams),
      });
      const data = await response.json();
      if (data.success === 'true') {
        setKeys(data);
        setEncryptData({ ...encryptData, e: data.e || keyParams.e, n: data.n });
        setDecryptData({ ...decryptData, d: data.d, n: data.n });
      } else {
        alert(data.error);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const processRSA = async (mode: 'encrypt' | 'decrypt') => {
    setLoading(true);
    const data = mode === 'encrypt' ? encryptData : decryptData;
    try {
      const response = await fetch(`http://localhost:8080/api/public-key/rsa/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      setResult(resData.result);
      if (mode === 'encrypt') setDecryptData({ ...decryptData, text: resData.result });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          RSA Asymmetric Encryption
        </h2>
        
        <div className="flex gap-1 bg-slate-200 p-1 rounded-lg mt-4 w-fit">
          {['keygen', 'encrypt', 'decrypt'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                activeTab === tab ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'keygen' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Prime P</label>
                <input type="text" className="w-full p-2 rounded-lg border border-slate-200 font-mono" value={keyParams.p} onChange={(e) => setKeyParams({...keyParams, p: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Prime Q</label>
                <input type="text" className="w-full p-2 rounded-lg border border-slate-200 font-mono" value={keyParams.q} onChange={(e) => setKeyParams({...keyParams, q: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Public E</label>
                <input type="text" className="w-full p-2 rounded-lg border border-slate-200 font-mono" value={keyParams.e} onChange={(e) => setKeyParams({...keyParams, e: e.target.value})} />
              </div>
            </div>
            <button onClick={generateKeys} className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all">
                {loading ? 'Generating...' : 'Calculate RSA Components'}
            </button>
            {keys && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Public Key (n, e)</p>
                  <p className="font-mono text-sm break-all font-bold text-emerald-800">n: {keys.n}</p>
                  <p className="font-mono text-sm break-all font-bold text-emerald-800">e: {keyParams.e}</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <p className="text-[10px] font-bold text-rose-600 uppercase mb-1">Private Key (d)</p>
                  <p className="font-mono text-sm break-all font-bold text-rose-800">d: {keys.d}</p>
                  <p className="text-[9px] text-rose-400 mt-2 italic">phi(n): {keys.phi}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'encrypt' || activeTab === 'decrypt') && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">
                    {activeTab === 'encrypt' ? 'Message (Numeric M)' : 'Ciphertext (Numeric C)'}
                </label>
                <input 
                    type="text" 
                    className="w-full p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-xl" 
                    value={activeTab === 'encrypt' ? encryptData.text : decryptData.text} 
                    onChange={(e) => activeTab === 'encrypt' ? setEncryptData({...encryptData, text: e.target.value}) : setDecryptData({...decryptData, text: e.target.value})}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                        {activeTab === 'encrypt' ? 'Public Exponent (e)' : 'Private Exponent (d)'}
                    </label>
                    <input 
                        type="text" 
                        className="w-full p-2 rounded-lg border border-slate-200 font-mono" 
                        value={activeTab === 'encrypt' ? encryptData.e : decryptData.d}
                        onChange={(e) => activeTab === 'encrypt' ? setEncryptData({...encryptData, e: e.target.value}) : setDecryptData({...decryptData, d: e.target.value})}
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Modulus (n)</label>
                    <input 
                        type="text" 
                        className="w-full p-2 rounded-lg border border-slate-200 font-mono" 
                        value={activeTab === 'encrypt' ? encryptData.n : decryptData.n}
                        onChange={(e) => activeTab === 'encrypt' ? setEncryptData({...encryptData, n: e.target.value}) : setDecryptData({...decryptData, n: e.target.value})}
                    />
                </div>
            </div>

            <button 
                onClick={() => processRSA(activeTab as any)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
                {loading ? 'Processing...' : activeTab === 'encrypt' ? 'Encrypt' : 'Decrypt'}
            </button>

            {results && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Result</p>
                    <p className="font-mono text-2xl font-black text-slate-800 break-all">{results}</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

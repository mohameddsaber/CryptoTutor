import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AESStep {
  name: string;
  state: string;
}

export default function AESCipher() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState<AESStep[]>([]);
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
        setSteps([]);
        return;
      }

      if (key.length !== 32) {
        setResult('Error: Key must be 32 hex characters (128-bit)');
        setSteps([]);
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
          if (data.result && data.result.startsWith('Error')) {
            setResult(data.result);
            setSteps([]);
          } else {
            if (mode === 'decrypt' && inputType === 'text') {
              setResult(`${data.result}\n\n(As Text: ${hexToString(data.result)})`);
            } else {
              setResult(data.result);
            }
            setSteps(data.steps || []);
          }
        } else {
          setResult('Error processing request');
          setSteps([]);
        }
      } catch (error) {
        console.error('API Error:', error);
        setResult('Error connecting to backend.');
        setSteps([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      processText();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text, key, mode, inputType]);

  const renderGrid = (hexState: string) => {
    if (!hexState || hexState.length !== 32) return null;
    const grid = [];
    // The state string is column-major in backend (c0r0, c0r1...)
    // Let's render it row-major in the UI as is standard for AES
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        // The index in the string for state[r][c] is (c * 4 + r) * 2
        const idx = (c * 4 + r) * 2;
        grid.push(hexState.substring(idx, idx + 2));
      }
    }

    return (
      <div className="grid grid-cols-4 gap-1 w-fit bg-slate-900 p-2 rounded-xl border border-slate-700 shadow-inner">
        {grid.map((byte, i) => (
          <div key={i} className="w-9 h-9 flex items-center justify-center bg-slate-950 rounded font-mono text-xs font-black text-indigo-400 border border-slate-800 shadow-sm transition-all group-hover:scale-110">
            {byte}
          </div>
        ))}
      </div>
    );
  };

  const getStepDescription = (name: string) => {
    if (name.includes('Initial State')) return "The 128-bit block is arranged into a 4x4 column-major grid. This is the starting point for the algorithm.";
    if (name.includes('AddRoundKey')) return "XORs the state with the round key, injecting the secret key material. This ensures every operation depends on the key.";
    if (name.includes('SubBytes') || name.includes('InvSubBytes')) return "Non-linear substitution using an S-box. Provides 'confusion' by hiding the relationship between the key and ciphertext.";
    if (name.includes('ShiftRows') || name.includes('InvShiftRows')) return "Cyclic row shifts. Provides 'diffusion' by spreading data across columns, ensuring bytes interact with different parts of the block.";
    if (name.includes('MixColumns') || name.includes('InvMixColumns')) return "Column-wise polynomial multiplication. Provides massive diffusion, meaning a 1-bit change affects the entire column immediately.";
    return "";
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { type: "spring", stiffness: 260, damping: 20 } 
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start w-full">
      {/* Left Column: Input, Key, and Result (Sticky with internal scroll safety) */}
      <div className="w-full xl:w-[420px] flex flex-col gap-6 xl:sticky xl:top-0 shrink-0 xl:max-h-screen xl:overflow-y-auto custom-scrollbar pb-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300">
          <div className="bg-slate-50 border-b border-slate-100 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-indigo-200 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">AES Engine</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Symmetric Security</p>
                </div>
              </div>
              <div className="flex bg-slate-200 p-1 rounded-xl shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setMode('encrypt')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'encrypt' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  ENCRYPT
                </button>
                <button
                  onClick={() => setMode('decrypt')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'decrypt' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  DECRYPT
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
          
          <div className="flex flex-col divide-y divide-slate-100">
            {/* Input & Key Section */}
            <div className="p-5 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">128-bit Master Key</label>
                  <button 
                    onClick={generateRandomKey}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-lg transition-colors border border-indigo-100"
                  >
                    Random
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={32}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase font-mono tracking-[0.1em] text-slate-700 text-center text-xs bg-slate-50/50"
                  placeholder="32 HEX CHARACTERS"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Payload
                </label>
                <textarea
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-24 text-slate-800 font-mono text-sm leading-relaxed custom-scrollbar shadow-inner"
                  placeholder={inputType === 'text' ? "Plain text..." : "Hex chars..."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>

            {/* Live Result Panel */}
            <div className="p-5 bg-slate-900 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-indigo-400/80 uppercase tracking-widest">
                  Active Result
                  {loading && <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>}
                </label>
                {result && !result.includes('Error') && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-indigo-400 transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012-2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner overflow-y-auto max-h-[120px] min-h-[80px] custom-scrollbar">
                {result ? (
                  <p className={`font-mono text-base break-words whitespace-pre-wrap ${result.includes('Error') ? 'text-rose-400 text-sm font-sans' : 'text-indigo-400'}`}>
                    {result}
                  </p>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-30 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase">SYSTEM IDLE</p>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">Standards & Security</p>
                <p className="text-[11px] text-slate-400 leading-relaxed italic opacity-80">
                  AES (FIPS 197) is a NIST-standard block cipher. It utilizes a series of transformations across 10-14 rounds depending on key size.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Visualization Feed */}
      <div className="flex-1 flex flex-col min-h-[600px] w-full">
        {steps.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-6 sm:p-10 w-full overflow-hidden"
          >
            <div className="mb-10 border-b border-slate-800 pb-6">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </div>
                Mathematical Breakdown
              </h3>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed max-w-xl">
                Observe the lifecycle of your first data block. Every operation here is designed to prevent decryption without the master key.
              </p>
            </div>

            <motion.div 
              key={`${mode}-${text.length}-${key.length}`} // Trigger staggered animation
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4"
            >
              {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  {/* Step Visualization Card */}
                  <motion.div 
                    variants={itemVariants}
                    className="flex flex-col md:flex-row items-center gap-8 bg-slate-800/30 rounded-[2rem] border border-slate-700/40 p-8 shadow-xl relative group hover:bg-slate-800/60 hover:border-indigo-500/40 transition-all duration-500 overflow-hidden"
                  >
                    {/* Grid side */}
                    <div className="shrink-0 relative">
                        {renderGrid(step.state)}
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    </div>
                    
                    {/* Explanation side */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="inline-block px-4 py-1.5 bg-slate-950 rounded-full border border-slate-800 mb-4 shadow-sm">
                          <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">{step.name}</h4>
                      </div>
                      <p className="text-base text-slate-300 leading-relaxed font-medium">
                        {getStepDescription(step.name)}
                      </p>
                    </div>

                    {/* Step Number Badge */}
                    <div className="absolute top-4 right-6 text-[4rem] font-black text-slate-800/20 select-none pointer-events-none group-hover:text-indigo-500/10 transition-colors">
                        {idx}
                    </div>
                  </motion.div>
                  
                  {/* Flow Arrow Connector */}
                  {idx < steps.length - 1 && (
                    <motion.div 
                      variants={itemVariants}
                      className="flex items-center justify-center py-1"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-600 shadow-inner group-hover:text-indigo-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 min-h-[600px] h-full p-12 text-center transition-all duration-300">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-slate-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.288a2 2 0 01-1.645.033l-.685-.333a4 4 0 00-1.907-.484l-2.169.362a2 2 0 00-1.483 2.361l.847 4.962a2 2 0 002.347 1.626l4.69-.469a2 2 0 001.626-2.347l-.847-4.962z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.5 9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-600 mb-3 tracking-tight">Ready for Computation</h3>
            <p className="text-sm max-w-sm font-medium leading-relaxed">
              Complete your cryptographic configuration on the left to activate the live mathematical engine and view the internal state transformations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

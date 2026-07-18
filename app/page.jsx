'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { encodeMessageInImage, decodeMessageFromImage } from '../lib/stego';
import { 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Download, 
  AlertTriangle, 
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { OriginButton } from '../components/ui/origin-button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('encode'); 
  
  // Encode State
  const [encodeImage, setEncodeImage] = useState(null);
  const [encodeImageData, setEncodeImageData] = useState(null);
  const [message, setMessage] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [encodedResult, setEncodedResult] = useState(null);
  const encodeFileInput = useRef(null);
  
  // Decode State
  const [decodeImage, setDecodeImage] = useState(null);
  const [decodeImageData, setDecodeImageData] = useState(null);
  const [decodePassword, setDecodePassword] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const decodeFileInput = useRef(null);

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setError('Please upload a PNG or JPG image.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        if (type === 'encode') {
          setEncodeImage(event.target.result);
          setEncodeImageData({ width: img.width, height: img.height, element: img });
          setEncodedResult(null);
        } else {
          setDecodeImage(event.target.result);
          setDecodeImageData({ width: img.width, height: img.height, element: img });
          setDecodedMessage('');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleEncode = () => {
    if (!encodeImageData || !message) {
      setError('Please select an image and enter a message.');
      return;
    }
    setError('');
    setLoadingText('Encrypting & Embedding...');
    setLoading(true);
    
    setTimeout(() => {
      try {
        const result = encodeMessageInImage(encodeImageData, message, usePassword ? password : '');
        setEncodedResult(result);
        setActiveTab('result'); 
      } catch (err) {
        setError(err.message || 'An error occurred while encoding.');
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const handleDecode = () => {
    if (!decodeImageData) {
      setError('Please select an image to decode.');
      return;
    }
    setError('');
    setLoadingText('Extracting & Decrypting...');
    setLoading(true);
    
    setTimeout(() => {
      try {
        const result = decodeMessageFromImage(decodeImageData, decodePassword);
        setDecodedMessage(result);
      } catch (err) {
        setError(err.message || 'An error occurred while decoding.');
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <>
      <header className="border-b border-white/[0.05] bg-black/30 backdrop-blur-2xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2.5 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(20,184,166,0.2)] group-hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] group-hover:scale-105 transition-all duration-500">
              <ShieldCheck className="text-black" size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white group-hover:text-brand-100 transition-colors">CryptoLens</h1>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 backdrop-blur-md">
            <Zap size={12} className="mr-1" /> AES-256 Secured
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 flex-1 flex flex-col items-center">
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24 max-w-4xl"
        >
          <div className="inline-flex items-center justify-center px-5 py-2 mb-8 rounded-full border border-white/[0.05] bg-white/[0.02] text-xs text-gray-400 tracking-wide backdrop-blur-xl">
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand-500 mr-3 animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.8)]"></span>
            Zero-knowledge client-side encryption
          </div>
          <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500/50 pb-2">
            Steganography, <br className="hidden md:block"/> Reimagined.
          </h2>
          <p className="text-lg md:text-xl text-gray-400/80 leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
            Conceal highly sensitive information inside standard images with true end-to-end encryption. Seamless, secure, and invisible.
          </p>
        </motion.section>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="w-full max-w-6xl mb-12 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center shadow-[0_0_30px_rgba(239,68,68,0.1)] backdrop-blur-xl"
            >
              <AlertTriangle className="mr-4 flex-shrink-0" size={20} />
              <p className="text-sm font-medium tracking-wide">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full max-w-6xl"
        >
          {/* Encode Section */}
          <motion.div variants={itemVariants} className="flex flex-col space-y-10">
            <div>
              <h3 className="text-3xl font-bold flex items-center text-white tracking-tight">
                <Lock className="mr-4 text-brand-500" size={28} strokeWidth={1.5} />
                Encrypt & Embed
              </h3>
              <p className="text-gray-500 text-sm mt-3 ml-11 font-light tracking-wide">Secure your classified data within an ordinary image asset.</p>
            </div>
            
            <div className="space-y-8 flex-1 flex flex-col">
              {/* Carrier Image */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Carrier Image</label>
                <div 
                  onClick={() => encodeFileInput.current?.click()}
                  className="border border-dashed border-white/[0.05] hover:border-brand-500/40 bg-gradient-to-b from-white/[0.02] to-transparent hover:bg-brand-500/[0.02] rounded-3xl p-8 text-center transition-all duration-500 cursor-pointer group relative overflow-hidden backdrop-blur-sm"
                >
                  {!encodeImage ? (
                    <div className="relative z-10 py-6">
                      <div className="bg-white/[0.03] rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_40px_rgba(20,184,166,0.15)] group-hover:bg-brand-500/10 border border-white/[0.05]">
                        <ImageIcon className="text-gray-500 group-hover:text-brand-400 transition-colors" size={28} strokeWidth={1.5} />
                      </div>
                      <p className="text-sm font-medium text-gray-300">Click to browse or drag & drop</p>
                      <p className="text-[10px] text-gray-600 mt-3 tracking-[0.1em] uppercase font-bold">PNG or JPG (Max 5MB)</p>
                    </div>
                  ) : (
                    <div className="relative group/img z-10">
                      <img src={encodeImage} className="max-h-64 mx-auto rounded-2xl shadow-2xl ring-1 ring-white/10" alt="Preview" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300 rounded-2xl backdrop-blur-md">
                        <p className="text-sm font-bold text-white flex items-center tracking-wide"><ImageIcon size={18} className="mr-2"/> Replace Asset</p>
                      </div>
                    </div>
                  )}
                  <input ref={encodeFileInput} onChange={(e) => handleImageUpload(e, 'encode')} type="file" className="hidden" accept="image/png,image/jpeg" />
                </div>
              </div>

              {/* Secret Payload */}
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Secret Payload</label>
                <div className="relative h-full min-h-[160px]">
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-full min-h-[160px] px-6 py-5 text-gray-200 bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.05] focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/30 transition-all placeholder-gray-600/50 resize-none font-mono text-sm shadow-inner rounded-3xl backdrop-blur-sm" 
                    placeholder="Enter classified data here..."
                  />
                  <div className="absolute bottom-5 right-5 text-[10px] text-brand-500/50 font-mono bg-black/80 px-2 py-1 rounded border border-white/[0.05]">{message.length} chars</div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="p-6 bg-white/[0.01] border border-white/[0.05] rounded-3xl relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500/50"></div>
                <div className="flex items-center justify-between mb-5 pl-2">
                  <label className="block text-sm font-medium tracking-wide text-gray-300">AES-256 Encryption</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={usePassword} onChange={(e) => setUsePassword(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/[0.05] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500 peer-checked:after:bg-white border border-white/5"></div>
                  </label>
                </div>
                <div className="relative">
                  <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${usePassword ? 'text-brand-500' : 'text-gray-700'}`} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!usePassword}
                    className="w-full pl-11 pr-5 py-3.5 text-gray-200 bg-black/40 border border-white/[0.05] rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/30 transition-all placeholder-gray-700 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-sm" 
                    placeholder="Enter secure passphrase..." 
                  />
                </div>
              </div>

              <OriginButton 
                onClick={handleEncode}
                disabled={!encodeImage || !message}
                className="w-full bg-white text-black font-extrabold tracking-[0.2em] text-xs py-5 px-6 rounded-3xl disabled:opacity-30 disabled:bg-white/10 disabled:text-gray-500 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center group"
              >
                <Lock className="mr-3 group-hover:scale-110 transition-transform text-black" size={18} /> INITIALIZE
              </OriginButton>
            </div>
          </motion.div>

          {/* Result / Decode Section */}
          <motion.div variants={itemVariants} className="flex flex-col space-y-10">
            
            {/* Tabs */}
            <div className="flex bg-white/[0.02] p-1.5 rounded-2xl border border-white/[0.05] relative z-10 backdrop-blur-md mt-2">
              <button 
                onClick={() => setActiveTab('result')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs tracking-[0.1em] transition-all duration-500 ${activeTab === 'result' || activeTab === 'encode' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
              >
                OUTPUT ASSET
              </button>
              <button 
                onClick={() => setActiveTab('decode')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs tracking-[0.1em] transition-all duration-500 ${activeTab === 'decode' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
              >
                DECRYPT & EXTRACT
              </button>
            </div>

            <div className="flex-1 flex flex-col relative z-10">
              {/* Result Tab */}
              {(activeTab === 'result' || activeTab === 'encode') && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 flex flex-col space-y-8"
                >
                  {!encodedResult ? (
                    <div className="text-center py-20 flex-1 flex flex-col justify-center items-center border border-dashed border-white/[0.05] rounded-3xl bg-gradient-to-b from-white/[0.01] to-transparent backdrop-blur-sm">
                      <div className="w-20 h-20 mb-6 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-white/[0.05] relative">
                        <ShieldCheck className="text-gray-600" size={32} strokeWidth={1.5} />
                        <div className="absolute inset-0 rounded-2xl border border-gray-600/20 animate-[spin_10s_linear_infinite]"></div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Awaiting processing</h3>
                      <p className="text-xs text-gray-500 max-w-xs font-light tracking-wide">Encrypt and embed data to generate a secured output asset.</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col space-y-8">
                      <div>
                        <h3 className="text-3xl font-bold flex items-center text-white tracking-tight">
                          <Download className="mr-4 text-brand-500" size={28} strokeWidth={1.5} />
                          Secured Asset Ready
                        </h3>
                      </div>
                      <div className="flex-1 flex items-center justify-center bg-[url('/grid.svg')] bg-center bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <img src={encodedResult} className="relative z-10 max-h-80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-brand-500/30 hover:scale-[1.02] transition-transform duration-500" alt="Encoded image" />
                      </div>
                      <OriginButton 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = encodedResult;
                          link.download = 'secure-asset.png';
                          link.click();
                        }}
                        className="w-full bg-brand-500 text-black font-extrabold tracking-[0.2em] text-xs py-5 px-6 rounded-3xl shadow-[0_0_20px_rgba(20,184,166,0.15)] hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center group"
                      >
                        <Download className="mr-3 group-hover:-translate-y-1 transition-transform" size={18} /> EXPORT SECURE ASSET
                      </OriginButton>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Decode Tab */}
              {activeTab === 'decode' && (
                <motion.div 
                  key="decode"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 flex flex-col space-y-8"
                >
                  <div>
                    <h3 className="text-3xl font-bold flex items-center text-white tracking-tight">
                      <Unlock className="mr-4 text-brand-500" size={28} strokeWidth={1.5} />
                      Extract Payload
                    </h3>
                    <p className="text-gray-500 text-sm mt-3 ml-11 font-light tracking-wide">Recover and decrypt data from a secured asset.</p>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Target Image */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Target Image</label>
                      <div 
                        onClick={() => decodeFileInput.current?.click()}
                        className="border border-dashed border-white/[0.05] hover:border-brand-500/40 bg-gradient-to-b from-white/[0.02] to-transparent hover:bg-brand-500/[0.02] rounded-3xl p-8 text-center transition-all duration-500 cursor-pointer group relative overflow-hidden backdrop-blur-sm"
                      >
                        {!decodeImage ? (
                          <div className="relative z-10 py-4">
                            <div className="bg-white/[0.03] rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_40px_rgba(20,184,166,0.15)] group-hover:bg-brand-500/10 border border-white/[0.05]">
                              <ImageIcon className="text-gray-500 group-hover:text-brand-400 transition-colors" size={28} strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-medium text-gray-300">Upload secured image asset</p>
                          </div>
                        ) : (
                          <div className="relative group/img z-10">
                            <img src={decodeImage} className="max-h-56 mx-auto rounded-2xl shadow-2xl ring-1 ring-white/10" alt="Decode Preview" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300 rounded-2xl backdrop-blur-md">
                              <p className="text-sm font-bold text-white flex items-center tracking-wide"><ImageIcon size={18} className="mr-2"/> Replace Asset</p>
                            </div>
                          </div>
                        )}
                        <input ref={decodeFileInput} onChange={(e) => handleImageUpload(e, 'decode')} type="file" className="hidden" accept="image/png,image/jpeg" />
                      </div>
                    </div>

                    {/* Decryption Key */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Decryption Key <span className="opacity-50 lowercase tracking-normal">(if encrypted)</span></label>
                      <div className="relative">
                        <Unlock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                        <input 
                          type="password" 
                          value={decodePassword}
                          onChange={(e) => setDecodePassword(e.target.value)}
                          className="w-full pl-11 pr-5 py-3.5 text-gray-200 bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.05] rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/30 transition-all placeholder-gray-700 font-mono text-sm backdrop-blur-sm" 
                          placeholder="Enter decryption key..." 
                        />
                      </div>
                    </div>

                    <OriginButton 
                      onClick={handleDecode}
                      disabled={!decodeImage}
                      className="w-full bg-white text-black font-extrabold tracking-[0.2em] text-xs py-5 px-6 rounded-3xl disabled:opacity-30 disabled:bg-white/10 disabled:text-gray-500 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center group"
                    >
                      <Unlock className="mr-3 group-hover:scale-110 transition-transform text-black" size={18} /> DECRYPT & EXTRACT
                    </OriginButton>

                    <AnimatePresence>
                      {decodedMessage && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 p-8 bg-brand-500/5 border border-brand-500/20 rounded-3xl shadow-[0_0_40px_rgba(20,184,166,0.1)] relative overflow-hidden backdrop-blur-xl"
                        >
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent"></div>
                          <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-500/20 blur-[60px] rounded-full"></div>
                          <h4 className="font-bold text-brand-400 text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center">
                            <ChevronRight size={14} className="mr-2" /> Extracted Payload
                          </h4>
                          <div className="font-mono text-gray-200 text-sm whitespace-pre-wrap break-words relative z-10 leading-relaxed selection:bg-brand-500/30">
                            {decodedMessage}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="border-t border-white/[0.05] bg-black/30 backdrop-blur-2xl py-10 mt-20">
        <div className="container mx-auto px-6 text-center text-gray-600 text-[10px] font-bold tracking-[0.2em] uppercase">
          <p>CryptoLens &copy; {new Date().getFullYear()}. <span className="text-gray-500">Secure by Design.</span></p>
        </div>
      </footer>

      {/* Futuristic Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-50"
          >
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-t-2 border-brand-500/80 rounded-full animate-spin"></div>
              <div className="absolute inset-3 border-b-2 border-brand-400/60 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
              <div className="absolute inset-6 border-l-2 border-brand-300/40 rounded-full animate-[spin_2s_linear_infinite]"></div>
              <ShieldCheck className="text-brand-500 animate-pulse relative z-10" size={32} strokeWidth={1.5} />
              <div className="absolute inset-0 bg-brand-500/10 rounded-full blur-2xl animate-pulse"></div>
            </div>
            <p className="text-brand-400 font-mono tracking-[0.2em] uppercase text-xs font-bold animate-pulse">{loadingText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

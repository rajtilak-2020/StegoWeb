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
import { GlowingCard } from '../components/ui/glowing-card';

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
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
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2.5 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(20,184,166,0.3)] group-hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all duration-300">
              <ShieldCheck className="text-black" size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tighter text-white">CryptoLens</h1>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
            <Zap size={14} className="mr-1" /> AES-256 Secured
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 flex-1 flex flex-col items-center">
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 max-w-4xl"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
            Zero-knowledge client-side encryption
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 pb-2">
            Steganography, <br className="hidden md:block"/> Reimagined.
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
            Conceal highly sensitive information inside standard images with true end-to-end encryption.
          </p>
        </motion.section>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl mb-8 bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl flex items-center shadow-[0_0_20px_rgba(239,68,68,0.15)] backdrop-blur-md"
            >
              <AlertTriangle className="mr-3 flex-shrink-0" />
              <p className="font-medium tracking-wide">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl"
        >
          {/* Encode Section */}
          <motion.div variants={itemVariants}>
            <GlowingCard className="p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-8 flex items-center text-white tracking-tight">
                <Lock className="mr-3 text-brand-400" size={26} />
                Encrypt & Embed
              </h3>
              
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Carrier Image</label>
                <div 
                  onClick={() => encodeFileInput.current?.click()}
                  className="border border-dashed border-white/10 hover:border-brand-500/50 bg-black/20 hover:bg-brand-500/5 rounded-2xl p-8 text-center transition-all duration-500 cursor-pointer group relative overflow-hidden"
                >
                  {!encodeImage ? (
                    <div className="relative z-10">
                      <div className="bg-white/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] group-hover:bg-brand-500/10 border border-white/5">
                        <ImageIcon className="text-gray-500 group-hover:text-brand-400 transition-colors" size={32} />
                      </div>
                      <p className="text-sm font-medium text-gray-300">Click to browse or drag & drop</p>
                      <p className="text-xs text-gray-600 mt-2 tracking-wide uppercase">PNG or JPG (Max 5MB)</p>
                    </div>
                  ) : (
                    <div className="relative group/img z-10">
                      <img src={encodeImage} className="max-h-56 mx-auto rounded-xl shadow-2xl ring-1 ring-white/10" alt="Preview" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300 rounded-xl backdrop-blur-sm">
                        <p className="text-sm font-bold text-white flex items-center tracking-wide"><ImageIcon size={18} className="mr-2"/> Change Image</p>
                      </div>
                    </div>
                  )}
                  <input ref={encodeFileInput} onChange={(e) => handleImageUpload(e, 'encode')} type="file" className="hidden" accept="image/png,image/jpeg" />
                </div>
              </div>

              <div className="mb-6 flex-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Secret Payload</label>
                <div className="relative h-full min-h-[140px]">
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-full min-h-[140px] px-5 py-4 text-gray-200 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500/50 transition-all placeholder-gray-600 resize-none font-mono text-sm shadow-inner" 
                    placeholder="Enter classified data here..."
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-brand-500/50 font-mono bg-black/80 px-2 py-1 rounded-md">{message.length} chars</div>
                </div>
              </div>

              <div className="mb-8 p-6 bg-black/40 border border-white/10 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold tracking-wide text-gray-200">AES-256 Encryption</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={usePassword} onChange={(e) => setUsePassword(e.target.checked)} className="sr-only peer" />
                    <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500 peer-checked:after:bg-white border border-white/5"></div>
                  </label>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!usePassword}
                  className="w-full px-5 py-3 text-gray-200 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500/50 transition-all placeholder-gray-600 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-sm" 
                  placeholder="Enter secure passphrase..." 
                />
              </div>

              <OriginButton 
                onClick={handleEncode}
                disabled={!encodeImage || !message}
                className="w-full bg-white text-black font-extrabold tracking-widest py-4 px-6 rounded-2xl disabled:opacity-40 disabled:bg-white/10 disabled:text-gray-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center group"
              >
                <Lock className="mr-3 group-hover:scale-110 transition-transform" size={20} /> INITIALIZE
              </OriginButton>
            </GlowingCard>
          </motion.div>

          {/* Result / Decode Section */}
          <motion.div variants={itemVariants} className="h-full">
            <GlowingCard className="p-8 h-full flex flex-col">
              <div className="flex bg-black/40 p-1.5 rounded-xl mb-8 border border-white/5 relative z-10">
                <button 
                  onClick={() => setActiveTab('result')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 ${activeTab === 'result' || activeTab === 'encode' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                  Output Asset
                </button>
                <button 
                  onClick={() => setActiveTab('decode')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 ${activeTab === 'decode' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                  Decrypt & Extract
                </button>
              </div>

              <div className="flex-1 flex flex-col relative z-10">
                {/* Result Tab */}
                {(activeTab === 'result' || activeTab === 'encode') && (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    {!encodedResult ? (
                      <div className="text-center py-16 flex-1 flex flex-col justify-center items-center border border-dashed border-white/10 rounded-2xl bg-black/20">
                        <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5 relative">
                          <ShieldCheck className="text-gray-600" size={40} />
                          <div className="absolute inset-0 rounded-full border border-gray-600/30 animate-[spin_10s_linear_infinite]"></div>
                        </div>
                        <h3 className="text-xl font-medium text-gray-300 mb-2">Awaiting processing</h3>
                        <p className="text-sm text-gray-500 max-w-xs font-light">Encrypt and embed data to generate a secured output asset.</p>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold mb-6 flex items-center text-white tracking-tight">
                          <Download className="mr-3 text-brand-400" size={26} />
                          Secured Asset Ready
                        </h3>
                        <div className="mb-8 text-center flex-1 flex items-center justify-center bg-[url('/grid.svg')] bg-center bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                          <img src={encodedResult} className="relative z-10 max-h-72 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-brand-500/50 hover:scale-[1.02] transition-transform duration-500" alt="Encoded image" />
                        </div>
                        <OriginButton 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = encodedResult;
                            link.download = 'secure-asset.png';
                            link.click();
                          }}
                          className="w-full bg-brand-500 text-black font-extrabold tracking-widest py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center group"
                        >
                          <Download className="mr-3 group-hover:-translate-y-1 transition-transform" size={20} /> EXPORT SECURE ASSET
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
                    className="flex-1 flex flex-col"
                  >
                    <h3 className="text-2xl font-bold mb-8 flex items-center text-white tracking-tight">
                      <Unlock className="mr-3 text-brand-400" size={26} />
                      Extract Payload
                    </h3>
                    
                    <div className="mb-6">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Target Image</label>
                      <div 
                        onClick={() => decodeFileInput.current?.click()}
                        className="border border-dashed border-white/10 hover:border-brand-500/50 bg-black/20 hover:bg-brand-500/5 rounded-2xl p-8 text-center transition-all duration-500 cursor-pointer group relative overflow-hidden"
                      >
                        {!decodeImage ? (
                          <div className="relative z-10">
                            <div className="bg-white/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] group-hover:bg-brand-500/10 border border-white/5">
                              <ImageIcon className="text-gray-500 group-hover:text-brand-400 transition-colors" size={32} />
                            </div>
                            <p className="text-sm font-medium text-gray-300">Upload secured image asset</p>
                          </div>
                        ) : (
                          <div className="relative group/img z-10">
                            <img src={decodeImage} className="max-h-48 mx-auto rounded-xl shadow-2xl ring-1 ring-white/10" alt="Decode Preview" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300 rounded-xl backdrop-blur-sm">
                              <p className="text-sm font-bold text-white flex items-center tracking-wide"><ImageIcon size={18} className="mr-2"/> Change Image</p>
                            </div>
                          </div>
                        )}
                        <input ref={decodeFileInput} onChange={(e) => handleImageUpload(e, 'decode')} type="file" className="hidden" accept="image/png,image/jpeg" />
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Decryption Key (If AES encrypted)</label>
                      <input 
                        type="password" 
                        value={decodePassword}
                        onChange={(e) => setDecodePassword(e.target.value)}
                        className="w-full px-5 py-3 text-gray-200 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500/50 transition-all placeholder-gray-600 font-mono text-sm" 
                        placeholder="Enter decryption key..." 
                      />
                    </div>

                    <OriginButton 
                      onClick={handleDecode}
                      disabled={!decodeImage}
                      className="w-full mb-6 bg-white text-black font-extrabold tracking-widest py-4 px-6 rounded-2xl disabled:opacity-40 disabled:bg-white/10 disabled:text-gray-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center group"
                    >
                      <Unlock className="mr-3 group-hover:scale-110 transition-transform" size={20} /> DECRYPT
                    </OriginButton>

                    <AnimatePresence>
                      {decodedMessage && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-6 bg-black/60 border border-brand-500/40 rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.15)] relative overflow-hidden backdrop-blur-md"
                        >
                          <div className="absolute top-0 left-0 w-full h-1 bg-glow-gradient"></div>
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/20 blur-[50px] rounded-full"></div>
                          <h4 className="font-bold text-brand-400 text-xs uppercase tracking-widest mb-4 flex items-center">
                            <ChevronRight size={14} className="mr-1" /> Extracted Payload
                          </h4>
                          <div className="font-mono text-gray-200 text-sm whitespace-pre-wrap break-words relative z-10 leading-relaxed selection:bg-brand-500/30">
                            {decodedMessage}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </GlowingCard>
          </motion.div>
        </motion.div>
      </main>

      <footer className="border-t border-white/5 bg-black/50 backdrop-blur-xl py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-gray-500 text-xs font-bold tracking-widest uppercase">
          <p>CryptoLens &copy; {new Date().getFullYear()}. <span className="text-gray-400">Secure by Design.</span></p>
        </div>
      </footer>

      {/* Futuristic Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50"
          >
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-t-2 border-brand-500 rounded-full animate-spin"></div>
              <div className="absolute inset-3 border-b-2 border-brand-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
              <div className="absolute inset-6 border-l-2 border-brand-300 rounded-full animate-[spin_2s_linear_infinite]"></div>
              <ShieldCheck className="text-brand-500 animate-pulse relative z-10" size={32} />
              <div className="absolute inset-0 bg-brand-500/10 rounded-full blur-xl animate-pulse"></div>
            </div>
            <p className="text-brand-400 font-mono tracking-widest uppercase text-sm font-bold animate-pulse">{loadingText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

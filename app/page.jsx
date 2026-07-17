'use client';

import { useState, useRef } from 'react';
import { encodeMessageInImage, decodeMessageFromImage } from '../lib/stego';
import { 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Download, 
  AlertTriangle, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { OriginButton } from '../components/ui/origin-button';

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
      <header className="border-b border-surface-border bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
              <ShieldCheck className="text-brand-500" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">CryptoLens</h1>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Zap size={14} className="mr-1" /> AES-256 Secured
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 flex-1 flex flex-col items-center">
        <section className="text-center mb-16 max-w-3xl animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-glow-gradient">
            Military-Grade Steganography
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Conceal highly sensitive information inside standard images. Zero server uploads. True end-to-end client-side encryption.
          </p>
        </section>

        {error && (
          <div className="w-full max-w-5xl mb-8 bg-red-500/10 border border-red-500/50 text-red-400 px-5 py-4 rounded-xl flex items-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <AlertTriangle className="mr-3 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Encode Section */}
          <div className="bg-surface-light/40 backdrop-blur-xl border border-surface-border rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:border-surface-border/80">
            <h3 className="text-2xl font-semibold mb-6 flex items-center text-white">
              <Lock className="mr-3 text-brand-400" size={24} />
              Encrypt & Embed
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Carrier Image</label>
              <div 
                onClick={() => encodeFileInput.current?.click()}
                className="border-2 border-dashed border-surface-border hover:border-brand-500/50 hover:bg-brand-500/5 rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group"
              >
                {!encodeImage ? (
                  <>
                    <div className="bg-surface-lighter rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="text-gray-400 group-hover:text-brand-400 transition-colors" size={28} />
                    </div>
                    <p className="text-sm font-medium text-gray-300">Click to browse or drag & drop</p>
                    <p className="text-xs text-gray-500 mt-2">PNG or JPG (Max 5MB)</p>
                  </>
                ) : (
                  <div className="relative group/img">
                    <img src={encodeImage} className="max-h-48 mx-auto rounded-lg shadow-lg ring-1 ring-white/10" alt="Preview" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                      <p className="text-sm font-medium text-white flex items-center"><ImageIcon size={16} className="mr-2"/> Change Image</p>
                    </div>
                  </div>
                )}
                <input ref={encodeFileInput} onChange={(e) => handleImageUpload(e, 'encode')} type="file" className="hidden" accept="image/png,image/jpeg" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Secret Payload</label>
              <div className="relative">
                <textarea 
                  rows="4" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 text-gray-200 bg-black/50 border border-surface-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-gray-600 resize-none font-mono text-sm" 
                  placeholder="Enter classified data here..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-mono">{message.length} chars</div>
              </div>
            </div>

            <div className="mb-8 p-5 bg-black/30 border border-surface-border rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-300">AES-256 Encryption</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={usePassword} onChange={(e) => setUsePassword(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                </label>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!usePassword}
                className="w-full px-4 py-3 text-gray-200 bg-black/50 border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-gray-600 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-sm" 
                placeholder="Enter encryption key..." 
              />
            </div>

            <OriginButton 
              onClick={handleEncode}
              disabled={!encodeImage || !message}
              className="w-full bg-surface-lighter text-brand-400 font-bold py-3.5 px-4 rounded-xl disabled:opacity-50 disabled:bg-surface-border disabled:text-gray-500 shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] flex items-center justify-center group border border-brand-500/30"
            >
              <Lock className="mr-2 group-hover:scale-110 transition-transform" size={18} /> INITIALIZE ENCRYPTION
            </OriginButton>
          </div>

          {/* Result / Decode Section */}
          <div className="bg-surface-light/40 backdrop-blur-xl border border-surface-border rounded-2xl p-8 shadow-2xl flex flex-col transition-all duration-300 hover:border-surface-border/80">
            <div className="flex bg-black/50 p-1 rounded-xl mb-8 border border-surface-border">
              <button 
                onClick={() => setActiveTab('result')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'result' || activeTab === 'encode' ? 'bg-surface-lighter text-brand-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Output Asset
              </button>
              <button 
                onClick={() => setActiveTab('decode')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'decode' ? 'bg-surface-lighter text-brand-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Decrypt & Extract
              </button>
            </div>

            <div className="flex-1 flex flex-col">
              {/* Result Tab */}
              {(activeTab === 'result' || activeTab === 'encode') && (
                <div className="flex-1 flex flex-col">
                  {!encodedResult ? (
                    <div className="text-center py-16 flex-1 flex flex-col justify-center items-center border border-dashed border-surface-border rounded-xl bg-black/20">
                      <ShieldCheck className="text-surface-border mb-4" size={56} />
                      <h3 className="text-lg font-medium text-gray-400">Awaiting processing...</h3>
                      <p className="mt-2 text-sm text-gray-500 max-w-xs">Encrypt and embed data to generate a secured output asset.</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col animate-slide-in">
                      <h3 className="text-xl font-semibold mb-6 flex items-center text-white">
                        <Download className="mr-3 text-brand-400" size={20} />
                        Secured Asset Ready
                      </h3>
                      <div className="mb-8 text-center flex-1 flex items-center justify-center bg-black/40 border border-surface-border rounded-xl p-4">
                        <img src={encodedResult} className="max-h-64 rounded shadow-[0_0_30px_rgba(20,184,166,0.15)] ring-1 ring-brand-500/30" alt="Encoded image" />
                      </div>
                      <OriginButton 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = encodedResult;
                          link.download = 'secure-asset.png';
                          link.click();
                        }}
                        className="w-full bg-surface-lighter text-brand-400 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center group border border-brand-500/30 shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)]"
                      >
                        <Download className="mr-2 group-hover:-translate-y-1 transition-transform" size={18} /> EXPORT SECURE ASSET
                      </OriginButton>
                    </div>
                  )}
                </div>
              )}

              {/* Decode Tab */}
              {activeTab === 'decode' && (
                <div className="flex-1 flex flex-col animate-slide-in">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-white">
                    <Unlock className="mr-3 text-brand-400" size={24} />
                    Extract Payload
                  </h3>
                  
                  <div className="mb-6">
                    <div 
                      onClick={() => decodeFileInput.current?.click()}
                      className="border-2 border-dashed border-surface-border hover:border-brand-500/50 hover:bg-brand-500/5 rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group"
                    >
                      {!decodeImage ? (
                        <>
                          <div className="bg-surface-lighter rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <ImageIcon className="text-gray-400 group-hover:text-brand-400 transition-colors" size={28} />
                          </div>
                          <p className="text-sm font-medium text-gray-300">Upload secured image asset</p>
                        </>
                      ) : (
                        <div className="relative group/img">
                          <img src={decodeImage} className="max-h-48 mx-auto rounded-lg shadow-lg ring-1 ring-white/10" alt="Decode Preview" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                            <p className="text-sm font-medium text-white flex items-center"><ImageIcon size={16} className="mr-2"/> Change Image</p>
                          </div>
                        </div>
                      )}
                      <input ref={decodeFileInput} onChange={(e) => handleImageUpload(e, 'decode')} type="file" className="hidden" accept="image/png,image/jpeg" />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Decryption Key (If AES encrypted)</label>
                    <input 
                      type="password" 
                      value={decodePassword}
                      onChange={(e) => setDecodePassword(e.target.value)}
                      className="w-full px-4 py-3 text-gray-200 bg-black/50 border border-surface-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-gray-600 font-mono text-sm" 
                      placeholder="Enter decryption key..." 
                    />
                  </div>

                  <OriginButton 
                    onClick={handleDecode}
                    disabled={!decodeImage}
                    className="w-full mb-6 bg-surface-lighter text-brand-400 font-bold py-3.5 px-4 rounded-xl disabled:opacity-50 disabled:bg-surface-border disabled:text-gray-500 shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] flex items-center justify-center group border border-brand-500/30"
                  >
                    <Unlock className="mr-2 group-hover:scale-110 transition-transform" size={18} /> DECRYPT & EXTRACT
                  </OriginButton>

                  {decodedMessage && (
                    <div className="mt-2 p-5 bg-black/80 border border-brand-500/30 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.1)] animate-fade-in relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-glow-gradient"></div>
                      <h4 className="font-medium text-gray-400 text-xs uppercase tracking-wider mb-3">Extracted Payload:</h4>
                      <div className="font-mono text-brand-200 text-sm whitespace-pre-wrap break-words">
                        {decodedMessage}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-surface-border bg-black/50 py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm font-medium">
          <p>CryptoLens &copy; {new Date().getFullYear()}. Secure by Design.</p>
        </div>
      </footer>

      {/* Futuristic Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 border-t-2 border-brand-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-b-2 border-brand-400 rounded-full animate-spin animation-delay-200"></div>
            <div className="absolute inset-4 border-l-2 border-brand-300 rounded-full animate-spin animation-delay-400"></div>
            <ShieldCheck className="text-brand-500 animate-pulse" size={24} />
          </div>
          <p className="text-brand-400 font-mono tracking-widest uppercase text-sm animate-pulse">{loadingText}</p>
        </div>
      )}
    </>
  );
}

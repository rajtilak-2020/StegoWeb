'use client';

import { useState, useRef, useEffect } from 'react';
import { encodeMessageInImage, decodeMessageFromImage } from '../lib/stego';
import { 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Download, 
  AlertTriangle, 
  Sun, 
  Moon,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('encode'); // 'encode' or 'decode'
  
  // Theme logic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
    setLoadingText('Encoding your message...');
    setLoading(true);
    
    setTimeout(() => {
      try {
        const result = encodeMessageInImage(encodeImageData, message, usePassword ? password : '');
        setEncodedResult(result);
        setActiveTab('result'); // Switch to result tab after encode
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
    setLoadingText('Decoding hidden message...');
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
      <header className="bg-white dark:bg-gray-800 shadow-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Lock className="text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-semibold">StegoWeb</h1>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">Hide Your Secret Messages Inside Images</h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            A simple steganography tool for educational purpose.
          </p>
        </section>

        {error && (
          <div className="max-w-6xl mx-auto mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded flex items-center">
            <AlertTriangle className="mr-2" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Encode Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Lock className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
              Encode Message
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Image</label>
              <div 
                onClick={() => encodeFileInput.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer"
              >
                {!encodeImage ? (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Click to browse or drag & drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG or JPG recommended (Max: 5MB)</p>
                  </>
                ) : (
                  <div>
                    <img src={encodeImage} className="max-h-48 mx-auto rounded" alt="Preview" />
                    <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Change image</p>
                  </div>
                )}
                <input ref={encodeFileInput} onChange={(e) => handleImageUpload(e, 'encode')} type="file" className="hidden" accept="image/png,image/jpeg" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secret Message</label>
              <div className="relative">
                <textarea 
                  rows="4" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" 
                  placeholder="Type your secret message here..."
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">{message.length} characters</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password (Optional)</label>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={usePassword} 
                    onChange={(e) => setUsePassword(e.target.checked)} 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                  />
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Enable password</span>
                </div>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!usePassword}
                className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder="Enter a password for extra security" 
              />
            </div>

            <button 
              onClick={handleEncode}
              disabled={!encodeImage || !message}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              <Lock className="mr-2" size={16} /> Encode Message
            </button>
          </div>

          {/* Right Column: Result or Decode */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button 
                onClick={() => setActiveTab('result')}
                className={`py-2 px-4 font-medium border-b-2 ${activeTab === 'result' || activeTab === 'encode' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
              >
                Result
              </button>
              <button 
                onClick={() => setActiveTab('decode')}
                className={`py-2 px-4 font-medium border-b-2 ${activeTab === 'decode' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
              >
                Decode
              </button>
            </div>

            {/* Result Tab Content */}
            {(activeTab === 'result' || activeTab === 'encode') && (
              <div>
                {!encodedResult ? (
                  <div className="text-center py-12">
                    <ImageIcon className="mx-auto text-gray-400" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">No encoded image yet</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload an image and add your message to get started</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Download className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
                      Encoded Result
                    </h3>
                    <div className="mb-6 text-center">
                      <img src={encodedResult} className="max-h-64 mx-auto rounded border dark:border-gray-700" alt="Encoded image" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Your message has been successfully hidden in this image.</p>
                    </div>
                    <a 
                      href={encodedResult} 
                      download="stego-image.png"
                      className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
                    >
                      <Download className="mr-2" size={16} /> Download Image
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Decode Tab Content */}
            {activeTab === 'decode' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Unlock className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
                  Decode Message
                </h3>
                
                <div className="mb-6">
                  <div 
                    onClick={() => decodeFileInput.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer"
                  >
                    {!decodeImage ? (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Upload an image with a hidden message</p>
                      </>
                    ) : (
                      <div>
                        <img src={decodeImage} className="max-h-48 mx-auto rounded" alt="Decode Preview" />
                        <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Change image</p>
                      </div>
                    )}
                    <input ref={decodeFileInput} onChange={(e) => handleImageUpload(e, 'decode')} type="file" className="hidden" accept="image/png,image/jpeg" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password (If required)</label>
                  <input 
                    type="password" 
                    value={decodePassword}
                    onChange={(e) => setDecodePassword(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600" 
                    placeholder="Enter password if the message was encrypted" 
                  />
                </div>

                <button 
                  onClick={handleDecode}
                  disabled={!decodeImage}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Unlock className="mr-2" size={16} /> Decode Message
                </button>

                {decodedMessage && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Decoded Message:</h4>
                    <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-800 dark:text-gray-200 min-h-[100px] whitespace-pre-wrap">
                      {decodedMessage}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-12 py-6 relative z-10">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} StegoWeb. All rights reserved.</p>
        </div>
      </footer>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">{loadingText}</p>
          </div>
        </div>
      )}
    </>
  );
}

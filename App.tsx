import React, { useState, useRef, useEffect } from 'react';
import { ComedyMode } from './types';
import { generateJoke, generatePerformanceAudio } from './services/geminiService';
import { getAudioContext, decodeBase64, decodeAudioData } from './services/audioUtils';
import { NeonButton } from './components/NeonButton';
import { Stage } from './components/Stage';

const App: React.FC = () => {
  const [joke, setJoke] = useState<string>("");
  const [mode, setMode] = useState<ComedyMode>(ComedyMode.MINUTE_SET);
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
    };
  }, []);

  const handleGenerate = async () => {
    if (loading) return;
    
    // Stop any current audio
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch(e) {}
    }
    setIsPlaying(false);

    setLoading(true);
    const result = await generateJoke(mode, topic);
    setJoke(result);
    setLoading(false);
  };

  const handlePlayAudio = async () => {
    if (!joke || audioLoading || isPlaying) return;

    try {
      setAudioLoading(true);
      const base64Audio = await generatePerformanceAudio(joke, mode);
      
      if (!base64Audio) {
        throw new Error("No audio generated");
      }

      const ctx = getAudioContext();
      audioContextRef.current = ctx;

      const audioBytes = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, ctx);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        sourceNodeRef.current = null;
      };

      sourceNodeRef.current = source;
      source.start();
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback failed", error);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleStopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 selection:bg-red-900 selection:text-white overflow-x-hidden">
      
      {/* Header */}
      <header className="w-full p-6 flex flex-col items-center border-b border-gray-900 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <h1 className="text-4xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500 neon-text tracking-tighter transform -rotate-2">
          KILL TONY AI
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-2 tracking-widest uppercase">
          Live from The Mothership • Austin, TX
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-5xl">
        
        {/* Stage Area */}
        <section className="relative rounded-3xl overflow-hidden border border-gray-800 bg-neutral-900/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] min-h-[500px] flex flex-col">
          <div className="absolute top-4 right-4 flex gap-2 z-20">
             {joke && !loading && (
               <>
                {!isPlaying ? (
                  <button 
                    onClick={handlePlayAudio}
                    disabled={audioLoading}
                    className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-gray-700"
                  >
                    {audioLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                    )}
                    PERFORM
                  </button>
                ) : (
                  <button 
                    onClick={handleStopAudio}
                    className="flex items-center gap-2 bg-red-900/80 hover:bg-red-800 text-red-100 px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-red-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    STOP
                  </button>
                )}
               </>
             )}
          </div>

          <Stage content={joke} loading={loading} />
        </section>

        {/* Controls */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Settings Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Mode Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Persona</label>
              <div className="flex flex-wrap gap-3">
                <NeonButton 
                  onClick={() => setMode(ComedyMode.MINUTE_SET)} 
                  active={mode === ComedyMode.MINUTE_SET}
                  color="blue"
                >
                  New Minute
                </NeonButton>
                <NeonButton 
                  onClick={() => setMode(ComedyMode.ROAST)} 
                  active={mode === ComedyMode.ROAST}
                >
                  Roast Mode
                </NeonButton>
                <NeonButton 
                  onClick={() => setMode(ComedyMode.WILLIAM_MONTGOMERY)} 
                  active={mode === ComedyMode.WILLIAM_MONTGOMERY}
                  color="green"
                >
                  The Big Red Machine
                </NeonButton>
                 <NeonButton 
                  onClick={() => setMode(ComedyMode.DAVID_LUCAS)} 
                  active={mode === ComedyMode.DAVID_LUCAS}
                  color="blue"
                >
                  David Lucas
                </NeonButton>
                <NeonButton 
                  onClick={() => setMode(ComedyMode.KAM_PATTERSON)} 
                  active={mode === ComedyMode.KAM_PATTERSON}
                  color="green"
                >
                  Kam Patterson
                </NeonButton>
              </div>
            </div>

            {/* Topic Input */}
            <div className="space-y-3">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                 Topic / Roast Target (Optional)
               </label>
               <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={mode === ComedyMode.ROAST ? "e.g., Tony's suits, Tech bros..." : "e.g., Dating apps, The Airport..."}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-4 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder-neutral-600 font-mono"
               />
            </div>
          </div>

          {/* Action Column */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                group relative w-full overflow-hidden rounded-xl p-1 transition-all duration-300
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 animate-gradient-x"></div>
              <div className="relative bg-black rounded-lg h-full px-8 py-6 flex items-center justify-center gap-4 border border-red-500/30">
                <span className={`text-2xl md:text-3xl font-display uppercase tracking-widest text-white group-hover:neon-text transition-all`}>
                  {loading ? 'WRITING...' : 'GENERATE SET'}
                </span>
                {!loading && (
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                )}
              </div>
            </button>
            <p className="text-center text-neutral-600 text-xs mt-4">
              * AI generated content. Comedy is subjective. Don't get cancelled.
            </p>
          </div>

        </section>
      </main>
    </div>
  );
};

export default App;
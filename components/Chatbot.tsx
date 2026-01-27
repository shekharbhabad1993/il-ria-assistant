import React, { useState, useRef, useEffect } from 'react';
import { Message, ContextAction, FeedbackData } from '../types.ts';
import {
  generateChatResponse,
  connectLive,
  decodeBase64,
  decodeAudioData,
  createPcmBlob
} from '../services/geminiService.ts';
import {
  generateEnhancedChatResponse,
  categorizeQuery,
  submitFeedback,
  generatePolicyDocument,
  downloadDocument
} from '../services/enhancedService.ts';
import { BRAND_COLORS } from '../constants.ts';
import { FeedbackWidget, IdlePrompt } from './FeedbackWidget.tsx';
import { ContextActions, FollowUpQuestions } from './ContextActions.tsx';

const INITIAL_SUGGESTIONS = [
  "How to file a cashless claim?",
  "What is my Base Sum Insured?",
  "Tell me about Infinite Care",
  "What is my premium amount?"
];

/**
 * Robust kPoint Video Component
 * Uses dangerouslySetInnerHTML to ensure attributes like data-video-params (JSON) 
 * are passed exactly as required by the kPoint script without React's attribute escaping.
 */
const KPointVideo: React.FC<{
  htmlSnippet: string;
  scriptUrl: string;
  className?: string;
  id?: string;
}> = ({ htmlSnippet, scriptUrl, className, id }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Re-inject the script to ensure the silk player identifies the new DOM elements
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [htmlSnippet, scriptUrl]);

  return (
    <div
      ref={wrapperRef}
      id={id}
      className={`${className || ''} cursor-pointer bg-black`}
      dangerouslySetInnerHTML={{ __html: htmlSnippet }}
    />
  );
};

const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold" style={{ color: BRAND_COLORS.secondary }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split("\n");
  
  // Specific trigger: Only show video if both "cashless" and "claim" are present in response
  const isCashlessClaimRelated = content.toLowerCase().includes("cashless") && content.toLowerCase().includes("claim");

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const text = trimmed.substring(2);
          return (
            <div key={i} className="flex gap-2 ml-1 items-start">
              <span className="text-orange-500 font-bold">•</span>
              <span className="text-[12px] font-medium leading-relaxed">{renderBoldText(text)}</span>
            </div>
          );
        }
        if (trimmed === "") return <div key={i} className="h-1" />;
        return <p key={i} className="text-[12px] font-medium leading-relaxed">{renderBoldText(trimmed)}</p>;
      })}
      
      {/* Conditional Claim Video - triggered specifically for cashless claim process queries */}
      {isCashlessClaimRelated && (
        <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-black">
          <KPointVideo
            scriptUrl="https://ktpl.kpoint.com/assets/orca/media/embed/player-silk.js"
            htmlSnippet={`<div data-video-host='ktpl.kpoint.com' data-kvideo-id='gcc-e84f5774-f9d1-445f-a2ed-db7ba282c77d' data-samesite=true style='width:100%'></div>`}
          />
        </div>
      )}
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Namaste! I am **RIA**. I have reviewed your **Elevate Health Insurance** policy documents. \n\nI can help you with your sum insured, specific benefits like Infinite Care, or claim procedures. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const inputTransRef = useRef<string>("");
  const outputTransRef = useRef<string>("");
  const [uiInputTrans, setUiInputTrans] = useState("");
  const [uiOutputTrans, setUiOutputTrans] = useState("");

  // Event listener for video end logic
  useEffect(() => {
    if (showIntro && isOpen) {
      const checkInterval = setInterval(() => {
        const kPlayer = (window as any).kPlayer1;
        if (kPlayer && typeof kPlayer.addEventListener === 'function') {
          console.log("kPlayer1 detected, attaching kapsuleEnded listener");
          kPlayer.addEventListener("kapsuleEnded", (e: any) => {
            console.log("Video has ended ", e);
            // Minimize the chatbot automatically
            setIsOpen(false);
            setShowIntro(false);
          });
          clearInterval(checkInterval);
        }
      }, 500);

      // Fallback safety: still have a timer if the event never fires for some reason
      const safetyTimer = setTimeout(() => {
        clearInterval(checkInterval);
      }, 60000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(safetyTimer);
      };
    }
  }, [showIntro, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, uiInputTrans, uiOutputTrans, isLoading, isOpen, isExpanded, showIntro]);

  // Auto-enable microphone when chatbot is opened, disable when minimized
  useEffect(() => {
    if (isOpen && !showIntro && !isLive) {
      // Automatically start live session when chatbot is opened (after intro)
      toggleLiveSession();
    } else if (!isOpen && isLive) {
      // Stop live session when chatbot is minimized
      stopLiveSession();
    }
  }, [isOpen, showIntro]);

  // Reset idle timer on activity
  const resetActivity = () => {
    lastActivityRef.current = Date.now();
    setShowIdlePrompt(false);
  };

  // Handle context actions (downloads, navigation, etc.)
  const handleContextAction = async (action: ContextAction) => {
    resetActivity();

    switch (action.type) {
      case 'download':
        if (action.action === 'download_policy') {
          try {
            const policyDoc = await generatePolicyDocument('5301/6503/00/00005645');
            downloadDocument(policyDoc, 'Mayank_Mundhra_Policy_5301-6503-00-00005645.pdf');
          } catch (error) {
            console.error('Error downloading policy:', error);
            alert('Unable to download policy document. Please try again.');
          }
        } else if (action.action === 'download_claim_form') {
          const claimForm = new Blob(['Claim Form - ICICI Lombard'], { type: 'text/plain' });
          downloadDocument(claimForm, 'Claim_Form.txt');
        }
        break;

      case 'navigate':
        // In a real app, this would navigate to different sections
        console.log('Navigate to:', action.action);
        // You could use React Router here: navigate(action.action);
        break;

      case 'external_link':
        window.open(action.action, '_blank');
        break;
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (messageId: string, rating: number, comment?: string) => {
    const queryType = categorizeQuery(
      messages.find(m => m.id === messageId)?.content || ''
    );

    const feedbackData: FeedbackData = {
      sessionId,
      messageId,
      rating,
      comment,
      timestamp: new Date(),
      queryType
    };

    const success = await submitFeedback(feedbackData);

    if (success) {
      // Mark message as feedback given
      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, feedbackGiven: true } : m)
      );
    }
  };

  const handleSendText = async (textOverride?: string) => {
    if (showIntro) setShowIntro(false);
    resetActivity();

    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      // Use enhanced chat response
      const result = await generateEnhancedChatResponse(textToSend, history, sessionId);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.answer,
        timestamp: new Date(),
        followUpQuestions: result.followUpQuestions,
        contextActions: result.contextActions,
        requiresFeedback: result.requiresFeedback,
        feedbackGiven: false
      };

      setMessages(prev => [...prev, assistantMsg]);
      setSuggestions(result.suggestions || INITIAL_SUGGESTIONS);
    } catch (error) {
      console.error("Chat Error:", error);

      // Fallback to basic service
      try {
        const history = messages.map(m => ({ role: m.role, content: m.content }));
        const result = await generateChatResponse(textToSend, history);
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.answer,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMsg]);
        setSuggestions(result.suggestions || INITIAL_SUGGESTIONS);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLiveSession = async () => {
    if (showIntro) setShowIntro(false);
    if (isLive) { stopLiveSession(); return; }
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) { await window.aistudio.openSelectKey(); }

    try {
      setIsLive(true);
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = connectLive({
        onMessage: async (message) => {
          const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioBase64) {
            const bytes = decodeBase64(audioBase64);
            const audioBuffer = await decodeAudioData(bytes, outputCtx, 24000, 1);
            const source = outputCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputCtx.destination);
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          if (message.serverContent?.inputTranscription) {
            inputTransRef.current += message.serverContent.inputTranscription.text || "";
            setUiInputTrans(inputTransRef.current);
          }
          if (message.serverContent?.outputTranscription) {
            outputTransRef.current += message.serverContent.outputTranscription.text || "";
            setUiOutputTrans(outputTransRef.current);
          }
          if (message.serverContent?.turnComplete) {
            const finalIn = inputTransRef.current;
            const finalOut = outputTransRef.current;
            if (finalIn || finalOut) {
              setMessages(prev => [...prev,
                { id: Date.now().toString(), role: "user", content: finalIn || "(Voice Input)", timestamp: new Date() },
                { id: (Date.now()+1).toString(), role: "assistant", content: finalOut || "(Voice Response)", timestamp: new Date() }
              ]);
            }
            inputTransRef.current = ""; outputTransRef.current = ""; setUiInputTrans(""); setUiOutputTrans("");
          }
        },
        onError: () => stopLiveSession(),
        onClose: () => stopLiveSession(),
        onOpen: () => {
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob })).catch(() => {});
          };
          source.connect(processor); processor.connect(inputCtx.destination);
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) { stopLiveSession(); }
  };

  const stopLiveSession = () => {
    setIsLive(false);
    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null;
    sessionPromiseRef.current?.then(s => s.close()).catch(() => {}); sessionPromiseRef.current = null;
    inputAudioContextRef.current?.close().catch(() => {}); outputAudioContextRef.current?.close().catch(() => {});
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} }); sourcesRef.current.clear();
    setUiInputTrans(""); setUiOutputTrans(""); nextStartTimeRef.current = 0;
  };

  return (
    <>
      {isOpen && (
        <div className={`chatbot-window animate-in slide-in-from-bottom-5 duration-300 h-full flex flex-col ${isExpanded ? 'expanded' : ''} ${showIntro ? 'intro-mode' : ''}`}>
          {/* Full-screen Intro Video - No Header/Footer */}
          {showIntro ? (
            <div className="absolute inset-0 z-50 bg-black overflow-hidden">
              {/* Intro Video Embed - Full size for 9:16 video */}
              <KPointVideo
                className="w-full h-full"
                scriptUrl="https://assets.kpoint.com/assets/orca/media/embed/player-silk.js"
                htmlSnippet={`<div style='width:100%;height:100%;' data-video-host='ktpl.kpoint.com' data-kvideo-id='gcc-5f2ec840-e32c-4184-bf3e-af37ca12d0d7' data-ar='9:16' data-video-params='{"autoplay":"true", "mute":"false", "hide_controls": "true"}'></div>`}
              />             
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 flex flex-col text-white shadow-md relative overflow-hidden flex-shrink-0 icici-maroon-bg border-b border-white/10">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm relative backdrop-blur-md border border-white/20">
                      R
                      {isLive && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse border border-maroon-900"></span>}
                    </div>
                    <div>
                      <h3 className="font-black text-[11px] tracking-tight leading-none mb-1">RIA Assistant</h3>
                      <p className="text-[7px] opacity-80 uppercase font-black tracking-[0.2em]">
                        {isLive ? "Listening..." : "Health Insurance Concierge"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      title={isExpanded ? "Collapse" : "Maximum Height Mode"}
                      className="hidden md:block hover:bg-white/10 p-2 rounded-xl transition-all"
                    >
                      {isExpanded ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7"></path></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5"></path></svg>
                      )}
                    </button>
                    <button onClick={() => { setIsOpen(false); stopLiveSession(); }} className="hover:bg-white/10 p-2 rounded-xl transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
                </div>

              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto relative bg-white no-scrollbar p-0">
                <div className="p-4 space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}>
                      <div className={`max-w-[88%] ${msg.role === "user" ? "" : "w-full"}`}>
                        <div className={`p-4 rounded-2xl shadow-sm ${msg.role === "user" ? "bg-orange-500 text-white rounded-tr-none" : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"}`}>
                          {msg.role === "assistant" ? <FormattedMessage content={msg.content} /> : <p className="text-[13px] font-semibold leading-relaxed">{msg.content}</p>}
                        </div>

                        {/* Context Actions - Only for assistant messages */}
                        {msg.role === "assistant" && msg.contextActions && (
                          <ContextActions
                            actions={msg.contextActions}
                            onAction={handleContextAction}
                          />
                        )}

                        {/* Follow-up Questions - Only for assistant messages */}
                        {msg.role === "assistant" && msg.followUpQuestions && (
                          <FollowUpQuestions
                            questions={msg.followUpQuestions}
                            onSelect={handleSendText}
                          />
                        )}

                        {/* Feedback Widget - Only for assistant messages that require feedback */}
                        {msg.role === "assistant" && msg.requiresFeedback && !msg.feedbackGiven && (
                          <FeedbackWidget
                            messageId={msg.id}
                            sessionId={sessionId}
                            onSubmit={(rating, comment) => handleFeedbackSubmit(msg.id, rating, comment)}
                            autoShow={true}
                            delayMs={60000}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Idle Prompt */}
                {showIdlePrompt && messages.length > 1 && !isLoading && (
                  <IdlePrompt onResponse={resetActivity} idleTimeMs={120000} />
                )}

                {(uiInputTrans || uiOutputTrans) && (
                  <div className="flex justify-center py-2">
                    <div className="bg-slate-50 px-4 py-2 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse border border-slate-100">
                      {uiOutputTrans || uiInputTrans}
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div className="flex justify-start p-4 pt-0">
                    <div className="bg-slate-50 p-3 rounded-2xl flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Input Area */}
              <div className="border-t bg-slate-50 p-4 flex-shrink-0">
                {!isLoading && !isLive && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
                    {suggestions.map((q, idx) => (
                      <button
                    key={idx}
                    onClick={() => handleSendText(q)}
                    className="whitespace-nowrap px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm"
                  >
                    {q}
                  </button>
                    ))}
                  </div>
                )}

                {/* Listening Indicator - Shows near microphone button when recording */}
                {isLive && (
                  <div className="mb-3 flex items-center justify-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200 animate-in fade-in duration-300">
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-700">
                      RIA is listening
                    </span>
                  </div>
                )}

                <div className="flex gap-3 items-center">
                  <button
                    onClick={toggleLiveSession}
                    className={`relative p-3 rounded-2xl transition-all shadow-md flex-shrink-0 ${isLive ? "bg-red-600 text-white" : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"}`}
                  >
                    {isLive ? (
                      <>
                        {/* Recording indicator */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="6" width="12" height="12" rx="2" />
                        </svg>
                      </>
                    ) : (
                      <>
                        {/* Microphone icon when not recording */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                        </svg>
                      </>
                    )}
                  </button>
                  {!isLive && (
                    <>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                        placeholder="Ask RIA about your health policy..."
                        className="flex-1 border border-slate-200 rounded-2xl px-5 py-3 text-[13px] font-bold focus:outline-none focus:border-orange-500 transition-all shadow-inner bg-white"
                      />
                      <button onClick={() => handleSendText()} disabled={isLoading || !inputValue.trim()} className="icici-maroon-bg text-white p-3 rounded-2xl hover:bg-slate-800 disabled:opacity-30 transition-all flex-shrink-0 shadow-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-12 h-12 md:w-14 md:h-14 rounded-2xl shadow-[0_10px_30px_rgba(140,29,33,0.3)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-white icici-maroon-bg border-2 border-white z-[110] pulse-soft"
        >
          <div className="flex flex-col items-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            <span className="text-[6px] font-black mt-0.5 uppercase tracking-widest">RIA AI</span>
          </div>
        </button>
      )}
    </>
  );
};

export default Chatbot;
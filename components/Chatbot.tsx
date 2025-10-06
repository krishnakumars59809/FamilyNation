import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/chatContext';
import { PredictionChart } from './PredictionChart';
import { Link } from 'react-router-dom';
import { Volume1, Volume2 } from 'lucide-react';
import { ChatInput } from './chat/ChatInput';
import { textToAudio, uploadAudioFile } from '../api/hazelChatApi';
import { playAudio } from '../utils/playAudio';

export const Chatbot = ({ onClose }: { onClose?: () => void }) => {
  const {
    messages,
    currentQuestion,
    sendAnswer,
    loading,
    chatCompleted,
    predictionData,
    showPrediction,
    setShowPrediction,
    setStart,
  } = useChat();

  const [input, setInput] = useState('');
  const [showFamilyProfile, setShowFamilyProfile] = useState(true); // NEW: Show profile first
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceGender, setVoiceGender] = useState<'MALE' | 'FEMALE' | 'NEUTRAL'>(
    'NEUTRAL'
  );
  const [canInteract, setCanInteract] = useState(true);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const recordingIdRef = useRef(
    `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMicClick = async () => {
    if (!isRecording) {
      setIsRecording(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        });

        mediaRecorder.addEventListener('stop', async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/mpeg',
          });
          setRecording(audioBlob);
          setIsRecording(false);
          await handleUpload(audioBlob);
        });

        mediaRecorder.start();
      } catch (err) {
        console.error('Mic error', err);
        alert('Cannot access microphone');
        setIsRecording(false);
      }
    } else {
      mediaRecorderRef.current?.stop();
    }
  };

  const handleUpload = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const file = new File([blob], `${recordingIdRef.current}.mp3`, {
        type: 'audio/mpeg',
      });
      const res = await uploadAudioFile(file);
      const formatted = capitalizeFirstLetter(res.text);
      setInput(formatted); // transcription appears in input
      setIsProcessing(false);
      recordingIdRef.current = `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    } catch (err) {
      console.error(err);
      setInput('Upload failed');
    }
  };

  function capitalizeFirstLetter(text: string) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  function handleStartHazel() {
    setShowFamilyProfile(false);
    setStart(true);
  }

  const handleTextToAudio = async (text: string, onFinish?: () => void) => {
    try {
      if (canInteract) {
        setCanInteract(false);
        const res: any = await textToAudio(text);
        if (!res?.audio) return;

        const audioBuffer = Uint8Array.from(atob(res?.audio), (c) =>
          c?.charCodeAt(0)
        )?.buffer;

        playAudio(audioBuffer, setIsPlaying, () => {
          setCanInteract(true);
          if (onFinish) onFinish();
        });
      }
    } catch (err) {
      console?.error('TTS failed:', err);
      setPlayingId(null);
      setCanInteract(true);
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // TODO
  // useEffect(() => {
  //   if (!messages || messages?.length === 0 || showFamilyProfile) return;

  //   const lastMsg = messages?.[messages?.length - 1];

  //   if (lastMsg?.type !== 'user') {
  //     let textToSpeak = lastMsg?.content;

  //     if (lastMsg?.options && lastMsg?.options?.length > 0) {
  //       textToSpeak += '. Options are: ' + lastMsg.options.join(', ') + '.';
  //     }

  //     handleTextToAudio(textToSpeak);
  //   }
  // }, [messages]);

  // Show loading state
  if (loading)
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-sm mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-[#0D9488] rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-[#0D9488] rounded-full animate-pulse delay-150"></div>
          <div className="w-3 h-3 bg-[#0D9488] rounded-full animate-pulse delay-300"></div>
        </div>
        <p className="text-center mt-3 text-gray-600">Loading Hazel...</p>
      </div>
    );

  // NEW: Show family profile screen first
  if (showFamilyProfile) {
    return (
      <div className="flex flex-col h-full w-full  bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#1E3A8A] text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center relative">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#F87171] rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F87171] rounded-full opacity-80 animate-pulse"></div>
            </div>
            <div>
              <span className="font-bold">FamilyNation</span>
              <p className="text-xs opacity-90">It Starts at Home</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Family Profile Content */}
        <div className="h-full bg-gray-50">
          <div className="bg-white lg:rounded-xl p-2 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
              Meet the Johnson Family
            </h3>

            {/* Family Avatars Grid */}
            <div className="h-[170px] md:h-[200px] flex-1 overflow-y-auto grid md:grid-cols-2 gap-4 mb-6">
              {/* Daughter */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-100  ">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">D</span>
                  </div>
                  <div>
                    <span className="font-semibold text-red-800">
                      Daughter (17)
                    </span>
                    <p className="text-xs text-red-600">High School Student</p>
                  </div>
                </div>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Learning impairment</li>
                  <li>• Being bullied at school</li>
                  <li>• Slipping grades</li>
                  <li>• Experimenting with drugs</li>
                </ul>
              </div>

              {/* Son */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">S</span>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-800">
                      Son (19)
                    </span>
                    <p className="text-xs text-blue-600">College Student</p>
                  </div>
                </div>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Confrontational behavior</li>
                  <li>• Anxiety and frustration</li>
                  <li>• Resentful towards family</li>
                </ul>
              </div>

              {/* Mother */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">M</span>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-800">
                      Mother
                    </span>
                    <p className="text-xs text-purple-600">
                      Working Professional
                    </p>
                  </div>
                </div>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• Anxiety and depression</li>
                  <li>• Under psychiatric care</li>
                  <li>• Overwhelmed by family issues</li>
                </ul>
              </div>

              {/* Father */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">F</span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-800">Father</span>
                    <p className="text-xs text-green-600">
                      Working Professional
                    </p>
                  </div>
                </div>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Job insecurity</li>
                  <li>• Financial stress</li>
                  <li>• Marital conflict</li>
                </ul>
              </div>
            </div>

            {/* Family Challenges Summary */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Family Challenges:
              </h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Parents have combative marriage</li>
                <li>• Disagreement on solutions</li>
                <li>• Stress spills over to school/work</li>
                <li>• Risk of family breakdown</li>
              </ul>
            </div>

            {/* Narration from document */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700 italic">
                "This family looks like so many others. Stress, conflict, and
                hardship don't stay at home — they spill over into schools,
                workplaces, and communities."
              </p>
            </div>
          </div>
        </div>

        {/* Start Chat Button */}
        <div className="p-2">
          <button
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-900 hover:bg-emerald-900 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            onClick={handleStartHazel}
          >
            Start Assessment with Hazel
          </button>
        </div>
      </div>
    );
  }

  // Show prediction screen after chat completes
  if (showPrediction && predictionData) {
    return (
      <div className="flex flex-col h-full w-full  bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#1E3A8A] text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center relative">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#F87171] rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F87171] rounded-full opacity-80 animate-pulse"></div>
            </div>
            <div>
              <span className="font-bold">Hazel</span>
              <p className="text-xs opacity-90">Family Stability Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Prediction Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Family Stability Forecast
            </h3>

            {/* Chart Component */}
            <PredictionChart data={predictionData} />

            {/* Prediction Message */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-blue-800 text-sm leading-relaxed">
                {predictionData.message}
              </p>
            </div>

            {/* Risk Level Indicator */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Risk Level:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  predictionData.riskLevel === 'high'
                    ? 'bg-red-100 text-red-800'
                    : predictionData.riskLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {predictionData.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <Link to="/recommended" className="p-4 flex gap-3">
          <button
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-900 hover:bg-emerald-900 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            onClick={onClose}
          >
            Show Recommended Professionals
          </button>
        </Link>
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="flex flex-col h-full w-full  bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Hazel branding */}
      <div className="p-4 bg-[#1E3A8A] text-white flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center relative">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-[#F87171] rounded-full"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F87171] rounded-full opacity-80 animate-pulse"></div>
          </div>
          <div>
            <span className="font-bold">Hazel</span>
            <p className="text-xs opacity-90">Family Support Agent</p>
          </div>
          {/* <select className="bg-transparent" value={voiceGender} onChange={(e) => setVoiceGender(e.target.value as any)}>
  <option className="bg-transparent" value="MALE">Male</option>
  <option className="bg-transparent" value="FEMALE">Female</option>
  <option className="bg-transparent" value="NEUTRAL">Neutral</option>
</select> */}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center transition-colors"
        >
          &times;
        </button>
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages?.map((msg) => {
          const isThisPlaying = playingId === msg?.id;

          return (
            <div
              key={msg?.id}
              className={`flex gap-2 ${msg?.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <button
                className="h-10 w-10 bg-[#0D9488] text-white rounded-full flex items-center justify-center"
                onClick={() => {
                  if (isThisPlaying) {
                    audioRef?.current?.pause();
                    setPlayingId(null);
                  } else {
                    setPlayingId(msg?.id);

                    let textToSpeak = '';

                    if (msg?.type === 'user') {
                      textToSpeak = `Your answer is: You have chosen ${msg?.content}`;
                    } else {
                      textToSpeak = msg?.content;
                      if (msg?.options && msg?.options?.length > 0) {
                        textToSpeak += `. Options are: ${msg?.options?.join(', ')}.`;
                      }
                    }

                    handleTextToAudio(textToSpeak, () => setPlayingId(null));
                  }
                }}
              >
                {isThisPlaying ? (
                  <Volume2 className="text-black" />
                ) : (
                  <Volume1 />
                )}
              </button>

              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  msg?.type === 'user'
                    ? 'bg-[#1E3A8A] text-white rounded-br-none'
                    : 'bg-[#0D9488] text-white rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{msg?.content}</p>

                {msg?.options && (
                  <div className="mt-3 flex flex-col gap-2">
                    {msg?.options?.map((opt) => (
                      <button
                        key={opt}
                        className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl text-left transition-all duration-200 border border-white border-opacity-30"
                        onClick={() => sendAnswer(opt)}
                        disabled={!canInteract}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Show "analyzing" message when completed but before prediction */}
        {chatCompleted && !showPrediction && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl max-w-[80%] bg-[#0D9488] text-white rounded-bl-none">
              <p className="leading-relaxed">
                Thank you for your answers. I'm analyzing your situation and
                preparing recommendations...
              </p>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {/* {currentQuestion && !currentQuestion.options && !chatCompleted && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                  sendAnswer(input);
                  setInput('');
                }
              }}
            />
            <button
              className="bg-[#0D9488] hover:bg-[#0c7c6f] text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim()}
              onClick={() => {
                if (input.trim()) {
                  sendAnswer(input);
                  setInput('');
                }
              }}
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Hazel is here to listen and support your family
          </p>
        </div>
      )} */}
      <ChatInput
        input={input}
        setInput={setInput}
        sendAnswer={sendAnswer}
        isRecording={isRecording}
        handleMicClick={handleMicClick}
        isProcessing={isProcessing}
        disabled={!canInteract}
      />
    </div>
  );
};

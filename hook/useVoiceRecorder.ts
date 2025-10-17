import { useState, useRef } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  startRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
}

export const useVoiceRecorder = (): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastVoiceTimeRef = useRef<number>(0);
  const recordingRef = useRef<boolean>(false);

  // Silence detection config
  const SILENCE_DURATION_MS = 3000; // 3 seconds
  const AMPLITUDE_THRESHOLD = 0.02; // roughly -34 dBFS (tweak as needed)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);

        // Clean up
        stream.getTracks().forEach((track) => track.stop());
      };

      // Setup WebAudio graph for silence detection
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      sourceRef.current = source;
      analyserRef.current = analyser;

      lastVoiceTimeRef.current = Date.now();
      // Ensure context is running
      try {
        await audioContext.resume();
      } catch {}

      const dataArray = new Float32Array(analyser.fftSize);
      const monitor = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(dataArray);
        // Compute RMS
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = dataArray[i];
          sumSquares += val * val;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        if (rms > AMPLITUDE_THRESHOLD) {
          lastVoiceTimeRef.current = Date.now();
        }
        // If silence for configured duration, stop recording
        if (
          recordingRef.current &&
          Date.now() - lastVoiceTimeRef.current > SILENCE_DURATION_MS
        ) {
          stopRecording();
          return;
        }
        rafIdRef.current = requestAnimationFrame(monitor);
      };
      rafIdRef.current = requestAnimationFrame(monitor);

      mediaRecorder.start();
      setIsRecording(true);
      recordingRef.current = true;
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access is required for voice messages.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (isRecording || recordingRef.current)) {
      // Stop the media recorder
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Stop the audio context
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }

      // Cancel any pending animation frames
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Reset states
      setIsRecording(false);
      recordingRef.current = false;
    }
    recordingRef.current = false;
    // Cleanup analyser and audio context
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {}
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch {}
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    chunksRef.current = [];
  };

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  };
};

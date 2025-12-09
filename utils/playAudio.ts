export const playAudio = (
  audioBuffer: ArrayBuffer,
  setIsPlaying: any,
  setAudioPlayer: (audio: HTMLAudioElement | null) => void,
  onFinish?: () => void
) => {
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  setAudioPlayer(audio);
  setIsPlaying(true);
  audio.play();

  // when finished
  audio.onended = () => {
    setIsPlaying(false);
    URL.revokeObjectURL(audioUrl); // cleanup
    onFinish?.();
  };
};

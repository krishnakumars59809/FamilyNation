export const playAudio = (audioBuffer: ArrayBuffer, setIsPlaying: any) => {
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  setIsPlaying(true);
  audio.play();

  // when finished
  audio.onended = () => {
    setIsPlaying(false);
    URL.revokeObjectURL(audioUrl); // cleanup
  };
};

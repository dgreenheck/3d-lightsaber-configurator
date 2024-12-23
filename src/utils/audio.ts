let audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export async function loadAudio(url: string): Promise<AudioBuffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = getAudioContext();
  return await audioContext.decodeAudioData(arrayBuffer);
}

export function playAudio(
  buffer: AudioBuffer,
  gain: number = 1,
  loop: boolean = false
): AudioBufferSourceNode {
  const audioContext = getAudioContext();
  const gainNode = audioContext.createGain();
  const source = audioContext.createBufferSource();

  source.buffer = buffer;
  source.loop = loop;

  gainNode.gain.setValueAtTime(gain, audioContext.currentTime);

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.start();

  return source;
}

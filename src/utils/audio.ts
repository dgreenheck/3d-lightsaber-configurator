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
  loop: boolean = false,
  onEnded?: (ev: Event) => any
): AudioBufferSourceNode {
  const audioContext = getAudioContext();
  const gainNode = audioContext.createGain();
  const source = audioContext.createBufferSource();

  source.buffer = buffer;
  source.loop = loop;

  console.log(gain);

  gainNode.gain.setValueAtTime(gain, audioContext.currentTime);

  // Connect nodes
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const cleanUp = () => {
    source.removeEventListener("ended", onSourceEnded);
    source.disconnect();
    gainNode.disconnect();
  };

  const onSourceEnded = (ev: Event) => {
    cleanUp();
    if (onEnded) onEnded(ev);
  };

  source.addEventListener("ended", onSourceEnded);
  source.start();

  return source;
}

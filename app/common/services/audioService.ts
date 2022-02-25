import Sound from "react-native-sound";

export const enum Audios {
  VALID = "result_valid.wav",
  INVALID = "result_invalid.wav",
  ACTIVATED = "audio_activated.wav",
}

type FileName = string;

// This is a cached list of all sounds available in the app. Initialisation and caching is required for responsive sound playback
// eslint-disable-next-line  functional/prefer-readonly-type
const mutableSoundMapCache: Map<FileName, Sound> = new Map<FileName, Sound>();

/**
 * Initialises the audioService. Creates and configures instances of sounds to play
 */
const initialise = (): void => {
  cleanUp();

  // Disable audio play in background (iOS)
  Sound.setCategory("Playback");

  const filenames = Object.values(Audios);

  filenames.map((filename) => {
    const sound = new Sound(filename, Sound.MAIN_BUNDLE);
    mutableSoundMapCache.set(filename, sound);
  });
};

/**
 * Plays the requested sound
 */
const playSound = (audioName: Audios): void => {
  const sound = mutableSoundMapCache.get(audioName);

  if (!sound) return;
  if (!sound.isLoaded()) return;
  if (sound.getVolume() === 0.0) return;

  const validSound = sound; // Ensures sound object is valid in the callback below

  // Always play from start incase it was left mid-way before
  validSound.stop(() => {
    validSound.play(() => {
      return;
    });
  });
};

/**
 * Cleans up the sound instances and empties the sound map
 */
const cleanUp = (): void => {
  if (mutableSoundMapCache.size === 0) return;
  mutableSoundMapCache.forEach((sound) => {
    sound.stop();
    sound.release();
  });
  mutableSoundMapCache.clear();
};

/**
 * A service for playing sounds
 */
export const audioService = {
  initialise,
  playSound,
  cleanUp,
};

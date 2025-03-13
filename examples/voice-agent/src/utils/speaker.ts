import Speaker from 'speaker';

class AudioPlayer {
  options: {
    channels?: number;
    bitDepth?: number;
    sampleRate?: number;
    signed?: boolean;
    highWaterMark?: number;
  };
  currentSpeaker: Speaker | null;
  isPlaying: boolean;
  bufferSize: number;

  constructor(options = {} as AudioPlayer['options']) {
    this.options = {
      channels: options.channels || 1,
      bitDepth: options.bitDepth || 16,
      sampleRate: options.sampleRate || 16000,
      signed: options.signed !== undefined ? options.signed : true,
      highWaterMark: 1024 * 512, // High buffer size
    };

    this.currentSpeaker = null;
    this.isPlaying = false;
    this.bufferSize = 1024 * 1024; // 1MB buffer for audio
  }

  createSilencePadding(durationMs = 100) {
    const bytesPerSample = this.options.bitDepth! / 8;
    const samplesPerMs = this.options.sampleRate! / 1000;
    const silenceSize = Math.floor(durationMs * samplesPerMs * bytesPerSample * this.options.channels!);
    return Buffer.alloc(silenceSize);
  }

  playAudio(audio: Int16Array | Buffer, status?: string) {
    let audioBuffer: Buffer;

    if (audio instanceof Int16Array) {
      audioBuffer = Buffer.from(audio.buffer);
    } else if (Buffer.isBuffer(audio)) {
      audioBuffer = audio;
    } else {
      console.error('Unsupported audio format');
      return;
    }

    // Create speaker if it doesn't exist
    if (!this.currentSpeaker) {
      this.currentSpeaker = new Speaker({
        ...this.options,
        highWaterMark: this.bufferSize,
      });

      // Add error handling
      this.currentSpeaker.on('error', err => {
        console.error('Speaker error:', err);
        this.closeSpeaker();
      });
    }

    try {
      // Write directly to the speaker
      this.currentSpeaker.write(audioBuffer);

      // Only close the speaker when we receive the complete status
      if (status === 'complete') {
        // Write silence padding to prevent buffer underflow
        this.currentSpeaker.write(this.createSilencePadding(200));

        // End the speaker with a delay to ensure all audio is played
        setTimeout(() => {
          if (this.currentSpeaker) {
            this.currentSpeaker.end();
            this.currentSpeaker = null;
          }
        }, 300); // Longer delay to ensure all audio is processed
      }
    } catch (e) {
      console.error('Error playing audio:', e);
      this.closeSpeaker();
    }
  }

  closeSpeaker() {
    if (this.currentSpeaker) {
      try {
        // Add silence padding before closing to prevent underflow
        this.currentSpeaker.write(this.createSilencePadding(100));
        this.currentSpeaker.end();
      } catch (e) {
        console.error('Error closing speaker:', e);
      }
      this.currentSpeaker = null;
    }
  }

  cleanup() {
    this.closeSpeaker();
  }
}

export default AudioPlayer;

class AudioManager {
  private audioContext: AudioContext | null = null;
  private beepInterval: number | null = null;
  private isInitialized: boolean = false;

  initializeAudio(): void {
    if (this.isInitialized) {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      return;
    }

    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
      
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    }
  }

  playBeep(frequency: number = 800, duration: number = 100): void {
    this.initializeAudio();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration / 1000
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  startProximityAlert(interval: number): void {
    this.stopProximityAlert();
    
    if (interval === 0) return;

    this.playBeep();
    this.beepInterval = window.setInterval(() => {
      this.playBeep();
    }, interval);
  }

  stopProximityAlert(): void {
    if (this.beepInterval !== null) {
      clearInterval(this.beepInterval);
      this.beepInterval = null;
    }
  }

  playRadarScan(): void {
    this.initializeAudio();
    if (!this.audioContext) return;

    const startFreq = 400;
    const endFreq = 1200;
    const duration = 0.5;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      endFreq,
      this.audioContext.currentTime + duration
    );

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}

export const audioManager = new AudioManager();

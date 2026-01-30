// source: https://pixabay.com/sound-effects/technology-alarm-clock-90867/
import alarmClock90867 from '../assets/audio/alarm-clock-90867.mp3';

class SoundManager {
  constructor() {
      this.sounds = new Map();
  }

  play(id) {
    // TODO: in extenstion, instead of using new Audio(), we sent to background.js
    if (!this.sounds.get(id)) {
      // const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
      this.sounds.set(id, new Audio(alarmClock90867));
      this.sounds.get(id).loop = true;
    }
    this.sounds.get(id).play().catch((error) => {console.log(`Audio playbak failed: ${error.name} ${error.message}`)});
  }

  stop(id) {
    if (this.sounds.get(id)) {
      this.sounds.get(id).pause();
      this.sounds.get(id).currentTime = 0;
      this.sounds.delete(id);
    }
  }

  stopAll() {
    this.sounds.map(id => this.stop(id));
  }
}

export const soundManager = new SoundManager();

import { TimerStatus } from "../constants/TimerConstants";

export const secondsToHMS = (seconds) => ({
  hour: Math.floor(seconds / 3600),
  minute: Math.floor(seconds % 3600 / 60),
  second: seconds % 60,
});

export const newTimer = (overrides = {}) => ({
  id: crypto.randomUUID(),
  name: '',
  totalSeconds: 0, // in seconds
  status: TimerStatus.EDITING, // 'idle', 'editing', 'running', 'paused', or 'notifying'
  notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
  runMiliSecondsLeft: 0,
  ...overrides,
});

export const newEditingTimer = (overrides = {}) => ({
  isEditing: false,
  name: '',
  hour: 0,
  minute: 0,
  second: 0,
  errorMsg: null,
  ...overrides,
});

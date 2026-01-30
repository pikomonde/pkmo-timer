import React from 'react';
import { soundManager } from '../utils/SoundManager';

const LOCAL_STORAGE_SAVE_NAME = 'pkmo_timer';

export const useTimerEngine = (initialState, tickInterval) => {
  const [timers, setTimers] = React.useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SAVE_NAME);
    return saved ? JSON.parse(saved) : initialState;
  });

  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SAVE_NAME, JSON.stringify(timers));
  }, [timers]);

  React.useEffect(() => {
    const tick = setInterval(() => {
      setTimers(prev => {
        const now = Date.now();
        const runningIds = prev.allIds.filter(id => prev.byId[id].status === 'running');

        if (runningIds.length === 0) return prev;

        const updatedTimers = {};
        runningIds.forEach((id) => {
          const timer = prev.byId[id];
          if (timer.status === 'running') {
            if (now + timer.totalSeconds > timer.notifyAt) {
              updatedTimers[id] = {
                ...timer,
                status: 'notifying',
                notifyAt: 0,
                runMiliSecondsLeft: 0,
              };
              soundManager.play(id);
            } else {
              updatedTimers[id] = {
                ...timer,
                runMiliSecondsLeft: (timer.notifyAt - now),
              };
            }
          }
        });
        return {
          ...prev,
          byId: {
            ...prev.byId,
            ...updatedTimers,
          },
        }
      });
    }, tickInterval);

    return () => clearInterval(tick);
  }, [tickInterval]);

  return { timers, setTimers };
}


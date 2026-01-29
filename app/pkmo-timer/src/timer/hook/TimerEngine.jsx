import React from 'react';
// source: https://pixabay.com/sound-effects/technology-alarm-clock-90867/
import alarmClock90867Src from '../assets/audio/alarm-clock-90867.mp3';

export const useTimerEngine = (initialState, tickInterval) => {
  const [timers, setTimers] = React.useState(initialState);
  const audioRefs = React.useRef({});

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
              if (!audioRefs.current[id]) {
                // const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
                const alarmSound = new Audio(alarmClock90867Src);
                alarmSound.loop = true;
                alarmSound.play().catch((error) => {console.log(`Audio playbak failed: ${error.name} ${error.message}`)});
                audioRefs.current[id] = alarmSound;
              }
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

  return { timers, setTimers, audioRefs };
}


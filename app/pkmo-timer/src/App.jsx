import React from 'react';
import './App.css';
import { Timers } from './timer/Timers';
import { newEditingTimer } from './utils/TimerUtils';

const MS_IN_60_FPS = 1000 / 60;

function App() {
  // TODO: remove this when deploy to production
  const id1 = crypto.randomUUID();
  const id2 = crypto.randomUUID();
  const id3 = crypto.randomUUID();
  const exampleListOfTimers = {
    byId: {
      [id1]: {
        name: "coffee break",
        totalSeconds: 5 * 60, // in seconds
        status: 'idle', // 'idle', 'editing', 'running', 'paused', or 'notifying'
        notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
        runMiliSecondsLeft: 0,
      },
      [id2]: {
        name: "generating report A",
        totalSeconds: 20 * 60, // in seconds
        status: 'idle', // 'idle', 'editing', 'running', 'paused', or 'notifying'
        notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
        runMiliSecondsLeft: 0,
      },
      [id3]: {
        name: "generating report B",
        totalSeconds: 12 * 60, // in seconds
        status: 'idle', // 'idle', 'editing', 'running', 'paused', or 'notifying'
        notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
        runMiliSecondsLeft: 0,
      }
    },
    allIds: [id1, id2, id3],
    editingTimer: newEditingTimer(),
  };

  const [timers, setTimers] = React.useState(exampleListOfTimers);
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
                // TODO: move to binary files or hex
                const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
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
    }, MS_IN_60_FPS);

    return () => clearInterval(tick);
  }, []);

  return (
    <>
      <Timers
        timers={timers}
        setTimers={setTimers}
        audioRefs={audioRefs}
      />
    </>
  );
}
 
export default App

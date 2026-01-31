import styles from './App.module.css';
import { Timers } from './timer/Timers';
import { WindowWrapper } from './WindowWrapper';
import { createEditingTimer } from './timer/utils/TimerUtils';
import { useTimerEngine } from './timer/hook/TimerEngine';

const MS_IN_60_FPS = 1000 / 60;

function App() {
  const id1 = crypto.randomUUID();
  const id2 = crypto.randomUUID();
  const id3 = crypto.randomUUID();
  const id4 = crypto.randomUUID();
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
      },
      [id4]: {
        name: "render video",
        totalSeconds: 75 * 60, // in seconds
        status: 'idle', // 'idle', 'editing', 'running', 'paused', or 'notifying'
        notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
        runMiliSecondsLeft: 0,
      },
    },
    allIds: [id1, id2, id3, id4],
    editingTimer: createEditingTimer(),
  };

  const {timers, setTimers} = useTimerEngine(exampleListOfTimers, MS_IN_60_FPS);
  const useWrapper = import.meta.env.VITE_USE_WINDOW_WRAPPER === 'true';

  if (useWrapper) {
    return (
      <WindowWrapper>
        <div className={styles.content}>
          <Timers
            timers={timers}
            setTimers={setTimers}
          />
        </div>
      </WindowWrapper>
    );
  }

  return (
    <div className={styles.content}>
      <Timers
        timers={timers}
        setTimers={setTimers}
      />
    </div>
  );
}
 
export default App

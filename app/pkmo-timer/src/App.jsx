import React from 'react';
import './App.css'

const MS_IN_60_FPS = 1000 / 60;
const TimerCallbackActionsContext = React.createContext(null);
const newTimer = (overrides = {}) => ({
  id: crypto.randomUUID(),
  name: '',
  totalSeconds: 0, // in seconds
  status: 'editing', // 'idle', 'editing', 'running', 'paused', or 'notifying'
  notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
  runMiliSecondsLeft: 0,
  ...overrides,
});
const newEditingTimer = (overrides = {}) => ({
  isEditing: false,
  name: '',
  hour: 0,
  minute: 0,
  second: 0,
  ...overrides
});

function secondsToHMS(seconds) {
  return {
    hour: Math.floor(seconds / 3600),
    minute: Math.floor(seconds % 3600 / 60),
    second: seconds % 60,
  };
}

const Timer = React.memo(function Timer({
  id,
  timer: {name, totalSeconds, status, runMiliSecondsLeft},
  editingTimer = { name: '', hour: 0, minute: 0, second: 0 },
  isOtherTimerEdited,
}) {
  const {hour, minute, second} = secondsToHMS(totalSeconds);
  const {hour: runHour, minute: runMinute, second: runSecond} = secondsToHMS(Math.ceil(runMiliSecondsLeft / 1000));
  const {onUpdate, onEdit, onDelete, onChange, onStartTimer, onPauseTimer, onResumeTimer, onStopTimer} = React.useContext(TimerCallbackActionsContext);
  
  const nameInputRef = React.useRef(null);
  React.useEffect(() => {
    if (status === 'editing' && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [status]);
  
  const isDisplayRunningTime = status === 'running' || status === 'paused' || status === 'notifying';

  return (
    <div className='timer-card'>
      <input
        ref={nameInputRef}
        type='text'
        placeholder='Input timer name'
        disabled={status !== 'editing'}
        value={status === 'editing' ? editingTimer.name : name}
        onChange={(event) => onChange(event, 'name')}
      />
      <input
        type='number'
        placeholder='Input hours'
        disabled={status !== 'editing'}
        value={status === 'editing' ? editingTimer.hour : (isDisplayRunningTime ? runHour : hour)}
        onChange={(event) => onChange(event, 'hour')}
      />
      <input
        type='number'
        placeholder='Input minutes'
        disabled={status !== 'editing'}
        value={status === 'editing' ? editingTimer.minute : (isDisplayRunningTime ? runMinute : minute)}
        onChange={(event) => onChange(event, 'minute')}
      />
      <input
        type='number'
        placeholder='Input seconds'
        disabled={status !== 'editing'}
        value={status === 'editing' ? editingTimer.second : (isDisplayRunningTime ? runSecond : second)}
        onChange={(event) => onChange(event, 'second')}
      />

      {status === 'editing' &&
        <button
          className='timer-button-save'
          onClick={() => onUpdate(id, editingTimer)}
        >
          Save
        </button>
      }
      {status === 'editing' &&
        <button
          className='timer-button-delete'
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      }
      {status === 'idle' &&
        <button
          className='timer-button-start'
          disabled={isOtherTimerEdited}
          onClick={() => onStartTimer(id)}
          >
          Start
        </button>
      }
      {(status === 'idle') &&
        <button
          className='timer-button-edit'
          disabled={isOtherTimerEdited}
          onClick={() => onEdit(id)}
        >
          Edit
        </button>
      }
      {status === 'running' &&
        <button
          className='timer-button-pause'
          disabled={isOtherTimerEdited}
          onClick={() => onPauseTimer(id)}
        >
          Pause
        </button>
      }
      {status === 'paused' &&
        <button
          className='timer-button-pause'
          disabled={isOtherTimerEdited}
          onClick={() => onResumeTimer(id)}
        >
          Resume
        </button>
      }
      {status === 'paused' &&
        <button
          className='timer-button-stop'
          disabled={isOtherTimerEdited}
          onClick={() => onStopTimer(id)}
        >
          Stop
        </button>
      }
      {(status === 'notifying') &&
        <button
          style={{backgroundColor: 'red'}}
          onClick={() => onStopTimer(id)}
        >
          RED
        </button>
      }

    </div>
  )
});

function Timers({ timers, setTimers, audioRefs }) {

  const onCreate = React.useCallback(() => {
    const timer = newTimer();
    setTimers(prev => {
      return {
        ...prev,
        byId: {...prev.byId, [timer.id]: timer},
        allIds: [...prev.allIds, timer.id],
        editingTimer: newEditingTimer({isEditing: true}),
      }
    });
  }, [setTimers]);

  const onUpdate = React.useCallback((id, { name, hour, minute, second }) => {
    const totalSeconds = Number(hour) * 3600 + Number(minute) * 60 + Number(second);

    if (totalSeconds === 0) {
      // TODO: handle 0 totalSeconds
      return;
    }

    setTimers(prev => {
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            ...prev.byId[id],
            name: name.trim() || 'Untitled Timer',
            totalSeconds: totalSeconds,
            status: "idle",
          }
        },
        editingTimer: newEditingTimer(),
      }
    });
  }, [setTimers]);

  const onEdit = React.useCallback((id) => {
    setTimers(prev => {
      const hms = secondsToHMS(prev.byId[id].totalSeconds);
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            ...prev.byId[id],
            status: 'editing',
          }
        },
        editingTimer: {
          isEditing: true,
          name: prev.byId[id].name,
          hour: hms.hour,
          minute: hms.minute,
          second: hms.second,
        },
      }
    });
  }, [setTimers]);

  const onChange = React.useCallback((event, fieldName) => {
    let val = event.target.value;
    switch (fieldName) {
      case 'hour':
        val = Math.floor(val)
        if (val < 0) {
          val = 0;
        }
        break;
      case 'minute':
        val = Math.floor(val)
        if (val < 0) {
          val = 0;
        } else if (val > 59) {
          val = 59;
        }
        break;
      case 'second':
        val = Math.floor(val)
        if (val < 0) {
          val = 0;
        } else if (val > 59) {
          val = 59;
        }
        break;
    }

    setTimers(prev => {
      return {
        ...prev,
        editingTimer: {
          ...prev.editingTimer,
          [fieldName]: val,
        },
      }
    });
  }, [setTimers]);

  const onDelete = React.useCallback((id) => {
    if (audioRefs.current[id]) {
      audioRefs.current[id].pause();
      audioRefs.current[id].currentTime = 0;
      delete audioRefs.current[id];
    }
    setTimers(prev => {
      const { [id]: _, ...remainingById } = prev.byId;
      const newAllIds = prev.allIds.filter(activeId => activeId !== id);

      return {
        ...prev,
        byId: {...remainingById},
        allIds: [...newAllIds],
        editingTimer: newEditingTimer(),
      }
    });
  }, [setTimers, audioRefs]);

  const onStartTimer = React.useCallback((id) => {
    setTimers(prev => {
      const totalSeconds = prev.byId[id].totalSeconds;
      const totalMiliSeconds = 1000 * totalSeconds;
      const notifyAt = Date.now() + totalMiliSeconds;
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            ...prev.byId[id],
            status: 'running',
            notifyAt: notifyAt,
            runMiliSecondsLeft: totalMiliSeconds,
          }
        },
      }
    });
  }, [setTimers]);

  const onPauseTimer = React.useCallback((id) => {
    setTimers(prev => {
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            ...prev.byId[id],
            status: 'paused',
          }
        },
      }
    });
  }, [setTimers]);

  const onResumeTimer = React.useCallback((id) => {
    setTimers(prev => {
      const runMiliSecondsLeft = prev.byId[id].runMiliSecondsLeft;
      const notifyAt = Date.now() + runMiliSecondsLeft;
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            ...prev.byId[id],
            status: 'running',
            notifyAt: notifyAt,
            runMiliSecondsLeft: runMiliSecondsLeft,
          }
        },
      }
    });
  }, [setTimers]);

  const onStopTimer = React.useCallback((id) => {
    if (audioRefs.current[id]) {
      audioRefs.current[id].pause();
      audioRefs.current[id].currentTime = 0;
      delete audioRefs.current[id];
    }
    setTimers(prev => {
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            ...prev.byId[id],
            status: 'idle',
            notifyAt: 0,
          }
        },
      }
    });
  }, [setTimers, audioRefs]);

  const callbackActions = React.useMemo(() => ({
    onUpdate, onEdit, onChange, onDelete, onStartTimer, onPauseTimer, onResumeTimer, onStopTimer
  }), [onUpdate, onEdit, onChange, onDelete, onStartTimer, onPauseTimer, onResumeTimer, onStopTimer]);

  return (
    <TimerCallbackActionsContext.Provider value={callbackActions}>
      <div className='timers-container'>
        {timers.allIds.map((id) => {
          const isEditingThisOne = timers.byId[id].status === 'editing';
          const isOtherTimerEdited = timers.editingTimer.isEditing;
          return <Timer
            key={id}
            id={id}
            timer={timers.byId[id]}
            editingTimer={isEditingThisOne ? timers.editingTimer: undefined}
            isOtherTimerEdited={isOtherTimerEdited}
          />
        })}
        <button
          className='timer-button-add'
          onClick={onCreate}
          disabled={timers.editingTimer.isEditing}
        >Add New Timer</button>
      </div>
    </TimerCallbackActionsContext.Provider>
  )
}

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

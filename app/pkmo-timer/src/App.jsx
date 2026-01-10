import React from 'react';
import './App.css'

const MS_IN_60_FPS = 1000 / 60;
const TimerCallbackActionsContext = React.createContext(null);

function secondsToHMS(seconds) {
  return {
    hour: Math.floor(seconds / 3600),
    minute: Math.floor(seconds % 3600 / 60),
    second: seconds % 60,
  };
}

const Timer = React.memo(function Timer({
  id,
  timer: {name, totalSeconds, status, runSecondsLeft},
  editingTimer = { name: '', hour: 0, minute: 0, second: 0 },
  isOtherTimerEdited,
}) {
  const {hour, minute, second} = secondsToHMS(totalSeconds);
  const {hour: runHour, minute: runMinute, second: runSecond} = secondsToHMS(runSecondsLeft);
  const {onUpdate, onEdit, onDelete, onChange, onStartTimer, onStopTimer} = React.useContext(TimerCallbackActionsContext);

  const nameInputRef = React.useRef(null);
  React.useEffect(() => {
    if (status === 'editing' && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [status]);

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
        value={status === 'editing' ? editingTimer.hour : (status === 'running' || status === 'notifying' ? runHour : hour)}
        onChange={(event) => onChange(event, 'hour')}
      />
      <input
        type='number'
        placeholder='Input minutes'
        disabled={status !== 'editing'}
        value={status === 'editing' ? editingTimer.minute : (status === 'running' || status === 'notifying' ? runMinute : minute)}
        onChange={(event) => onChange(event, 'minute')}
      />
      <input
        type='number'
        placeholder='Input seconds'
        disabled={status !== 'editing'}
        value={status === 'editing' ? editingTimer.second : (status === 'running' || status === 'notifying' ? runSecond : second)}
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

function Timers({ timers, setTimers }) {

  const onCreate = React.useCallback(() => {
    const id = crypto.randomUUID();
    setTimers(prev => {
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            name: '',
            totalSeconds: 0,
            status: 'editing', // 'idle', 'editing', 'running', or 'notifying'
            notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
            runSecondsLeft: 0,
          }
        },
        allIds: [...prev.allIds, id],
        editingTimer: {
          isEditing: true,
          name: '',
          hour: 0,
          minute: 0,
          second: 0,
        },
      }
    });
  }, [setTimers]);

  const onUpdate = React.useCallback((id, { name, hour, minute, second }) => {
    // TODO: handle totalSeconds = 0
    // TODO: handle name = ''

    setTimers(prev => {
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            ...prev.byId[id],
            name: name || 'Untitled Timer',
            totalSeconds: Number(hour) * 3600 + Number(minute) * 60 + Number(second),
            status: "idle",
          }
        },
        editingTimer: {
          isEditing: false,
          name: '',
          hour: 0,
          minute: 0,
          second: 0,
        },
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
    setTimers(prev => {
      const { [id]: _, ...remainingById } = prev.byId;
      const newAllIds = prev.allIds.filter(activeId => activeId !== id);

      return {
        ...prev,
        byId: {...remainingById},
        allIds: [...newAllIds],
        editingTimer: {
          isEditing: false,
          name: '',
          hour: 0,
          minute: 0,
          second: 0,
        },
      }
    });
  }, [setTimers]);

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
            runSecondsLeft: Math.ceil((totalMiliSeconds) / 1000),
          }
        },
      }
    });
  }, [setTimers]);

  const onStopTimer = React.useCallback((id) => {
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
  }, [setTimers]);

  const callbackActions = React.useMemo(() => ({
    onUpdate, onEdit, onChange, onDelete, onStartTimer, onStopTimer
  }), [onUpdate, onEdit, onChange, onDelete, onStartTimer, onStopTimer]);

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
        status: 'idle', // 'idle', 'editing', 'running', or 'notifying'
        notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
        runSecondsLeft: 0,
      },
      [id2]: {
        name: "generating report A",
        totalSeconds: 20 * 60, // in seconds
        status: 'idle', // 'idle', 'editing', 'running', or 'notifying'
        notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
        runSecondsLeft: 0,
      },
      [id3]: {
        name: "generating report B",
        totalSeconds: 12 * 60, // in seconds
        status: 'idle', // 'idle', 'editing', 'running', or 'notifying'
        notifyAt: 0, // in mili unix time stamp, will be used when the timer starts
        runSecondsLeft: 0,
      }
    },
    allIds: [id1, id2, id3],
    // TODO: how to make this class as default?
    editingTimer: {
      isEditing: false,
      name: '',
      hour: 0,
      minute: 0,
      second: 0,
    },
  };

  const [timers, setTimers] = React.useState(exampleListOfTimers);
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
                runSecondsLeft: 0,
              };
            } else {
              updatedTimers[id] = {
                ...timer,
                runSecondsLeft: Math.ceil((timer.notifyAt - now) / 1000),
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
      />
    </>
  );
}
 
export default App

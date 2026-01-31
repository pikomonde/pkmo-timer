import React from 'react';
import styles from './Timers.module.css';
import { createEditingTimer, createTimer, secondsToHMS } from './utils/TimerUtils';
import { Timer } from './Timer';
import { TimerCallbackActionsContext } from './TimerContext';
import { soundManager } from './utils/SoundManager';
import { TimerStatus } from './constants/TimerConstants';

export const Timers = ({ timers, setTimers }) => {

  const onCreate = React.useCallback(() => {
    const timer = createTimer();
    setTimers(prev => {
      return {
        ...prev,
        byId: {...prev.byId, [timer.id]: timer},
        allIds: [...prev.allIds, timer.id],
        editingTimer: createEditingTimer({ isEditing: true }),
      }
    });
  }, [setTimers]);

  const onUpdate = React.useCallback((id, { name, hour, minute, second }) => {
    const totalSeconds = Number(hour) * 3600 + Number(minute) * 60 + Number(second);

    if (totalSeconds === 0) {
      setTimers(prev => ({
        ...prev,
        editingTimer: {
          ...prev.editingTimer,
          errorMsg: 'Timer cannot be zero second.',
        },
      }));
      return;
    }

    setTimers(prev => {
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            ...prev.byId[id],
            name: name.trim() || 'untitled timer',
            totalSeconds: totalSeconds,
            status: TimerStatus.IDLE,
          }
        },
        editingTimer: createEditingTimer(),
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
            status: TimerStatus.EDITING,
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
    soundManager.stop(id);
    setTimers(prev => {
      const { [id]: _, ...remainingById } = prev.byId;
      const newAllIds = prev.allIds.filter(activeId => activeId !== id);

      return {
        ...prev,
        byId: {...remainingById},
        allIds: [...newAllIds],
        editingTimer: createEditingTimer(),
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
            status: TimerStatus.RUNNING,
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
            status: TimerStatus.PAUSED,
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
            status: TimerStatus.RUNNING,
            notifyAt: notifyAt,
            runMiliSecondsLeft: runMiliSecondsLeft,
          }
        },
      }
    });
  }, [setTimers]);

  const onStopTimer = React.useCallback((id) => {
    soundManager.stop(id);
    setTimers(prev => {
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: {
            ...prev.byId[id],
            status: TimerStatus.IDLE,
            notifyAt: 0,
          }
        },
      }
    });
  }, [setTimers]);

  const callbackActions = React.useMemo(() => ({
    onUpdate, onEdit, onChange, onDelete, onStartTimer, onPauseTimer, onResumeTimer, onStopTimer
  }), [onUpdate, onEdit, onChange, onDelete, onStartTimer, onPauseTimer, onResumeTimer, onStopTimer]);

  return (
    <TimerCallbackActionsContext.Provider value={callbackActions}>
      <div className={styles['timers-container']}>
        {timers.allIds.map((id) => {
          const isEditingThisOne = timers.byId[id].status === TimerStatus.EDITING;
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
          className={styles['timer-button-add']}
          onClick={onCreate}
          disabled={timers.editingTimer.isEditing}
          >Add New Timer</button>
      </div>
    </TimerCallbackActionsContext.Provider>
  )
}

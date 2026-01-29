import React from 'react';
import './Timer.css';
import { secondsToHMS } from '../utils/TimerUtils';
import { TimerCallbackActionsContext } from './TimerContext';

export const Timer = React.memo(function Timer({
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
      <div className='timer-card-controls'>
        <div className='timer-card-time-group'>
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
        </div>

        <div className='timer-card-action-group'>
          {status === 'editing' &&
            <button
              className='timer-card-button timer-button-save'
              onClick={() => onUpdate(id, editingTimer)}
            >
              Save
            </button>
          }
          {status === 'editing' &&
            <button
              className='timer-card-button timer-button-delete'
              onClick={() => onDelete(id)}
            >
              Delete
            </button>
          }
          {status === 'idle' &&
            <button
              className='timer-card-button timer-button-start'
              disabled={isOtherTimerEdited}
              onClick={() => onStartTimer(id)}
              >
              Start
            </button>
          }
          {(status === 'idle') &&
            <button
              className='timer-card-button timer-button-edit'
              disabled={isOtherTimerEdited}
              onClick={() => onEdit(id)}
            >
              Edit
            </button>
          }
          {status === 'running' &&
            <button
              className='timer-card-button timer-button-pause'
              disabled={isOtherTimerEdited}
              onClick={() => onPauseTimer(id)}
            >
              Pause
            </button>
          }
          {status === 'paused' &&
            <button
              className='timer-card-button timer-button-resume'
              disabled={isOtherTimerEdited}
              onClick={() => onResumeTimer(id)}
            >
              Resume
            </button>
          }
          {status === 'paused' &&
            <button
              className='timer-card-button timer-button-stop'
              disabled={isOtherTimerEdited}
              onClick={() => onStopTimer(id)}
            >
              Restart
            </button>
          }
          {(status === 'notifying') &&
            <button
              className='timer-card-button timer-button-notify'
              onClick={() => onStopTimer(id)}
            >
              Stop
            </button>
          }
        </div>
      </div>
    </div>
  )
});

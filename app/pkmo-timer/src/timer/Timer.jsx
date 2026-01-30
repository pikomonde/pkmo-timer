import React from 'react';
import clsx from 'clsx';
import styles from './Timer.module.css';
import { secondsToHMS } from './utils/TimerUtils';
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
      nameInputRef.current.scrollIntoView({
        behaviour: 'smooth',
        block: 'center',
      });
    }
  }, [status]);
  
  const isDisplayRunningTime = status === 'running' || status === 'paused' || status === 'notifying';

  return (
    <div className={styles['timer-card']}>
      <input
        ref={nameInputRef}
        type='text'
        placeholder='Input timer name'
        disabled={status !== 'editing'}
        value={status === 'editing' ? editingTimer.name : name}
        onChange={(event) => onChange(event, 'name')}
      />
      <div className={styles['timer-card-controls']}>
        <div className={styles['timer-card-time-group']}>
          <input
            type='number'
            className={clsx({ [styles['is-invalid-input']]: editingTimer?.errorMsg })}
            placeholder='Input hours'
            disabled={status !== 'editing'}
            value={status === 'editing' ? editingTimer.hour : (isDisplayRunningTime ? runHour : hour)}
            onChange={(event) => onChange(event, 'hour')}
          />
          <input
            type='number'
            className={clsx({ [styles['is-invalid-input']]: editingTimer?.errorMsg })}
            placeholder='Input minutes'
            disabled={status !== 'editing'}
            value={status === 'editing' ? editingTimer.minute : (isDisplayRunningTime ? runMinute : minute)}
            onChange={(event) => onChange(event, 'minute')}
          />
          <input
            type='number'
            className={clsx({ [styles['is-invalid-input']]: editingTimer?.errorMsg })}
            placeholder='Input seconds'
            disabled={status !== 'editing'}
            value={status === 'editing' ? editingTimer.second : (isDisplayRunningTime ? runSecond : second)}
            onChange={(event) => onChange(event, 'second')}
          />
        </div>

        <div className={styles['timer-card-action-group']}>
          {status === 'editing' &&
            <button
              className={clsx(styles['timer-card-button'], styles['timer-button-save'])}
              onClick={() => onUpdate(id, editingTimer)}
            >
              Save
            </button>
          }
          {status === 'editing' &&
            <button
              className={clsx(styles['timer-card-button'], styles['timer-button-delete'])}
              onClick={() => onDelete(id)}
            >
              Delete
            </button>
          }
          {status === 'idle' &&
            <button
              className={clsx(styles['timer-card-button'], styles['timer-button-start'])}
              disabled={isOtherTimerEdited}
              onClick={() => onStartTimer(id)}
              >
              Start
            </button>
          }
          {(status === 'idle') &&
            <button
              className={clsx(styles['timer-card-button'], styles['timer-button-edit'])}
              disabled={isOtherTimerEdited}
              onClick={() => onEdit(id)}
            >
              Edit
            </button>
          }
          {status === 'running' &&
            <button
              className={clsx(styles['timer-card-button'], styles['timer-button-pause'])}
              disabled={isOtherTimerEdited}
              onClick={() => onPauseTimer(id)}
            >
              Pause
            </button>
          }
          {status === 'paused' &&
            <button
              className={clsx(styles['timer-card-button'], styles['timer-button-resume'])}
              disabled={isOtherTimerEdited}
              onClick={() => onResumeTimer(id)}
            >
              Resume
            </button>
          }
          {status === 'paused' &&
            <button
              className={clsx(styles['timer-card-button'], styles['timer-button-stop'])}
              disabled={isOtherTimerEdited}
              onClick={() => onStopTimer(id)}
            >
              Restart
            </button>
          }
          {(status === 'notifying') &&
            <button
              className={clsx(styles['timer-card-button'], styles['timer-button-notify'])}
              onClick={() => onStopTimer(id)}
            >
              Stop
            </button>
          }
        </div>
        {/* <div>
            {editingTimer?.errorMsg && (
            <span style={{ color: 'var(--piko-danger)', fontSize: '10px' }}>
                {editingTimer.errorMsg}
            </span>
            )}
        </div> */}
      </div>
    </div>
  )
});

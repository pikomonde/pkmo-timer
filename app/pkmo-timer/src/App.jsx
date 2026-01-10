import React from 'react';
import './App.css'

function secondsToHMS(seconds) {
  return {
    hour: Math.floor(seconds / 3600),
    minute: Math.floor(seconds % 3600 / 60),
    second: seconds % 60,
  };
}

const Timer = React.memo(function Timer({ 
  id,
  timer: {name, totalSeconds, status},
  editingTimer,
  isOtherTimerEdited,
  setTimers,
  onUpdate,
  onEdit,
  onDelete, 
}) {
  const hms = secondsToHMS(totalSeconds);

  const onChange = (event, fieldName) => {
    setTimers(prev => {
      return {
        ...prev,
        editingTimer: {
          ...prev.editingTimer,
          [fieldName]: event.target.value,
        },
      }
    });
  };


  return (
    <div className='timer-card'>
      <input
        type='text'
        placeholder='Input timer name'
        disabled={status !== 'editing'}
        value={status !== 'editing' ? name : editingTimer.name}
        onChange={(event) => onChange(event, 'name')}
      />
      <input
        type='number'
        placeholder='Input hours'
        disabled={status !== 'editing'}
        value={status !== 'editing' ? hms.hour : editingTimer.hour}
        onChange={(event) => onChange(event, 'hour')}
      />
      <input
        type='number'
        placeholder='Input minutes'
        disabled={status !== 'editing'}
        value={status !== 'editing' ? hms.minute : editingTimer.minute}
        onChange={(event) => onChange(event, 'minute')}
      />
      <input
        type='number'
        placeholder='Input seconds'
        disabled={status !== 'editing'}
        value={status !== 'editing' ? hms.second : editingTimer.second}
        onChange={(event) => onChange(event, 'second')}
      />
      
      {status === 'editing' &&
        <button
          className='timer-button-save'
          disabled={status !== 'editing'}
          onClick={() => onUpdate(id, editingTimer)}
        >
          Save
        </button>
      }
      {status === 'editing' &&
        <button
          className='timer-button-delete'
          disabled={status !== 'editing'}
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      }
      {status === 'idle' &&
        <button
          className='timer-button-edit'
          disabled={status !== 'idle' || isOtherTimerEdited}
          onClick={() => onEdit(id)}
        >
          Edit
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
            status: 'editing', // 'idle', 'editing', or 'running'
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

  return (
    <div className='timers-container'>
      {timers.allIds.map((id) => {
        const isEditingThisOne = timers.byId[id].status === 'editing';
        const isOtherTimerEdited = timers.editingTimer.isEditing;
        return <Timer
          key={id}
          id={id}
          timer={timers.byId[id]}
          editingTimer={isEditingThisOne ? timers.editingTimer: null}
          isOtherTimerEdited={isOtherTimerEdited}
          setTimers={setTimers}
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      })}
      <button
        className='timer-button-add'
        onClick={onCreate}
        disabled={timers.editingTimer.isEditing}
      >Add New Timer</button>
    </div>
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
        status: 'idle',
      },
      [id2]: {
        name: "generating report A",
        totalSeconds: 20 * 60, // in seconds
        status: 'idle',
      },
      [id3]: {
        name: "generating report B",
        totalSeconds: 12 * 60, // in seconds
        status: 'idle',
      }
    },
    allIds: [id1, id2, id3],
    editingTimer: {
      isEditing: false,
      name: '',
      hour: 0,
      minute: 0,
      second: 0,
    },
  };

  const [timers, setTimers] = React.useState(exampleListOfTimers);

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

import React from 'react';
import './App.css'

function secondsToHMS(seconds) {
  return {
    hour: Math.floor(seconds / 3600),
    minute: Math.floor(seconds % 3600 / 60),
    second: seconds % 60,
  };
}

function Timer({ id, timer, editingTimer, setTimers, onUpdate, onEdit, onDelete }) {
  const hms = secondsToHMS(timer.totalSeconds);

  function onChange(event, fieldName) {
    setTimers(prev => {
      return {
        ...prev,
        editingTimer: {
          ...prev.editingTimer,
          [fieldName]: event.target.value,
        },
      }
    });
  }


  return (
    <div className='timer-card'>
      <input
        type='text'
        placeholder='Input timer name'
        disabled={timer.status !== 'editing'}
        value={timer.status !== 'editing' ? timer.name : editingTimer.name}
        onChange={(event) => onChange(event, 'name')}
      />
      <input
        type='number'
        placeholder='Input hours'
        disabled={timer.status !== 'editing'}
        value={timer.status !== 'editing' ? hms.hour : editingTimer.hour}
        onChange={(event) => onChange(event, 'hour')}
      />
      <input
        type='number'
        placeholder='Input minutes'
        disabled={timer.status !== 'editing'}
        value={timer.status !== 'editing' ? hms.minute : editingTimer.minute}
        onChange={(event) => onChange(event, 'minute')}
      />
      <input
        type='number'
        placeholder='Input seconds'
        disabled={timer.status !== 'editing'}
        value={timer.status !== 'editing' ? hms.second : editingTimer.second}
        onChange={(event) => onChange(event, 'second')}
      />
      
      {timer.status === 'editing' &&
        <button
          className='timer-button-save'
          disabled={timer.status !== 'editing'}
          onClick={() => onUpdate(id, editingTimer)}
        >
          Save
        </button>
      }
      {timer.status === 'editing' &&
        <button
          className='timer-button-delete'
          disabled={timer.status !== 'editing'}
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      }
      {timer.status === 'idle' &&
        <button
          className='timer-button-edit'
          disabled={timer.status !== 'idle' || editingTimer.isEditing}
          onClick={() => onEdit(id)}
        >
          Edit
        </button>
      }

    </div>
  )
}

function Timers({ timers, setTimers }) {

  const onCreate = () => {
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
  };

  const onUpdate = (id, { name, hour, minute, second }) => {
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
  }

  const onEdit = (id) => {
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
  }

  const onDelete = (id) => {
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
  }

  return (
    <div className='timers-container'>
      {timers.allIds.map((id) => {
        return <Timer
          key={id}
          id={id}
          timer={timers.byId[id]}
          editingTimer={timers.editingTimer}
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

import React from 'react';
import './App.css'

function secondsToHMS(seconds) {
  return {
    hour: Math.floor(seconds / 3600),
    minute: Math.floor(seconds % 3600 / 60),
    second: seconds % 60,
  };
}

function Timer({ id, timer, editingTimer, setEditingTimer, onUpdate, onEdit, onDelete }) {
  const hms = secondsToHMS(timer.totalSeconds);

  function onChange(event, fieldName) {
    let newTimer = {...editingTimer};
    newTimer[fieldName] = event.target.value;
    setEditingTimer(newTimer);
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
  const [editingTimer, setEditingTimer] = React.useState({});

  const onCreate = () => {
    const id = crypto.randomUUID();
    setTimers({
      byId: {...timers.byId, [id]: {
        name: '',
        totalSeconds: 0,
        status: 'editing', // 'idle', 'editing', or 'running'
      }},
      allIds: [...timers.allIds, id],
    });
    setEditingTimer({
      isEditing: true,
      name: '',
      hour: 0,
      minute: 0,
      second: 0,
    });
  };

  const onUpdate = (id, { name, hour, minute, second }) => {
    // TODO: handle totalSeconds = 0
    // TODO: handle name = ''

    const updatedTimers = {...timers.byId}
    updatedTimers[id] = {
      name: name || 'Untitled Timer',
      totalSeconds: Number(hour) * 3600 + Number(minute) * 60 + Number(second),
      status: "idle",
    }

    setTimers({
      byId: updatedTimers,
      allIds: [...timers.allIds],
    });
    setEditingTimer({
      isEditing: false,
      name: '',
      hour: 0,
      minute: 0,
      second: 0,
    });
  }

  const onEdit = (id) => {
    const hms = secondsToHMS(timers.byId[id].totalSeconds);

    setTimers({
      byId: {...timers.byId, [id]: {
        ...timers.byId[id],
        status: 'editing',
      }},
      allIds: [...timers.allIds],
    });
    setEditingTimer({
      isEditing: true,
      name: timers.byId[id].name,
      hour: hms.hour,
      minute: hms.minute,
      second: hms.second,
    });
  }

  const onDelete = (id) => {
    const newById = { ...timers.byId };
    delete newById[id];

    const newAllIds = timers.allIds.filter(activeId => activeId !== id);

    setTimers({
      byId: {...newById},
      allIds: [...newAllIds],
    });
    setEditingTimer({
      isEditing: false,
      name: '',
      hour: 0,
      minute: 0,
      second: 0,
    });
  }

  return (
    <div className='timers-container'>
      {timers.allIds.map((id) => {
        return <Timer
          key={id}
          id={id}
          timer={timers.byId[id]}
          editingTimer={editingTimer}
          setEditingTimer={setEditingTimer}
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      })}
      <button
        className='timer-button-add'
        onClick={onCreate}
        disabled={editingTimer.isEditing}
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

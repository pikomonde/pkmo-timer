import { expect, test } from 'vitest';
import * as TimerUtils from './TimerUtils';

test('conversion from seconds to HMS using secondsToHMS', () => {
  // Positive test
  expect(TimerUtils.secondsToHMS(3661)).toEqual({ hour: 1, minute: 1, second: 1 });
  
  // Case 0
  expect(TimerUtils.secondsToHMS(0)).toEqual({ hour: 0, minute: 0, second: 0 });
  
  // Case minuteonly
  expect(TimerUtils.secondsToHMS(600)).toEqual({ hour: 0, minute: 10, second: 0 });
});

test('create new timer using createTimer', () => {
  // Positive test
  const timer1 = TimerUtils.createTimer();
  expect(timer1).toEqual({
    id: timer1.id,
    name: '',
    totalSeconds: 0,
    status: "editing",
    notifyAt: 0,
    runMiliSecondsLeft: 0,
   });
  
  // case override id
  const timer2 = TimerUtils.createTimer({ id: 'id-2' });
  expect(timer2).toEqual({
    id: 'id-2',
    name: '',
    totalSeconds: 0,
    status: "editing",
    notifyAt: 0,
    runMiliSecondsLeft: 0,
   });
  
  // case override multiple properties
  const timer3 = TimerUtils.createTimer({ name: 'name-3', totalSeconds: 1028 });
  expect(timer3).toEqual({
    id: timer3.id,
    name: 'name-3',
    totalSeconds: 1028,
    status: "editing",
    notifyAt: 0,
    runMiliSecondsLeft: 0,
   });
});

test('create new editing timer using createEditingTimer', () => {
  // Positive test
  expect(TimerUtils.createEditingTimer()).toEqual({
    isEditing: false,
    name: '',
    hour: 0,
    minute: 0,
    second: 0,
    errorMsg: null,
   });
  
  // case override isEditing
  expect(TimerUtils.createEditingTimer({
    isEditing: true,
  })).toEqual({
    isEditing: true,
    name: '',
    hour: 0,
    minute: 0,
    second: 0,
    errorMsg: null,
   });
  
  // case override multiple properties
  expect(TimerUtils.createEditingTimer({
    isEditing: true,
    name: 'untitled timer',
  })).toEqual({
    isEditing: true,
    name: 'untitled timer',
    hour: 0,
    minute: 0,
    second: 0,
    errorMsg: null,
   });
});

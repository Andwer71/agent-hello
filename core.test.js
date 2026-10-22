const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { addTask, toggleTask, deleteTask } = require('./core.js');

describe('att göra-listans kärnfunktioner', () => {
  it('lägger till uppgifter med trimmad text och som ej klara', () => {
    assert.deepEqual(addTask([], '  Köp kaffe  ', 'id-1'), [
      { id: 'id-1', text: 'Köp kaffe', completed: false }
    ]);
  });

  it('avvisar tomma uppgifter och bara blanksteg', () => {
    const tasks = [{ id: 'id-1', text: 'Läs', completed: false }];
    assert.equal(addTask(tasks, '', 'id-2'), tasks);
    assert.equal(addTask(tasks, '   \t ', 'id-2'), tasks);
  });

  it('markerar en uppgift klar och kan markera den som ogjord igen', () => {
    const tasks = [{ id: 'id-1', text: 'Läs', completed: false }];
    const completed = toggleTask(tasks, 'id-1');
    assert.equal(completed[0].completed, true);
    assert.equal(toggleTask(completed, 'id-1')[0].completed, false);
  });

  it('lämnar listan oförändrad om en okänd uppgift växlas', () => {
    const tasks = [{ id: 'id-1', text: 'Läs', completed: false }];
    assert.deepEqual(toggleTask(tasks, 'saknas'), tasks);
  });

  it('tar bort endast uppgiften med matchande id', () => {
    const tasks = [
      { id: 'id-1', text: 'Läs', completed: false },
      { id: 'id-2', text: 'Skriv', completed: true }
    ];
    assert.deepEqual(deleteTask(tasks, 'id-1'), [tasks[1]]);
  });

  it('ändrar inte ursprungslistan när listan uppdateras', () => {
    const tasks = [{ id: 'id-1', text: 'Läs', completed: false }];
    addTask(tasks, 'Skriv', 'id-2');
    toggleTask(tasks, 'id-1');
    deleteTask(tasks, 'id-1');
    assert.deepEqual(tasks, [{ id: 'id-1', text: 'Läs', completed: false }]);
  });
});

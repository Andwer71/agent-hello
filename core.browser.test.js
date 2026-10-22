(() => {
  const { addTask, toggleTask, deleteTask, filterTasks, countRemaining } = TodoCore;
  const results = document.querySelector('#test-results');
  const checks = [];

  function test(name, run) {
    try {
      run();
      checks.push({ name, passed: true });
    } catch (error) {
      checks.push({ name: `${name}: ${error.message}`, passed: false });
    }
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  test('Lägger till uppgift med trimmad text', () => {
    const tasks = addTask([], '  Köp kaffe  ', 'id-1');
    assert(tasks.length === 1 && tasks[0].text === 'Köp kaffe' && !tasks[0].completed, 'uppgiften blev fel');
  });

  test('Avvisar tom text och blanksteg', () => {
    const tasks = [{ id: 'id-1', text: 'Läs', completed: false }];
    assert(addTask(tasks, '', 'id-2') === tasks, 'tom text lades till');
    assert(addTask(tasks, ' \t ', 'id-2') === tasks, 'blanksteg lades till');
  });

  test('Växlar status mellan klar och ogjord', () => {
    const tasks = [{ id: 'id-1', text: 'Läs', completed: false }];
    const done = toggleTask(tasks, 'id-1');
    assert(done[0].completed, 'uppgiften blev inte klar');
    assert(!toggleTask(done, 'id-1')[0].completed, 'uppgiften blev inte ogjord igen');
  });

  test('Lämnar okända uppgifter oförändrade', () => {
    const tasks = [{ id: 'id-1', text: 'Läs', completed: false }];
    assert(toggleTask(tasks, 'saknas')[0].completed === false, 'okänd uppgift ändrades');
    assert(deleteTask(tasks, 'saknas').length === 1, 'okänd uppgift togs bort');
  });

  test('Tar bort endast matchande uppgift', () => {
    const tasks = [
      { id: 'id-1', text: 'Läs', completed: false },
      { id: 'id-2', text: 'Skriv', completed: true }
    ];
    const remaining = deleteTask(tasks, 'id-1');
    assert(remaining.length === 1 && remaining[0].id === 'id-2', 'fel uppgift togs bort');
  });

  test('Filtrerar fram aktiva uppgifter', () => {
    const tasks = [
      { id: 'id-1', text: 'Läs', completed: false },
      { id: 'id-2', text: 'Skriv', completed: true }
    ];
    const active = filterTasks(tasks, 'active');
    assert(active.length === 1 && active[0].id === 'id-1', 'aktivt filter visade fel uppgifter');
  });

  test('Filtrerar fram klara uppgifter', () => {
    const tasks = [
      { id: 'id-1', text: 'Läs', completed: false },
      { id: 'id-2', text: 'Skriv', completed: true }
    ];
    const completed = filterTasks(tasks, 'completed');
    assert(completed.length === 1 && completed[0].id === 'id-2', 'klart filter visade fel uppgifter');
  });

  test('Visar alla uppgifter och lämnar tomma filterresultat tomma', () => {
    const tasks = [{ id: 'id-1', text: 'Läs', completed: false }];
    assert(filterTasks(tasks, 'all') === tasks, 'alla-filtret ändrade listan');
    assert(filterTasks(tasks, 'completed').length === 0, 'tomt filterresultat innehöll uppgifter');
  });

  test('Räknar återstående uppgifter', () => {
    const tasks = [
      { id: 'id-1', text: 'Läs', completed: false },
      { id: 'id-2', text: 'Skriv', completed: true },
      { id: 'id-3', text: 'Promenera', completed: false }
    ];
    assert(countRemaining(tasks) === 2, 'antalet återstående uppgifter är fel');
    assert(countRemaining([]) === 0, 'tom lista ska ha noll återstående uppgifter');
  });

  test('Ändrar inte ursprungslistan', () => {
    const tasks = [{ id: 'id-1', text: 'Läs', completed: false }];
    addTask(tasks, 'Skriv', 'id-2');
    toggleTask(tasks, 'id-1');
    deleteTask(tasks, 'id-1');
    assert(tasks.length === 1 && !tasks[0].completed, 'ursprungslistan ändrades');
  });

  for (const check of checks) {
    const item = document.createElement('li');
    item.textContent = `${check.passed ? '✓' : '✗'} ${check.name}`;
    results.append(item);
  }

  const passed = checks.filter(check => check.passed).length;
  const summary = document.querySelector('#result');
  summary.textContent = `${passed} av ${checks.length} tester godkända.`;
  if (passed !== checks.length) summary.classList.add('fail');
})();

(() => {
  const STORAGE_KEY = 'lugn-lista-uppgifter';
  const form = document.querySelector('#todo-form');
  const input = document.querySelector('#todo-input');
  const list = document.querySelector('#todo-list');
  const emptyState = document.querySelector('#empty-state');
  const taskCount = document.querySelector('#task-count');
  const remainingCount = document.querySelector('#remaining-count');
  const filteredEmptyState = document.querySelector('#filtered-empty-state');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const formError = document.querySelector('#form-error');
  const storageError = document.querySelector('#storage-error');

  let tasks = [];
  let currentFilter = 'all';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.some(task =>
        !task || typeof task.id !== 'string' || typeof task.text !== 'string' || typeof task.completed !== 'boolean'
      )) throw new Error('Ogiltiga sparade uppgifter.');
      tasks = parsed;
    }
  } catch (error) {
    storageError.textContent = 'Kunde inte läsa sparade uppgifter. Kontrollera webbläsarens lagring.';
    storageError.hidden = false;
    console.error('Kunde inte läsa att göra-listan från webbläsarens lagring.', error);
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      storageError.hidden = true;
    } catch (error) {
      storageError.textContent = 'Uppgifterna kunde inte sparas på den här enheten.';
      storageError.hidden = false;
      console.error('Kunde inte spara att göra-listan i webbläsarens lagring.', error);
    }
  }

  function render() {
    const visibleTasks = TodoCore.filterTasks(tasks, currentFilter);
    list.replaceChildren();
    for (const task of visibleTasks) {
      const item = document.createElement('li');
      item.className = `todo-item${task.completed ? ' is-complete' : ''}`;

      const completeButton = document.createElement('button');
      completeButton.className = 'complete-button';
      completeButton.type = 'button';
      completeButton.setAttribute('aria-label', task.completed ? `Markera ${task.text} som ogjord` : `Markera ${task.text} som klar`);
      completeButton.setAttribute('aria-pressed', String(task.completed));
      completeButton.textContent = task.completed ? '✓' : '';
      completeButton.addEventListener('click', () => {
        tasks = TodoCore.toggleTask(tasks, task.id);
        saveTasks();
        render();
      });

      const text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = task.text;

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.type = 'button';
      deleteButton.setAttribute('aria-label', `Ta bort ${task.text}`);
      deleteButton.textContent = '×';
      deleteButton.addEventListener('click', () => {
        tasks = TodoCore.deleteTask(tasks, task.id);
        saveTasks();
        render();
      });

      item.append(completeButton, text, deleteButton);
      list.append(item);
    }

    const count = tasks.length;
    const visibleCount = visibleTasks.length;
    const remaining = TodoCore.countRemaining(tasks);
    taskCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'uppgift' : 'uppgifter'}`;
    remainingCount.textContent = `${remaining} ${remaining === 1 ? 'uppgift' : 'uppgifter'} kvar`;
    emptyState.hidden = count > 0;
    filteredEmptyState.hidden = count === 0 || visibleCount > 0;
    for (const button of filterButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === currentFilter));
    }
  }

  for (const button of filterButtons) {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter;
      render();
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      formError.textContent = 'Skriv en uppgift innan du lägger till den.';
      formError.hidden = false;
      input.focus();
      return;
    }
    formError.hidden = true;
    tasks = TodoCore.addTask(tasks, value, crypto.randomUUID());
    saveTasks();
    render();
    form.reset();
    input.focus();
  });

  input.addEventListener('input', () => {
    if (input.value.trim()) formError.hidden = true;
  });

  render();
})();

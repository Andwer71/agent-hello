(function (root, factory) {
  const core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.TodoCore = core;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function addTask(tasks, text, id) {
    const title = text.trim();
    if (!title) return tasks;
    return [...tasks, { id, text: title, completed: false }];
  }

  function toggleTask(tasks, id) {
    return tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  }

  function deleteTask(tasks, id) {
    return tasks.filter(task => task.id !== id);
  }

  function filterTasks(tasks, filter) {
    if (filter === 'active') return tasks.filter(task => !task.completed);
    if (filter === 'completed') return tasks.filter(task => task.completed);
    return tasks;
  }

  function countRemaining(tasks) {
    return tasks.filter(task => !task.completed).length;
  }

  return { addTask, toggleTask, deleteTask, filterTasks, countRemaining };
});

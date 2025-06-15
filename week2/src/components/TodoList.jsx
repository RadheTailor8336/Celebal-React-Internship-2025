import { useState, useEffect } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, text: 'Learn React', completed: false, createdAt: new Date().toISOString() },
      { id: 2, text: 'Build Todo App', completed: false, createdAt: new Date().toISOString() },
      { id: 3, text: 'Style Components', completed: false, createdAt: new Date().toISOString() }
    ];
  });
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
    ]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  const getFilteredTasks = () => {
    let filteredTasks = tasks;
    switch (filter) {
      case 'active':
        filteredTasks = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filteredTasks = tasks.filter(task => task.completed);
        break;
      default:
        break;
    }
    return sortTasks(filteredTasks);
  };

  return (
    <div className="todo-list">
      <h2>To-Do List</h2>
      
      <form onSubmit={addTask} className="todo-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          maxLength={100}
          className="todo-input"
        />
        <button type="submit" className="todo-button">Add Task</button>
      </form>

      <div className="todo-filters">
        <button 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed
        </button>
      </div>

      <ul className="todo-items">
        {getFilteredTasks().map(task => (
          <li key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span className="task-text">{task.text}</span>
            <button 
              onClick={() => deleteTask(task.id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;

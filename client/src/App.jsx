import React, { useState, useEffect } from 'react';
import { CreateTodo } from './components/CreateTodo';
import { Todos } from './components/Todos';

const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/todos")
      .then(async (res) => {
        const json = await res.json();
        setTodos(json.todos);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <CreateTodo />
      <Todos todos={todos} />
    </div>
  );
};

export default App;

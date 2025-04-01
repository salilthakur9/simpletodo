export function Todos({ todos }) {
    return (
        <div>
            {Array.isArray(todos) ? todos.map((todo) => (
                <div key={todo._id}>
                    <h1>{todo.title}</h1>
                    <h2>{todo.description}</h2>
                    <button>{todo.completed ? "Completed" : "Mark as complete"}</button>
                </div>
            )) : <p>No todos available</p>}
        </div>
    );
}

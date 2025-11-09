import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Backend API base URL
const API_URL =
  "https://todo-backend-mlwe2d57yhf942m9j8jqj8e8-3000.thekalkicinematicuniverse.com/todos";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  category: string;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/all`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load todos 😢");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ✅ Add todo
  const addTodo = async () => {
    if (!title.trim()) return toast.warn("Please enter a title");
    try {
      const res = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      toast.success("Todo added!");
      setTitle("");
      fetchTodos();
    } catch {
      toast.error("Error adding todo");
    }
  };

  // ✅ Edit todo
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
  };

  const updateTodo = async () => {
    if (editingId === null) return;
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Todo updated!");
      setEditingId(null);
      setTitle("");
      fetchTodos();
    } catch {
      toast.error("Update failed");
    }
  };

  // ✅ Delete todo
  const deleteTodo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      toast.info("Todo deleted");
      fetchTodos();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ✅ Toggle completion
  const toggleTodo = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
      fetchTodos();
    } catch {
      toast.error("Failed to toggle");
    }
  };

  // ✅ Sort todos (pending first)
  const sortedTodos = [...todos].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900 flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-700">📝 Todo List</h1>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-[480px]">
        <input
          type="text"
          placeholder="Enter todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {editingId ? (
          <button
            onClick={updateTodo}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            Update
          </button>
        ) : (
          <button
            onClick={addTodo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            Add
          </button>
        )}
      </div>

      {/* Todos Section */}
      <div className="w-full sm:w-[500px] bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        {loading ? (
          <p className="text-gray-400 text-center">Loading todos...</p>
        ) : sortedTodos.length === 0 ? (
          <p className="text-gray-400 text-center">No todos yet 😴</p>
        ) : (
          <ul className="space-y-3">
            {sortedTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-all"
              >
                <div
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-1 cursor-pointer ${todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                    }`}
                >
                  {todo.title}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(todo)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded-md shadow-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md shadow-sm"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        Built with ❤️ React + Tailwind + Bun + Hono
      </footer>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

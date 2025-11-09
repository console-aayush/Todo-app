import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Backend URL
const API_URL = "https://todo-backend-mlwe2d57yhf942m9j8jqj8e8-3000.thekalkicinematicuniverse.com/todos";

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

  // ✅ Fetch all todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/all`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load todos 😢");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ✅ Add new todo
  const addTodo = async () => {
    if (!title.trim()) {
      toast.warn("Please enter a title");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add todo");
      toast.success("Todo added!");
      setTitle("");
      fetchTodos();
    } catch (err) {
      toast.error("Error adding todo");
    }
  };

  // ✅ Start editing
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
  };

  // ✅ Update todo
  const updateTodo = async () => {
    if (editingId === null) return;
    if (!title.trim()) {
      toast.warn("Please enter a title");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      toast.success("Todo updated!");
      setEditingId(null);
      setTitle("");
      fetchTodos();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // ✅ Delete todo
  const deleteTodo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.info("Todo deleted");
      fetchTodos();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ✅ Toggle complete
  const toggleTodo = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to toggle");
      fetchTodos();
    } catch {
      toast.error("Failed to toggle");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center pt-12 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-400 tracking-wide drop-shadow-md">
        📝 My Todo App
      </h1>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-[480px]">
        <input
          type="text"
          placeholder="Enter your todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {editingId ? (
          <button
            onClick={updateTodo}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg shadow-md transition"
          >
            Update
          </button>
        ) : (
          <button
            onClick={addTodo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
          >
            Add
          </button>
        )}
      </div>

      {/* Todos List */}
      <div className="w-full sm:w-[500px] bg-gray-800 rounded-2xl shadow-lg p-6">
        {loading ? (
          <p className="text-gray-400 text-center">Loading todos...</p>
        ) : todos.length === 0 ? (
          <p className="text-gray-400 text-center">No todos yet 😴</p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center bg-gray-900 p-3 rounded-xl hover:scale-[1.02] transition-all duration-150"
              >
                <div
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-1 cursor-pointer ${todo.completed
                      ? "line-through text-gray-500"
                      : "text-white"
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

      <footer className="mt-8 text-gray-500 text-sm">
        Built with ❤️ using React + Tailwind + Bun + Hono
      </footer>

      <ToastContainer position="bottom-right" autoClose={2000} theme="dark" />
    </div>
  );
}

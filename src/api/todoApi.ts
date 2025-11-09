// ✅ Define API base URL
const API_URL = "https://todo-backend-mlwe2d57yhf942m9j8jqj8e8-3000.thekalkicinematicuniverse.com";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// ✅ Fetch all todos
export const fetchAllTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${API_URL}/todos`);
  if (!res.ok) throw new Error("Failed to fetch todos");

  const data = await res.json();
  console.log("✅ Fetched Todos from backend:", data);
  return data;
};

// ✅ Add a new todo
export const addTodo = async (todo: { title: string; completed?: boolean; category?: string }): Promise<Todo> => {
  const res = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });

  if (!res.ok) throw new Error("Failed to create todo");

  const data = await res.json();
  return data.todo;
};

// ✅ Update todo
export const updateTodo = async (id: number, todo: { title: string; completed: boolean; category?: string }): Promise<Todo> => {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });

  if (!res.ok) throw new Error("Failed to update todo");
  return res.json();
};

// ✅ Delete todo
export const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete todo");
};

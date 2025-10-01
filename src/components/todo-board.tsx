import { AgentState, TodoItem, TodoStatus } from "@/lib/types";
import { generateRandomId } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

interface TodoCardProps {
  todo: TodoItem;
  isDragging: boolean;
  onUpdate: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function TodoCard({ 
  todo, 
  isDragging,
  onUpdate,
  onDelete,
  onUpdateStatus,
  onDragStart,
  onDragEnd
}: TodoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || isEditingTitle || isEditingDescription) return;

    return draggable({
      element,
      getInitialData: () => ({ todoId: todo.id }),
      onDragStart: onDragStart,
      onDrop: onDragEnd,
    });
  }, [todo.id, isEditingTitle, isEditingDescription, onDragStart, onDragEnd]);

  const handleTitleBlur = () => {
    const newTitle = titleRef.current?.textContent?.trim() || todo.title;
    if (newTitle !== todo.title) {
      onUpdate(todo.id, newTitle, todo.description || "");
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionBlur = () => {
    const newDescription = descriptionRef.current?.textContent?.trim() || "";
    if (newDescription !== todo.description) {
      onUpdate(todo.id, todo.title, newDescription);
    }
    setIsEditingDescription(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, isTitle: boolean) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (isTitle && titleRef.current) {
        titleRef.current.textContent = todo.title;
        titleRef.current.blur();
      } else if (descriptionRef.current) {
        descriptionRef.current.textContent = todo.description || "";
        descriptionRef.current.blur();
      }
    }
  };

  return (
    <div
      ref={cardRef}
      style={{
        boxShadow: isDragging ? 'var(--shadow-lg)' : 'var(--shadow)',
      }}
      className={`bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] relative group hover:border-[var(--text-muted)] transition-all ${
        !isEditingTitle && !isEditingDescription ? "cursor-move" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus(todo.id, todo.status === "done" ? "todo" : "done");
          }}
          className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 transition-all ${
            todo.status === "done"
              ? "bg-[var(--foreground)] border-[var(--foreground)]"
              : "bg-[var(--card-bg)] border-[var(--text-muted)] hover:border-[var(--foreground)]"
          }`}
          title={todo.status === "done" ? "Mark incomplete" : "Mark complete"}
        >
          {todo.status === "done" && (
            <svg
              className="w-full h-full text-[var(--background)]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div
            ref={titleRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => setIsEditingTitle(true)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => handleKeyDown(e, true)}
            className={`font-medium text-[var(--foreground)] outline-none rounded cursor-text ${
              todo.status === "done" ? "line-through text-[var(--text-secondary)]" : ""
            }`}
            title={todo.title}
          >
            {todo.title}
          </div>
          <div
            ref={descriptionRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => setIsEditingDescription(true)}
            onBlur={handleDescriptionBlur}
            onKeyDown={(e) => handleKeyDown(e, false)}
            className={`text-sm text-[var(--text-secondary)] line-clamp-2 outline-none rounded cursor-text ${
              todo.status === "done" ? "line-through text-[var(--text-muted)]" : ""
            } ${!todo.description ? "text-[var(--text-muted)] italic" : ""}`}
            title={todo.description || "Click to add description"}
          >
            {todo.description || "Add description..."}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo.id);
            }}
            className="text-[var(--text-muted)] hover:text-red-600 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

interface ColumnDropZoneProps {
  status: TodoStatus;
  children: React.ReactNode;
  onDrop: (status: TodoStatus) => void;
}

function ColumnDropZone({ status, children, onDrop }: ColumnDropZoneProps) {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const element = dropZoneRef.current;
    if (!element) return;

    return dropTargetForElements({
      element,
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => {
        setIsOver(false);
        onDrop(status);
      },
    });
  }, [status, onDrop]);

  return (
    <div
      ref={dropZoneRef}
      className={`flex flex-col gap-3 md:flex-1 p-4 rounded-lg transition-colors md:overflow-y-auto md:min-h-0 ${
        isOver ? "bg-[var(--card-hover)]" : ""
      }`}
    >
      {children}
    </div>
  );
}

export interface TodoBoardProps {
  state: AgentState;
  setState: (state: AgentState) => void;
  theme?: string;
  setTheme?: (theme: string) => void;
}

export function TodoBoard({ state, setState, theme, setTheme }: TodoBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const columns: { title: string; status: TodoStatus }[] = [
    { title: "Todo", status: "todo" },
    { title: "In Progress", status: "in-progress" },
    { title: "Done", status: "done" },
  ];

  const updateTodo = (id: string, title: string, description: string) => {
    const updatedTodos = state.todos.map((todo) =>
      todo.id === id
        ? { ...todo, title, description: description || undefined }
        : todo
    );
    setState({ todos: updatedTodos });
  };

  const updateTodoStatus = (id: string, newStatus: TodoStatus) => {
    const updatedTodos = state.todos.map((todo) =>
      todo.id === id ? { ...todo, status: newStatus } : todo
    );
    setState({ todos: updatedTodos });
  };

  const deleteTodo = (id: string) => {
    setState({ todos: state.todos.filter((todo) => todo.id !== id) });
  };

  const handleDrop = (newStatus: TodoStatus) => {
    if (draggedId) {
      updateTodoStatus(draggedId, newStatus);
    }
  };

  const addNewTodo = (status: TodoStatus) => {
    const newTodo: TodoItem = {
      id: generateRandomId(),
      title: "New task",
      description: undefined,
      status: status,
    };
    setState({ todos: [...state.todos, newTodo] });
  };

  return (
    <div className="w-full h-full flex flex-col px-6 py-12 md:px-12 md:py-16 max-w-7xl mx-auto">
      <div className="mb-12 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-3">
            Tasks
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Manage your work with the help of your AI assistant
          </p>
        </div>
        
        {/* Theme Toggle Button */}
        {setTheme && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ boxShadow: 'var(--shadow)' }}
            className="flex-shrink-0 p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--text-muted)] transition-all"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 flex-1 md:min-h-0 overflow-y-auto md:overflow-visible">
        {columns.map((column) => (
          <div key={column.status} className="flex flex-col md:min-h-0">
            <div className="mb-6">
              <h2 className="text-xl font-serif text-[var(--foreground)] mb-4">
                {column.title}
              </h2>
              
              {/* Add new task button */}
              <button
                onClick={() => addNewTodo(column.status)}
                className="w-full py-3 text-[var(--text-secondary)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--text-secondary)] hover:bg-[var(--card-bg)] bg-[var(--background)] rounded-lg transition-all text-sm flex items-center justify-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>

            <ColumnDropZone status={column.status} onDrop={handleDrop}>
              {state.todos
                ?.filter((todo) => todo.status === column.status)
                .map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    isDragging={draggedId === todo.id}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                    onUpdateStatus={updateTodoStatus}
                    onDragStart={() => setDraggedId(todo.id)}
                    onDragEnd={() => setDraggedId(null)}
                  />
                ))}

              {state.todos?.filter((todo) => todo.status === column.status)
                .length === 0 && (
                <p className="text-center text-[var(--text-muted)] italic text-sm mt-8">
                  No tasks yet
                </p>
              )}
            </ColumnDropZone>
          </div>
        ))}
      </div>
    </div>
  );
}
import { AgentState } from "@/lib/types";

interface FullSendCardProps {
  themeColor: string;
  status: string;
  respond?: (response: string) => void;
  state: AgentState;
  setState: (state: AgentState) => void;
}

export function FullSendCard({ themeColor, status, respond, state, setState }: FullSendCardProps) {
  const handleConfirm = () => {
    setState({
      todos: state.todos.map(todo => ({ ...todo, status: "done" as const }))
    });
    respond?.("yes");
  };

  const isComplete = status === "complete";

  if (isComplete) {
    return (
      <div 
        style={{ boxShadow: 'var(--shadow)' }}
        className="bg-[var(--card-bg)] rounded-lg p-5 mt-4 mb-4 max-w-md w-full border border-[var(--border)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">All todos marked as complete</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ boxShadow: 'var(--shadow)' }}
      className="bg-[var(--card-bg)] rounded-lg p-5 mt-4 mb-4 w-full max-w-md border border-[var(--border)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--background)] flex items-center justify-center mt-0.5 border border-[var(--border)]">
          <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 space-y-4">
          <p className="text-[var(--foreground)] text-sm leading-relaxed">
            Would you like to mark all todos as complete?
          </p>
          
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => respond?.("no")}
              className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] border border-[var(--border)] rounded-lg text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-[var(--foreground)] hover:opacity-90 text-[var(--background)] rounded-lg text-sm font-medium transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
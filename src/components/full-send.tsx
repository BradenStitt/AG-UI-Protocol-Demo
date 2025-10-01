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
      <div className="bg-white rounded-lg p-5 mt-4 mb-4 max-w-md w-full border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-700 text-sm">All todos marked as complete</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-5 mt-4 mb-4 w-full max-w-md border border-gray-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 space-y-4">
          <p className="text-gray-900 text-sm leading-relaxed">
            Would you like to mark all todos as complete?
          </p>
          
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => respond?.("no")}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
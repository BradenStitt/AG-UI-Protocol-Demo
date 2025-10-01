import { CatchAllActionRenderProps } from "@copilotkit/react-core";
import { useState } from "react";

export type BackendToolsProps = CatchAllActionRenderProps & {
  themeColor: string;
}

export function BackendToolsCard({ name, args, status, result, themeColor }: BackendToolsProps) {
  const [showArgs, setShowArgs] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const getStatusColor = () => {
    switch (status) {
      case "executing":
      case "inProgress":
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "complete":
        return "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      default:
        return "bg-[var(--background)] text-[var(--text-secondary)] border-[var(--border)]";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "executing":
      case "inProgress":
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case "complete":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      style={{ boxShadow: 'var(--shadow)' }}
      className="bg-[var(--card-bg)] rounded-lg p-5 mt-4 mb-4 max-w-md w-full border border-[var(--border)]"
    >
      {/* Header with tool name and status */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[var(--foreground)] font-medium text-sm">🔧 {name}</h3>
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
          {getStatusIcon()}
          {status}
        </span>
      </div>

      {/* Arguments */}
      {args && Object.keys(args).length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowArgs(!showArgs)}
            className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-medium mb-1.5 hover:text-[var(--foreground)] transition-colors"
          >
            <svg 
              className={`w-3 h-3 transition-transform ${showArgs ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Arguments
          </button>
          {showArgs && (
            <div className="bg-[var(--background)] rounded p-3 space-y-1 border border-[var(--border)]">
              {Object.entries(args).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <span className="text-[var(--text-muted)] text-xs font-medium">{key}:</span>
                  <span className="text-[var(--text-secondary)] text-xs font-mono">{JSON.stringify(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          <button
            onClick={() => setShowResult(!showResult)}
            className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-medium mb-1.5 hover:text-[var(--foreground)] transition-colors"
          >
            <svg 
              className={`w-3 h-3 transition-transform ${showResult ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Result
          </button>
          {showResult && (
            <div className="bg-[var(--background)] rounded p-3 border border-[var(--border)]">
              <pre className="text-[var(--text-secondary)] text-xs font-mono whitespace-pre-wrap break-words">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
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
        return "text-[var(--text-secondary)]";
      case "complete":
        return "text-[var(--accent)]";
      default:
        return "text-[var(--text-muted)]";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "executing":
      case "inProgress":
        return (
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case "complete":
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-[var(--card-bg)] rounded-xl p-4 my-3 border border-[var(--border)] shadow-sm hover:shadow-md transition-all"
    >
      {/* Header with tool name and status */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
        <h3 className="text-[var(--foreground)] font-serif font-semibold text-base tracking-tight">
          🔧 {name}
        </h3>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${getStatusColor()}`}>
          {getStatusIcon()}
          {status}
        </span>
      </div>

      {/* Arguments */}
      {args && Object.keys(args).length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowArgs(!showArgs)}
            className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium mb-2 hover:text-[var(--foreground)] transition-colors w-full"
          >
            <svg 
              className={`w-3.5 h-3.5 transition-transform ${showArgs ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-serif">Arguments</span>
          </button>
          {showArgs && (
            <div className="bg-[var(--background)] rounded-lg p-3 space-y-2 ml-5">
              {Object.entries(args).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-start">
                  <span className="text-[var(--text-muted)] text-xs font-medium min-w-fit">{key}:</span>
                  <span className="text-[var(--foreground)] text-xs font-mono break-all">{JSON.stringify(value)}</span>
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
            className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium mb-2 hover:text-[var(--foreground)] transition-colors w-full"
          >
            <svg 
              className={`w-3.5 h-3.5 transition-transform ${showResult ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-serif">Result</span>
          </button>
          {showResult && (
            <div className="bg-[var(--background)] rounded-lg p-3 ml-5">
              <pre className="text-[var(--foreground)] text-xs font-mono whitespace-pre-wrap break-words">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
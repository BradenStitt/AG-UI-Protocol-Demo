"use client";

import { TodoBoard } from "@/components/todo-board";
import { FullSendCard } from "@/components/full-send";
import { AgentState } from "@/lib/types";
import { CatchAllActionRenderProps, useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState } from "react";
import { BackendToolsCard } from "@/components/backend-tools";
import { initialState } from "@/lib/defaults";
import { useTheme } from "next-themes";

export default function Home() {
  const [themeColor, setThemeColor] = useState("#FF7F50");
  const { theme, setTheme } = useTheme();

  /*
    Shared State with Agent
  */
  const { state, setState } = useCoAgent<AgentState>({
    name: "my_agent", // Must match the agent name in route.ts
    initialState
  });

  /*
    Frontend Actions
  */
  
  // Set theme color
  useCopilotAction({
    name: "setThemeColor",
    description: "Change the accent color theme of the application.",
    parameters: [{ 
      name: "themeColor", 
      description: "The theme color to set (hex color code, e.g., #FF7F50).", 
      required: true 
    }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

  // Toggle dark/light mode
  useCopilotAction({
    name: "toggleThemeMode",
    description: "Toggle between dark mode and light mode.",
    parameters: [{ 
      name: "mode", 
      description: "The theme mode: 'dark' or 'light' or 'system'.", 
      required: true 
    }],
    handler({ mode }) {
      setTheme(mode);
    },
  });

  // Show celebration confetti
  useCopilotAction({
    name: "celebrate",
    description: "Show a confetti celebration animation! Use when user completes tasks or reaches milestones.",
    handler() {
      // Create confetti effect
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Create colorful confetti particles using DOM manipulation
        for (let i = 0; i < particleCount; i++) {
          const confetti = document.createElement('div');
          confetti.style.position = 'fixed';
          confetti.style.width = '10px';
          confetti.style.height = '10px';
          confetti.style.backgroundColor = `hsl(${randomInRange(0, 360)}, 100%, 50%)`;
          confetti.style.left = randomInRange(0, window.innerWidth) + 'px';
          confetti.style.top = '-10px';
          confetti.style.opacity = '1';
          confetti.style.zIndex = '9999';
          confetti.style.borderRadius = '50%';
          confetti.style.pointerEvents = 'none';
          document.body.appendChild(confetti);

          const xVelocity = randomInRange(-5, 5);
          const yVelocity = randomInRange(2, 8);
          let yPos = -10;
          let xPos = parseFloat(confetti.style.left);

          const fall = setInterval(() => {
            yPos += yVelocity;
            xPos += xVelocity;
            confetti.style.top = yPos + 'px';
            confetti.style.left = xPos + 'px';
            confetti.style.opacity = String(Math.max(0, 1 - yPos / window.innerHeight));

            if (yPos > window.innerHeight) {
              clearInterval(fall);
              confetti.remove();
            }
          }, 20);
        }
      }, 250);
    },
  });

  // Export todos
  useCopilotAction({
    name: "exportTodos",
    description: "Export todos to a downloadable JSON file.",
    parameters: [{ 
      name: "filename", 
      description: "The filename for the export (without extension).", 
      required: false 
    }],
    handler({ filename = "todos" }) {
      const dataStr = JSON.stringify(state.todos, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
  }, [state]);

  // Show todo statistics
  useCopilotAction({
    name: "showTodoStats",
    description: "Display statistics about the current todos.",
    render: () => {
      const total = state.todos.length;
      const todoCount = state.todos.filter(t => t.status === 'todo').length;
      const inProgressCount = state.todos.filter(t => t.status === 'in-progress').length;
      const doneCount = state.todos.filter(t => t.status === 'done').length;
      const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

      return (
        <div className="bg-[var(--card-bg)] rounded-xl p-5 my-3 border border-[var(--border)] shadow-lg">
          <h3 className="text-[var(--foreground)] font-serif font-semibold text-lg mb-4 flex items-center gap-2">
            📊 Todo Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)] font-medium">Total Tasks:</span>
              <span className="text-[var(--foreground)] font-bold text-xl">{total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)] font-medium">📝 To Do:</span>
              <span className="text-blue-500 font-semibold text-lg">{todoCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)] font-medium">🚧 In Progress:</span>
              <span className="text-yellow-500 font-semibold text-lg">{inProgressCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)] font-medium">✅ Done:</span>
              <span className="text-green-500 font-semibold text-lg">{doneCount}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-[var(--border)]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--text-secondary)] font-medium">Completion Rate:</span>
                <span className="text-[var(--accent)] font-bold text-xl">{completionRate}%</span>
              </div>
              <div className="w-full bg-[var(--background)] rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${completionRate}%`,
                    background: `linear-gradient(90deg, ${themeColor}, ${themeColor}dd)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    },
  }, [state, themeColor]);

  // Show motivational message
  useCopilotAction({
    name: "showMotivation",
    description: "Display a motivational message to encourage the user.",
    parameters: [{ 
      name: "message", 
      description: "The motivational message to display.", 
      required: true 
    }],
    render: (props) => {
      const message = (props.args as { message: string }).message;
      return (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-5 my-3 border border-purple-500/30 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💪</span>
            <div>
              <h3 className="text-[var(--foreground)] font-serif font-semibold text-lg mb-2">
                Keep Going!
              </h3>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed italic">
                "{message}"
              </p>
            </div>
          </div>
        </div>
      );
    },
  });

  // Highlight a specific todo
  useCopilotAction({
    name: "highlightTodo",
    description: "Highlight and focus on a specific todo item by scrolling to it.",
    parameters: [{ 
      name: "todoId", 
      description: "The ID of the todo to highlight.", 
      required: true 
    }],
    handler({ todoId }) {
      const todo = state.todos.find(t => t.id === todoId);
      if (todo) {
        // Try to find and scroll to the todo element
        const element = document.querySelector(`[data-todo-id="${todoId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-yellow-400', 'ring-offset-2');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-yellow-400', 'ring-offset-2');
          }, 2000);
        }
      }
    },
  }, [state]);

  /*
    Human in the Loop
  */
  useCopilotAction({
    name: "full_send",
    description: "Mark all todos as complete. Requires user confirmation.",
    renderAndWaitForResponse: (props) => (
      <FullSendCard themeColor={themeColor} {...props} state={state} setState={setState} />
    ),
  }, [themeColor, state, setState]);

  /*
    🪁 Backend Tools
  */
  useCopilotAction({
    name: "*",
    render: (props: CatchAllActionRenderProps) => (
      <BackendToolsCard themeColor={themeColor} {...props} />
    ),
  }, [themeColor]);

  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      {/* 
        Agent Chat UI
      */}
      <CopilotSidebar
        clickOutsideToClose={false}
        disableSystemMessage={true}
        labels={{
          title: "Todo Assistant",
          initial: "Hi! I can help you manage your todos.",
        }}
        suggestions={[
          { title: "Add Todos", message: "Add a todo to build a website." },
          { title: "Change Theme", message: "Set the theme to a nice purple." },
          { title: "Dark Mode", message: "Switch to dark mode please." },
          { title: "Show Stats", message: "Show me my todo statistics." },
          { title: "Celebrate", message: "Show me some confetti!" },
          { title: "Motivate Me", message: "Give me a motivational message!" },
          { title: "Export Data", message: "Export my todos to a file." },
          { title: "Full Send", message: "Please full send it!" },
        ]}
      >
        <div className="h-screen w-full bg-[var(--background)]">
          <TodoBoard state={state} setState={setState} theme={theme} setTheme={setTheme} />
        </div>
      </CopilotSidebar>
    </main>
  );
}
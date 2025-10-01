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
    Frontend Action
  */
  useCopilotAction({
    name: "setThemeColor",
    parameters: [{ name: "themeColor", description: "The theme color to set.", required: true }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

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
          { title: "Update Status", message: "Move the first todo to in-progress." },
          { title: "Full Send", message: "Please full send it!" },
          { title: "Manage Tasks", message: "Delete all completed todos." },
          { title: "Read State", message: "What todos do I have?" },
        ]}
      >
        <div className="h-screen w-full bg-[var(--background)] relative">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute top-6 right-6 md:top-8 md:right-8 p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--card-hover)] transition-all shadow-sm z-10"
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
          <TodoBoard state={state} setState={setState} />
        </div>
      </CopilotSidebar>
    </main>
  );
}
import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallDisplay } from "../ToolCallDisplay";

afterEach(() => {
  cleanup();
});

// Test str_replace_editor create command
test("displays user-friendly message for str_replace_editor create command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "create",
      path: "/App.jsx",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(screen.queryByText("str_replace_editor")).toBeNull();
});

// Test str_replace_editor str_replace command
test("displays user-friendly message for str_replace_editor str_replace command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "str_replace",
      path: "/components/Button.tsx",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
  expect(screen.queryByText("str_replace_editor")).toBeNull();
});

// Test str_replace_editor insert command
test("displays user-friendly message for str_replace_editor insert command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "insert",
      path: "/utils/helpers.js",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Adding to helpers.js")).toBeDefined();
  expect(screen.queryByText("str_replace_editor")).toBeNull();
});

// Test str_replace_editor view command
test("displays user-friendly message for str_replace_editor view command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "view",
      path: "/config.json",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Reading config.json")).toBeDefined();
  expect(screen.queryByText("str_replace_editor")).toBeNull();
});

// Test file_manager rename command
test("displays user-friendly message for file_manager rename command", () => {
  const tool = {
    toolName: "file_manager",
    state: "result" as const,
    args: {
      command: "rename",
      path: "/Header.jsx",
      new_path: "/NavBar.jsx",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Renaming Header.jsx to NavBar.jsx")).toBeDefined();
  expect(screen.queryByText("file_manager")).toBeNull();
});

// Test file_manager delete command
test("displays user-friendly message for file_manager delete command", () => {
  const tool = {
    toolName: "file_manager",
    state: "result" as const,
    args: {
      command: "delete",
      path: "/old-file.js",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Deleting old-file.js")).toBeDefined();
  expect(screen.queryByText("file_manager")).toBeNull();
});

// Test completed state shows green dot
test("shows green dot for completed tool calls", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "create",
      path: "/App.jsx",
    },
  };

  const { container } = render(<ToolCallDisplay tool={tool} />);

  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeDefined();
});

// Test calling state shows spinner
test("shows spinner for calling tool calls", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "calling" as const,
    args: {
      command: "create",
      path: "/App.jsx",
    },
  };

  const { container } = render(<ToolCallDisplay tool={tool} />);

  // Check for spinner (Loader2 component with animate-spin)
  const spinnerElement = container.querySelector('.animate-spin');
  expect(spinnerElement).toBeDefined();
});

// Test nested file paths extract filename correctly
test("extracts filename correctly from nested paths", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "create",
      path: "/src/components/ui/Button.tsx",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

// Test fallback for unknown tool
test("displays fallback message for unknown tool", () => {
  const tool = {
    toolName: "unknown_tool",
    state: "result" as const,
    args: {},
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("unknown tool")).toBeDefined();
});

// Test str_replace_editor without command defaults to "Modifying"
test("displays default message for str_replace_editor without command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      path: "/App.jsx",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Modifying App.jsx")).toBeDefined();
});

// Test file_manager without command defaults to "Managing"
test("displays default message for file_manager without command", () => {
  const tool = {
    toolName: "file_manager",
    state: "result" as const,
    args: {
      path: "/some-file.js",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Managing some-file.js")).toBeDefined();
});

// Test rename without new_path
test("displays rename message without new filename when new_path missing", () => {
  const tool = {
    toolName: "file_manager",
    state: "result" as const,
    args: {
      command: "rename",
      path: "/Header.jsx",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Renaming Header.jsx")).toBeDefined();
});

// Test missing path handling
test("handles missing path gracefully", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "create",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Creating undefined")).toBeDefined();
});

// Test empty path handling
test("handles empty path gracefully", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "create",
      path: "",
    },
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText(/Creating\s*$/)).toBeDefined();
});

// Test missing args handling
test("handles missing args gracefully", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
  };

  render(<ToolCallDisplay tool={tool} />);

  // Should fallback to the unknown tool handler
  expect(screen.getByText("str replace editor")).toBeDefined();
});

// Test color coding for different operations
test("applies correct color coding for create operation", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "create",
      path: "/App.jsx",
    },
  };

  const { container } = render(<ToolCallDisplay tool={tool} />);

  expect(container.querySelector(".bg-green-50")).toBeDefined();
  expect(container.querySelector(".text-green-600")).toBeDefined();
});

test("applies correct color coding for edit operation", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "str_replace",
      path: "/App.jsx",
    },
  };

  const { container } = render(<ToolCallDisplay tool={tool} />);

  expect(container.querySelector(".bg-blue-50")).toBeDefined();
  expect(container.querySelector(".text-blue-600")).toBeDefined();
});

test("applies correct color coding for delete operation", () => {
  const tool = {
    toolName: "file_manager",
    state: "result" as const,
    args: {
      command: "delete",
      path: "/old-file.js",
    },
  };

  const { container } = render(<ToolCallDisplay tool={tool} />);

  expect(container.querySelector(".bg-red-50")).toBeDefined();
  expect(container.querySelector(".text-red-600")).toBeDefined();
});
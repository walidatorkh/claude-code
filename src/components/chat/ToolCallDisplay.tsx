"use client";

import { Loader2, FileEdit, FolderPlus, FileX, RotateCcw, Eye } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: "calling" | "result" | "partial-call" | "call";
  args?: any;
  result?: any;
}

interface ToolCallDisplayProps {
  tool: ToolInvocation;
}

function getToolDisplayInfo(tool: ToolInvocation) {
  const { toolName, args } = tool;

  if (toolName === "str_replace_editor" && args) {
    const { command, path } = args;
    const fileName = path?.split("/").pop() || path;

    switch (command) {
      case "create":
        return {
          icon: FileEdit,
          message: `Creating ${fileName}`,
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "str_replace":
        return {
          icon: FileEdit,
          message: `Editing ${fileName}`,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "insert":
        return {
          icon: FileEdit,
          message: `Adding to ${fileName}`,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        };
      case "view":
        return {
          icon: Eye,
          message: `Reading ${fileName}`,
          color: "text-neutral-600",
          bgColor: "bg-neutral-50",
        };
      default:
        return {
          icon: FileEdit,
          message: `Modifying ${fileName}`,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
    }
  }

  if (toolName === "file_manager" && args) {
    const { command, path, new_path } = args;
    const fileName = path?.split("/").pop() || path;
    const newFileName = new_path?.split("/").pop() || new_path;

    switch (command) {
      case "rename":
        return {
          icon: RotateCcw,
          message: newFileName ? `Renaming ${fileName} to ${newFileName}` : `Renaming ${fileName}`,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
        };
      case "delete":
        return {
          icon: FileX,
          message: `Deleting ${fileName}`,
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      default:
        return {
          icon: FolderPlus,
          message: `Managing ${fileName}`,
          color: "text-neutral-600",
          bgColor: "bg-neutral-50",
        };
    }
  }

  // Fallback for unknown tools
  return {
    icon: FileEdit,
    message: toolName.replace(/_/g, " "),
    color: "text-neutral-600",
    bgColor: "bg-neutral-50",
  };
}

export function ToolCallDisplay({ tool }: ToolCallDisplayProps) {
  const { icon: Icon, message, color, bgColor } = getToolDisplayInfo(tool);
  const isCompleted = tool.state === "result";

  return (
    <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-xs border border-neutral-200 ${bgColor}`}>
      {isCompleted ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <Icon className={`w-3 h-3 ${color}`} />
          <span className="text-neutral-700 font-medium">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <Icon className={`w-3 h-3 ${color}`} />
          <span className="text-neutral-700 font-medium">{message}</span>
        </>
      )}
    </div>
  );
}
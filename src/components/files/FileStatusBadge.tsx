import { cn } from "@/lib/utils";

interface FileStatusBadgeProps {
  status: string;
}

export function FileStatusBadge({ status }: FileStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "Completed"
          ? "bg-green-100 text-green-800"
          : status === "In Progress"
          ? "bg-blue-100 text-blue-800"
          : "bg-yellow-100 text-yellow-800"
      )}
    >
      {status}
    </span>
  );
}
import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  onClose?: () => void;
}

export function Alert({
  className,
  variant = 'default',
  children,
  onClose,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 mb-4",
        variant === 'destructive' 
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-gray-200 bg-white",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
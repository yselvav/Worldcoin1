import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "w-8 h-8",
  text,
}) => {
  return (
    <div className="flex flex-col items-center justify-center" role="status" aria-live="polite">
      <svg
        className={cn("animate-spin text-primary", className)} // Using theme primary for spinner color
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <span className="mt-2 text-sm text-muted-foreground">{text}</span>}
      <span className="sr-only">{text || "Loading..."}</span>
    </div>
  );
};

export default LoadingSpinner;

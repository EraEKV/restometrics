import { cn } from "@/shared/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  className?: string
  size?: "sm" | "default" | "lg"
  text?: string
}

const sizeVariants = {
  sm: "h-4 w-4",
  default: "h-6 w-6", 
  lg: "h-8 w-8"
}

export function Loader({ className, size = "default", text }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeVariants[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

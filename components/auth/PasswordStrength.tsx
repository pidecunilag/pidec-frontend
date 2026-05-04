import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export function PasswordStrength({
  password = "",
  className,
}: PasswordStrengthProps) {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const criteria = [
    { label: "8+ characters", met: hasMinLength },
    { label: "Contains a letter", met: hasLetter },
    { label: "Contains a number", met: hasNumber },
  ];

  const strengthScore = criteria.filter((c) => c.met).length;

  return (
    <div className={cn("space-y-2 mt-2", className)}>
      <div className="flex gap-2">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 w-full rounded-full transition-colors duration-300",
              strengthScore >= level
                ? strengthScore === 3
                  ? "bg-brand"
                  : strengthScore === 2
                  ? "bg-amber-500"
                  : "bg-red-500"
                : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground flex gap-3">
        {criteria.map((c, i) => (
          <span
            key={i}
            className={cn(
              "transition-colors",
              c.met ? "text-foreground font-medium" : "text-muted-foreground/60"
            )}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

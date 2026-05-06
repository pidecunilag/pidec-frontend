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
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const criteria = [
    { label: "8+ characters", met: hasMinLength },
    { label: "Letter", met: hasLetter },
    { label: "Number", met: hasNumber },
    { label: "Special char", met: hasSpecial },
  ];

  const strengthScore = criteria.filter((c) => c.met).length;

  return (
    <div className={cn("space-y-2 mt-2", className)}>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 w-full rounded-full transition-colors duration-300",
              strengthScore >= level
                ? strengthScore === 4
                  ? "bg-green-500" // Green when fully passed
                  : strengthScore >= 2
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

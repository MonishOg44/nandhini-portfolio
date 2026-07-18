export function SectionDivider() {
  return (
    <div className="relative h-16 bg-background flex items-center justify-center overflow-hidden border-b border-border">
      {/* Centered accent line */}
      <div className="absolute w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
    </div>
  );
}

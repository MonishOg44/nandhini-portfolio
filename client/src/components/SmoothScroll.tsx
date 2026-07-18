interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  // Pass-through to rely on native high-performance browser compositor scroll (supports touch & keyboard perfectly)
  return <>{children}</>;
}

export default SmoothScroll;

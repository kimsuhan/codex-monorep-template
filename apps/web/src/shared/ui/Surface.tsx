import type { PropsWithChildren } from 'react';

interface SurfaceProps extends PropsWithChildren {
  className?: string;
}

export function Surface({ children, className }: SurfaceProps) {
  const resolvedClassName = className ? `surface ${className}` : 'surface';

  return <section className={resolvedClassName}>{children}</section>;
}

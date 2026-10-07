import type { PropsWithChildren, ReactNode } from 'react';

export function AppShell({
  title,
  navigation,
  navigationPosition = 'header',
  header,
  className = '',
  children,
}: PropsWithChildren<{
  title: string;
  navigation?: ReactNode;
  navigationPosition?: 'header' | 'footer';
  header?: ReactNode;
  className?: string;
}>) {
  return (
    <div className={`app-shell ${className}`.trim()}>
      {header ?? (
        <header>
          <strong>{title}</strong>
          {navigation && navigationPosition === 'header' ? (
            <nav aria-label="Primary">{navigation}</nav>
          ) : null}
        </header>
      )}
      <main>{children}</main>
      {navigation && navigationPosition === 'footer' ? navigation : null}
    </div>
  );
}

export function RoutePlaceholder({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section>
      <h1>{title}</h1>
      {children ?? <p>Architecture placeholder. Final interface is not defined.</p>}
    </section>
  );
}

export function RoutePending() {
  return <p role="status">Loading route…</p>;
}

export function RouteError() {
  return (
    <section role="alert">
      <h1>Something went wrong</h1>
      <p>This route could not be loaded. Try again from a safe entry point.</p>
    </section>
  );
}

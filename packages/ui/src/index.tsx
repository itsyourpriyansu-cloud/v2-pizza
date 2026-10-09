import { useId, type PropsWithChildren, type ReactNode } from 'react';

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
        <header className="app-shell__header">
          <div className="app-shell__brand">
            <span className="app-shell__wordmark">Pizza Avenue</span>
            <strong className="app-shell__product">{title}</strong>
          </div>
          {navigation && navigationPosition === 'header' ? (
            <nav className="app-shell__nav" aria-label="Primary">{navigation}</nav>
          ) : null}
        </header>
      )}
      <main className="app-shell__main" id="main-content">{children}</main>
      {navigation && navigationPosition === 'footer' ? navigation : null}
    </div>
  );
}

export function RoutePlaceholder({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  const headingId = useId();
  return (
    <section className="route-placeholder" aria-labelledby={headingId}>
      <header className="route-placeholder__header">
        <p className="route-placeholder__eyebrow">Pizza Avenue workspace</p>
        <h1 id={headingId}>{title}</h1>
      </header>
      <div className="route-placeholder__content">
        {children ?? <p>This workspace is ready for its governed workflow.</p>}
      </div>
    </section>
  );
}

export function RoutePending() {
  return <p className="route-status" role="status">Loading workspace…</p>;
}

export function RouteError() {
  return (
    <section className="route-status route-status--error" role="alert">
      <h1>Something went wrong</h1>
      <p>This route could not be loaded. Try again from a safe entry point.</p>
    </section>
  );
}

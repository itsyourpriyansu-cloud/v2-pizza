import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`button button--${variant} ${className}`.trim()} {...props} />;
}

export function ButtonLink({
  variant = 'primary',
  className = '',
  ...props
}: LinkProps & { variant?: ButtonVariant }) {
  return <Link className={`button button--${variant} ${className}`.trim()} {...props} />;
}

export function Surface({
  children,
  className = '',
  as: Component = 'section',
}: PropsWithChildren<{ className?: string; as?: 'section' | 'div' | 'article' }>) {
  return <Component className={`surface ${className}`.trim()}>{children}</Component>;
}

export function Badge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'neutral' | 'success' | 'warning' | 'danger' }>) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="page-header__description">{description}</p> : null}
      </div>
      {action ? <div className="page-header__action">{action}</div> : null}
    </header>
  );
}

export function SectionHeader({ title, action, id }: { title: string; action?: ReactNode; id?: string }) {
  return (
    <div className="section-header">
      <h2 id={id}>{title}</h2>
      {action}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <span className={`skeleton ${className}`.trim()} aria-hidden="true" />;
}

export function PageSkeleton({ label }: { label: string }) {
  return (
    <div className="page-stack" role="status" aria-label={`Loading ${label}`}>
      <Skeleton className="skeleton--title" />
      <Skeleton className="skeleton--block" />
      <div className="product-grid">
        <Skeleton className="skeleton--card" />
        <Skeleton className="skeleton--card" />
      </div>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <Surface className="state-card">
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </Surface>
  );
}

export function ErrorState({ title, body, onRetry }: { title: string; body: string; onRetry?: () => void }) {
  return (
    <Surface className="state-card state-card--error">
      <Badge tone="danger">Needs attention</Badge>
      <h2>{title}</h2>
      <p>{body}</p>
      {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    </Surface>
  );
}

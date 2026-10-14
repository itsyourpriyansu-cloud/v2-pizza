import { customerFlowSteps } from '../landing-content';

interface CustomerFlowProps {
  readonly customerAppUrl: string;
}

function customerUrl(baseUrl: string, path: string): string {
  return new URL(path.replace(/^\//, ''), `${baseUrl.replace(/\/$/, '')}/`).toString();
}

export function CustomerFlow({ customerAppUrl }: CustomerFlowProps) {
  const menuUrl = customerUrl(customerAppUrl, '/menu');

  return (
    <section
      className="customer-flow-section"
      id="process"
      aria-labelledby="customer-flow-title"
    >
      <div className="customer-flow-header">
        <span className="customer-flow-badge" role="text">
          Process
        </span>
        <h2 id="customer-flow-title" className="customer-flow-title">
          BROWSE THEN ORDER
        </h2>
        <p className="customer-flow-subtitle">
          Scroll through everything we&apos;ve got cooking.
        </p>
      </div>

      <div className="customer-flow-grid" role="list" aria-label="How ordering works">
        {customerFlowSteps.map((step) => (
          <article
            className="customer-flow-card"
            key={step.stepNumber}
            role="listitem"
            aria-labelledby={`flow-step-title-${step.stepNumber}`}
          >
            <div className="customer-flow-card__media">
              <img
                src={step.imageSrc}
                alt={step.imageAlt}
                className="customer-flow-card__img"
                loading="lazy"
              />
              <div className="customer-flow-card__gradient" aria-hidden="true" />
            </div>

            <div className="customer-flow-card__body">
              <span className="customer-flow-card__step-pill">
                {step.stepLabel}
              </span>
              <h3
                id={`flow-step-title-${step.stepNumber}`}
                className="customer-flow-card__step-title"
              >
                {step.title}
              </h3>
              <p className="customer-flow-card__step-desc">
                {step.description}
              </p>
              <a
                href={menuUrl}
                className="customer-flow-card__action-btn"
                style={{ color: step.actionColor }}
                aria-label={`${step.actionText} - ${step.title}`}
              >
                {step.actionText}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

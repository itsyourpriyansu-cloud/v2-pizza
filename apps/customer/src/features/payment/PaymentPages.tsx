import { RoutePlaceholder } from '@pizza-avenue/ui';
import { usePrototypeStore } from '../../shared/state/prototype-store';

export function PaymentPage() {
  const selectedScenario = usePrototypeStore((state) => state.selectedScenario);
  const selectScenario = usePrototypeStore((state) => state.selectScenario);
  return (
    <RoutePlaceholder title="Payment foundation">
      <p>Payment is mocked; client success never confirms an operational order.</p>
      <button type="button" onClick={() => selectScenario('PAYMENT_FAILURE')}>
        Select payment failure scenario
      </button>
      <output>Selected: {selectedScenario ?? 'default'}</output>
    </RoutePlaceholder>
  );
}

export function PaymentSuccessPage() {
  return (
    <RoutePlaceholder title="Payment processing">
      <p>Await authoritative server verification before showing an order as confirmed.</p>
    </RoutePlaceholder>
  );
}

export function PaymentFailurePage() {
  return (
    <RoutePlaceholder title="Payment failed">
      <p>Preserve the cart, release or expire capacity, and allow retry.</p>
    </RoutePlaceholder>
  );
}

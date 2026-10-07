import {
  createServiceRequest,
  getDineInBill,
  getDineInOrder,
  getDineInSession,
  resolveTableContext,
} from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { formatMoney, queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { usePrototypeStore } from '../../shared/state/prototype-store';

function TableContext({ children }: { children: ReactNode }) {
  const context = usePrototypeStore((state) => state.serviceContext);
  return (
    <>
      <p><strong>Dine In · {context?.tableLabel ?? 'Table context required'}</strong></p>
      {children}
    </>
  );
}

export function DineInStartPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t') ?? '';
  const setServiceContext = usePrototypeStore((state) => state.setServiceContext);
  const resolution = useQuery({
    queryKey: queryKeys.tableContext(token),
    queryFn: () => resolveTableContext(token),
    enabled: Boolean(token),
  });

  if (!token) {
    return (
      <RoutePlaceholder title="Scan your table QR">
        <p>A trusted table cannot be selected manually. Scan the opaque QR token at your table.</p>
      </RoutePlaceholder>
    );
  }
  if (resolution.isPending) return <p role="status">Checking table QR…</p>;
  if (resolution.isError || resolution.data.status !== 'VALID' || !resolution.data.session) {
    return <DineInWrongTablePage />;
  }

  const { session } = resolution.data;
  return (
    <RoutePlaceholder title="Confirm your table">
      <p>You are ordering for <strong>{session.tableLabel}</strong>.</p>
      <p>Pizza Avenue · Sainikpuri</p>
      <Link
        to="/dine-in"
        onClick={() => setServiceContext({
          mode: 'DINE_IN',
          storeId: session.storeId,
          tableId: session.tableId,
          tableLabel: session.tableLabel,
          tableSessionId: session.id,
          confirmedAt: new Date().toISOString(),
        })}
      >
        Start Ordering
      </Link>
      <Link to="/dine-in/wrong-table">Scan Another QR</Link>
    </RoutePlaceholder>
  );
}

export function DineInHomePage() {
  const sessionQuery = useQuery({ queryKey: queryKeys.tableSession(), queryFn: getDineInSession });
  if (sessionQuery.isPending) return <p role="status">Loading table session…</p>;
  if (sessionQuery.isError) return <p role="alert">Table session could not be loaded.</p>;
  return (
    <RoutePlaceholder title="Your table">
      <TableContext>
        <p>Current kitchen estimate: 20–30 minutes.</p>
        <p>Session status: {sessionQuery.data.status}</p>
        <Link to="/dine-in/menu">View Menu</Link>
        <Link to="/dine-in/bill">View Current Bill</Link>
        <Link to="/dine-in/service">Call Waiter</Link>
      </TableContext>
    </RoutePlaceholder>
  );
}

export function DineInShellPage({ title, guidance }: { title: string; guidance: string }) {
  return (
    <RoutePlaceholder title={title}>
      <TableContext><p>{guidance}</p></TableContext>
    </RoutePlaceholder>
  );
}

export function DineInOrderPage() {
  const { orderId = '' } = useParams();
  const orderQuery = useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => getDineInOrder(orderId),
    enabled: Boolean(orderId),
  });
  if (orderQuery.isPending) return <p role="status">Loading dine-in order…</p>;
  if (orderQuery.isError) return <p role="alert">Dine-in order could not be loaded.</p>;
  const customerMessage = orderQuery.data.status === 'CUSTOMER_SUBMITTED' || orderQuery.data.status === 'WAITER_REVIEW'
    ? 'Waiting for waiter confirmation'
    : orderQuery.data.status === 'READY_TO_SERVE'
      ? 'Ready to be served'
      : orderQuery.data.status;
  return (
    <RoutePlaceholder title={orderQuery.data.publicNumber}>
      <TableContext><p>Current status: {customerMessage}</p></TableContext>
    </RoutePlaceholder>
  );
}

export function DineInBillPage() {
  const billQuery = useQuery({ queryKey: queryKeys.tableBill(), queryFn: getDineInBill });
  if (billQuery.isPending) return <p role="status">Loading current table bill…</p>;
  if (billQuery.isError) return <p role="alert">Current bill could not be loaded.</p>;
  return (
    <RoutePlaceholder title="Current table bill">
      <TableContext>
        <p>Estimated total: {formatMoney(billQuery.data.grandTotal)}</p>
        <p>Final bill is confirmed by the restaurant before payment.</p>
        <Link to="/dine-in/bill/request">Request Bill</Link>
      </TableContext>
    </RoutePlaceholder>
  );
}

export function DineInServicePage() {
  const mutation = useMutation({
    mutationFn: () => createServiceRequest('CALL_WAITER', crypto.randomUUID()),
  });
  return (
    <RoutePlaceholder title="Need help?">
      <TableContext>
        <button type="button" disabled={mutation.isPending || mutation.isSuccess} onClick={() => mutation.mutate()}>
          Call Waiter
        </button>
        {mutation.isSuccess ? <p role="status">Waiter has been notified.</p> : null}
      </TableContext>
    </RoutePlaceholder>
  );
}

export function DineInWrongTablePage() {
  return (
    <RoutePlaceholder title="Table could not be confirmed">
      <p>Scan the QR at your current table. A typed table number is not accepted.</p>
      <Link to="/dine-in/start">Scan Another QR</Link>
    </RoutePlaceholder>
  );
}

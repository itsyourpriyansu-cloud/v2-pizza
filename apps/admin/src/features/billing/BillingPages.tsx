import { getAdminBill, listAdminBills } from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

export function OpenBillsPage() {
  const query = useQuery({ queryKey: ['admin', 'bills'], queryFn: listAdminBills });
  if (query.isPending) return <p role="status">Loading table bills…</p>;
  if (query.isError) return <p role="alert">Table bills could not be loaded.</p>;
  return (
    <RoutePlaceholder title="Open table bills">
      {query.data.map((bill) => (
        <p key={bill.id}><Link to={`/billing/${bill.id}`}>{bill.id}</Link> · {bill.status}</p>
      ))}
    </RoutePlaceholder>
  );
}

export function BillDetailPage() {
  const { billId = '' } = useParams();
  const query = useQuery({
    queryKey: ['admin', 'bills', billId],
    queryFn: () => getAdminBill(billId),
    enabled: Boolean(billId),
  });
  if (query.isPending) return <p role="status">Loading bill detail…</p>;
  if (query.isError) return <p role="alert">Bill detail could not be loaded.</p>;
  return (
    <RoutePlaceholder title={`Bill ${query.data.id}`}>
      <p>Rounds: {query.data.includedOrderIds.length} · Status: {query.data.status}</p>
      <p>Loyalty ownership is listed per authenticated order owner; guests receive none.</p>
      <Link to={`/billing/${query.data.id}/finalize`}>Finalize Bill</Link>
      <Link to={`/billing/${query.data.id}/payment`}>Take Payment</Link>
    </RoutePlaceholder>
  );
}

export function BillingShellPage({ title, guidance }: { title: string; guidance: string }) {
  return <RoutePlaceholder title={title}><p>{guidance}</p></RoutePlaceholder>;
}

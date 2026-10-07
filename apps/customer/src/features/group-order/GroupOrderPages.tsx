import { addGroupItem, checkoutGroupOrder, createGroupOrder, getGroupOrder, joinGroupOrder, voteGroupPoll } from '@pizza-avenue/api-client';
import { queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Copy, ShoppingBasket, UserPlus, UsersRound, Vote } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { useToast } from '../../shared/feedback/use-toast';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

export function GroupOrderStartPage() {
  useScenarioFromUrl();
  const navigate = useNavigate();
  const create = useMutation({ mutationFn: createGroupOrder, onSuccess: (group) => { trackCustomerEvent('group_order_created', { groupId: group.id }); navigate(`/group-order/${group.id}`); } });
  return <div className="page-stack engagement-page"><PageHeader eyebrow="One host · one checkout" title="Order together, pay once" description="Invite people to contribute food choices and vote. The host reviews the combined basket and completes the existing checkout." />
    <Surface className="group-intro"><span className="league-emblem" aria-hidden="true"><UsersRound /></span><h2>How it works</h2><ol><li><strong>Host creates and shares</strong><span>One invite keeps the group together.</span></li><li><strong>Everyone contributes</strong><span>Display names, food choices and poll votes only.</span></li><li><strong>Host finalizes</strong><span>No split bills or participant payments.</span></li></ol><Button type="button" disabled={create.isPending} onClick={() => create.mutate()}>{create.isPending ? 'Creating…' : 'Create group order'}</Button>{create.isError ? <p className="validation-message" role="alert">The group could not be created. Try again without losing any cart.</p> : null}</Surface>
  </div>;
}

export function GroupOrderDetailPage() {
  useScenarioFromUrl();
  const { groupId = '' } = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { showToast } = useToast();
  const setCartSummary = useCommerceStore((state) => state.setCartSummary);
  const query = useQuery({ queryKey: queryKeys.groupOrder(groupId), queryFn: () => getGroupOrder(groupId), enabled: Boolean(groupId) });
  const [joinName, setJoinName] = useState('Kabir');
  const refresh = (group: Awaited<ReturnType<typeof getGroupOrder>>) => client.setQueryData(queryKeys.groupOrder(groupId), group);
  const join = useMutation({ mutationFn: () => joinGroupOrder(groupId, joinName), onSuccess: (group) => { refresh(group); trackCustomerEvent('group_order_joined', { groupId }); showToast(`${joinName} joined the group.`); } });
  const add = useMutation({ mutationFn: (productId: string) => addGroupItem(groupId, productId), onSuccess: (group, productId) => { refresh(group); trackCustomerEvent('group_item_added', { groupId, productId }); } });
  const vote = useMutation({ mutationFn: (optionId: string) => voteGroupPoll(groupId, optionId), onSuccess: (group, optionId) => { refresh(group); trackCustomerEvent('group_poll_vote', { groupId, optionId }); } });
  const checkout = useMutation({ mutationFn: () => checkoutGroupOrder(groupId), onSuccess: (result) => { setCartSummary('PICKUP', result.cart.id, result.cart.items.reduce((sum, item) => sum + item.quantity, 0)); trackCustomerEvent('group_checkout_started', { groupId }); navigate('/cart'); } });
  if (query.isPending) return <PageSkeleton label="group order" />;
  if (query.isError || !query.data) return <ErrorState title="The group could not be refreshed" body="Choices may still be safe. Reconnect and try again before contributing." onRetry={() => void query.refetch()} />;
  const group = query.data;
  if (group.status === 'EXPIRED' || group.status === 'CLOSED' || group.status === 'HOST_LEFT') return <div className="page-stack engagement-page"><PageHeader eyebrow="Group unavailable" title={group.status === 'EXPIRED' ? 'This invite has expired' : group.status === 'HOST_LEFT' ? 'The host left this group' : 'This group is closed'} description={group.notices[0] ?? 'Ask the host to create a new group order.'} /><Button type="button" onClick={() => navigate('/group-order')}>Start a new group</Button></div>;
  const totalItems = group.participants.flatMap((participant) => participant.contributions).reduce((sum, item) => sum + item.quantity, 0);
  return <div className="page-stack engagement-page"><PageHeader eyebrow={group.currentParticipantRole === 'HOST' ? 'You are the host' : 'Participant view'} title={group.name} description="Participants see display names, contributions and poll choices — never private profiles, Points or order history." />
    {group.notices.length ? <Surface className="recovery-notice" role="status"><strong>Group update</strong>{group.notices.map((notice) => <p key={notice}>{notice}</p>)}</Surface> : null}
    <Surface className="group-share"><span><strong>Invite code</strong><small>{group.inviteCode}</small></span><Button type="button" variant="secondary" onClick={() => showToast(`Invite code copied: ${group.inviteCode}`)}><Copy aria-hidden="true" /> Copy</Button></Surface>
    {group.currentParticipantRole === 'HOST' ? <Surface className="engagement-form"><h2>Invite a teammate</h2><label className="field"><span>Display name</span><input className="input" value={joinName} onChange={(event) => setJoinName(event.target.value)} /></label><Button type="button" disabled={!joinName.trim() || join.isPending} onClick={() => join.mutate()}><UserPlus aria-hidden="true" /> Add participant</Button></Surface> : null}
    <section className="page-stack" aria-labelledby="group-members"><h2 id="group-members">Group basket · {totalItems} items</h2><div className="engagement-grid">{group.participants.map((participant) => <Surface as="article" className="participant-card" key={participant.id}><div className="engagement-card-heading"><strong>{participant.displayName}</strong><Badge>{participant.role}</Badge></div>{participant.contributions.length ? <ul>{participant.contributions.map((item, index) => <li key={`${item.productId}-${index}`}>{item.quantity} × {item.productName}</li>)}</ul> : <p className="muted">No choices yet</p>}</Surface>)}</div></section>
    <Surface><h2>Add a food choice</h2><p className="muted">Current menu availability is checked again when the host begins checkout.</p><div className="choice-buttons"><Button type="button" variant="secondary" onClick={() => add.mutate('pizza-pesto')}>Pesto</Button><Button type="button" variant="secondary" onClick={() => add.mutate('pizza-chicken-pepperoni')}>Chicken Pepperoni</Button><Button type="button" variant="secondary" onClick={() => add.mutate('pizza-farmhouse')}>Farmhouse</Button></div></Surface>
    {group.poll ? <Surface className="poll-card"><div className="engagement-card-heading"><span className="engagement-card-icon" aria-hidden="true"><Vote /></span><Badge>Host decides</Badge></div><h2>{group.poll.question}</h2><fieldset><legend className="sr-only">Choose one poll option</legend>{group.poll.options.map((option) => <button className={option.selectedByCurrentParticipant ? 'poll-option is-selected' : 'poll-option'} type="button" onClick={() => vote.mutate(option.id)} key={option.id}><span>{option.selectedByCurrentParticipant ? <Check aria-hidden="true" /> : null}{option.label}</span><strong>{option.votes} votes</strong></button>)}</fieldset></Surface> : null}
    {group.currentParticipantRole === 'HOST' ? <Surface className="host-checkout"><span className="engagement-card-icon" aria-hidden="true"><ShoppingBasket /></span><div><h2>Host review</h2><p>Current products, prices and availability are revalidated before this becomes the normal Pickup cart.</p></div><Button type="button" disabled={!totalItems || checkout.isPending} onClick={() => checkout.mutate()}>{checkout.isPending ? 'Validating group basket…' : 'Review combined basket'}</Button></Surface> : <Surface className="context-notice"><strong>Your choices are in</strong><p>The host makes the final basket decision and completes one checkout.</p></Surface>}
    {join.isError || add.isError || vote.isError || checkout.isError ? <p className="validation-message" role="alert">That group update did not save. Refresh before trying again.</p> : null}
  </div>;
}

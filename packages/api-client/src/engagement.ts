import type {
  EngagementSummary,
  GroupOrder,
  HouseholdMember,
  HouseholdMemberInput,
  LeagueOverview,
  Occasion,
  OccasionInput,
  Referral,
  SavedBasket,
  SavedBasketValidationResult,
  TasteCard,
} from '@pizza-avenue/types';
import { apiRequest } from './client';

export const getEngagementSummary = () => apiRequest<EngagementSummary>('me/engagement-summary');
export const getSavedBaskets = () => apiRequest<SavedBasket[]>('me/saved-baskets');
export const createSavedBasket = (input: Pick<SavedBasket, 'name' | 'kind' | 'peopleCount'>) => apiRequest<SavedBasket>('me/saved-baskets', { method: 'POST', body: JSON.stringify(input) });
export const getSavedBasket = (id: string) => apiRequest<SavedBasket>(`me/saved-baskets/${id}`);
export const updateSavedBasket = (id: string, input: Pick<SavedBasket, 'name' | 'peopleCount'>) => apiRequest<SavedBasket>(`me/saved-baskets/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
export const deleteSavedBasket = (id: string) => apiRequest<void>(`me/saved-baskets/${id}`, { method: 'DELETE' });
export const reorderSavedBasket = (id: string) => apiRequest<SavedBasketValidationResult>(`me/saved-baskets/${id}/reorder`, { method: 'POST' });
export const shareSavedBasket = (id: string) => apiRequest<{ text: string }>(`me/saved-baskets/${id}/share`, { method: 'POST' });

export const getHouseholdMembers = () => apiRequest<HouseholdMember[]>('me/household');
export const addHouseholdMember = (input: HouseholdMemberInput) => apiRequest<HouseholdMember>('me/household', { method: 'POST', body: JSON.stringify(input) });
export const updateHouseholdMember = (id: string, input: HouseholdMemberInput) => apiRequest<HouseholdMember>(`me/household/${id}`, { method: 'PATCH', body: JSON.stringify(input) });

export const getOccasions = () => apiRequest<Occasion[]>('me/occasions');
export const createOccasion = (input: OccasionInput) => apiRequest<Occasion>('me/occasions', { method: 'POST', body: JSON.stringify(input) });
export const planOccasion = (id: string) => apiRequest<SavedBasketValidationResult>(`me/occasions/${id}/plan`, { method: 'POST' });

export const getReferrals = () => apiRequest<Referral[]>('me/referrals');
export const shareReferral = () => apiRequest<Referral>('me/referrals/share', { method: 'POST' });
export const advanceReferral = (id: string) => apiRequest<Referral>(`me/referrals/${id}/advance`, { method: 'POST' });
export const getTasteCard = () => apiRequest<TasteCard>('me/taste-card');
export const shareTasteCard = () => apiRequest<{ payload: TasteCard['sharePayload'] }>('me/taste-card/share', { method: 'POST' });

export const getLeague = () => apiRequest<LeagueOverview>('me/league');
export const optIntoLeague = () => apiRequest<LeagueOverview>('me/league/opt-in', { method: 'POST' });

export const createGroupOrder = () => apiRequest<GroupOrder>('group-orders', { method: 'POST' });
export const getGroupOrder = (id: string) => apiRequest<GroupOrder>(`group-orders/${id}`);
export const joinGroupOrder = (id: string, displayName: string) => apiRequest<GroupOrder>(`group-orders/${id}/join`, { method: 'POST', body: JSON.stringify({ displayName }) });
export const addGroupItem = (id: string, productId: string) => apiRequest<GroupOrder>(`group-orders/${id}/items`, { method: 'POST', body: JSON.stringify({ productId }) });
export const voteGroupPoll = (groupId: string, optionId: string) => apiRequest<GroupOrder>(`group-orders/${groupId}/poll`, { method: 'POST', body: JSON.stringify({ optionId }) });
export const checkoutGroupOrder = (id: string) => apiRequest<SavedBasketValidationResult>(`group-orders/${id}/checkout`, { method: 'POST' });

import type { EntityId, ISODateTime } from './common';

export type AnalyticsEventName =
  | 'app_opened'
  | 'source_detected'
  | 'qr_scanned'
  | 'whatsapp_join_sent'
  | 'whatsapp_webhook_received'
  | 'magic_link_generated'
  | 'magic_link_opened'
  | 'whatsapp_login_completed'
  | 'otp_requested'
  | 'otp_verified'
  | 'login_completed'
  | 'menu_viewed'
  | 'category_viewed'
  | 'product_viewed'
  | 'search_used'
  | 'builder_started'
  | 'variant_selected'
  | 'modifier_selected'
  | 'builder_completed'
  | 'upsell_shown'
  | 'upsell_accepted'
  | 'cart_viewed'
  | 'checkout_started'
  | 'pickup_options_viewed'
  | 'pickup_slot_selected'
  | 'quote_generated'
  | 'payment_started'
  | 'payment_success'
  | 'payment_failed'
  | 'order_confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'order_completed'
  | 'points_earned'
  | 'reward_unlocked'
  | 'reward_redeemed'
  | 'passport_progress'
  | 'passport_completed'
  | 'reorder_clicked'
  | 'reorder_completed';

export interface AnalyticsEvent {
  id: EntityId;
  name: AnalyticsEventName;
  occurredAt: ISODateTime;
  sessionId: EntityId;
  customerId: EntityId | null;
  orderId: EntityId | null;
  properties: Record<string, string | number | boolean | null>;
}

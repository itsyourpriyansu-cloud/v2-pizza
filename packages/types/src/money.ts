/**
 * `amount` is always an integer count of paise, never a decimal rupee value.
 * Example: ₹349.00 is represented as `{ amount: 34900, currency: 'INR' }`.
 */
export interface Money {
  amount: number;
  currency: 'INR';
}

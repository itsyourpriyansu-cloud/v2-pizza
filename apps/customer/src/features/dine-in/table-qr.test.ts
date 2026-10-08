import { describe, expect, it } from 'vitest';
import { extractTableToken } from './table-qr';

describe('table QR parsing', () => {
  it.each([
    ['https://order.pizzaavenue.example/dine-in/start?t=opaque-token-12', 'opaque-token-12'],
    ['/dine-in/start?t=table-12-valid', 'table-12-valid'],
    ['https://another-host.example/dine-in/start?t=signed-token', 'signed-token'],
  ])('extracts an opaque token from a dine-in start link', (value, expected) => {
    expect(extractTableToken(value, 'https://pizzaavenue.example')).toBe(expected);
  });

  it.each([
    '12',
    'table-12-valid',
    'https://pizzaavenue.example/menu?t=table-12-valid',
    'https://pizzaavenue.example/dine-in/start?table=12',
    'https://pizzaavenue.example/dine-in/start?phone=9999999999',
    '',
  ])('rejects non-table-link content: %s', (value) => {
    expect(extractTableToken(value, 'https://pizzaavenue.example')).toBeNull();
  });
});

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TableQrScanner } from './TableQrScanner';

const scannerMocks = vi.hoisted(() => ({
  decodeFromConstraints: vi.fn(),
  stop: vi.fn(),
}));

vi.mock('@zxing/browser', () => ({
  BrowserQRCodeReader: class {
    decodeFromConstraints = scannerMocks.decodeFromConstraints;
  },
}));

function renderScanner() {
  const router = createMemoryRouter([
    { path: '/dine-in/start', element: <TableQrScanner /> },
  ], { initialEntries: ['/dine-in/start'] });
  return { router, ...render(<RouterProvider router={router} />) };
}

function scannerCallback() {
  return scannerMocks.decodeFromConstraints.mock.calls[0]?.[2] as (
    result: { getText: () => string } | undefined,
    error: unknown,
    controls: { stop: () => void },
  ) => void;
}

describe('in-app table QR scanner', () => {
  beforeEach(() => {
    scannerMocks.decodeFromConstraints.mockReset();
    scannerMocks.stop.mockReset();
    scannerMocks.decodeFromConstraints.mockResolvedValue({ stop: scannerMocks.stop });
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true });
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn() },
    });
  });

  it('waits for explicit permission intent before starting the camera', async () => {
    const user = userEvent.setup();
    renderScanner();

    expect(screen.getByRole('heading', { name: 'Scan the QR on your table' })).toBeVisible();
    expect(scannerMocks.decodeFromConstraints).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Start camera/ }));

    await waitFor(() => expect(scannerMocks.decodeFromConstraints).toHaveBeenCalledOnce());
    const constraints = scannerMocks.decodeFromConstraints.mock.calls[0]?.[0];
    expect(constraints).toEqual({
      audio: false,
      video: { facingMode: { ideal: 'environment' } },
    });
    expect(await screen.findByText('Looking for the table QR')).toBeVisible();
  });

  it('extracts the token and navigates internally after a valid scan', async () => {
    const user = userEvent.setup();
    const { router } = renderScanner();
    await user.click(screen.getByRole('button', { name: /Start camera/ }));
    await waitFor(() => expect(scannerMocks.decodeFromConstraints).toHaveBeenCalledOnce());

    act(() => scannerCallback()(
      { getText: () => 'https://qr.pizzaavenue.example/dine-in/start?t=table-12-valid' },
      undefined,
      { stop: scannerMocks.stop },
    ));

    await waitFor(() => expect(router.state.location.search).toBe('?t=table-12-valid'));
    expect(scannerMocks.stop).toHaveBeenCalled();
  });

  it('keeps scanning and explains an unrelated QR', async () => {
    const user = userEvent.setup();
    renderScanner();
    await user.click(screen.getByRole('button', { name: /Start camera/ }));
    await waitFor(() => expect(scannerMocks.decodeFromConstraints).toHaveBeenCalledOnce());

    act(() => scannerCallback()(
      { getText: () => 'https://example.com/summer-offer' },
      undefined,
      { stop: scannerMocks.stop },
    ));

    expect(await screen.findByRole('alert')).toHaveTextContent('not a Pizza Avenue table QR');
    expect(scannerMocks.stop).not.toHaveBeenCalled();
  });

  it('shows a recoverable state when camera permission is denied', async () => {
    scannerMocks.decodeFromConstraints.mockRejectedValueOnce(new DOMException('Denied', 'NotAllowedError'));
    const user = userEvent.setup();
    renderScanner();

    await user.click(screen.getByRole('button', { name: /Start camera/ }));

    expect(await screen.findByRole('heading', { name: 'Camera access is off' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try camera again' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Choose Pickup instead' })).toBeVisible();
  });

  it('stops the camera when the scanner unmounts', async () => {
    const user = userEvent.setup();
    const { unmount } = renderScanner();
    await user.click(screen.getByRole('button', { name: /Start camera/ }));
    await screen.findByText('Looking for the table QR');

    unmount();

    expect(scannerMocks.stop).toHaveBeenCalled();
  });
});

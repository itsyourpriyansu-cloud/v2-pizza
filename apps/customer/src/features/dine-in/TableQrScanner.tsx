import type { IScannerControls } from '@zxing/browser';
import { Camera, QrCode, ShieldCheck, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonLink, PageHeader, Surface } from '../../shared/components/Primitives';
import { extractTableToken } from './table-qr';

type ScannerState = 'idle' | 'starting' | 'scanning' | 'error';

type ScannerError = {
  title: string;
  body: string;
};

function describeCameraError(error: unknown): ScannerError {
  const name = error instanceof DOMException
    ? error.name
    : typeof error === 'object' && error && 'name' in error
      ? String(error.name)
      : '';

  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return {
      title: 'Camera access is off',
      body: 'Allow camera access for Pizza Avenue in your browser settings, then try again. Nothing has been ordered.',
    };
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return {
      title: 'No camera is available',
      body: 'Try your phone’s camera app on the table QR, or choose Pickup instead.',
    };
  }
  return {
    title: 'Camera could not start',
    body: 'Check camera permission and try again. You can also scan the table QR with your phone’s camera app.',
  };
}

export function TableQrScanner() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const hasResultRef = useRef(false);
  const [scannerState, setScannerState] = useState<ScannerState>('idle');
  const [scannerError, setScannerError] = useState<ScannerError | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    const stream = videoRef.current?.srcObject;
    if (stream && 'getTracks' in stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => stopScanner, [stopScanner]);

  const closeScanner = useCallback(() => {
    stopScanner();
    hasResultRef.current = false;
    setScanMessage(null);
    setScannerError(null);
    setScannerState('idle');
  }, [stopScanner]);

  const startScanner = useCallback(async () => {
    setScannerError(null);
    setScanMessage(null);
    hasResultRef.current = false;

    if (window.isSecureContext === false || !navigator.mediaDevices?.getUserMedia) {
      setScannerError({
        title: 'Camera scanning is not supported here',
        body: 'Open this page in a current browser over a secure connection, or scan the table QR with your phone’s camera app.',
      });
      setScannerState('error');
      return;
    }

    setScannerState('starting');
    try {
      const { BrowserQRCodeReader } = await import('@zxing/browser');
      const reader = new BrowserQRCodeReader(undefined, { delayBetweenScanAttempts: 180 });
      const controls = await reader.decodeFromConstraints(
        { audio: false, video: { facingMode: { ideal: 'environment' } } },
        videoRef.current ?? undefined,
        (result, _error, activeControls) => {
          if (!result || hasResultRef.current) return;
          const token = extractTableToken(result.getText());
          if (!token) {
            setScanMessage('That is not a Pizza Avenue table QR. Point at the code fixed to your table.');
            return;
          }
          hasResultRef.current = true;
          activeControls.stop();
          stopScanner();
          navigate(`/dine-in/start?t=${encodeURIComponent(token)}`, {
            replace: true,
            state: { tableQrSource: 'IN_APP_CAMERA' },
          });
        },
      );
      controlsRef.current = controls;
      if (!hasResultRef.current) setScannerState('scanning');
    } catch (error) {
      stopScanner();
      setScannerError(describeCameraError(error));
      setScannerState('error');
    }
  }, [navigate, stopScanner]);

  const cameraActive = scannerState === 'starting' || scannerState === 'scanning';

  return (
    <div className="page-stack dine-in-scan-guide">
      <PageHeader
        eyebrow="Dine In"
        title="Scan the QR on your table"
        description="This securely connects your order to the table you’re sitting at. You’ll confirm the table before anything can be ordered."
      />

      {scannerState === 'idle' ? (
        <Surface className="dine-in-scan-card">
          <span className="dine-in-scan-card__icon" aria-hidden="true"><QrCode /></span>
          <div className="dine-in-scan-card__intro">
            <h2>Connect your table</h2>
            <p>Camera access starts only after you tap the button. No table number can be entered manually.</p>
          </div>
          <ol>
            <li><strong>Start the camera</strong><span>Point it at the QR fixed to this table.</span></li>
            <li><strong>Check the table</strong><span>We’ll show the verified table before you continue.</span></li>
            <li><strong>Order with confidence</strong><span>Your waiter still confirms each round before it reaches the kitchen.</span></li>
          </ol>
          <div className="dine-in-scan-card__actions">
            <Button type="button" onClick={() => void startScanner()}><Camera aria-hidden="true" /> Start camera</Button>
            <ButtonLink to="/" variant="secondary">Choose Pickup instead</ButtonLink>
          </div>
          <p className="dine-in-scan-card__privacy"><ShieldCheck aria-hidden="true" /> Only the scanned table token is sent for verification.</p>
        </Surface>
      ) : null}

      {cameraActive ? (
        <Surface className="table-scanner" aria-label="Table QR scanner">
          <div className="table-scanner__viewport">
            <video ref={videoRef} autoPlay muted playsInline aria-label="Camera preview for table QR scanning" />
            <div className="table-scanner__shade" aria-hidden="true" />
            <div className="table-scanner__frame" aria-hidden="true"><span /><span /><span /><span /></div>
            <button className="table-scanner__close" type="button" onClick={closeScanner} aria-label="Close camera"><X /></button>
            <div className="table-scanner__status" role="status" aria-live="polite">
              <strong>{scannerState === 'starting' ? 'Starting camera…' : 'Looking for the table QR'}</strong>
              <span>Hold your phone steady with the full code inside the frame.</span>
            </div>
          </div>
          {scanMessage ? <p className="table-scanner__message" role="alert">{scanMessage}</p> : null}
          <ButtonLink to="/" variant="ghost" onClick={stopScanner}>Choose Pickup instead</ButtonLink>
        </Surface>
      ) : null}

      {scannerState === 'error' && scannerError ? (
        <Surface className="table-scanner-error" role="alert">
          <span className="table-scanner-error__icon" aria-hidden="true"><Camera /></span>
          <div>
            <h2>{scannerError.title}</h2>
            <p>{scannerError.body}</p>
          </div>
          <div className="dine-in-scan-card__actions">
            <Button type="button" onClick={() => void startScanner()}>Try camera again</Button>
            <ButtonLink to="/" variant="secondary">Choose Pickup instead</ButtonLink>
          </div>
        </Surface>
      ) : null}
    </div>
  );
}

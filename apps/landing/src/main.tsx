import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createSurfaceConfig } from '@pizza-avenue/config';
import './styles.css';

const surfaceConfig = createSurfaceConfig(import.meta.env, window.location.origin);
const root = document.getElementById('root');

if (!root) throw new Error('Landing root element is missing.');

createRoot(root).render(
  <StrictMode>
    <main>
      <h1>The Pizza Avenue</h1>
      <p>Landing surface architecture is ready. Marketing content is intentionally deferred.</p>
      <a href={surfaceConfig.customerAppUrl}>Order now</a>
    </main>
  </StrictMode>,
);

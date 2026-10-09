import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createSurfaceConfig } from '@pizza-avenue/config';
import '@fontsource/phudu/latin-600.css';
import '@fontsource/phudu/latin-700.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import { LandingPage } from './LandingPage';
import './styles.css';
import './reference.css';

const surfaceConfig = createSurfaceConfig(import.meta.env, window.location.origin);
const root = document.getElementById('root');

if (!root) throw new Error('Landing root element is missing.');

createRoot(root).render(
  <StrictMode>
    <LandingPage customerAppUrl={surfaceConfig.customerAppUrl} />
  </StrictMode>,
);

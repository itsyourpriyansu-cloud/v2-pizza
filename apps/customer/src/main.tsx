import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { customerRouter } from './app/router';
import { startMocks } from './app/start-mocks';
import './styles.css';

async function bootstrap() {
  await startMocks();
  const root = document.getElementById('root');
  if (!root) throw new Error('Customer root element is missing.');

  createRoot(root).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={customerRouter} />
      </AppProviders>
    </StrictMode>,
  );
}

void bootstrap();

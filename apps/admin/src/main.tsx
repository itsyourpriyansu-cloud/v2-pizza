import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AdminProviders } from './app/providers';
import { adminRouter } from './app/router';
import { startMocks } from './app/start-mocks';
import './styles.css';

async function bootstrap() {
  await startMocks();
  const root = document.getElementById('root');
  if (!root) throw new Error('Admin root element is missing.');
  createRoot(root).render(
    <StrictMode>
      <AdminProviders>
        <RouterProvider router={adminRouter} />
      </AdminProviders>
    </StrictMode>,
  );
}

void bootstrap();

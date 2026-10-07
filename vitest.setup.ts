import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetScenarioState, server } from '@pizza-avenue/mocks/server';

configure({ asyncUtilTimeout: 4_000 });

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetScenarioState();
});

afterAll(() => server.close());

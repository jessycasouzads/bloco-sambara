/// <reference types="vitest/globals" />
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

// RTL no limpia el DOM entre tests automáticamente con Vitest.
// Hacemos cleanup manual para evitar leaks entre tests.
afterEach(() => {
  cleanup();
});

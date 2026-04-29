import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';

/**
 * Documentación interactiva de la API en /api-docs.
 *
 * Pública (sin login). Lazy-loaded desde App.tsx para no inflar el bundle
 * principal — Scalar pesa ~300 KB.
 *
 * El spec vive en public/openapi.yaml y se sirve como asset estático.
 */
export default function ApiDocsPage() {
  return (
    <ApiReferenceReact
      configuration={{
        url: '/openapi.yaml',
        theme: 'default',
      }}
    />
  );
}

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pill } from './Pill';

describe('Pill', () => {
  it('renders children inside a span', () => {
    render(<Pill>Activo</Pill>);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('applies neutral tone classes by default', () => {
    render(<Pill>Default</Pill>);
    const el = screen.getByText('Default');
    expect(el.className).toContain('bg-parchment');
    expect(el.className).toContain('text-ink/70');
  });

  it('applies brand tone classes when tone="brand"', () => {
    render(<Pill tone="brand">Brand</Pill>);
    const el = screen.getByText('Brand');
    expect(el.className).toContain('bg-brand-100');
    expect(el.className).toContain('text-brand-700');
  });

  it('applies success tone classes when tone="success"', () => {
    render(<Pill tone="success">Al día</Pill>);
    expect(screen.getByText('Al día').className).toContain('bg-green-100');
  });

  it('applies warning tone classes when tone="warning"', () => {
    render(<Pill tone="warning">Pendiente</Pill>);
    expect(screen.getByText('Pendiente').className).toContain('bg-amber-100');
  });

  it('applies danger tone classes when tone="danger"', () => {
    render(<Pill tone="danger">Atrasado</Pill>);
    expect(screen.getByText('Atrasado').className).toContain('bg-rose-100');
  });
});

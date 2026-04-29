import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink/80">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-12 w-full rounded-xl border border-parchment bg-white px-4 text-[15px] text-ink',
          'placeholder:text-ink/40',
          'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200',
          'disabled:bg-parchment/40 disabled:opacity-60',
          error && 'border-danger focus:border-danger focus:ring-rose-200',
          className,
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
});

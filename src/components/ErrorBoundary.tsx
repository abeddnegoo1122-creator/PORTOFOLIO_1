import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected application error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#E6E6E6] text-[#111111] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#F2F2F2] border-[1.5px] border-[#111111] rounded-xl p-8 flex flex-col gap-4">
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#133926]">
              SYSTEM // RECOVERY
            </span>
            <h1 className="font-display text-2xl font-extrabold uppercase">
              Something went wrong
            </h1>
            <p className="font-mono text-xs text-[#5A5A5A] break-words bg-white p-3 rounded border border-[#111111]/15">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="self-start px-5 py-2.5 rounded bg-[#111111] text-white hover:bg-[#133926] font-mono text-[11px] font-bold tracking-[0.14em] uppercase cursor-pointer"
            >
              RELOAD APPLICATION
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

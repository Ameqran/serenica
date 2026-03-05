'use client';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="state-card">
      <div className="state-title">{message}</div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state-card state-card-error">
      <div className="state-title">Error</div>
      <p>{message}</p>
    </div>
  );
}

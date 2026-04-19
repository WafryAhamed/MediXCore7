
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './Router';

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

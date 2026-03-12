import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the home route through the application providers', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: 'Template workspace is ready for the first Codex-guided feature.',
      }),
    ).toBeInTheDocument();
  });
});

import { act, screen } from '@testing-library/react';
import { renderApp } from './index';

describe('renderApp', () => {
  it('mounts the application into the provided root element', async () => {
    const rootElement = document.createElement('div');
    document.body.appendChild(rootElement);

    await act(async () => {
      renderApp(rootElement);
    });

    expect(
      screen.getByRole('heading', {
        name: 'Template workspace is ready for the first Codex-guided feature.',
      }),
    ).toBeInTheDocument();
  });
});

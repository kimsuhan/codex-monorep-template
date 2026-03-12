import { render, screen } from '@testing-library/react';
import { TemplateReadinessChecklist } from './TemplateReadinessChecklist';

describe('TemplateReadinessChecklist', () => {
  it('renders the recommended next steps for a freshly cloned workspace', () => {
    render(<TemplateReadinessChecklist />);

    expect(
      screen.getByRole('heading', { name: 'Workspace readiness' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Replace the template name with your project identity.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Set app-level environment variables from the examples.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Run pnpm validate before opening the first PR.'),
    ).toBeInTheDocument();
  });
});

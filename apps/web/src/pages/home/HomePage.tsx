import '@/pages/home/home-page.css';
import { TemplateReadinessChecklist } from '@/features/template-readiness/ui/TemplateReadinessChecklist';
import { WorkspaceTargetsPanel } from '@/pages/home/ui/WorkspaceTargetsPanel';
import { getAppConfig } from '@/shared/config/app-config';
import { Surface } from '@/shared/ui/Surface';

export function HomePage() {
  const { apiBaseUrl, appName } = getAppConfig();

  return (
    <main className="home-shell">
      <section className="home-hero">
        <p className="home-eyebrow">{appName}</p>
        <h1 className="home-title">
          Template workspace is ready for the first Codex-guided feature.
        </h1>
        <p className="home-copy">
          This frontend keeps `app`, `pages`, `features`, and `shared`
          responsibilities visible from the first commit. Point the web app at{' '}
          <code>{apiBaseUrl}</code>, replace the template identity, and start
          with a vertical slice instead of a blank screen.
        </p>
      </section>
      <section className="home-grid" aria-label="template workspace overview">
        <Surface>
          <WorkspaceTargetsPanel />
        </Surface>
        <Surface>
          <TemplateReadinessChecklist />
        </Surface>
      </section>
    </main>
  );
}

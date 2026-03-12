const WORKSPACE_TARGETS = [
  { label: 'web', title: 'React + Vite' },
  { label: 'api', title: 'NestJS' },
] as const;

export function WorkspaceTargetsPanel() {
  return (
    <section className="workspace-targets-panel" aria-label="workspace targets">
      {WORKSPACE_TARGETS.map((target) => (
        <div key={target.label} className="workspace-targets-item">
          <span className="workspace-targets-label">{target.label}</span>
          <strong className="workspace-targets-title">{target.title}</strong>
        </div>
      ))}
    </section>
  );
}

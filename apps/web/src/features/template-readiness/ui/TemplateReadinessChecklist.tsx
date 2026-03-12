import { templateReadinessItems } from '../model/template-readiness-items';

export function TemplateReadinessChecklist() {
  return (
    <section
      className="template-readiness-card"
      aria-labelledby="template-readiness-title"
    >
      <p className="template-readiness-eyebrow">Example feature</p>
      <h2 id="template-readiness-title" className="template-readiness-title">
        Workspace readiness
      </h2>
      <ul className="template-readiness-list">
        {templateReadinessItems.map((item) => (
          <li key={item} className="template-readiness-item">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

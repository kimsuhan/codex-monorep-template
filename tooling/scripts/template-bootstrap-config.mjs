export const bootstrapTemplatePath = 'docs/init/codex-bootstrap-template.md';
export const bootstrapDirectoryPath = '.codex/bootstrap';
export const bootstrapPromptPath = `${bootstrapDirectoryPath}/init.prompt.md`;
export const bootstrapManifestPath = `${bootstrapDirectoryPath}/init.config.json`;

export const requiredSkills = [
  {
    id: 'vercel-react-best-practices',
    displayName: 'vercel-react-best-practices',
    requirement: 'required for apps/web work',
    installSummary:
      'Install from the official Vercel skill source at https://github.com/vercel-labs/agent-skills/tree/main/vercel-react-best-practices and restart Codex.',
  },
  {
    id: 'nestjs-best-practices',
    displayName: 'nestjs-best-practices',
    requirement: 'required for apps/api work',
    installSummary:
      'Install from https://github.com/Kadajett/agent-nestjs-skills and restart Codex.',
  },
  {
    id: 'impeccable',
    displayName: 'impeccable',
    requirement: 'required when establishing or refining design quality',
    installSummary:
      'Install from https://github.com/pbakaus/impeccable into `~/.agents` so the bundled refinement skills such as `audit`, `critique`, `polish`, `harden`, and `optimize` are available, then restart Codex.',
  },
  {
    id: 'superpowers',
    displayName: 'superpowers',
    requirement: 'required for planning, verification, debugging, and workflow discipline',
    installSummary:
      'Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md, then restart Codex.',
  },
];

export const optionalSkills = [
  {
    id: 'ui-ux-pro-max',
    displayName: 'ui-ux-pro-max',
    requirement: 'optional for broader UI exploration before converging on repository rules',
    installSummary:
      'Install with `npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max -g -y`, then restart Codex.',
  },
];

export const optionalSkillIds = optionalSkills.map((skill) => skill.id);

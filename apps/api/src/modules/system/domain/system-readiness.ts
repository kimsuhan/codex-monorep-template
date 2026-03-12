export interface SystemReadiness {
  name: string;
  status: 'ready';
  checks: {
    config: 'loaded';
  };
}

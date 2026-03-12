export interface SystemHealth {
  name: string;
  status: 'ok';
  checks: {
    api: 'up';
  };
}

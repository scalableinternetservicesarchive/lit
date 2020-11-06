export enum AppService {
  /**
   * Runs a background process every 10s.
   */
  BACKGROUND = 'BACKGROUND',
}

const services = (process.env.SERVICES || '').split(',') as AppService[]

function isProd() {
  return process.env.NODE_ENV === 'production'
}

function isServiceEnabled(svc: AppService) {
  return services.includes(svc)
}

export const Config = {
  isProd: isProd(),
  appName: process.env.APP_NAME || 'lit',
  appserverPort: Number(process.env.APP_PORT || 3000),
  appserverTag: process.env.APPSERVER_TAG || 'local',
  honeyKey: process.env.HONEYCOMB_KEY || '86f6f8a9b4c10d722687584a7c9727b1',
  honeyDatasets: (process.env.HONEYCOMB_DATASETS || 'op').split(',').map(d => (isProd() ? d : 'dev-' + d)),
  backgroundService: isServiceEnabled(AppService.BACKGROUND) ? true : !isProd(),
  wsUrl: process.env.WS_URL || 'ws://localhost:3000/graphqlsubscription',
  adminPassword: process.env.ADMIN_PASSWORD || 'password',
}

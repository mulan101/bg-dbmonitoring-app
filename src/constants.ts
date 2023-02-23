import { NavModelItem } from '@grafana/data';
import pluginJson from './plugin.json';

export const PLUGIN_BASE_URL = `/a/${pluginJson.id}`;
export const API_SERVER_URL = 'http://13.209.126.167:7001'

export enum ROUTES {
  Dashboard = 'dashboard',
  DashboardRegist = 'dashboard_regist',
  Report = 'report',
  ReportRegist = 'report_regist',
  User = 'user',
  UserRegist = 'user_regist'
}

export const NAVIGATION_TITLE = '설정';
export const NAVIGATION_SUBTITLE = '대시보드별 리포트 설정';

export const NAVIGATION: Record<string, NavModelItem> = {
  [ROUTES.Dashboard]: {
    id: ROUTES.Dashboard,
    text: '대시보드 관리',
    icon: 'sliders-v-alt',
    url: `${PLUGIN_BASE_URL}/dashboard`,
  },
  [ROUTES.Report]: {
    id: ROUTES.Report,
    text: '리포트 관리',
    icon: 'sliders-v-alt',
    url: `${PLUGIN_BASE_URL}/report`,
  },
  [ROUTES.User]: {
    id: ROUTES.User,
    text: '리포트 사용자 관리',
    icon: 'sliders-v-alt',
    url: `${PLUGIN_BASE_URL}/user`,
  },
};

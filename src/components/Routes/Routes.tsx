
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { DashboardList, DashboardRegist } from '../../pages/dashboard';
import { ReportList, ReportRegist } from '../../pages/report';
import { UserList, UserRegist } from '../../pages/user';
import { prefixRoute, useNavigation } from '../../utils/utils.routing';
import { ROUTES } from '../../constants';

export const Routes = () => {
  useNavigation();

  return (
    <Switch>
      <Route exact path={prefixRoute(ROUTES.Report)} component={ReportList} />
      <Route exact path={prefixRoute(ROUTES.ReportRegist)} component={ReportRegist} />
      <Route exact path={`${prefixRoute(ROUTES.ReportRegist)}/:dbId/:reportId`} component={ReportRegist} />
      <Route exact path={prefixRoute(ROUTES.User)} component={UserList} />
      <Route exact path={prefixRoute(ROUTES.UserRegist)} component={UserRegist} />
      <Route exact path={prefixRoute(ROUTES.DashboardRegist)} component={DashboardRegist} />
      <Route exact path={`${prefixRoute(ROUTES.DashboardRegist)}/:dbId`} component={DashboardRegist} />
      <Route component={DashboardList} />
    </Switch>
  );
};

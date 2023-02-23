import { DeleteButton, LinkButton, VerticalGroup } from '@grafana/ui';
import { API_SERVER_URL, PLUGIN_BASE_URL, ROUTES } from '../../constants';
import { config } from '@grafana/runtime';
import * as React from 'react';
import { useFetchList } from 'components/hooks/useFetch';

export interface Dashboard {
  custId: string;
  dbId: string;
  dbName: string;
  mkDate: string;
}

export const DashboardList = () => {
  console.log("대시보드 조회")
  
  const custId = config.bootData.user.orgId
  const dashboards: Dashboard[] = useFetchList(`${API_SERVER_URL}/dms/v1/custs/${custId}/dashboards`)
  
  function onDelete(dashboardId: string) {
    if(window.confirm("대시보드 삭제 시 연결된 리포트 및 리포트 사용자 정보가 모두 삭제됩니다. \n삭제 하시겠습니까?")) {
      fetch(`${API_SERVER_URL}/dms/v1/custs/${custId}/dashboards/${dashboardId}`, {
        method: "DELETE",
      }).then(res => {
        if (res.ok) {
          alert("삭제가 완료 되었습니다");
          location.reload();
        }
      })
    }
  }

  return (
    <>
        <h3>대시보드 조회</h3>
        <div className="text-right">
          <LinkButton href={`${PLUGIN_BASE_URL}/${ROUTES.DashboardRegist}`}>
            등록
          </LinkButton>
        </div>

        <div className="admin-list-table">
          <VerticalGroup spacing="md">
            <table className="filter-table filter-table--hover form-inline">
              <thead>
                <tr>
                  <th>대시보드 명</th>
                  <th>대시보드 아이디</th>
                  <th style={{ width: '1%' }} />
                </tr>
              </thead>
              <tbody>
                {dashboards.map(dashboard => (
                  <tr key={dashboard.dbId}>
                    <td className="link-td">
                        <a href={`${PLUGIN_BASE_URL}/${ROUTES.DashboardRegist}/${dashboard.dbId}`}>{dashboard.dbName}</a>
                    </td>
                    <td className="link-td">
                        {dashboard.dbId}
                    </td>
                    <td className="text-right">
                        <DeleteButton
                        size="sm"
                        onConfirm={() => onDelete(dashboard.dbId)}
                        />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </VerticalGroup>
        </div>
      </>
  );
}

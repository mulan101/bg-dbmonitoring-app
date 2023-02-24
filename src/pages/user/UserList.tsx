import { Button, DeleteButton, LinkButton, VerticalGroup } from '@grafana/ui';
import { API_SERVER_URL, PLUGIN_BASE_URL, ROUTES } from '../../constants';
import * as React from 'react';
import { config } from '@grafana/runtime';
import { useFetchList } from 'components/hooks/useFetch';

export interface User {
  custId: string;
  dbId: string;
  dbName: string; // 대시보드명
  reportId: string;
  reportName: string; // 리포트명
  email: string; // 이메일
  erName: string; // 이메일 레포트 명
  lastSentTime: string;
  mkDate: string;
}

export const UserList = () => {

  console.log("리포트 사용자 조회")
  
  const custId = config.bootData.user.orgId
  const moment = require("moment");
  const users: User[] = useFetchList(`${API_SERVER_URL}/dms/v1/custs/${custId}/dashboards/reports/emailReports`)

  function onDelete(dashboardId: string, reportId: string, email: string) {
    if(window.confirm("삭제 하시겠습니까?")) {
      fetch(`${API_SERVER_URL}/dms/v1/custs/${custId}/dashboards/${dashboardId}/reports/${reportId}/emailReports/${email}`, {
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
            <h3>리포트 사용자 조회</h3>
            <div className="text-right">
              <LinkButton href={`${PLUGIN_BASE_URL}/${ROUTES.UserRegist}`}>
                등록
              </LinkButton>
            </div>

            <div className="admin-list-table">
              <VerticalGroup spacing="md">
                <table className="filter-table filter-table--hover form-inline">
                  <thead>
                    <tr>
                      <th>대시보드 명</th>
                      <th>리포트 명</th>
                      <th>이메일</th>
                      <th>최종 발송일자</th>
                      <th>최종 발송 레포트</th>
                      <th style={{ width: '1%' }} />
                    </tr>
                  </thead>
                  <tbody>
                  {users.map(user => (
                    <tr key={user.email}>
                        <td className="link-td">
                          <a href={`${PLUGIN_BASE_URL}/${ROUTES.UserRegist}/${user.dbId}/${user.reportId}/${user.email}`}>{user.dbName}</a>
                        </td>
                        <td className="link-td">
                            {user.reportName}
                        </td>
                        <td className="link-td">
                            {user.email}
                        </td>
                        <td className="link-td">
                            {
                              user.lastSentTime && moment(user.lastSentTime, "YYYY-MM-DD[T]HH:mm:ss").add(9,"h").format("YYYY-MM-DD HH:mm:ss")
                            }
                        </td>
                        <td>
                            {
                              user.lastSentTime && <Button size='xs' icon="file-alt" onClick={()=>console.log("download click")}></Button>
                            }
                        </td>
                        <td className="text-right">
                            <DeleteButton
                            size="sm"
                            onConfirm={() => onDelete(user.dbId, user.reportId, user.email)}
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

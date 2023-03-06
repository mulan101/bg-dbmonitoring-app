import { Button, DeleteButton, LinkButton, VerticalGroup } from '@grafana/ui';
import { API_SERVER_URL, PLUGIN_BASE_URL, ROUTES } from '../../constants';
import * as React from 'react';
import { useFetchList } from 'components/hooks/useFetch';
import { config } from '@grafana/runtime';

export interface Report {
  custId: string;
  dbId: string;
  dbName: string; // 대시보드명
  reportId: string;
  reportName: string; // 리포트명
  type: string; //  스케줄 타입
  rtime: number; // 스케줄 시간
  rtimeKst: string; // 스케줄 시간
  rday: string; // 스케줄 요일 -> 
  rdate: number; // ?
  searchAdd: string; //부가 조건
  searchFrom: string; // 시작 날짜 조건
  searchTo: string; // 종료 날짜 조건
  lastReportFile: string; // ?
  lastSuccessTime: string; // ?
  mkDate: string // ?
}
export const ReportList = () => {

  console.log("리포트 조회")
  
  const custId = config.bootData.user.orgId
  const moment = require("moment");
  const reports: Report[] = useFetchList(`${API_SERVER_URL}/dms/v1/custs/${custId}/dashboards/reports`)

  function handleDownload(downloadUrl: string, filename: string) {
    fetch(downloadUrl, {
      method: "GET"
    }).then(res => {
      return res.blob()
    }).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.target = "_blank"
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
    
  }

  function onDelete(dashboardId: string, reportId: string) {
    if(window.confirm("리포트 삭제 시 연결된 리포트 사용자 정보가 모두 삭제됩니다. \n삭제 하시겠습니까?")) {
      fetch(`${API_SERVER_URL}/dms/v1/custs/${custId}/dashboards/${dashboardId}/reports/${reportId}`, {
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
          <h3>리포트 조회</h3>
          <div className="text-right">
            <LinkButton href={`${PLUGIN_BASE_URL}/${ROUTES.ReportRegist}`}>
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
                    <th>스케줄 타입</th>
                    <th>최종 완료 일자</th>
                    <th>최종 발송 레포트</th>
                    <th style={{ width: '1%' }} />
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.reportId}>
                        <td className="link-td">
                          <a href={`${PLUGIN_BASE_URL}/${ROUTES.ReportRegist}/${report.dbId}/${report.reportId}`}>{report.dbName}</a>
                        </td>
                        <td className="link-td">
                          {report.reportName}
                        </td>
                        <td className="link-td">
                            {report.type === 'daily' ? '일' : (report.type === 'weekly' ? '주' : '월')}
                        </td>
                        <td className="link-td">
                            {
                              report.lastSuccessTime && moment(report.lastSuccessTime, "YYYY-MM-DD[T]HH:mm:ss").add(9,"h").format("YYYY-MM-DD HH:mm:ss")
                            }
                        </td>
                        <td>
                            {
                              report.lastSuccessTime && <Button size='xs' icon="file-alt" onClick={()=>handleDownload(`${API_SERVER_URL}/dms/v1/custs/${custId}/files/${report.lastReportFile}`, report.lastReportFile)}></Button>
                            }
                        </td>
                        <td className="text-right">
                            <DeleteButton
                            size="sm"
                            onConfirm={() => onDelete(report.dbId, report.reportId)}
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

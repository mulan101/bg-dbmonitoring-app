import * as React from 'react';
import { useEffect, useState } from "react";
import { Button, Field, Input, FieldSet } from '@grafana/ui';
import { useHistory, useParams } from "react-router-dom";
import { config } from '@grafana/runtime';
import { PLUGIN_BASE_URL, API_SERVER_URL, ROUTES } from '../../constants';
import { Dashboard } from './DashboardList';
import { useFetch } from 'components/hooks/useFetch';

const divStyle = {
    width: "40%"
  }

export const DashboardRegist = () => {
  console.log("대시보드 등록/수정")
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { dbId } = useParams<{dbId: string}>();
  const type = (dbId === undefined) // 화면 유형 true: 등록, false: 수정
  const custId = config.bootData.user.orgId;
  const url = `${API_SERVER_URL}/dms/v1/custs/${custId}/dashboards`;
  const dashboard: Dashboard = useFetch(`${url}/${dbId}`, dbId);
  const [dashboardState, setDashboardState] = useState(dashboard);
  
  // state 값 초기화
  useEffect(() => {
    if(!type) {
      setDashboardState((prevState) => {
        return {
          ...prevState, 
          dbName: dashboard.dbName,
          dbId: dashboard.dbId
        }
      })
    }
  }, [type, dashboard.dbName, dashboard.dbId]);

  // Input 핸들러
  const handleChange = (e: any) => {
    setDashboardState((prevState: any) => {
      return {...prevState, [e.target.name]: e.target.value}
    })
  }
  
  //등록 버튼 클릭
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoading) {
      setIsLoading(true);

      const dbName = dashboardState.dbName;
      const dbId = dashboardState.dbId;
      const request_body = JSON.stringify({
        dbName,
        dbId
      });

      fetch(`${url}/${(type ? "": dbId)}`, {
          method: type ? "POST" : "PUT",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
          },
          body: request_body,
        }).then(res => {
          if (res.ok) {
            alert("완료 되었습니다");
            setIsLoading(false);
            history.push(`${PLUGIN_BASE_URL}/${ROUTES.Dashboard}`)
          }
        });
    }
  }

  return (
    <div style={divStyle}>
      <h3>대시보드 {(type ? "등록": "수정")}</h3>
      <form onSubmit={onSubmit}>
            <FieldSet> 
              <Field label="대시보드 명">
                <Input name="dbName" onChange={handleChange} value={dashboardState.dbName} required/>
              </Field>
              <Field label="대시보드 아이디">
                <Input name="dbId" onChange={handleChange} value={dashboardState.dbId} required disabled={!type}/>
              </Field>
              <div className="gf-form-button-row">
                <Button type="submit" variant="primary" style={{
                  opacity: isLoading ? 0.3 : 1,
                }}>
                  {isLoading ? "Saving..." : "저장"}
                </Button>
              </div>
            </FieldSet>
      </form>
      </div>
  );
};

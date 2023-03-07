import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Field, Input, FieldSet, Select } from '@grafana/ui';
import { useHistory, useParams } from 'react-router-dom';
import { config } from '@grafana/runtime';
import { User } from './UserList';
import { useFetch, useFetchList } from 'components/hooks/useFetch';
import { Dashboard } from 'pages/dashboard/DashboardList';
import { API_SERVER_URL, PLUGIN_BASE_URL, ROUTES } from '../../constants';
import { Report } from 'pages/report/ReportList';

const divStyle = {
    width: "40%"
}

export const UserRegist = () => {
  console.log("리포트 사용자 등록/수정")
  const history = useHistory();
  const [isLoading, setIsLoading] = React.useState(false);
  const { dbId, reportId, email } = useParams<{dbId: string, reportId: string, email: string}>();
  const type = (reportId === undefined) // 화면 유형 true: 등록, false: 수정
  const custId = config.bootData.user.orgId;
  const url = `${API_SERVER_URL}/dms/v1/custs/${custId}/dashboards`;
  const user: User = useFetch(`${url}/${dbId}/reports/${reportId}/emailReports/${email}`, email);
  const dashboards: Dashboard[] = useFetchList(url);
  const [userState, setUserState] = useState(user);
  const reports: Report[] = useFetchList(`${url}/${type ? userState.dbId: dbId}/reports`);

  // state 값 초기화
  useEffect(() => {
    if(!type) {
      setUserState((prevState) => {
        return {
          ...prevState, 
          custId: user.custId,
          dbId: user.dbId,
          reportId: user.reportId,
          email: user.email,
          erName: user.erName
        }
      })
    }
    console.log(user)
  }, [type, user]);
  
  // Input 핸들러
  const handleChange = (e: any) => {
    setUserState((prevState: any) => {
      return { 
        ...prevState, 
        [e.target.name]: e.target.value
      }
    })
  }

  //등록 버튼 클릭
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoading) {
      setIsLoading(true);

      const request_body = JSON.stringify(userState);

      console.log(request_body)

      fetch(`${url}/${userState.dbId}/reports/${userState.reportId}/emailReports/${(type ? "": userState.email)}`, {
          method: type ? "POST" : "PUT",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
          },
          body: request_body,
        })
        .then(res => {
          if (res.ok) {
            alert("완료 되었습니다");
            history.push(`${PLUGIN_BASE_URL}/${ROUTES.User}`)
            return
          } else {
            return res.json()
          }  
        })
        .then(data => {
          if(data.code === "DUPLICATED") {
            alert("대시보드/리포트/이메일 정보가 이미 등록되었습니다.")
          }
          setIsLoading(false);
        });
    }
  }

  return (
    <div style={divStyle}>
      <h3>리포트 사용자 등록</h3>
      <form onSubmit={onSubmit}>
            <FieldSet>
            <Field label="사용자 리포트 명">
              <Input name="erName" onChange={handleChange} value={userState.erName} required/>
            </Field>
            <Field label="대시보드명">
              <Select 
                  disabled={!type}
                  options={dashboards.map(dashboard => ({'label':dashboard.dbName, 'value': dashboard.dbId}))}
                  onChange={v => {

                    setUserState((prevState: any) => {
                      return {
                        ...prevState, 
                        dbId: v.value
                      }
                    })
                  }}
                  value={userState.dbId}
                />
              </Field>
              <Field label="리포트명">
                  <Select 
                    disabled={!type}
                    options={reports.map(report => ({'label':report.reportName, 'value': report.reportId}))}
                    onChange={v => {
                      setUserState((prevState: any) => {
                        return {
                          ...prevState, 
                          reportId: v.value
                        }
                      })
                    }}
                    value={userState.reportId}
                  />
              </Field>
              <Field label="이메일">
                <Input name="email" onChange={handleChange} value={userState.email} placeholder="test@gmai.com" pattern="[a-zA-Z0-9\._-]+[@][a-zA-Z0-9]+[.]+[a-zA-Z]+[.]*[a-zA-Z]*" disabled={!type} required/>
              </Field>
              <div className="gf-form-button-row">
                <Button type="submit" variant="primary">
                  저장
                </Button>
              </div>
            </FieldSet>
      </form>
      </div>
  );
};

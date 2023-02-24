import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Field, Input, FieldSet, Select } from '@grafana/ui';
import { useHistory, useParams } from 'react-router-dom';
import { config } from '@grafana/runtime';
import { Report } from './ReportList';
import { useFetch, useFetchList } from 'components/hooks/useFetch';
import { Dashboard } from 'pages/dashboard/DashboardList';
import { API_SERVER_URL, PLUGIN_BASE_URL, ROUTES } from '../../constants';

const types = [
  { label: '일', value: "daliy"},
  { label: '주', value: "weekly"},
  { label: '월', value: "monthly"}
];

const days = [
  { label: '일', value: "sun"},
  { label: '월', value: "mon"},
  { label: '화', value: "tue"},
  { label: '수', value: "wed"},
  { label: '목', value: "thu"},
  { label: '금', value: "fri"},
  { label: '토', value: "sat"}
];

const divStyle = {
    width: "40%"
  }

export const ReportRegist = () => {
  console.log("리포트 등록/수정")
  const history = useHistory();
  const moment = require("moment");
  const [isLoading, setIsLoading] = useState(false);
  const { dbId, reportId } = useParams<{dbId: string, reportId: string}>();
  const type = (reportId === undefined) // 화면 유형 true: 등록, false: 수정
  const custId = config.bootData.user.orgId;
  const url = `${API_SERVER_URL}/dms/v1/custs/${custId}/dashboards`;
  const report: Report = useFetch(`${url}/${dbId}/reports/${reportId}`, reportId);
  const dashboards: Dashboard[] = useFetchList(url);
  const [reportState, setReportState] = useState(report);

  // state 값 초기화
  useEffect(() => {
    const rtimeKst = moment(report.rtime, "HHmm").add(9,"h").format("HH:mm")
    if(!type) {
      setReportState((prevState) => {
        return {
          ...prevState, 
          dbId: report.dbId,
          reportId: report.reportId,
          reportName: report.reportName,
          type: report.type,
          rtime: report.rtime,
          rtimeKst: rtimeKst,
          rday: report.rday,
          rdate: report.rdate,
          searchAdd: report.searchAdd,
          searchFrom: report.searchFrom,
          searchTo: report.searchTo
        }
      })
    }
  }, [type, report, moment]);

  // Input 핸들러
  const handleChange = (e: any) => {
    const pattern = new RegExp('[0-9]{2}:[0-9]{2}');
    if(e.target.name === "rtimeKst" && pattern.test(e.target.value) ) {
      const timeUTC = moment(e.target.value, "HH:mm").add(-9,"h").format("HHmm");
      setReportState((prevState: any) => {
        return { 
          ...prevState, 
          rtimeKst: e.target.value,
          rtime: timeUTC
        }
      })
    } else {
      setReportState((prevState: any) => {
        return { 
          ...prevState, 
          [e.target.name]: e.target.value 
        }
      })
    }
  }

  //등록 버튼 클릭
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoading) {
      setIsLoading(true);

      const request_body = JSON.stringify(reportState);

      console.log(request_body)

      fetch(`${url}/${reportState.dbId}/reports/${(type ? "": reportId)}`, {
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
            history.push(`${PLUGIN_BASE_URL}/${ROUTES.Report}`)
          }
        });
    }
  }

  return (
    <div style={divStyle}>
      <h3>리포트 등록</h3>
      <form onSubmit={onSubmit}>
            <FieldSet>
              <Field label="대시보드 명">  
                <Select 
                  disabled={!type}
                  options={dashboards.map(dashboard => ({'label':dashboard.dbName, 'value': dashboard.dbId}))}
                  onChange={v => {
                    setReportState((prevState: any) => {
                      return {
                        ...prevState, 
                        dbId: v.value
                      }
                    })
                  }}
                  value={reportState.dbId}
                />
              </Field> 
              <Field label="리포트 명">
                <Input name="reportName" onChange={handleChange} value={reportState.reportName} required/>
              </Field>
              <Field label="스케줄 타입">
                <Select 
                  options={types}
                  onChange={v => {
                    setReportState((prevState: any) => {
                      return {
                        ...prevState, 
                        type: v.value,
                        rday: "",
                        rdate: ""
                      }
                    })
                  }}
                  value={reportState.type}
                />
              </Field>
              <Field
                label="스케줄 시간"
                description={'예시) 시:분 -> 23:30'}
               >
                <Input name="rtimeKst" onChange={handleChange} value={reportState.rtimeKst} placeholder="00:00" pattern="[0-9]{2}:[0-9]{2}" required/>
              </Field>
              { reportState.type === "weekly" &&
                <Field
                  label="스케줄 요일"
                >
                <Select 
                  options={days}
                  onChange={v => {
                    setReportState((prevState: any) => {
                      return {
                        ...prevState, 
                        rday: v.value
                      }
                    })
                  }}
                  value={reportState.rday}
                />
                </Field>
              }
              { reportState.type === "monthly" &&
                <Field
                  label="스케줄 일자"
                  description={'예시) 31'}
                >
                  <Input name="rdate" onChange={handleChange} value={reportState.rdate} placeholder="31" pattern="[0-9]{2}" required/>
                </Field>
              }
              <Field label="부가조건">
                <Input name="searchAdd" onChange={handleChange} value={reportState.searchAdd} required/>
              </Field>
              <Field label="시작 날짜 조건">
                <Input name="searchFrom" onChange={handleChange} value={reportState.searchFrom} required/>
              </Field>
              <Field label="종료 날짜 조건">
                <Input name="searchTo" onChange={handleChange} value={reportState.searchTo} required/>
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

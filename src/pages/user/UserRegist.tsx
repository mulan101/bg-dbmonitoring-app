import * as React from 'react';
import { Button, Field, Input, FieldSet } from '@grafana/ui';

const dashboards = [
  { name: 'test1', value: "test1"},
  { name: 'test2', value: "test2"},
  { name: 'test3', value: "test3"}
];

const reports = [
  { name: 'test1', value: "test1"},
  { name: 'test2', value: "test2"},
  { name: 'test3', value: "test3"}
];

const divStyle = {
    width: "40%"
  }

export const UserRegist = () => {

  function onSubmit() {
    alert(11111)
  }

  return (
    <div style={divStyle}>
      <h3>리포트 사용자 등록</h3>
      <form onSubmit={onSubmit}>
            <FieldSet>
              <Field label="리포트명">
                <select>
                  {reports.map((report) => (
                    <option
                      key={report.value}
                      value={report.value}
                    >
                      {report.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="대시보드명">
                <select>
                  {dashboards.map((dashboard) => (
                    <option
                      key={dashboard.value}
                      value={dashboard.value}
                    >
                      {dashboard.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="이메일">
                <Input name="dashboardId" id="dashboardId" placeholder="test@gmai.com" required/>
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

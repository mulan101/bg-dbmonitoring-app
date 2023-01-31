import * as React from 'react';
import { useState } from 'react';
import { Button, Field, Input, FieldSet } from '@grafana/ui';

const dashboards = [
  { name: 'test1', value: "test1"},
  { name: 'test2', value: "test2"},
  { name: 'test3', value: "test3"}
];

const types = [
  { name: '일', value: "day"},
  { name: '주', value: "week"},
  { name: '월', value: "month"}
];

const divStyle = {
    width: "40%"
  }

export const ReportRegist = () => {

  const [type, setType] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setType(e.target.value)
    //alert(e.target.value); 
	};

  function onSubmit() {
    alert(11111)
  }

  return (
    <div style={divStyle}>
      <h3>리포트 등록</h3>
      <form onSubmit={onSubmit}>
            <FieldSet>
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
              <Field label="리포트명">
                <Input name="reportName" id="reportName" required/>
              </Field>
              <Field label="스케줄 타입">
                <select onChange={handleChange}>
                  {types.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="스케줄 시간"
                description={'예시) 시:분 -> 23:30'}
              >
                <Input id="scheduleTime" placeholder="00:00" required/>
              </Field>
              { type === "week" &&
                <Field
                  label="스케줄 요일"
                  description={'예시) Mon'}
                >
                  <Input id="scheduleDay" placeholder="Mon" required/>
                </Field>
              }
              { type === "month" &&
                <Field
                  label="스케줄 일자"
                  description={'예시) 31'}
                >
                  <Input id="scheduleDate" placeholder="01" required/>
                </Field>
              }
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

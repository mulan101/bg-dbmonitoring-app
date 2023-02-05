import * as React from 'react';
import { Button, Field, Input, FieldSet } from '@grafana/ui';
import { config } from '@grafana/runtime';
//import { useContext } from 'react';
//import PanelContext from 'PluginContext';

const divStyle = {
    width: "40%"
  }

export const DashboardRegist = () => {
  function onSubmit() {
    alert(11111)
    //const { userDetails } = useContext(PanelContext);
  }

  return (
    <div style={divStyle}>
      <h3>대시보드 등록</h3>
      <form onSubmit={onSubmit}>
            <Input type="hidden" name="custId" id="custId"  value={config.bootData.user.orgId}/>
            <FieldSet> 
              <Field label="대시보드명">
                <Input name="dashboardName" id="dashboardName" required/>
              </Field>
              <Field label="대시보드 아이디">
                <Input name="dashboardId" id="dashboardId" required/>
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

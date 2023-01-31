import { DeleteButton, LinkButton, VerticalGroup } from '@grafana/ui';
import { PLUGIN_BASE_URL, ROUTES } from '../../constants';
import * as React from 'react';

export const UserList = () => {

    function onDelete() {
        if(window.confirm("삭제 하시겠습니까?")) {
            alert("Deleted")
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
                      <th>리포트명</th>
                      <th>대시보드명</th>
                      <th>이메일</th>
                      <th>최종발송일자</th>
                      <th style={{ width: '1%' }} />
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="test1">
                        <td className="link-td">
                            <a href="#">test1</a>
                        </td>
                        <td className="link-td">
                            <a href="#">test1</a>
                        </td>
                        <td className="link-td">
                            <a href="#">aaa@gmail.com</a>
                        </td>
                        <td className="link-td">
                            <a href="#">2023.01.01 15:00:00</a>
                        </td>
                        <td className="text-right">
                            <DeleteButton
                            size="sm"
                            onConfirm={onDelete}
                            />
                        </td>
                    </tr>
                  </tbody>
                </table>
              </VerticalGroup>
            </div>
          </>
    );
}

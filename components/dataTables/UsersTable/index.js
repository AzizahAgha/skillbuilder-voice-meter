import React, { useMemo } from "react";
import styled from "styled-components";
import DataTable from "@ui-library/DataTable";
import Dropdown from "react-bootstrap/Dropdown";
import Tooltip from "@ui-library/Tooltip";
import { IoAddCircleSharp } from "react-icons/io5";
import { FiMoreHorizontal } from "react-icons/fi";
import { Width } from "@utils/helpers";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import ExpandableFirstName from "@ui-library/ExpandableFirstName";

export const Actions = {
  Edit: "Edit",
  Deactivate: "Inactive",
  Archive: "Archived",
  Delete: "Delete",
  AddAsAdmin: "AddAsAdmin",
  Unarchive: "Active",
  Activate: "Active",
  DeleteInvite: "DeleteInvite",
};

export default function UsersTable({
  data = [],
  searchKeyword = "",
  onAddUserClick,
  onUserActionClick,
  id,
}) {
  const isTabletOrMobile = useMediaQuery({ maxWidth: Width.mobile });
  const tableHeader = useMemo(() => {
    if (isTabletOrMobile)
      return [
        {
          accessor: "firstName",
          Header: "First Name",
          Cell: ({ row: { original, index } }) => (
            <ExpandableFirstName data={original} idx={index} />
          ),
          Footer: (
            <Tooltip text="Add User">
              <button
                type="button"
                className="btn p-0"
                onClick={onAddUserClick}
                id="btn-add-question"
              >
                <IoAddCircleSharp color="#81C2C0" size={34} />
              </button>
            </Tooltip>
          ),
        },
        {
          accessor: "lastName",
          Header: "Last Name",
          Cell: ({ value }) => <Text>{value}</Text>,
        },
        {
          accessor: "*",
          Header: "Action",
          Cell: ({ value, row: { original } }) =>
            original.status !== "Invited" ? (
              <Dropdown>
                <DropdownToggle variant="default">
                  <FiMoreHorizontal color="#969C9D" />
                </DropdownToggle>
                {/* {console.log(original)} */}
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => onUserActionClick(Actions.Edit, original)}
                  >
                    Edit
                  </Dropdown.Item>
                  {original.status === "Active" ? (
                    <>
                      <Dropdown.Item
                        onClick={() =>
                          onUserActionClick(Actions.Deactivate, original)
                        }
                      >
                        Deactivate
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          onUserActionClick(Actions.Archive, original)
                        }
                      >
                        Archive
                      </Dropdown.Item>
                    </>
                  ) : original.status === "Inactive" ? (
                    <Dropdown.Item
                      onClick={() =>
                        onUserActionClick(Actions.Activate, original)
                      }
                    >
                      Activate
                    </Dropdown.Item>
                  ) : original.status === "Archived" ? (
                    <Dropdown.Item
                      onClick={() =>
                        onUserActionClick(Actions.Unarchive, original)
                      }
                    >
                      Unarchive
                    </Dropdown.Item>
                  ) : (
                    ""
                  )}
                  {original.userId !== id && (
                    <Dropdown.Item
                      onClick={() =>
                        onUserActionClick(Actions.Delete, original)
                      }
                    >
                      Delete User
                    </Dropdown.Item>
                  )}

                  {original.userId !== id && original.isAdmin !== true && (
                    <Dropdown.Item
                      onClick={() =>
                        onUserActionClick(Actions.AddAsAdmin, original)
                      }
                    >
                      Set as Admin{" "}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Dropdown>
                <DropdownToggle variant="default">
                  <FiMoreHorizontal color="#969C9D" />
                </DropdownToggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      onUserActionClick(Actions.DeleteInvite, original)
                    }
                  >
                    Delete User
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ),
        },
      ];

    return [
      {
        accessor: "firstName",
        Header: "First Name",
        Cell: ({ value, row: { original } }) => (
          <div className="flex-grow-1 text-center d-flex align-items-center">
            <Profile
              src={original.avtarurl || "/images/default-user-avatar.jpg"}
            />
            <Text>{value}</Text>
          </div>
        ),
        Footer: (
          <Tooltip text="Add User">
            <button
              type="button"
              className="btn p-0"
              onClick={onAddUserClick}
              id="btn-add-question"
            >
              <IoAddCircleSharp color="#81C2C0" size={34} />
            </button>
          </Tooltip>
        ),
      },
      {
        accessor: "lastName",
        Header: "Last Name",
        Cell: ({ value }) => <Text>{value}</Text>,
      },
      {
        accessor: "email",
        Header: "Email",
        Cell: ({ value }) => <Text>{value}</Text>,
      },
      {
        accessor: "title",
        Header: "Title",
        Cell: ({ value }) => <Text>{value}</Text>,
      },
      {
        accessor: "department",
        Header: "Department",
        Cell: ({ value }) => <Text>{value}</Text>,
      },
      {
        accessor: "status",
        Header: "Status",
        Cell: ({ value }) => <Text>{value}</Text>,
      },
      {
        accessor: "lastActivity",
        Header: "Last  Activity",
        Cell: ({ value }) => (
          <Text>{value ? moment(value).format("MMM DD, YYYY") : ""}</Text>
        ),
      },
      {
        accessor: "*",
        Header: "Action",
        Cell: ({ value, row: { original } }) =>
          original.status !== "Invited" ? (
            <Dropdown>
              <DropdownToggle variant="default">
                <FiMoreHorizontal color="#969C9D" />
              </DropdownToggle>
              {/* {console.log(original)} */}
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => onUserActionClick(Actions.Edit, original)}
                >
                  Edit
                </Dropdown.Item>
                {original.status === "Active" ? (
                  <>
                    <Dropdown.Item
                      onClick={() =>
                        onUserActionClick(Actions.Deactivate, original)
                      }
                    >
                      Deactivate
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        onUserActionClick(Actions.Archive, original)
                      }
                    >
                      Archive
                    </Dropdown.Item>
                  </>
                ) : original.status === "Inactive" ? (
                  <Dropdown.Item
                    onClick={() =>
                      onUserActionClick(Actions.Activate, original)
                    }
                  >
                    Activate
                  </Dropdown.Item>
                ) : original.status === "Archived" ? (
                  <Dropdown.Item
                    onClick={() =>
                      onUserActionClick(Actions.Unarchive, original)
                    }
                  >
                    Unarchive
                  </Dropdown.Item>
                ) : (
                  ""
                )}
                {original.userId !== id && (
                  <Dropdown.Item
                    onClick={() => onUserActionClick(Actions.Delete, original)}
                  >
                    Delete User
                  </Dropdown.Item>
                )}

                {original.userId !== id && original.isAdmin !== true && (
                  <Dropdown.Item
                    onClick={() =>
                      onUserActionClick(Actions.AddAsAdmin, original)
                    }
                  >
                    Set as Admin{" "}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown>
              <DropdownToggle variant="default">
                <FiMoreHorizontal color="#969C9D" />
              </DropdownToggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    onUserActionClick(Actions.DeleteInvite, original)
                  }
                >
                  Delete User
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ),
      },
    ];
  }, [id, isTabletOrMobile, onAddUserClick, onUserActionClick]);

  return (
    <TableWrapper>
      <DataTable
        data={data}
        header={tableHeader}
        isSortable
        enableFooter
        stripedStartOddRow={true}
        searchKeyword={searchKeyword}
        enableGlobalSearchFilter={true}
      />
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  &&& {
    .th-container {
      display: flex;
    }
    table {
      tbody {
        tr {
          @media (max-width: 768px) {
            border-bottom: none !important;
          }
          border-bottom: 1px solid #dedfdf !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          &,
          td {
            height: 100%;
          }
          td {
            border: none !important;
            vertical-align: middle;
          }
          td:first-child {
            /* min-width: 200px; */
            width: auto;
          }
          td:nth-child(n + 4) {
            text-align: center;
          }
        }
        tr.expandable {
          border: none !important;
          td:first-child {
            font-family: "Barlow Condensed";
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 19px;
            color: #003647;
          }
          td {
            padding: 8px;
          }
        }
      }
    }
  }
`;

const DropdownToggle = styled(Dropdown.Toggle)`
  &&& {
    background: none;
    border: none;
    box-shadow: none;
    &:hover {
      background: #eaeaea;
    }
    &:focus {
      background: #eaeaea;
    }
    &:after {
      content: none;
    }
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Text = styled.div`
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #393d3e;
`;

const Profile = styled.img`
  width: 30px !important;
  height: 30px !important;
  border: 1px solid #00364744 !important;
  border-radius: 30px;
  margin: 20px 10px;
`;

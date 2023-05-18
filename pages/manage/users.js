import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Col, Container, InputGroup, Row } from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { DebounceInput } from "react-debounce-input";
import { SelectionMode, useAppContext } from "@contexts/AppContext";
import Tooltip from "@ui-library/Tooltip";
import BsDropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "@ui-library/DropdownToggle";
import DocumentDownloadIcon from "@public/icons/document-download";
import PrinterIcon from "@public/icons/printer";
import AddUsersIcon from "@public/icons/add-users";
import InvitesPopup from "@components/invites/InvitesPopup";
import InvitationsSentPopup from "@components/invites/InvitationsSentPopup";
import teamService from "@services/team.service";
import UsersTable, { Actions } from "@components/dataTables/UsersTable";
import adminService from "@services/superadmin.service";
import inviteService from "@services/invite.service";
import ConfirmAlert from "@ui-library/ConfirmAlert";
import {
  CategoryType as Type,
  createReactPageFromHTML,
  download,
  generateAccountsCSV,
  getPageFromWebflow,
  printContent,
} from "@utils/helpers";
import { pdf } from "@react-pdf/renderer";
import UsersTemplate from "@layouts/pdf-templates/UsersTemplate";
import ManagePageHeader from "@ui-library/ManagePageHeader";

import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { useAuthUser } from "@contexts/AuthContext";
import Category from "@ui-library/Category";
import Authorization from "@contexts/Authorization";
import Error from "@components/error";
import Alert from "react-bootstrap/Alert";
import Select from "@ui-library/Select";

const categories = [Type.All, Type.Active, Type.Inactive, Type.Archived];

const UserRender = () => {
  const router = useRouter();
  const { inSelectMode, selectionMode, setSelectionMode, alert } =
    useAppContext();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showInvitesPopup, setShowInvitesPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const queryClient = useQueryClient();
  const { auth: { user: { isSuperAdmin, id, isAdmin } = {} } = {} } =
    useAuthUser();

  const [type, setType] = useState(Type.All);

  // console.log("is Admin", isAdmin);
  // console.log("is super admin", isSuperAdmin);

  useEffect(() => {
    if (!inSelectMode) {
      if (selectionMode === SelectionMode.CSV) {
        downloadCSV();
      } else if (selectionMode === SelectionMode.PDF) {
        downloadPDF();
      } else if (selectionMode === SelectionMode.PRINT) {
        print();
      }
      setSelectionMode(null);
    }
  }, [selectionMode]);

  const {
    isFetched,
    data: { data: { teamUsers: users = [], teamDetails: team = {} } = {} } = {},
  } = useQuery(
    ["allUsers", router.query?.teamId],
    () => teamService.getAllUsers(router.query?.teamId),
    {
      enabled: !!router.query?.teamId,
    }
  );

  const filteredUsers = useMemo(() => {
    if (type === Type.All) return users;

    return users.filter((u) => u.status === type);
  }, [type, users]);

  const userStatusMutation = useMutation(
    ({ userId, status }) =>
      adminService.updateUserStatus(router.query?.teamId, userId, status),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["allUsers", router.query?.teamId]);
      },
    }
  );

  const userDeleteMutation = useMutation(
    ({ userId }) => adminService.deleteUser(router.query?.teamId, userId),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["allUsers", router.query?.teamId]);
      },
    }
  );

  const userDeleteInviteMutation = useMutation(
    ({ email }) => inviteService.delete(router.query?.teamId, email),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["allUsers", router.query?.teamId]);
      },
    }
  );

  const useraddAsAdmin = useMutation(
    ({ userId }) => adminService.addAsAdmin(router.query?.teamId, userId),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["allUsers", router.query?.teamId]);
      },
    }
  );

  const downloadCSV = () => {
    const blob = generateAccountsCSV(filteredUsers);
    download(blob, `${router.query?.teamName ?? "team"}-skillbuilderio.csv`);
  };

  async function downloadPDF() {
    const PDFDoc = pdf(
      <UsersTemplate
        data={filteredUsers}
        onReady={async () => {
          const blob = await PDFDoc.toBlob();
          download(
            blob,
            `${router.query?.teamName ?? "team"}-skillbuilderio.pdf`
          );
        }}
      />
    );
  }

  async function print() {
    const PDFDoc = pdf(
      <UsersTemplate
        data={users}
        onReady={async () => {
          const blob = await PDFDoc.toBlob();
          printContent(blob);
        }}
      />
    );
  }

  const onUserAction = (action, { userId, email }) => {
    switch (action) {
      case Actions.Edit:
        if (router.query?.fromAccounts) {
          router.push(
            `/manage/profile?userId=${userId}&fromAccountsToUsersToProfile=${true}`
          );
        } else {
          router.push(`/manage/profile?userId=${userId}`);
        }

        break;
      case Actions.Deactivate:
        userStatusMutation.mutate({ userId, status: action });
        break;
      case Actions.Archive:
        userStatusMutation.mutate({ userId, status: action });
        break;
      case Actions.Unarchive:
        userStatusMutation.mutate({ userId, status: action });
        break;
      case Actions.Activate:
        userStatusMutation.mutate({ userId, status: action });
        break;
      case Actions.Delete:
        const alertDialog = alert.show(
          <ConfirmAlert
            title={"Are you sure?"}
            message={"The user will be deleted"}
            onDone={() => {
              userDeleteMutation.mutate({ userId });
              alertDialog.close();
            }}
            onCancel={() => alertDialog.close()}
          />
        );
        break;

      case Actions.DeleteInvite:
        const alertDialog1 = alert.show(
          <ConfirmAlert
            title={"Are you sure?"}
            message={"The user will be deleted"}
            onDone={() => {
              userDeleteInviteMutation.mutate({ email });
              alertDialog1.close();
            }}
            onCancel={() => alertDialog1.close()}
          />
        );
        break;

      case Actions.AddAsAdmin:
        const adminAlert = alert.show(
          <ConfirmAlert
            title={"Are you sure?"}
            message={"The user will be made admin"}
            onDone={() => {
              useraddAsAdmin.mutate({ userId });
              adminAlert.close();
            }}
            onCancel={() => adminAlert.close()}
          />
        );

        break;
    }
  };

  return (
    <Authorization
      allow={["admin", "superadmin"]}
      fallback={team && <Error code={401} />}
    >
      <div className="bs">
        <ManagePageHeader />
        <Container>
          {isSuperAdmin && router.query?.fromAccounts && (
            <StyledAlert key="primary" variant="primary">
              You are viewing this account as a Super Admin
            </StyledAlert>
          )}
          <br />
          {isSuperAdmin && router.query?.fromAccounts && (
            <TextButton onClick={() => router.back()}>&lt; Accounts</TextButton>
          )}
          <Row
            className="mb-3 mb-lg-5 align-items-center justify-content-between"
            sm={3}
          >
            <Col className="d-flex align-items-center">
              {isSuperAdmin && (
                <Title>{router.query?.teamName ?? "Users"}</Title>
              )}

              <div className="d-none d-lg-block">
                {!isSuperAdmin &&
                  categories.map((category) => (
                    <Category
                      key={category}
                      active={type === category}
                      onClick={() => setType(category)}
                    >
                      {category}
                    </Category>
                  ))}
              </div>
            </Col>

            <Col className="d-flex align-items-center">
              <StyledInputGroup className="d-none d-lg-flex">
                <InputGroup.Text>
                  <IoSearchOutline color="#003647" size={20} />
                </InputGroup.Text>

                <Input
                  type="search"
                  minLength={2}
                  debounceTimeout={300}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search Users"
                  className="form-control"
                />
              </StyledInputGroup>

              <Tooltip text="Download">
                <Dropdown>
                  <DropdownToggle>
                    <DocumentDownloadIcon />
                  </DropdownToggle>

                  <Dropdown.Menu>
                    <Dropdown>
                      <DropdownToggle>Download All</DropdownToggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => setSelectionMode(SelectionMode.PDF)}
                        >
                          Download PDF
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setSelectionMode(SelectionMode.CSV)}
                        >
                          Download CSV
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Dropdown.Menu>
                </Dropdown>
              </Tooltip>

              <Tooltip text="Print">
                <Dropdown className="d-none d-lg-inline-block">
                  <DropdownToggle>
                    <PrinterIcon />
                  </DropdownToggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => setSelectionMode(SelectionMode.PRINT)}
                    >
                      Print All
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Tooltip>

              <Tooltip text="Invite">
                <button
                  className="btn"
                  onClick={() => setShowInvitesPopup(true)}
                >
                  <AddUsersIcon />
                </button>
              </Tooltip>

              <InvitesPopup
                show={showInvitesPopup}
                handleClose={() => setShowInvitesPopup(false)}
                showConfirmationPopup={() => setShowConfirmationPopup(true)}
                teamId={router.query?.teamId}
                showCloseBtn
              />

              <InvitationsSentPopup
                show={showConfirmationPopup}
                handleClose={() => setShowConfirmationPopup(false)}
                onSendMoreInvites={() => setShowInvitesPopup(true)}
              />
            </Col>
          </Row>

          <div className="mb-3 d-block d-lg-none">
            {!isSuperAdmin && (
              <Select
                stretched={true}
                value={type}
                onChange={(event) => setType(event?.target?.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            )}
          </div>

          <div className="mb-3 d-block d-lg-none">
            <StyledInputGroup>
              <InputGroup.Text>
                <IoSearchOutline color="#003647" size={20} />
              </InputGroup.Text>

              <Input
                type="search"
                minLength={2}
                debounceTimeout={300}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search Users"
                className="form-control"
              />
            </StyledInputGroup>
          </div>

          {filteredUsers?.length !== 0 && (
            <UsersTable
              searchKeyword={searchKeyword}
              data={filteredUsers}
              onAddUserClick={() => setShowInvitesPopup(true)}
              onUserActionClick={onUserAction}
              id={id}
            />
          )}

          {filteredUsers?.length === 0 && isFetched && (
            <Title className="text-center w-100">No Users</Title>
          )}
        </Container>
      </div>
    </Authorization>
  );
};

const StyledInputGroup = styled(InputGroup)`
  &&& {
    margin-left: 0.5rem;
    color: #003647;
    font-family: "Barlow Condensed", sans-serif;
    border: 1px solid #003647;
    border-radius: 0.25rem;

    .input-group-text {
      background: none;
      border: none;
      padding: 0.375rem 0.5rem;
    }

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }
`;

const Input = styled(DebounceInput)`
  &&& {
    border: none;
    padding-left: 0;
  }
`;

const Title = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 55px;
  line-height: 66px;
  margin-right: 1rem;
  color: #81c2c0;

  @media (max-width: 768px) {
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    color: #81c2c0;
  }
`;

const TextButton = styled.span`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-size: 16px;
  line-height: 22px;
  cursor: pointer;
  margin-bottom: 14px;
  display: inline-block;
  font-weight: 400;
  color: #393d3e;
`;

const Dropdown = styled(BsDropdown)`
  &&& {
    font-family: "Barlow Condensed";
    font-style: normal;
  }
`;

const StyledAlert = styled(Alert)`
  &&& {
    font-family: Manrope, sans-serif;
    font-style: normal;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 14px;
    // display: inline-block;
    font-weight: 400;
    color: #ffffff;
    background-color: #81c2c0;
  }
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <UserRender />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/users");

  return {
    props: { HEAD, BODY },
  };
}

export default function UsersPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

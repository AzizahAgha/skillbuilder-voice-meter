import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Col,
  Container,
  InputGroup,
  Row,
  Spinner,
  Form,
} from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { useTeam } from "@contexts/TeamContext";
import { useInfiniteQuery } from "react-query";
import adminService from "@services/superadmin.service";
import { useRouter } from "next/router";
import { DebounceInput } from "react-debounce-input";
import { SelectionMode, useAppContext } from "@contexts/AppContext";
import ManagePageHeader from "@ui-library/ManagePageHeader";
import Tooltip from "@ui-library/Tooltip";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "@ui-library/DropdownToggle";
import DocumentDownloadIcon from "@public/icons/document-download";
import PrinterIcon from "@public/icons/printer";
import AddUsersIcon from "@public/icons/add-users";
import InvitesPopup from "@components/invites/InvitesPopup";
import InvitationsSentPopup from "@components/invites/InvitationsSentPopup";
import Category from "@ui-library/Category";
import AccountCard from "@ui-library/AccountCard";
import {
  CategoryType as Type,
  createReactPageFromHTML,
  download,
  generateTeamsCSV,
  getPageFromWebflow,
  printContent,
} from "@utils/helpers";
import { pdf } from "@react-pdf/renderer";
import AccountsTemplate from "@layouts/pdf-templates/AccountsTemplate";

import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";

import Authorization from "@contexts/Authorization";
import Error from "@components/error";
import { useInView } from "react-intersection-observer";
import down from "@public/svgs/down.svg";

const Accounts = () => {
  const router = useRouter();
  const { team, setTeam } = useTeam();
  const { inSelectMode, selectionMode, setSelectionMode } = useAppContext();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [type, setType] = useState(Type.All);
  const [showInvitesPopup, setShowInvitesPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const { ref, inView } = useInView({ threshold: 1 });

  const {
    data,
    isLoading,
    isFetched,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["teams", type, searchKeyword],
    ({ pageParam = 1 }) =>
      adminService.getAccounts(type, searchKeyword, pageParam),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    }
  );

  const { countData, teams } = useMemo(() => {
    const teams = data?.pages?.flatMap((page) => page.data) || [];
    return {
      countData: data?.pages?.[0]?.countData ?? {
        allCount: 0,
        activeCount: 0,
        inactiveCount: 0,
      },
      teams: teams,
    };
  }, [data]);

  const downloadCSV = useCallback(() => {
    const blob = generateTeamsCSV(teams);
    download(blob, "Teams-skillbuilderio.csv");
  }, [teams]);

  const downloadPDF = useCallback(async () => {
    const PDFDoc = pdf(
      <AccountsTemplate
        data={teams}
        onReady={async () => {
          const blob = await PDFDoc.toBlob();
          download(blob, "Teams-skillbuilderio.pdf");
        }}
      />
    );
  }, [teams]);

  const print = useCallback(async () => {
    const PDFDoc = pdf(
      <AccountsTemplate
        data={teams}
        onReady={async () => {
          const blob = await PDFDoc.toBlob();
          printContent(blob);
        }}
      />
    );
  }, [teams]);

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
  }, [
    downloadCSV,
    downloadPDF,
    inSelectMode,
    print,
    selectionMode,
    setSelectionMode,
  ]);

  useEffect(() => {
    setTeam(team);
  }, []);

  const { allCount, activeCount, inactiveCount } = countData;

  const options = useMemo(
    () => [
      { name: "All", value: Type.All, count: allCount },
      { name: "Active", value: Type.Active, count: activeCount },
      { name: "Inactive", value: Type.Inactive, count: inactiveCount },
    ],
    [activeCount, allCount, inactiveCount]
  );

  useEffect(() => {
    if (inView) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, inView]);

  return (
    <Authorization
      allow={["superadmin"]}
      fallback={data && <Error code={401} />}
    >
      <div className="bs">
        <ManagePageHeader />

        <Container>
          <div className="mb-3 mb-lg-5 align-items-center d-flex">
            <div className="d-flex align-items-center flex-grow-1">
              <Title>Accounts</Title>

              <Category
                className="d-none d-lg-block"
                active={type === Type.All}
                onClick={() => setType(Type.All)}
              >
                All ({allCount})
              </Category>
              <Category
                className="d-none d-lg-block"
                active={type === Type.Active}
                onClick={() => setType(Type.Active)}
              >
                Active ({activeCount})
              </Category>
              <Category
                className="d-none d-lg-block"
                active={type === Type.Inactive}
                onClick={() => setType(Type.Inactive)}
              >
                Inactive ({inactiveCount})
              </Category>
            </div>

            <div className="d-flex align-items-center">
              <StyledInputGroup className="d-none d-lg-flex">
                <InputGroup.Text>
                  <IoSearchOutline color="#003647" size={20} />
                </InputGroup.Text>

                <Input
                  type="search"
                  minLength={2}
                  debounceTimeout={300}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                  }}
                  placeholder="Search Accounts"
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
                      <StyledDropdown>Download All</StyledDropdown>
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
                teamId={team?.id}
                showCloseBtn
              />

              <InvitationsSentPopup
                show={showConfirmationPopup}
                handleClose={() => setShowConfirmationPopup(false)}
                onSendMoreInvites={() => setShowInvitesPopup(true)}
              />
            </div>
          </div>

          <div className="mb-3 d-block d-lg-none">
            <StyledInputGroup className="m-0">
              <InputGroup.Text>
                <IoSearchOutline color="#003647" size={20} />
              </InputGroup.Text>
              <Input
                type="search"
                minLength={2}
                debounceTimeout={300}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                }}
                placeholder="Search Accounts"
                className="form-control"
              />
            </StyledInputGroup>
          </div>

          <div className="mb-3 d-block d-lg-none">
            <Select
              className="w-100"
              value={type}
              onChange={(event) => {
                const val = event?.target?.value;
                setType(val);
              }}
            >
              {options.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.name} ({option.count})
                </option>
              ))}
            </Select>
          </div>

          {isFetched && teams.length > 0 && (
            <Row>
              {teams?.map((team, idx) => (
                <Col
                  key={idx}
                  className="col-12 col-lg-4 mb-4"
                  /*onClick={() =>
                    router.push(
                      `/manage/users?teamId=${team.teamId}&teamName=${team.teamName
                      }&fromAccounts=${true}`
                    )
                  }*/
                >
                  <AccountCard data={team} searchKeyword={searchKeyword} />
                </Col>
              ))}
            </Row>
          )}

          {isFetched && teams.length <= 0 && (
            <Title className="text-center mb-5">No Accounts</Title>
          )}
          {isLoading && (
            <Title className="text-center mb-5 d-block">Loading</Title>
          )}

          {isFetchingNextPage && (
            <LoadingIndicator>
              <Spinner
                animation="border"
                role="status"
                variant="secondary"
                className="me-1"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              Loading...
            </LoadingIndicator>
          )}

          {hasNextPage && (
            <span style={{ visibility: "hidden" }} ref={ref}>
              intersection observer marker
            </span>
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
  }
`;

const Input = styled(DebounceInput)`
  &&& {
    border: none;
    padding-left: 0;
  }
`;

const Title = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 55px;
  line-height: 66px;
  margin-right: 1rem;
  color: #81c2c0;
`;

const LoadingIndicator = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #81c2c0;
`;

const StyledDropdown = styled(DropdownToggle)`
  &&& {
    display: block;
    width: 100%;
    padding: 0.25rem 1rem;
    clear: both;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    text-decoration: none;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
    font-family: Arial, sans-serif !important;
  }
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <Accounts />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/accounts");

  return {
    props: { HEAD, BODY },
  };
}

export default function AccountPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

const Select = styled(Form.Select)`
  &&& {
    border: 1px solid #003647;
    border-radius: 5px;
    background-image: url("${down.src}");

    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #1f5462;
  }
`;

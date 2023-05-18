import React from "react";
import styled from "styled-components";
import info from "@public/svgs/info.svg";
import arrowUp from "@public/svgs/arrow-up.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #969c9d;
  margin: 0 auto;
  overflow: auto;
`;

const Headers = styled.div`
  display: flex;
  background: white;
`;

const Header = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: #1f5462;
  display: flex;
  align-items: center;
  justify-content: center !important;
  padding: 10px 3px;
  cursor: pointer;
  ${({ width }) => (width ? `width: ${width}` : `flex: 1`)};
  justify-content: ${({ key }) => (key === 1 ? "center" : "flex-start")};
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1px 0 0 1px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1px;
`;

const Cell = styled.div`
  padding: 15px;
  margin-right: 1px;
  background: ${({ row }) => (row % 2 ? "#fafafa" : "white")};
  ${({ width }) => (width ? `width: ${width}` : `flex: 1`)};
  display: flex;
  ${({ stretched }) =>
    !stretched ? "flex-direction: column;justify-content: center" : ""};
  white-space: pre-wrap;
`;

const Tooltip = styled.div`
  margin-left: 5px;
`;
const Image = styled.img`
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;

const Table = ({ headers, showHeader = true, data, footer }) => {
  return (
    <Container>
      {showHeader && (
        <Headers>
          {headers.map((header, rowNum) => (
            <Header key={rowNum} width={header.width}>
              {header.name}
              {header.description && (
                <Tooltip>
                  <Image src={info.src} alt="info" />
                </Tooltip>
              )}
            </Header>
          ))}
        </Headers>
      )}

      <Rows>
        {data?.map((item, rowNum) => (
          <Row key={rowNum}>
            {headers.map((header, colNum) => (
              <Cell
                key={colNum}
                row={rowNum}
                width={header.width}
                stretched={header.stretched}
              >
                {header.renderer(item, rowNum)}
              </Cell>
            ))}
          </Row>
        ))}
      </Rows>
      {footer}
    </Container>
  );
};

export default Table;

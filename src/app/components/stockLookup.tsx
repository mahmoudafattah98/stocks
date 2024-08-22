import { Input, Grid, Spin, Empty, Button, Avatar } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card } from "antd";
import React from "react";

const { Search } = Input;

type Stock = {
  ticker: string;
  name: string;
  market: string;
  locale: string;
};
type SearchResult = {
  count?: number;
  request_id: string;
  results: Array<Stock>;
  status: string;
};

export default function StockLookup() {
  const [stocks, setStocks]: [Stock[], Dispatch<SetStateAction<Stock[]>>] =
    useState([{ ticker: "", name: "", market: "", locale: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [ticker, setTicker] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult]: [
    SearchResult,
    Dispatch<SetStateAction<SearchResult>>
  ] = useState<SearchResult>({
    count: 0,
    request_id: "",
    results: [],
    status: "",
  });

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  async function fetchStocks(ticker: string) {
    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?search=${ticker}&active=true&apiKey=viPbJp10BxQKnao_CgbjW3rpmf26RZbt`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Parsed JSON:", data);
      setSearchResult(data);
      setStocks(data.results);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function resetStocks() {
    setStocks([]);
    setSearchTerm("");
    setSearchResult({ count: 0, request_id: "", results: [], status: "" });
  }
  function renderStocks() {
    if (isLoading) {
      return <Spin />;
    }

    if (stocks.length === 0) {
      return (
        <Empty>
          <Button onClick={() => resetStocks}>Reset Search</Button>
        </Empty>
      );
    }

    return (
      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        {stocks.map((stock) => (
          <Col span={6} key={uuidv4()}>
            <Card
              title={
                <Avatar
                  size={52}
                  style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                >
                  {stock.ticker.substring(0, 2)}
                </Avatar>
              }
              hoverable
              bordered={false}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <div style={{ flexDirection: "column" }}>
                <p style={{ fontWeight: "bold" }}>{stock.ticker}</p>
                <p>{stock.name}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <>
      <Row justify={"center"} style={{ marginTop: "20px" }}>
        <Col xs={24} md={18}>
          <Search
            placeholder="Search for stocks by entering ticker e.g. AAPL, MCFT"
            size="large"
            onSearch={(searchTerm) => fetchStocks(searchTerm)}
            style={{ marginBottom: "20px" }}
          />
        </Col>
      </Row>

      {renderStocks()}
    </>
  );
}

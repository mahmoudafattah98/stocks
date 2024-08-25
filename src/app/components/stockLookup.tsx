import { Input, Grid, Spin, Empty, Button, Avatar } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card } from "antd";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const { Search } = Input;
const apiKey = "viPbJp10BxQKnao_CgbjW3rpmf26RZbt";
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
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult]: [
    SearchResult,
    Dispatch<SetStateAction<SearchResult>>
  ] = useState<SearchResult>({
    count: 0,
    request_id: "",
    results: [],
    status: "",
  });

  useEffect(() => {
    fetchStocks("");
  }, []);

  async function fetchStocks(ticker: string) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?search=${ticker}&active=true&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
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
    setSearchResult({ count: 0, request_id: "", results: [], status: "" });
  }

  function renderStocks() {
    if (isLoading) {
      return (
        <div
          style={{
            height: "65vh",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Spin size="large" />
          <p>Loading...</p>
        </div>
      );
    }

    if (stocks.length === 0) {
      return (
        <div
          style={{
            height: "65vh",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Empty>
            <Button onClick={resetStocks}>Reset Search</Button>
          </Empty>
        </div>
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
                <p>{stock.name.substring(0, 37)}</p>
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
            id="search"
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

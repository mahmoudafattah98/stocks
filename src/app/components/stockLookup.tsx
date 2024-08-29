import { Input, Spin, Empty, Button, Avatar } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Card } from "antd";
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
  const [searchResult, setSearchResult] = useState<SearchResult>({
    count: 0,
    request_id: "",
    results: [],
    status: "",
  });
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    fetchStocks("");
    logWhenBottomReached();
  }, []);

  async function fetchStocks(ticker: string) {
    setIsLoading(true);
    setRateLimited(false);

    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?search=${ticker}&active=true&apiKey=${apiKey}`
      );

      if (response.status === 429) {
        setRateLimited(true);
        return;
      }

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
    setRateLimited(false);
  }

  function logWhenBottomReached() {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      console.log("Scroll event detected");
      if (windowHeight + scrollTop >= documentHeight - 1) {
        console.log("Bottom of the page reached");
      }
    });
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
          <br />
          <p>Loading...</p>
        </div>
      );
    }

    if (rateLimited) {
      return (
        <div
          style={{
            height: "65vh",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <CloseCircleFilled
            style={{ fontSize: "50px", color: "red", marginBottom: "20px" }}
          />
          <p style={{ fontWeight: "bold", fontSize: "24px" }}>
            You have reached your maximum number of requests.
          </p>
          <p style={{ fontSize: "14px", marginBottom: "20px" }}>
            Please wait at least 1 minute before retrying.
          </p>
          <Button type="primary" onClick={resetStocks}>
            Reset Search
          </Button>
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
      <Row gutter={[16, 16]}>
        {stocks.map((stock) => (
          <Col key={uuidv4()} xs={24} sm={12} md={8} lg={6}>
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
        <Col xs={24} sm={24} md={18} lg={12} xl={12}>
          <Search
            id="search"
            placeholder="Search for stocks by entering ticker e.g. AAPL, MCFT"
            size="large"
            onSearch={(searchTerm) => fetchStocks(searchTerm)}
            style={{ marginBottom: "40px" }}
          />
        </Col>
      </Row>

      {renderStocks()}
    </>
  );
}

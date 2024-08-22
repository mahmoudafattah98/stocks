import { Input, Grid } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useState } from "react";

const { Search } = Input;

type stock = {};

export default function StockLookup() {
  const [stocks, setStocks]: [stock, any] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ticker, setTicker] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  async function fetchStocks(ticker: string) {
    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?ticker=${ticker}&active=true&limit=100&apiKey=viPbJp10BxQKnao_CgbjW3rpmf26RZbt`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Parse the JSON if the response is in JSON format
      const data = await response.json();
      console.log("Parsed JSON:", data);

      // Process the data as needed
      setStocks([data]);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function renderStocks() {
    return <></>;
  }

  return (
    <>
      <Row justify={"center"} style={{ marginTop: "20px" }}>
        <Col xs={24} md={18}>
          <Search
            placeholder="Search for stocks by entering ticker e.g. AAPL, MCFT"
            size="large"
            onSearch={fetchStocks}
          />
        </Col>
      </Row>

      <Row>{renderStocks()}</Row>
    </>
  );
}

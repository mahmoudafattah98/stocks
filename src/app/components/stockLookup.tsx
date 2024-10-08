import { Input, Spin, Empty, Button, Avatar } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Card } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  const [ticker, setTicker] = useState<string>("");
  const [rateLimited, setRateLimited] = useState(false);

  const fetchStocks = async ({ pageParam = "" }) => {
    const response = await fetch(
      `https://api.polygon.io/v3/reference/tickers?search=${ticker}&active=true&limit=24&cursor=${pageParam}&apiKey=${apiKey}`
    );
    if (response.status === 429) {
      setRateLimited(true);
      return null;
    }
    const data = await response.json();
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [ticker],
      queryFn: fetchStocks,
      getNextPageParam: (lastPage) => {
        if (lastPage === null) {
          return undefined;
        }
        return lastPage?.next_url?.split("cursor=")[1];
      },
      initialPageParam: "",
      enabled: !!ticker,
    });

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSearch = (searchTerm: string) => {
    setTicker(searchTerm);
  };

  const resetStocks = () => {
    setTicker("");
    setRateLimited(false);
  };

  const renderStocks = () => {
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

    if (rateLimited && !data?.pages?.[0]?.results.length) {
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

    if (!data?.pages?.[0]?.results.length) {
      return (
        <div
          style={{
            height: "65vh",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Empty
            image={"assets/noResults.png"}
            imageStyle={{ width: "254px", height: "294px" }}
          >
            <Button onClick={resetStocks}>Reset Search</Button>
          </Empty>
        </div>
      );
    }

    return (
      <>
        <Row gutter={[16, 16]}>
          {data.pages.map((page) =>
            page?.results?.map((stock: Stock) => (
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
            ))
          )}
        </Row>
        {isFetchingNextPage && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Row justify={"center"} style={{ marginTop: "20px" }}>
        <Col xs={24} sm={24} md={18} lg={12} xl={12}>
          <Search
            id="search"
            placeholder="Search for stocks by entering ticker e.g. AAPL, MCFT"
            size="large"
            onSearch={handleSearch}
            style={{ marginBottom: "40px" }}
          />
        </Col>
      </Row>

      {renderStocks()}
    </>
  );
}

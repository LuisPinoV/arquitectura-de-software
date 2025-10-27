"use client";

import { Col, Row } from "antd";
import { SearchCard } from "@/components/custom/search-card";
import { useEffect, useState } from "react";
import { DropdownOneSelected } from "@/components/custom/dropdown";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import "./dropdown-general.css";
import { CheckedState } from "@radix-ui/react-checkbox";

export function SearchGeneralMain({ search_input = "" }: any) {

  const pagesPerDisplay = {
    name: "20",
    categories: ["5", "10", "20", "25", "50", "100"],
    default: "20",
  };

  const [itemsPerPage, setItemsPerPage] = useState<number>(
    parseInt(pagesPerDisplay["name"])
  );

  const [searchData, setSearchData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/dashboard/busqueda_general/api/get_all_boxes`
        );
        const data: any = await res.json();
        setSearchData(data["dataArr"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  let dataArr = searchData;

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);

    const firstPage = 1;
    setCurPage(firstPage);
  };

  if (search_input !== "") {
    dataArr = searchData.filter((item) => {
      return Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search_input.toLowerCase());
    });
  }
  const [curPage, setCurPage] = useState<number>(1);

  const startIndex = (curPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, dataArr.length);

  const visibleData = dataArr.slice(startIndex, endIndex);

  const totalPages = Math.ceil(dataArr.length / itemsPerPage);

  const handleNext = () => {
    if (curPage < totalPages) {
      setCurPage(curPage + 1);
    }
  };

  const handlePrev = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };

  return (
    <div>
      <Row justify="center" align="top">
        <Col className="options-col" xs={24} md={24} lg={24} xl={12} xxl={6}>
          <div className="dropdown-filters-general">
            <p
              style={{
                margin: 0,
                padding: 0,
                width: "100%",
                textAlign: "right",
                alignSelf: "center",
                paddingRight: "3%",
              }}
            >
              Items por página
            </p>
            <DropdownOneSelected
              data={pagesPerDisplay}
              value={itemsPerPage.toString()} // convert number to string if needed
              onChange={(selected) => handleItemsPerPageChange(parseInt(selected))}
            />
          </div>
        </Col>
        <Col className="options-col" xs={24} md={24} lg={24} xl={12} xxl={6}>
          <div className="dropdown-filters-general">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={handlePrev} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>{curPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={handleNext} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Col>
      </Row>
      <Row justify="center" align="top">
        {visibleData.map((data: any, i, _) => (
          <Col
            key={i}
            className="search-cards-col"
            xs={24}
            xxl={6}
            xl={8}
            lg={12}
          >
            <div className="search-cards-col">
              <SearchCard data={data} />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
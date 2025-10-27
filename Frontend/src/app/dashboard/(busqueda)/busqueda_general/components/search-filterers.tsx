"use client";
/*
import { Row, Col } from "antd";
import {
  DropdownMenuCheckboxes,
  DropdownOneSelected,
} from "@/components/custom/dropdown";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import "./dropdown-general.css";

export default function GeneralSearchFilterers({
  currentPage,
  onChangePage,
}: any) {
  const categories = {
    name: "Categoría",
    desc: "Filtrar por...",
    categories: ["Boxes", "Médicos", "Personal general"],
    default: true,
  };

  const sortBy = {
    name: "Ordenar",
    desc: "Ordenar por...",
    categories: ["Mayor a menor", "Menor a mayor", "Alfabético"],
    default: false,
  };

  const pagesPerDisplay = {
    name: 20,
    categories: [5, 10, 20, 25, 50, 100],
    default: 20,
  };

  const handleNext = () => {
    onChangePage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onChangePage(currentPage - 1);
    }
  };

  return (
    <Row justify="center" align="top">
      <Col className="options-col" xs={24} md={12} lg={12} xl={12} xxl={6}>
        <div className="dropdown-filters-general">
          <DropdownMenuCheckboxes data={categories} />
        </div>
      </Col>
      <Col className="options-col" xs={24} md={12} lg={12} xl={12} xxl={6}>
        <div className="dropdown-filters-general">
          <DropdownMenuCheckboxes data={sortBy} />
        </div>
      </Col>
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
          <DropdownOneSelected data={pagesPerDisplay} />
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
                <PaginationLink>{currentPage}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={handleNext} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Col>
    </Row>
  );
}
*/
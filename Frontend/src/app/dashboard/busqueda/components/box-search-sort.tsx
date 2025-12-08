import { Row, Col } from "antd";
import {
  DropdownMenuCheckboxes,
} from "@/components/custom/dropdown";
import { useLanguage } from "@/contexts/LanguageContext";

import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";

import "./dropdown-boxes.css";

export function BoxSorterer() {
  const { t } = useLanguage();
  
  const sortBy = {
    name: t("search.sort"),
    desc: t("search.sortBy"),
    categories: [t("search.highestToLowest"), t("search.lowestToHighest"), t("search.alphabetical")],
    default: false,
    defaultAllSelected:false,
  };
  return (
    <Row justify="center" align="top" style={{ marginTop: "30px" }}>
      <Col className="options-col" xs={24} md={24} lg={8} xl={8} xxl={8}>
        <div className="dropdown-filters-general">
          <DropdownMenuCheckboxes data={sortBy} />
        </div>
      </Col>
      <Col className="options-col" xs={24} md={12} lg={8} xl={8} xxl={8}>
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
        </div>
      </Col>
      <Col className="options-col" xs={24} md={12} lg={8} xl={8} xxl={8}>
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
            1-20 de 132
          </p>
          <Button variant="secondary" size="icon" className="size-8 mx-1">
            <ChevronFirst />
          </Button>
          <Button variant="secondary" size="icon" className="size-8 mx-1">
            <ChevronLeft />
          </Button>
          <Button variant="secondary" size="icon" className="size-8 mx-1">
            <ChevronRight />
          </Button>
          <Button variant="secondary" size="icon" className="size-8 mx-1">
            <ChevronLast />
          </Button>
        </div>
      </Col>
    </Row>
  );
}

import { Col, Row } from "antd";
import { GoBackButton } from "./components/backButton";
import { LanguageSelector } from "./components/language-selector";

export default function Page() {
  return (
    <Row align={"middle"} justify={"center"} id="topOfPage">
      <Col xs={24} style={{ display: "flex", marginBottom: "20px" }}>
        <GoBackButton />
      </Col>
      <Col xs={24}>
        <LanguageSelector />
      </Col>
    </Row>
  );
}

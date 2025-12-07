import { Col, Row } from "antd";
import {
  ChartBoxesAcrossTime,
  ChartInfoCards,
} from "./components/charts";
import { Card, CardContent, CardHeader, } from "@/components/ui/card";
import { BoxesDataTable } from "./components/table-boxes";

export default function Page() {
  return (
    <div className="boxes-dashboard-container">
      <h1 style={{ margin: "0px 0px 10px 0px", fontSize: "130%" }}>
        Reporte Boxes
      </h1>
      <Row justify={"center"} align={"middle"}>
        <Col xs={24} lg = {24}>
          <ChartInfoCards />
        </Col>
        <Col sm={24} xs={24} lg={24}>
          <ChartBoxesAcrossTime />
        </Col>
        <Col xs={24} style={{ margin: "10px 10px" }}>
          <Card>
            <CardHeader>
              <div className="text-muted-foreground leading-none">
                Tabla de boxes
              </div>
            </CardHeader>
            <CardContent>
              <BoxesDataTable />
            </CardContent>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

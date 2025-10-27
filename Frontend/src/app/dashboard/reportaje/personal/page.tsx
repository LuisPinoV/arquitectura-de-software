import { Col, Row } from "antd";
import { InfoCards } from "./components/info-cards";
import "./personal-general.css";
import {
  ChartTiempoPromedioAtencion,
  ChartUsoPedidoUsado,
} from "./components/charts";
import { PersonalDataTable } from "./components/table-personal";

/*
  TODO:
    Add functionalities to different charts
    Connect charts to actual data
    Change table elements to actual ones
*/

export default function Page() {
  return (
    <div>
      <div className="text-bold">
        <h1 style={{ margin: "0px 0px 10px 0px", fontSize: "130%" }}>
          Reporte Personal
        </h1>
      </div>
      <Row align={"middle"} justify={"center"}>
        <Col xs={22} className="personal-col" style = {{marginTop:"20px"}}>
          <PersonalDataTable />
        </Col>
      </Row>
    </div>
  );
}

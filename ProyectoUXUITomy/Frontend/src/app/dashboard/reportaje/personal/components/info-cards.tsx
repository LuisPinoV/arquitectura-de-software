import { Row, Col } from "antd";
import Link from "next/link";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { InfoCardChart } from "./charts";

export function InfoCards() {
  return (
    <Row justify="center" align="top" style = {{marginBottom:"20px"}}>
      <Col className="personal-col" xs={24} sm={11} md={11} lg={11} xl={5}>
        <Card className="@container/card info-card">
          <CardHeader>
            <CardDescription>Boxes agendados hoy</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              315
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Alta cantidad de boxes libres
            </div>
          </CardFooter>
        </Card>
      </Col>
      <Col className="personal-col" xs={24} sm={11} md={11} lg={11} xl={5}>
        <Card className="@container/card info-card">
          <CardHeader>
            <CardDescription>Pacientes atendidos hoy</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              130
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Más de la mitad de pacientes atendidos
            </div>
          </CardFooter>
        </Card>
      </Col>
      <Col className="personal-col" xs={24} sm={11} md={11} lg={11} xl={5}>
        <Card className="@container/card info-card">
          <CardHeader>
            <CardDescription>Pacientes a atender</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              132
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Hubieron pacientes sin atención
            </div>
          </CardFooter>
        </Card>
      </Col>
      <Col className="personal-col" xs={24} sm={11} md={11} lg={11} xl={6}>
        <Card className="@container/card info-card">
          <CardHeader>
            <CardDescription>Atrasos en atención totales</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl max-h-[80px]">
              <InfoCardChart/>
            </CardTitle>
          </CardHeader>
        </Card>
      </Col>
    </Row>
  );
}

"use client";

import { Row, Col } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBoxAcrossTime, BoxSchedule } from "./charts";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ScheduleTable } from "./table-box";
import { useRouter } from "next/navigation";

export default function MainBoxSpecific({ box }: { box: any }) {
  const router = useRouter();
  const [boxCurrentData, setBoxCurrentData] = useState<any>();
  useEffect(() => {
    async function fetchDataTodayBox() {
      try {
        const res = await fetch(
          `/dashboard/reportaje/boxes/api/get_data_today_box?idBox=${box}`
        );
        const data: any = await res.json();
        setBoxCurrentData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchDataTodayBox();
  }, []);
  let nextTime = "--:--";
  if (boxCurrentData) {

    if (boxCurrentData["proximoBloque"]) {
      nextTime = `${boxCurrentData["proximoBloque"].split(":")[0]}:${
        boxCurrentData["proximoBloque"].split(":")[1]
      }`;
    }
  }
  return (
    <div>
      <div className="text-bold">
        <h1 style={{ margin: "0px 0px 10px 0px", fontSize: "130%" }}>
          Reporte Box - {box}
        </h1>
      </div>
      <Row justify={"center"} align={"middle"}>
        <Col
          xs={22}
          lg={10}
          style={{
            margin: "10px 0px",
          }}
        >
          <ChartBoxAcrossTime idbox={box} />
        </Col>
        <Col
          xs={22}
          lg={8}
          style={{
            margin: "10px 30px",
          }}
        >
          <BoxSchedule idbox={box} />
        </Col>
        <Col
          xs={22}
          lg={3}
          style={{
            margin: "10px 0px",
          }}
        >
          <Row justify={"center"} align={"middle"}>
            <Col xs={24}>
              <Card className="h-[205px]">
                <CardHeader className="mt-2 text-lg items-center text-center">
                  <CardTitle>Siguiente Hora</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      alignSelf: "center",
                      fontSize: "32px",
                      fontWeight: "600",
                    }}
                  >
                    {nextTime}
                  </p>
                </CardContent>
              </Card>
            </Col>
            <Col xs={24} style={{ marginTop: "10px" }}>
              <Card className="h-[205px]">
                <CardHeader className="mt-2 text-lg items-center text-center">
                  <CardTitle>Opciones</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Button style={{ margin: "0px 5px" }} onClick={() => router.push(`/dashboard/agendamiento/peticiones/${box}`)}>Peticiones</Button>
                  <Button style={{ margin: "5px 5px" }} onClick={() => router.push(`/dashboard/agendamiento/${box}`)}>Agendar</Button>
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={22}>
          <Card>
            <CardHeader>
              <div className="text-muted-foreground leading-none">
                Tabla agendamiento de box
              </div>
            </CardHeader>
            <CardContent>
              <ScheduleTable box={box} />
            </CardContent>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

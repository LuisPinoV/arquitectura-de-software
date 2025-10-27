"use client";

import { Row, Col } from "antd";
import Link from "next/link";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export function InfoCards() {

  const [percentageUsage, setPercentageUsage] = useState<string>("");
  const [countData, setCountData] = useState<string>("");

  useEffect(() => {
      async function fetchData() {
        const today = new Date();
        const yesterday = new Date(today);
        const tomorrow = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        tomorrow.setDate(today.getDate() + 1);
  
        const yesterdayISO = yesterday.toISOString().split("T")[0];
        const tomorrowISO = tomorrow.toISOString().split("T")[0];
  
        try {
          const resBoxes = await fetch(
            `/dashboard/reportaje/boxes/api/get_all_boxes_count`
          );
          const countBoxes: any = await resBoxes.json();
          const boxes: any = countBoxes["dataLength"];
  
          const res1 = await fetch(
            `/dashboard/general/api/usage_by_date?firstDate=${yesterdayISO}&lastDate=${tomorrowISO}`
          );
          const data1: any = await res1.json();
          const usageData1: any = `${data1["dataArr"][1]["uso"].toFixed(2)}%`;

          setPercentageUsage(usageData1);
  
          const res2 = await fetch(
            `/dashboard/reportaje/boxes/api/get_all_scheduling_today_count`
          );
          const data2: any = await res2.json();
          const lenData2: any = data2["dataLength"];

          setCountData(lenData2);

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      fetchData();
    }, []);
  return (
    <Row justify="center" align="top">
      <Col className="general-col" xs={24} sm={12} md={12} lg={12} xl={12}>
        <Card className="@container/card info-card">
          <CardHeader>
            <CardDescription>Uso boxes hoy</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {percentageUsage}
            </CardTitle>
            <CardAction>
              <Link href="#">Ver más</Link>
            </CardAction>
          </CardHeader>
        </Card>
      </Col>
      <Col className="general-col" xs={24} sm={12} md={12} lg={12} xl={12}>
        <Card className="@container/card info-card">
          <CardHeader>
            <CardDescription>Peticiones de agendamiento</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {countData}
            </CardTitle>
            <CardAction>
              <Link href="#">Ver más</Link>
            </CardAction>
          </CardHeader>
        </Card>
      </Col>
    </Row>
  );
}

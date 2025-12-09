"use client";

import { Row, Col } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBoxAcrossTime, BoxSchedule } from "./charts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRBox } from "./QR";
import { useRef } from "react";
import { TablaInventario, EditarInventario } from "./inventario";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "@/hooks/use-user";
import { ScheduleTable } from "./table-box";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/utils/get_user_profile";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MainBoxSpecific({ box }: { box: any }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [boxCurrentData, setBoxCurrentData] = useState<any>();
  const [spaceName, setSpaceName] = useState<string>("");

  //Get Space Name
  useEffect(() => {
    async function fetchSpaceName() {
      try {
        const res = await apiFetch(`/api/scheduling/get_boxes`);
        const data: any = await res?.json();
        if (Array.isArray(data)) {
          const curSpace = data.find((s) => s.idBox === box);

          setSpaceName(curSpace.nombre ? curSpace.nombre : "N/A");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchSpaceName();
  }, []);

  useEffect(() => {
    async function fetchDataTodayBox() {
      try {
        const res = await apiFetch(
          `/api/reports/get_data_today_box?idBox=${box}`
        );
        const data: any = await res?.json();
        setBoxCurrentData(data ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchDataTodayBox();
  }, []);
  let nextTime = "--:--";
  if (boxCurrentData) {
    if (boxCurrentData.proximoBloque) {
      nextTime = `${boxCurrentData.proximoBloque.split(":")[0]}:${
        boxCurrentData.proximoBloque.split(":")[1]
      }`;
    }
  }

  const [clientProfile, setClientProfile] = useState<any>(null);

  useEffect(() => {
    const p = getUserProfile();
    setClientProfile(p);
  }, []);

  const space = clientProfile?.spaceName ?? "Espacio";

  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) {
      return;
    }

    const svg = qrRef.current.querySelector("svg");
    if (!svg) {
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx?.drawImage(image, 0, 0);

      const pngFile = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `qr_box_${box}.png`;
      link.href = pngFile;
      link.click();
    };

    image.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handlePrint = () => {
    if (!qrRef.current) {
      return;
    }

    const printWindow = window.open("", "PRINT", "height=600, with=800");

    if (!printWindow) {
      return;
    }

    printWindow.document.writeln(`<html><head><title>QR</title></head><body>`);
    printWindow.document.writeln(qrRef.current.innerHTML);
    printWindow.document.writeln(`</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const [openInventoryDialog, setOpenInventoryDialog] = useState(false);

  const onCloseEditInventory = () => {
    setOpenInventoryDialog(false);
  };

  const onOpenEditInventory = () => {
    setOpenInventoryDialog(true);
  };

  return (
    <div>
      <div className="text-bold">
        <h1 style={{ margin: "0px 0px 10px 0px", fontSize: "130%" }}>
          {t("reports.title")} {space} - {spaceName}
        </h1>
      </div>
      <Row justify={"center"} align={"middle"}>
        <Col
          xs={22}
          md={22}
          lg={20}
          xl={10}
          style={{
            margin: "10px 0px",
          }}
        >
          <ChartBoxAcrossTime idbox={box} />
        </Col>
        <Col
          xs={22}
          md={22}
          lg={14}
          xl={8}
          style={{
            margin: "10px 30px",
          }}
        >
          <BoxSchedule idbox={box} />
        </Col>
        <Col
          xs={22}
          md={22}
          lg={6}
          xl={3}
          style={{
            margin: "10px 0px",
          }}
        >
          <Row justify={"center"} align={"middle"}>
            <Col xs={24}>
              <Card className="h-[160px]">
                <CardHeader className="mt-1 text-lg items-center text-center">
                  <CardTitle>{t("common.nextHour")}</CardTitle>
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
              <Card className="h-[250px]">
                <CardHeader className="mt-2 text-lg items-center text-center">
                  <CardTitle>{t("common.options")}</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    style={{ margin: "0px 5px" }}
                    onClick={() =>
                      router.replace(
                        `/dashboard/agendamiento/peticiones/${box}`
                      )
                    }
                  >
                    {t("common.requests")}
                  </Button>
                  <Button
                    style={{ margin: "5px 5px" }}
                    onClick={() =>
                      router.replace(`/dashboard/agendamiento/${box}`)
                    }
                  >
                    {t("common.schedule")}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild style={{ margin: "5px 5px" }}>
                      <Button>
                        {t("common.qrScheduling")}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="flex flex-col items-center">
                      <DialogHeader>
                        <DialogTitle>
                          Código QR del {space} {box}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="mt-4 flex justify-center">
                        <QRBox
                          idbox={box}
                          idPaciente="1"
                          userId="1"
                          ref={qrRef}
                        />
                      </div>

                      <div className="mt-6 flex gap-4">
                        <Button onClick={handleDownload}>{t("common.download")}</Button>
                        <Button onClick={handlePrint}>{t("common.print")}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col
          xs={22}
          md={18}
          lg={13}
          xl={18}
          style={{
            margin: "10px 0px 10px 10px",
          }}
        >
          <Card>
            <CardHeader className="mx-2">
              <div className="text-muted-foreground leading-none">
                {t("common.scheduleTable")} {space}
              </div>
            </CardHeader>
            <CardContent>
              <ScheduleTable box={box} />
            </CardContent>
          </Card>
        </Col>
        <Col
          xs={22}
          sm={8}
          md={8}
          lg={6}
          xl={4}
          style={{
            margin: "10px 0px 10px 10px",
          }}
        >
          <Card>
            <CardHeader>
              <div>
                {t("common.inventory")} {space} - {spaceName}
              </div>
              <Dialog>
                <DialogTrigger asChild style={{ margin: "5px 5px" }} >
                  <Button>
                    Editar
                  </Button>
                </DialogTrigger>

                <DialogContent className="flex flex-col items-center" >
                  <DialogHeader>
                    <DialogTitle>Editar inventario del {space} {box} </DialogTitle>
                  </DialogHeader>
        
                  <EditarInventario idBox={box} onClose={() => {}} onSaved={() => {}}/>

                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent style={{ maxHeight: "185px", overflowY: "scroll" }}>
              <TablaInventario idBox={box} />
            </CardContent>
          </Card>
        </Col>
      </Row>
      <Dialog open={openInventoryDialog}>
        <DialogContent className="flex flex-col items-center" onPointerDownOutside={onCloseEditInventory} onEscapeKeyDown={onCloseEditInventory}>
          <DialogHeader>
            <DialogTitle>
              Editar inventario del {space} - {spaceName}{" "}
            </DialogTitle>
          </DialogHeader>
            <EditarInventario
              idBox={box}
              onClose={onCloseEditInventory}
              onSaved={() => {}}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}

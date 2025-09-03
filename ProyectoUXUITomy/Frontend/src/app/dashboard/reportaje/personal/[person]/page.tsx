import { Row, Col } from "antd";
import { InfoCards } from "../components/info-cards";
import "../personal-general.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChartAtendidovsNoAtendido,
  ChartUsoPedidoUsado,
} from "../components/charts";
import { PersonalDataTable } from "../components/table-personal";

export default async function Page({
  params,
}: {
  params: Promise<{ person: string }>;
}) {
  const { person } = await params;
  const person_spaced = ReplaceUnderline(person);

  return (
    <div>
      <Row
        align={"top"}
        justify={"space-evenly"}
        style={{ margin: "10px 30px 30px 30px" }}
      >
        <Col
          xl={16}
          md={24}
          className="text-bold items-start"
          style={{
            margin: "20px 0px 40px 0px",
          }}
        >
          <h1
            style={{
              margin: "0px 0px 10px 0px",
              fontSize: "170%",
            }}
          >
            Reporte Persona - {person_spaced}
          </h1>
        </Col>
        <Col xl={8} sm={24}>
          <Card>
            <CardHeader>
              <CardTitle>Próximos agendamientos</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full" opts={{ align: "start" }}>
                <CarouselContent className="-ml-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-1 min-w-0 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <div className="p-1 min-w-0">
                        <Card>
                          <CardContent className="flex items-center justify-center p-2 sm:p-4 md:p-6 min-w-0">
                            <span className="text-2xl sm:text-3xl font-semibold">
                              {index + 1}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        </Col>
      </Row>
      <Row justify={"space-evenly"} align={"middle"}>
        <Col xs={21} style={{ margin: "5px 5px" }}>
          <PersonalDataTable />
        </Col>
      </Row>
    </div>
  );
}

function ReplaceUnderline(name: string) {
  return name.replaceAll("_", " ");
}

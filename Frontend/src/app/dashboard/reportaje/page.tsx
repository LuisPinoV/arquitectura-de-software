import { FileUser, Box } from "lucide-react";
import { Row, Col } from "antd";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <Row justify="center" align="middle" className="w-full h-full">
      <Col
        className="col-cards"
        md={15}
        lg={11}
        sm={20}
        style={{ margin: "5px 20px 5px 20px" }}
      >
        <Card className="w-full max-sm text-center">
          <CardHeader>
            <CardTitle>Boxes</CardTitle>
            <CardDescription>
              Reportes y herramientas para la gestión de boxes
            </CardDescription>
          </CardHeader>
          <CardContent style={{ display: "flex", justifyContent: "center" }}>
            <Box height={"50%"} width={"50%"} />
          </CardContent>
          <CardFooter style={{ display: "flex", justifyContent: "center" }}>
            <Button className="w-full">
              <Link
                className = "w-full"
                href="/dashboard/reportaje/boxes"
                style={{ color: "white" }}
              >
                Visitar
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
}

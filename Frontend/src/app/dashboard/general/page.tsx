import { Row, Col } from 'antd';

import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card"

import './general.css';
import { GraficoConcentracionPorEspecialidad, GraficoUsoSemanal, BoxesSpeficicChart } from './components/charts';
import {InfoCards} from './components/info-cards';
import { BoxesTable } from './components/box-table';

export default async function GeneralDashboardPage()
{

    return (
        <div className = "general-dashboard-container">
            <InfoCards/>
            <Row justify="center" align="top">
                <Col className = "general-col" xs={24} sm={24} md={24} lg={24} xl={12} xxl = {12}>
                    <GraficoConcentracionPorEspecialidad/>
                </Col>
                <Col className = "general-col" xs={24} sm={24} md={24} lg={24} xl={12} xxl = {12}>
                    <GraficoUsoSemanal/>
                </Col>
                <Col className = "general-col"  xs={24} sm={24} md={24} lg={24} xl={12} xxl = {12}>
                    <Card className="@container/card calendar-card">
                        <CardHeader>
                            <CardDescription>Tabla boxes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BoxesTable/>
                        </CardContent>
                    </Card>
                </Col>
                <Col className = "general-col"  xs={24} sm={24} md={24} lg={24} xl={12} xxl = {12}>
                    <Card className="@container/card donut-card">
                        <CardHeader>
                            <CardDescription>Uso boxes por categoría</CardDescription>
                        </CardHeader>
                        <CardContent className = "p-0 m-0">
                            <Row justify="center">
                                <Col xxl = {12} xl={12} lg = {12} xs = {24}>
                                    <BoxesSpeficicChart/>
                                </Col>
                                <Col xxl = {12} xl={12} lg = {12} xs = {24}>
                                    <BoxesSpeficicChart/>
                                </Col>
                            </Row>
                        </CardContent>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
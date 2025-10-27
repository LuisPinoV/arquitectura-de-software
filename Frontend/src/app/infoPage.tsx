"use client"

import React from "react";
import "animate.css";
import { Row, Col } from "antd";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

const DonutGauge: React.FC<{ value: number }> = ({ value }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg viewBox="0 0 120 120" className="w-24 h-24">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#E9ECEF"
        strokeWidth="12"
        fill="transparent"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#EF4444"
        strokeLinecap="round"
        strokeWidth="12"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="font-semibold fill-neutral-800"
      >
        {value.toFixed(1)}%
      </text>
    </svg>
  );
};

const BadgeChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
    {children}
  </span>
);

export default function InfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900">
      <Row
        justify="space-between"
        align="middle"
        className="px-6 py-4 border-b"
      >
        <Col xs={24}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-red-500 grid place-items-center text-white font-bold">
              +
            </div>
            <span className="text-lg font-semibold tracking-tight">
              AIOHospital
            </span>
            <Button
              variant="ghost"
              className="animate__animated animate__fadeInDown"
              onClick={() => router.push("/dashboard/general")}
            >
              Explorar
            </Button>
          </div>
        </Col>
      </Row>

      <Row
        justify="center"
        className="px-6 py-12 max-w-7xl mx-auto"
        gutter={[32, 32]}
      >
        <Col xs={24} md={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight animate__animated animate__fadeInUp">
                Visión general clara.
                <br />
                Toma decisiones{" "}
                <span className="text-neutral-800">rápidas.</span>
              </h1>
            </Col>
            <Col span={24}>
              <p className="text-neutral-600 animate__animated animate__fadeInUp animate__delay-1s">
                Plataforma para analizar y planificar el uso de recursos
              </p>
            </Col>
            <Col span={24}>
              <Row gutter={16}>
                <Col>
                  <Button
                    variant="outline"
                    className="h-11 px-6 rounded-xl animate__animated animate__fadeInUp animate__delay-2s"
                    onClick={() => router.push("/dashboard/general")}
                  >
                    Explorar
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={12}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md = {12}>
              <Card className="rounded-2xl shadow-sm animate__animated animate__fadeInRight">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-neutral-800">
                    Uso de boxes
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <DonutGauge value={30.4} />
                  <div className="space-y-1">
                    <div className="text-sm text-neutral-500">
                      Uso de boxes (hoy)
                    </div>
                    <BadgeChip>30.4%</BadgeChip>
                  </div>
                </CardContent>
              </Card>
            </Col>

            <Col xs={24} md = {12}>
              <Card className="rounded-2xl shadow-sm animate__animated animate__fadeInRight animate__delay-1s">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-neutral-800">
                    Reportajes claros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-20">
                    {[20, 35, 50, 70].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="w-4 sm:w-5 rounded-md bg-blue-200"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Col>

            <Col span={24}>
              <Card className="rounded-2xl shadow-sm animate__animated animate__fadeInUp animate__delay-2s">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-neutral-800">
                    Gestión de boxes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Row align="middle" gutter={16}>
                    <Col>
                      <div className="w-12 h-12 rounded-xl border-2 border-neutral-900 grid place-items-center">
                        <div className="w-6 h-6 border-2 border-neutral-900" />
                      </div>
                    </Col>
                    <Col flex="auto">
                      <p className="text-sm text-neutral-600">
                        Optimiza la ocupación y asignación de recursos con
                        tableros claros y actualizados.
                      </p>
                    </Col>
                  </Row>
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row
        justify="center"
        className="bg-neutral-50 px-6 py-8"
        gutter={[32, 32]}
      >
        <Col xs={24} md={8}>
          <div className="flex items-center gap-3 animate__animated animate__fadeInUp">
            <div className="w-9 h-9 rounded-full bg-red-100 grid place-items-center text-red-600">
              ⏱
            </div>
            <span className="font-semibold">Monitoreo en tiempo real</span>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="flex items-center gap-3 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="w-9 h-9 rounded-full bg-blue-100 grid place-items-center">
              📊
            </div>
            <span className="font-semibold">Reportes claros</span>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="flex items-center gap-3 animate__animated animate__fadeInUp animate__delay-2s">
            <div className="w-9 h-9 rounded-full bg-neutral-200 grid place-items-center">
              🧩
            </div>
            <span className="font-semibold">Gestión de boxes</span>
          </div>
        </Col>
      </Row>
    </div>
  );
}

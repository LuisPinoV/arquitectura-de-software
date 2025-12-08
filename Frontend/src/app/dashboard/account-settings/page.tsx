"use client";

import { Col, Row } from "antd";
import { AlertCircle, Brush, Accessibility } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import "./account-settings.theme.css";
import SettingButton from "./components/buttons";

export default function Page() {
  const { t } = useLanguage();
  
  const settingsButtonsColsStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    padding: "10px 0px",
  };

  const iconsStyle: React.CSSProperties = {
    margin: "6% 10%",
    minWidth:"75px",
    minHeight:"75px",
    width:"5vw",
    height:"5vw"
  };

  const brushIcon = <Brush className="text-secondary-foreground" strokeWidth="2px" style={iconsStyle} />;
  const alertIcon = <AlertCircle className="text-secondary-foreground" strokeWidth="2px" style={iconsStyle} />;
  const accessibilityIcon = <Accessibility className="text-secondary-foreground" strokeWidth="2px" style={iconsStyle} />;


  return (
    <Row justify={"center"} align={"middle"} style={{ height: "100%" }}>
      <Col xs={24} md = {12} xl={8} style={settingsButtonsColsStyle}>
        <SettingButton Icon = {alertIcon} title = {t("settings.general")} url = "/dashboard/account-settings/general"/>
      </Col>
      <Col
        className="settings-cols"
        xs={24}
        md = {12}
        xl={8}
        style={settingsButtonsColsStyle}
      >
        <SettingButton Icon = {brushIcon} title = {t("settings.customize")} url = "/dashboard/account-settings/themes"/>
      </Col>

      <Col
        className="settings-cols"
        xs={24}
        md = {12}
        xl={8}
        style={settingsButtonsColsStyle}
      >
        <SettingButton Icon = {accessibilityIcon} title = {t("settings.accessibility")} url = "#"/>
      </Col>
    </Row>
  );
}

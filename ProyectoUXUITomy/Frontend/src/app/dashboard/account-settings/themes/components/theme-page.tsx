"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Col, Row, theme } from "antd";
import { motion } from "framer-motion";

import { Moon, Paintbrush, Plus, Sun } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import convert from "color-convert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const iconsStyle: React.CSSProperties = {
  height: "30px",
  width: "30px",
};

type ColorPickerProps = {
  onChange?: (value: string) => void;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  color: string;
};

const colors = [
  {
    name: "Color principal",
    color: "--primary",
  },
  {
    name: "Color principal texto",
    color: "--primary-foreground",
  },
  {
    name: "Color fondo",
    color: "--background",
  },
  {
    name: "Color primer plano",
    color: "--foreground",
  },
  {
    name: "Color principal cartas",
    color: "--card",
  },
  {
    name: "Color secundario cartas",
    color: "--card-foreground",
  },
  {
    name: "Color principal popovers",
    color: "--popover",
  },
  {
    name: "Color secundario popovers",
    color: "--popover-foreground",
  },
  {
    name: "Color secundario",
    color: "--secondary",
  },
  {
    name: "Color secundario texto",
    color: "--secondary-foreground",
  },
];

type ThemesCarouselProps = {
  onSelect?: (colorData: any) => void;
};

export function ExistingThemesCarousel({onSelect}:ThemesCarouselProps) {
  const existingThemes = [
    {
      name: "Claro",
      icon: <Sun style={iconsStyle} />,
      id: "light",
    },
    {
      name: "Oscuro",
      icon: <Moon style={iconsStyle} />,
      id: "dark",
    },
  ];

  const onSelectDefaultTheme = (id: string) => {
    if (id != "light" && id != "dark") {
      return null;
    }

    const themeColors: string[] = [];

    for (let i = 0; i < colors.length; i++) {
      let curColor: string = getThemeVariable(colors[i].color, id);

      if (curColor.startsWith("lab")) {
        const curColorLab = parseLab(curColor);
        curColor = convert.lab.hex([
          curColorLab.l,
          curColorLab.a,
          curColorLab.b,
        ]);
        curColor = "#" + curColor;
      }

      themeColors.push(curColor);
    }

    if (onSelect) {
      onSelect(themeColors);
    }
  };

  return (
    <Card
      className="px-2 sm:px-8"
      style={{
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        flex: "1 1 100%",
      }}
    >
      <CardHeader>
        <CardTitle className="text-left text-lg font-semibold">Temas</CardTitle>
        <CardAction>
          <Button>Guardar</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Carousel className="w-full -lm-2">
          <CarouselContent className="px-1">
            <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/8 px-0">
              <Card className="w-full max-w-[160px] mx-auto border-transparent min-w-0 ps-1">
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  <Button
                    className="w-full h-full flex flex-col text-center"
                    style={{ flex: "1 1 100%" }}
                    variant="outline"
                  >
                    <Plus style={iconsStyle} />
                    <span className="text-sm sm:text-base">Añadir</span>
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
            {existingThemes.map((data, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/8 px-0"
              >
                <Card className="w-full max-w-[160px] mx-auto border-transparent min-w-0 ps-1">
                  <CardContent className="flex aspect-square items-center justify-center p-2">
                    <Button
                      className="w-full h-full flex flex-col text-center p-2"
                      variant="outline"
                      style={{ flex: "1 1 100%" }}
                      onClick={() => onSelectDefaultTheme(data.id)}
                    >
                      {data.icon}
                      <span className="text-sm sm:text-base">{data.name}</span>
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
      <CardFooter
        style={{ display: "flex", justifyContent: "right" }}
      ></CardFooter>
    </Card>
  );
}

export function ThemePage() {
  const [curColors, setCurColors] = useState<
    { name: string; colorHex: string }[]
  >([]);

  const [tempColors, setTempColors] = useState<
    { name: string; colorHex: string }[]
  >([]);

  const [profileName, setProfileName] = useState<string>("");

  const onSelectedProfile = ((theme:string[]) =>
  {
    //setCurColors(colors_);
    //setTempColors(colors_);
  })

  const onHandleChangeColor = (idx: number, newColor: string) => {
    setTempColors((prev) => {
      const copy = [...prev];
      copy[idx] = { name: copy[idx].name, colorHex: newColor };
      return copy;
    });
  };

  const onCancelChangeColor = () => {
    setTempColors(curColors);
  };

  const onHandleConfirmColor = () => {
    setCurColors(tempColors);
  };

  return (
    <>
      <Col xs={24} style={{ display: "flex", marginBottom: "20px" }}>
        <ExistingThemesCarousel onSelect={((theme) => {onSelectedProfile(theme)})} />
      </Col>
      <Col xs={24}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <Card className="px-8">
            <CardTitle className="text-lg font-semibold">Añadir tema</CardTitle>
            <CardContent>
              <Row justify={"start"} align={"top"}>
                <Col xs={24} md={8}>
                  <Row>
                    <Col xs={24}>
                      <span className="text-md font-semibold">
                        Nombre perfil
                      </span>
                      <Input
                        className="mt-1"
                        type="text"
                        placeholder="Nuevo perfil"
                        value={profileName}
                        onChange={(event) => {
                          setProfileName(event.currentTarget.value);
                        }}
                      />
                    </Col>
                    {tempColors.map((data, index) => (
                      <Col key={index} xs={24} style={{ marginTop: "10px" }}>
                        <span className="text-md font-semibold">
                          {data.name}
                        </span>
                        <ColorPicker
                          color={data.colorHex}
                          onChange={(newColor) =>
                            onHandleChangeColor(index, newColor)
                          }
                          onCancel={onCancelChangeColor}
                          onConfirm={onHandleConfirmColor}
                        />
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
              <CardDescription className="mt-6 mb-0">
                ¿Crear tema?
              </CardDescription>
            </CardContent>
            <CardFooter
              className="-mt-4"
              style={{ display: "flex", justifyContent: "left" }}
            >
              <Button className="me-2" variant={"outline"}>
                Cancelar
              </Button>
              <Button>Confirmar</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </Col>
    </>
  );
}

function ColorPicker({
  onChange,
  onConfirm,
  onCancel,
  color,
}: ColorPickerProps) {
  const handleConfirm = (newColor: string) => {
    if (onConfirm) {
      onConfirm(newColor);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleChange = (newColor: string) => {
    if (onChange) {
      onChange(newColor);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full shadow-xs flex">
            <div
              className="h-full shadow-xs me-1"
              style={{
                flex: "1 1 100%",
                backgroundColor: color,
                borderRadius: "var(--radius)",
                borderColor: "var(--muted-foreground)",
                borderWidth: "1px",
              }}
            ></div>
            <Button variant="outline" style={{ flex: "1 1 5%" }}>
              <Paintbrush />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-70">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium text-center">
                Elegir color
              </h4>
              <p className="text-muted-foreground text-sm">
                Cambia el color de la propiedad actual
              </p>
            </div>
            <div className="grid gap-2">
              <div
                className="items-center gap-2"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <HexColorPicker color={color} onChange={handleChange} />
              </div>
              <div
                className="grid grid-cols-3 items-center gap-4 mt-2"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  className="m-2"
                  variant={"outline"}
                  onClick={handleCancel}
                  asChild
                >
                  <PopoverClose>Cancelar</PopoverClose>
                </Button>
                <Button asChild>
                  <PopoverClose onClick={() => handleConfirm(color)}>
                    Confirmar
                  </PopoverClose>
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ColorPickerAccordion({
  onChange,
  onConfirm,
  onCancel,
  color,
}: ColorPickerProps) {
  const handleConfirm = (newColor: string) => {
    if (onConfirm) {
      onConfirm(newColor);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleChange = (newColor: string) => {
    if (onChange) {
      onChange(newColor);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionContent>
            <AccordionTrigger>
              <div className="w-full shadow-xs flex">
                <div
                  className="h-full shadow-xs me-1"
                  style={{
                    flex: "1 1 100%",
                    backgroundColor: color,
                    borderRadius: "var(--radius)",
                    borderColor: "var(--muted-foreground)",
                    borderWidth: "1px",
                  }}
                ></div>
                <Button variant="outline" style={{ flex: "1 1 5%" }}>
                  <Paintbrush />
                </Button>
              </div>
            </AccordionTrigger>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="leading-none font-medium text-center">
                  Elegir color
                </h4>
                <p className="text-muted-foreground text-sm">
                  Cambia el color de la propiedad actual
                </p>
              </div>
              <div className="grid gap-2">
                <div
                  className="items-center gap-2"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <HexColorPicker color={color} onChange={handleChange} />
                </div>
                <div
                  className="grid grid-cols-3 items-center gap-4 mt-2"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    className="m-2"
                    variant={"outline"}
                    onClick={handleCancel}
                    asChild
                  >
                    <CollapsibleTrigger>Cancelar</CollapsibleTrigger>
                  </Button>
                  <Button asChild>
                    <CollapsibleTrigger onClick={() => handleConfirm(color)}>
                      Confirmar
                    </CollapsibleTrigger>
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

type Lab = { l: number; a: number; b: number; alpha?: number };

function parseLab(str: string): Lab {
  str = str.replace(/,\s*/g, " ").trim();

  const regex =
    /^lab\(\s*([+-]?[0-9.]+%?)\s+([+-]?[0-9.]+)\s+([+-]?[0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\)$/i;

  const match = str.match(regex);
  if (!match) throw new Error(`Invalid Lab string: ${str}`);

  let [, lStr, aStr, bStr, alphaStr] = match;

  const l = lStr.endsWith("%") ? parseFloat(lStr) : parseFloat(lStr);
  const a = parseFloat(aStr);
  const b = parseFloat(bStr);

  let alpha: number | undefined;
  if (alphaStr !== undefined) {
    alpha = alphaStr.endsWith("%")
      ? parseFloat(alphaStr) / 100
      : parseFloat(alphaStr);
  }

  return { l, a, b, alpha };
}

function getThemeVariable(variable: string, theme: "light" | "dark") {
  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules as any) {
      if (theme === "light" && rule.selectorText === ":root") {
        return rule.style.getPropertyValue(variable)?.trim();
      }
      if (theme === "dark" && rule.selectorText === ".dark") {
        return rule.style.getPropertyValue(variable)?.trim();
      }
    }
  }
  return null;
}

async function getThemesFromDB() {
  //TODO: Connect to DynamoDB using SNS
}

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
import { motion, AnimatePresence } from "framer-motion";

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
import { useTheme } from "next-themes";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

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
  onSelect?: (idTheme: string, colorData: any, idx: number) => void;
  onAdd?: () => void;
  buttonSelected: boolean[];
  showSaveButton: boolean;
  showDeleteButton: boolean;
  onSaved?: () => void;
  customProfiles?: { name: string; icon: any; id: string; colors: string[] }[];
  onDeleted?: () => void;
};

export function ExistingThemesCarousel({
  onSelect,
  onAdd,
  buttonSelected,
  showSaveButton,
  onSaved,
  customProfiles,
  showDeleteButton,
  onDeleted,
}: ThemesCarouselProps) {
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

  const onSelectCustomTheme = (id: string, idx: number, idxProfile: number) => {
    if (!customProfiles) return;

    const themeColors: string[] = [];
    const profile = customProfiles[idxProfile];

    for (let i = 0; i < profile.colors.length; i++) {
      let curColor: string = profile.colors[i];

      themeColors.push(curColor);
    }

    if (onSelect) {
      onSelect(id, themeColors, idx);
    }
  };

  const onSelectDefaultTheme = (id: string, idx: number) => {
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
      onSelect(id, themeColors, idx);
    }
  };

  const onAddButtonPressed = () => {
    if (onAdd) onAdd();
  };

  const onSavedCurrentTheme = () => {
    if (onSaved) {
      onSaved();
    }
  };

  const onDeletedCurrentTheme = () => {
    if (onDeleted) onDeleted();
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
          <AnimatePresence initial={false}>
            {showSaveButton ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                {showDeleteButton ? (
                  <Button
                    variant={"default"}
                    onClick={onDeletedCurrentTheme}
                    style={{ margin: "0px 5px" }}
                  >
                    Borrar
                  </Button>
                ) : null}
                <Button
                  variant={"outline"}
                  onClick={onSavedCurrentTheme}
                  style={{ margin: "0px 5px" }}
                >
                  Guardar
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </CardAction>
      </CardHeader>
      <CardContent className="flex justify-center -mt-6">
        <Carousel className="w-full max-w-sm">
          <CarouselContent className="-ml-1">
            <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="border-transparent">
                  <CardContent className="flex aspect-square items-center justify-center p-0">
                    <Button
                      className="w-full h-full flex flex-col text-center"
                      style={{ flex: "1 1 100%" }}
                      variant={buttonSelected[0] ? "default" : "outline"}
                      onClick={onAddButtonPressed}
                    >
                      <Plus style={iconsStyle} />
                      <span className="text-sm sm:text-base">Añadir</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            {existingThemes.map((data, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="border-transparent">
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <Button
                        className="w-full h-full flex flex-col text-center p-2"
                        variant={
                          buttonSelected[1 + index] ? "default" : "outline"
                        }
                        style={{ flex: "1 1 100%" }}
                        onClick={() => onSelectDefaultTheme(data.id, 1 + index)}
                      >
                        {data.icon}
                        <span className="text-sm sm:text-base">
                          {data.name}
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
            {customProfiles
              ? customProfiles.map((data, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-1 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card className="border-transparent">
                        <CardContent className="flex aspect-square items-center justify-center p-0">
                          <Button
                            className="w-full h-full flex flex-col text-center p-2"
                            variant={
                              buttonSelected[1 + existingThemes.length + index]
                                ? "default"
                                : "outline"
                            }
                            style={{ flex: "1 1 100%" }}
                            onClick={() =>
                              onSelectCustomTheme(
                                data.id,
                                1 + existingThemes.length + index,
                                index
                              )
                            }
                          >
                            {data.icon}
                            <span className="text-sm sm:text-base">
                              {data.name}
                            </span>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              : null}
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
  const { setTheme } = useTheme();
  const [curColors, setCurColors] = useState<
    { name: string; colorHex: string }[]
  >([]);

  const [tempColors, setTempColors] = useState<
    { name: string; colorHex: string }[]
  >([]);

  const [profileName, setProfileName] = useState<string>("");
  const [profileId, setProfileId] = useState<string>("");
  const [isAddThemeVisible, setIsAddThemeVisible] = useState(false);
  const [buttonSelected, setButtonSelected] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [customProfiles, setCustomProfiles] = useState<
    { name: string; icon: any; id: string; colors: string[] }[]
  >([]);

  useEffect(() => {
    GetThemes();
  }, []);

  const onSelectedProfile = (
    idTheme: string,
    theme: string[],
    idxThemeSelected: number
  ) => {
    let name = "";
    if (idTheme == "light" || idTheme == "dark") {
      name = idTheme == "light" ? "Claro" : "Oscuro";
      setProfileName(name);
      setShowDeleteButton(false);
    } else {
      for (let i = 0; i < customProfiles.length; i++) {
        if (customProfiles[i].id === idTheme) {
          name = customProfiles[i].name;
          setProfileName(name);
          break;
        }
      }
    }
    const colors_: { name: string; colorHex: string }[] = [];
    for (let i = 0; i < theme.length; i++) {
      const colorName = colors[i].name;
      const color = theme[i];

      colors_.push({ name: colorName, colorHex: color });
    }
    setButtonSelected((prev) => {
      const copy = [...prev];
      copy[idxThemeSelected] = true;
      for (let i = 0; i < copy.length; i++) {
        if (i === idxThemeSelected) continue;
        copy[i] = false;
      }
      return copy;
    });
    setCurColors(colors_);
    setTempColors(colors_);
    setIsAddThemeVisible(true);
    setShowSaveButton(true);
    setProfileId(idTheme);
    if (idTheme != "light" && idTheme != "dark") {
      setShowDeleteButton(true);
    }
  };

  async function GetThemes() {
    const claims = await AutohrizeAndGetClaims();
    const userId = claims.sub;
    const profiles = await getCustomThemesFromDB(userId);

    if (!profiles) return;

    const profilesArr = [];

    for (let i = 0; i < profiles.length; i++) {
      const curProfile = profiles[i];
      if (!curProfile.preferences.name) continue;

      const colors: string[] = [];
      for (let i = 0; i < curProfile.preferences.colors.length; i++) {
        const curColor = curProfile.preferences.colors[i];
        colors.push(curColor.colorHex);
      }

      const profileParams = {
        name: curProfile.preferences.name,
        icon: <Paintbrush style={iconsStyle} />,
        id: curProfile.profileType,
        colors: colors,
      };
      profilesArr.push(profileParams);
    }

    setCustomProfiles(profilesArr);
  }

  const onHandleChangeColor = (idx: number, newColor: string) => {
    setTempColors((prev) => {
      const copy = [...prev];
      copy[idx] = { name: copy[idx].name, colorHex: newColor };
      return copy;
    });

    if (!buttonSelected[0] && (buttonSelected[1] || buttonSelected[2])) {
      setButtonSelected((prev) => {
        const copy = [...prev];
        copy[0] = true;
        for (let i = 1; i < copy.length; i++) {
          copy[i] = false;
        }
        return copy;
      });
      setShowSaveButton(false);
    }
  };

  const onCancelChangeColor = () => {
    setTempColors(curColors);
  };

  const onHandleConfirmColor = () => {
    setCurColors(tempColors);
  };

  const onCancelAddTheme = () => {
    setTempColors([]);
    setCurColors([]);
    setIsAddThemeVisible(false);
    setButtonSelected((prev) => {
      const copy = [...prev];
      for (let i = 0; i < copy.length; i++) {
        copy[i] = false;
      }
      return copy;
    });

    scrollToSection("topOfPage");
    scrollToTop();
  };

  const onPressedAddThemeButton = () => {
    const colors_: { name: string; colorHex: string }[] = [];

    for (let i = 0; i < colors.length; i++) {
      const colorName = colors[i].name;
      const color = "#FFFFFF";

      colors_.push({ name: colorName, colorHex: color });
    }
    setCurColors(colors_);
    setTempColors(colors_);
    setShowSaveButton(false);
    setShowDeleteButton(false);
    setIsAddThemeVisible(true);
    setProfileName("");
    setProfileId("");
    setButtonSelected((prev) => {
      const copy = [...prev];
      copy[0] = true;
      for (let i = 1; i < copy.length; i++) {
        copy[i] = false;
      }
      return copy;
    });
  };

  const onSavedProfile = async () => {
    let colorsProfile: string[] = [];
    for (let i = 0; i < customProfiles.length; i++) {
      if (customProfiles[i].id === profileId) {
        colorsProfile = customProfiles[i].colors;
        break;
      }
    }

    if (colorsProfile.length !== 0) {
      const styleTag = document.createElement("style");
      styleTag.id = `theme-${profileId}`;
      let theme = `[data-theme='${profileId}'] {\n`;

      for (let i = 0; i < colors.length; i++) {
        theme += `  ${colors[i].color}: ${colorsProfile[i]};\n`;
      }

      theme += "}\n";
      styleTag.innerHTML = theme;

      const oldTag = document.getElementById(styleTag.id);
      if (oldTag) oldTag.remove();

      document.head.appendChild(styleTag);
    }

    if (profileId != "dark" && profileId != "light") {
      saveProfileToLocalStorage(profileId, colorsProfile);
    }

    setTheme(profileId);
    setShowSaveButton(false);
    setShowDeleteButton(false);
  };

  const deleteProfile = (profileId: string) => {
    // Remove from localStorage
    const profiles = JSON.parse(localStorage.getItem("customProfiles") || "{}");
    if (profiles[profileId]) {
      delete profiles[profileId];
      localStorage.setItem("customProfiles", JSON.stringify(profiles));
    }

    const styleTag = document.getElementById(`theme-${profileId}`);
    if (styleTag) {
      styleTag.remove();
    }

    if (
      window.document.documentElement.getAttribute("data-theme") === profileId
    ) {
      setTheme("system");
    }
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addNewTheme = async () => {
    let userId = "";
    const claims = await AutohrizeAndGetClaims();

    if (claims) {
      userId = claims.sub;
    }

    if (userId === "") return;

    const profileId = uuidv4();
    const name = profileName !== "" ? profileName : "Nuevo perfil";
    const colors = curColors;
    const params = { name: name, colors: colors };
    const body = {
      userId: userId,
      profileType: profileId,
      preferences: params,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_THEME_PROFILE;
      const res = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        console.log("Perfil creado correctamente");
        onCancelAddTheme();
        await GetThemes();
        toast("Se ha creado nuevo tema", {
          description: new Date().toLocaleString(),
          action: {
            label: "Descartar",
            onClick: () => console.log("Descartar"),
          },
        });
      } else {
        console.log("Perfil no pudo ser creado");
      }
    } catch {
      console.log("Perfil no pudo ser creado");
    }
  };

  const addThemeHTML = (
    <section id="addTheme">
      <Col xs={24} lg={18}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <Card className="px-8">
            <CardTitle className="text-lg font-semibold">Añadir tema</CardTitle>
            <CardContent>
              <Row justify={"start"} align={"top"}>
                <Col xs={24} md={18} lg={12}>
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
              <Button
                className="me-2"
                variant={"outline"}
                onClick={onCancelAddTheme}
              >
                Cancelar
              </Button>
              <Button onClick={addNewTheme}>Confirmar</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </Col>
    </section>
  );

  return (
    <>
      <section id="themesCarousel">
        <Col
          xs={24}
          md={12}
          lg={12}
          style={{ display: "flex", marginBottom: "20px" }}
        >
          <ExistingThemesCarousel
            onSelect={(id, theme, idx) => {
              onSelectedProfile(id, theme, idx);
            }}
            onAdd={onPressedAddThemeButton}
            buttonSelected={buttonSelected}
            showSaveButton={showSaveButton}
            onSaved={onSavedProfile}
            customProfiles={customProfiles}
            showDeleteButton={showDeleteButton}
            onDeleted={() => deleteProfile(profileId)}
          />
        </Col>
      </section>
      <AnimatePresence initial={false}>
        {isAddThemeVisible ? addThemeHTML : null}
      </AnimatePresence>
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
      <Popover onOpenChange={handleCancel}>
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

async function getCustomThemesFromDB(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_THEME_PROFILE;
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "GET",
    });

    if (res.ok) {
      console.log("Got profiles");
      const resJson = await res.json();
      return resJson;
    } else {
      console.log("Couldn't get profiles");
      return null;
    }
  } catch {
    console.log("Couldn't get profiles");
    return null;
  }
}

async function AutohrizeAndGetClaims() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const apiUrl = process.env.NEXT_PUBLIC_AUTH_USER_URL;
    const res = await fetch(`${apiUrl}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const resJson = await res.json();

    if (res.ok) {
      console.log("Got claims");
      return resJson;
    } else {
      console.log("Couldn't get claims");
      return null;
    }
  } catch {
    console.log("Couldn't get claims");
    return null;
  }
}

const saveProfileToLocalStorage = (
  profileId: string,
  colorsProfile: string[]
) => {
  const profiles = JSON.parse(localStorage.getItem("customProfiles") || "{}");
  profiles[profileId] = colorsProfile;
  localStorage.setItem("customProfiles", JSON.stringify(profiles));
};

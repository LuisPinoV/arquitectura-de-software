"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Row, Col } from "antd";
import { apiFetch } from "@/lib/apiClient";
import { useLanguage } from "@/contexts/LanguageContext";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { parseJwt } from "@/lib/utils";

export default function NuevoEspacioPage() {
  const { t } = useLanguage();

  const [companyName, setCompanyName] = useState("");
  const [spaceName, setSpaceName] = useState("");

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    const claims = parseJwt(idToken ?? "");

    const companyClaim =
      claims["custom:companyName"] ||
      claims.companyName ||
      claims.org ||
      claims["cognito:groups"] ||
      "";

    const spaceClaim = claims["custom:spaceName"] || claims.spaceName || "";

    setCompanyName(companyClaim);
    setSpaceName(spaceClaim);
  });

  const NuevoUsuarioSchema = z.object({
    name: z.string().min(3, t("newUser.nameMissing")),
    email: z.string().email(t("newUser.wrongEmail")),
    password: z
      .string()
      .min(8, t("newUser.passwordRequirements.characters"))
      .regex(/[A-Z]/, t("newUser.passwordRequirements.mayus"))
      .regex(/[a-z]/, t("newUser.passwordRequirements.minus"))
      .regex(/[0-9]/, t("newUser.passwordRequirements.number"))
      .regex(/[^A-Za-z0-9]/, t("newUser.passwordRequirements.special")),
    companyName: z.string(),
    spaceName: z.string(),
    group: z.string(),
  });

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [loadingRegistration, setLoadingRegistration] =
    useState<boolean>(false);

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setOpenAlert(true);
  };

  const closeAlert = () => {
    setAlertMessage("");
    setOpenAlert(false);
  };

  const registerButton = (
    <Button type="submit" className="w-full">
      {t("newUser.createUser")}
    </Button>
  );

  const loadingButton = (
    <Button type="submit" className="w-full">
      <Spinner>{t("newUser.loading")}</Spinner>
    </Button>
  );

  const form = useForm<z.infer<typeof NuevoUsuarioSchema>>({
    resolver: zodResolver(NuevoUsuarioSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      group: "Usuario",
      companyName: companyName,
      spaceName: spaceName,
    },
  });

  async function onSubmit(data: z.infer<typeof NuevoUsuarioSchema>) {
    try {
      data.companyName = companyName;
      data.spaceName = spaceName;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      setLoadingRegistration(true);
      const res = await apiFetch("/api/session/createUser", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      const json = await res?.json().catch(() => ({}));
      showAlert(t("newUser.successCreatingUser"));
    } catch (e) {
      showAlert(t("newUser.errorCreatingUser"));
    }

    setLoadingRegistration(false);
  }

  return (
    <div className="nuevo-user-container">
      <Row justify="center">
        <Col xs={24} sm={18} md={14} lg={10} xl={8}>
          <Card>
            <CardHeader>
              <CardTitle>{t("newUser.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newUser.name")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("newUser.namePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newUser.email")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("newUser.emailPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newUser.password")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    {loadingRegistration ? loadingButton : registerButton}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </Col>
      </Row>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("newUser.userCreation")}</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAlert}>
              {t("newUser.understood")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

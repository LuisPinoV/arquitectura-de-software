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
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function NuevoEspacioPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const NuevoEspacioSchema = z.object({
    spaceName: z.string().min(1, t("newSpace.spaceNameRequired")),
    pasillo: z.string().optional(),
    capacidad: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
  });

  const [openAler, setOpenAlert] = useState(false);
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
      {t("newSpace.createSpace")}
    </Button>
  );

  const loadingButton = (
    <Button type="submit" className="w-full">
      <Spinner>{t("newSpace.loading")}</Spinner>
    </Button>
  );

  const form = useForm<z.infer<typeof NuevoEspacioSchema>>({
    resolver: zodResolver(NuevoEspacioSchema),
    defaultValues: {
      spaceName: "",
      pasillo: "",
      capacidad: "",
      category: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof NuevoEspacioSchema>) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      setLoadingRegistration(true);
      const res = await apiFetch("/api/spaces/create", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      const json = await res?.json().catch(() => ({}));
      console.debug("Create espacio response", {
        status: res?.status,
        body: json,
      });

      if (res?.ok) {
        const createdId =
          json.idBox ||
          json.id ||
          (typeof json === "object" && json.idBox) ||
          null;
        if (createdId) {
          setLoadingRegistration(false);
          showAlert(`${t("newSpace.spaceCreatedSuccess")} (id: ${createdId})`);
        } else {
          setLoadingRegistration(false);
          showAlert(json.message || t("newSpace.spaceCreatedSuccess"));
        }
      } else {
        setLoadingRegistration(false);
        showAlert(json.message || t("newSpace.errorCreatingSpace"));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setLoadingRegistration(false);
      showAlert(t("newSpace.errorCreatingSpace"));
    }
  }

  return (
    <div className="nuevo-espacio-container">
      <Row justify="center">
        <Col xs={24} sm={18} md={14} lg={10} xl={8}>
          <Card>
            <CardHeader>
              <CardTitle>{t("newSpace.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="spaceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newSpace.spaceName")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("newSpace.spaceNamePlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newSpace.category")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("newSpace.optional")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pasillo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newSpace.hallway")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("newSpace.hallwayPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newSpace.capacity")}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newSpace.description")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("newSpace.descriptionPlaceholder")}
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
      <AlertDialog open={openAler} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("newSpace.spaceCreation")}</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAlert}>
              {t("newSpace.understood")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

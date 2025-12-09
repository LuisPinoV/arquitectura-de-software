"use client"


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
import {v4 as uuidv4} from 'uuid';


export default function NuevoFuncionario() {
    const { t } = useLanguage();
    const router = useRouter();

    const NuevoFuncionarioSchema = z.object({
        idFuncionario: z.string(),
        nombre: z.string().min(3, t("newUser.nameMissing")),
        rut: z.string().optional(),
        tipoFuncionario: z.string().optional(),
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
        {t("newFuncionario.createFuncionario")}
        </Button>
    );

    const loadingButton = (
        <Button type="submit" className="w-full">
        <Spinner>{t("newUser.loading")}</Spinner>
        </Button>
    );

    const form = useForm<z.infer<typeof NuevoFuncionarioSchema>>({
        resolver: zodResolver(NuevoFuncionarioSchema),
        defaultValues: {
            idFuncionario: uuidv4(),
            nombre: "",
            rut: "",
            tipoFuncionario: ""
        },
    });

    async function onSubmit(data: z.infer<typeof NuevoFuncionarioSchema>) {
        try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        setLoadingRegistration(true);
        const res = await apiFetch("/api/createFuncionario", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });

        const json = await res?.json().catch(() => ({}));
        } catch (e) {
        showAlert(t("newFuncionario.errorCreatingFuncionario"));
        }
        setLoadingRegistration(false);
    }

    return (
        <div className="nuevo-espacio-container">
        <Row justify="center">
            <Col xs={24} sm={18} md={14} lg={10} xl={8}>
            <Card>
                <CardHeader>
                <CardTitle>{t("newFuncionario.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                    >
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("newFuncionario.funcionarioName")}</FormLabel>
                            <FormControl>
                            <Input placeholder={t("newUser.namePlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rut"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("newFuncionario.rut")}</FormLabel>
                            <FormControl>
                            <Input placeholder={t("newFuncionario.rutPlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tipoFuncionario"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("newFuncionario.tipoFuncionario")}</FormLabel>
                            <FormControl>
                            <Input placeholder={t("newFuncionario.tipoFuncionarioPlaceholder")} {...field} />
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
                <AlertDialogTitle>{t("newFuncionario.funcionarioCreation")}</AlertDialogTitle>
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

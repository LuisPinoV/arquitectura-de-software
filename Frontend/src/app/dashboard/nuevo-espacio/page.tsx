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

const NuevoEspacioSchema = z.object({
  spaceName: z.string().min(1, "El nombre del espacio es requerido"),
  pasillo: z.string().optional(),
  capacidad: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

export default function NuevoEspacioPage() {
  const router = useRouter();

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
      Crear espacio
    </Button>
  );

  const loadingButton = (
    <Button type="submit" className="w-full">
      <Spinner>Cargando...</Spinner>
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
          showAlert(`Espacio creado correctamente (id: ${createdId})`);
        } else {
          setLoadingRegistration(false);
          showAlert(json.message || "Espacio creado correctamente");
        }
      } else {
        setLoadingRegistration(false);
        showAlert(json.message || "Error creando el espacio");
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setLoadingRegistration(false);
      showAlert("Error creando el espacio");
    }
  }

  return (
    <div className="nuevo-espacio-container">
      <Row justify="center">
        <Col xs={24} sm={18} md={14} lg={10} xl={8}>
          <Card>
            <CardHeader>
              <CardTitle>Nuevo espacio</CardTitle>
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
                        <FormLabel>Nombre del espacio</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Sala A, Box 12" {...field} />
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
                        <FormLabel>Categoría</FormLabel>
                        <FormControl>
                          <Input placeholder="Opcional" {...field} />
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
                        <FormLabel>Pasillo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: P1" {...field} />
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
                        <FormLabel>Capacidad</FormLabel>
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
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Descripción breve..."
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
            <AlertDialogTitle>Creación espacio</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAlert}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

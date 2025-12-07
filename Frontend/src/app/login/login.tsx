"use client";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiClient";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const [openAler, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setOpenAlert(true);
  };

  const closeAlert = () => {
    setAlertMessage("");
    setOpenAlert(false);
  };
  
  const FormSchema = z.object({
    username: z.string().email({
      message: "Debes utilizar un correo electrónico.",
    }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginButton = (
    <Button type="submit" className="w-full">
                    Iniciar Sesión
    </Button>
  );

  const loadingButton = (
    <Button type="submit" className="w-full">
      <Spinner>Cargando...</Spinner>
    </Button>
  );

  const router = useRouter();

  useEffect(() => {
    async function TryFirstLogin() {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;
      setLoadingLogin(true);
      try {
        const res = await apiFetch(`/api/session/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refreshToken }),
        });

        const resJson = await res.json();

        setLoadingLogin(false);

        if (resJson.ok) {
          showAlert("Sesión Iniciada!");
          router.replace("/dashboard/general");
          localStorage.setItem("idToken", resJson.idToken);
          localStorage.setItem("accessToken", resJson.accessToken);
        } else {
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("idToken");
          localStorage.removeItem("accessToken");
        }
      } catch {
        localStorage.removeItem("refreshToken");
      }
    }

    TryFirstLogin();
  }, []);

  async function onSubmitLogin(data: z.infer<typeof FormSchema>) {
    try {
      setLoadingLogin(true);
      const res = await apiFetch(`/api/session/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();

      if (resJson.ok) {
        showAlert("Sesión Iniciada!");
        localStorage.setItem("accessToken", resJson.accessToken);
        localStorage.setItem("idToken", resJson.idToken);
        localStorage.setItem("refreshToken", resJson.refreshToken);

        router.replace("/dashboard/general");
      } else {
        showAlert("Hubo un error de conexión \n aprete 'Entiendo' para cerrar esta pestaña");
      }

      setLoadingLogin(false);
    } catch {

      setLoadingLogin(false);
      showAlert("Hubo un error de conexión \n aprete 'Entiendo' para cerrar esta pestaña");
    }
  }

  return (
    <>
      <div className="login-card">
        <Card>
          <CardHeader className="text-md">
            <CardTitle>Ingresa a tu cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitLogin)}
                className="flex flex-col gap-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          id="mail"
                          type="mail"
                          placeholder="email@example.com"
                          required
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
                    <FormItem className="grid gap-2">
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          required
                          placeholder="************"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormDescription>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tú constraseña?
                  </a>
                </FormDescription>
                <CardFooter className="flex-col gap-2">
                  {loadingLogin ? loadingButton : loginButton}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/register")}
                  >
                    Crear usuario
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={openAler} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Inicio de Sesión
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAlert}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

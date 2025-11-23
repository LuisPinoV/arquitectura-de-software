"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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

export default function LoginPage() {
  const [open, setOpen] = useState(false);

  const showAlert = () => {
    setOpen(true);
  };

  const closeAlert = () => {
    setOpen(false);
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

  const router = useRouter();

  useEffect(() => {
    async function TryFirstLogin() {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      try {
        const res = await fetch(`/login/api/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refreshToken }),
        });

        const resJson = await res.json();

        if (resJson.ok) {
          router.replace("/dashboard/general");
          localStorage.setItem("idToken", resJson.idToken);
          localStorage.setItem("accessToken", resJson.accessToken);
          localStorage.setItem("refreshToken", resJson.refreshToken);
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

      const res = await fetch(`/login/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();

      console.log(resJson);

      if (resJson.ok) {
        localStorage.setItem("accessToken", resJson.accessToken);
        localStorage.setItem("idToken", resJson.idToken);
        localStorage.setItem("refreshToken", resJson.refreshToken);

        router.replace("/dashboard/general");
      } else {
        showAlert();
      }
    } catch {
      showAlert();
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
                  <Button type="submit" className="w-full">
                    Iniciar Sesión
                  </Button>
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
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              No se pudo conectar, inténtalo nuevamente!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hubo un error de conexión, <br />
              aprete "Entiendo" para cerrar esta pestaña
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

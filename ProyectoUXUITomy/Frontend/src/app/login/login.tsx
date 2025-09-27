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
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  async function onSubmitLogin(data: z.infer<typeof FormSchema>) {
    try {
      console.log(JSON.stringify(data, null, 2));
      const res = await fetch(
        "https://ud7emz2nq0.execute-api.us-east-1.amazonaws.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data, null, 2),
        }
      );

      const resJson = await res.json();
      console.log(res.status);
      console.log(resJson.challenge);

      if (res.ok) {
        console.log("Sesión iniciada correctamente", resJson);
        router.push("/dashboard/general");
      } else {
        console.log("Sesión no pudo conectarse: ", resJson.error);
        showAlert();
      }
    } catch {
      console.log("Error fetching answer");
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

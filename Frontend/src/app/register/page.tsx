"use client";

import { Header } from "../login/loginComponents/headerLogin/headerLogin";
import { Footer } from "../login/loginComponents/footerLogin/footerLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import "../login/styles/loginPage.css";

const RegisterSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  companyName: z.string().min(1, "Nombre de la empresa es requerido"),
  spaceName: z.string().min(1, "Nombre del espacio es requerido"),
});

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      companyName: "",
      spaceName: "",
    },
  });

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    try {

      const res = await fetch("/login/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          companyName: data.companyName,
          spaceName: data.spaceName,
        }),
      });

      const resJson = await res.json();

      if (resJson.ok) {
        alert("Usuario creado correctamente");
        router.replace("/");
      } else {
        alert(resJson.message || "Error al crear el usuario");
      }
    } catch (e) {
      console.error(e);
      alert("Error al crear el usuario");
    }
  }

  return (
    <div className="login-page-container">
      <Header />
      <main id="login-main">
        <div className="login-card">
          <Card>
            <CardHeader>
              <CardTitle>Crear usuario</CardTitle>
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
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
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
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la empresa</FormLabel>
                        <FormControl>
                          <Input placeholder="Mi empresa S.A." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spaceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Espacio a arrendar</FormLabel>
                        <FormControl>
                          <Input placeholder="Box, taller, sala..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Crear usuario
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

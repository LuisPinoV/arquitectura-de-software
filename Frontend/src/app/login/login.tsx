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
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LoginPage() {
  const { t, language, setLanguage } = useLanguage();
  const [openAlert, setOpenAlert] = useState(false);
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
      message: t("auth.invalidEmail"),
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
      {t("auth.loginButton")}
    </Button>
  );

  const loadingButton = (
    <Button type="submit" className="w-full">
      <Spinner>{t("auth.loading")}</Spinner>
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

        if (!res) {
          throw new Error("No response from refresh endpoint");
        }

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

      if (!res) {
        throw new Error("No response from login endpoint");
      }

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
      showAlert(t("auth.connectionError"));
    }
  }

  return (
    <>
      <div className="login-card">
        <Card>
          <div className="flex justify-between items-center px-6 pt-6">
            <CardHeader className="text-md flex-1 p-0">
              <CardTitle>{t("auth.loginTitle")}</CardTitle>
            </CardHeader>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title={t("auth.language")}>
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLanguage("es")}
                  className={language === "es" ? "bg-accent" : ""}
                >
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={language === "en" ? "bg-accent" : ""}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("fr")}
                  className={language === "fr" ? "bg-accent" : ""}
                >
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("pt")}
                  className={language === "pt" ? "bg-accent" : ""}
                >
                  Português
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                      <FormLabel>{t("auth.email")}</FormLabel>
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
                      <FormLabel>{t("auth.password")}</FormLabel>
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
                    {t("auth.forgotPassword")}
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
                    {t("auth.createUser")}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("auth.sessionTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAlert}>
              {t("auth.understood")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

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
import './nuevo_espacio.css';

const NuevoEspacioSchema = z.object({
  spaceName: z.string().min(1, "El nombre del espacio es requerido"),
  pasillo: z.string().optional(),
  capacidad: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

export default function NuevoEspacioPage() {
  const router = useRouter();

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
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      const res = await apiFetch('/api/spaces/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      const json = await res?.json().catch(() => ({}));
      // Log full response for easier debugging
      // eslint-disable-next-line no-console
      console.debug('Create espacio response', { status: res?.status, body: json });

      if (res?.ok) {
        // Backend returns created item (has `idBox`). Show it to the user so they can confirm.
        const createdId = json.idBox || json.id || (typeof json === 'object' && json.idBox) || null;
        if (createdId) {
          alert(`Espacio creado correctamente (id: ${createdId})`);
        } else {
          alert(json.message || 'Espacio creado correctamente');
        }
        router.push('/dashboard/agendamiento');
      } else {
        alert(json.message || 'Error creando el espacio');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      alert('Error creando el espacio');
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                          <Input placeholder="Descripción breve..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    <Button type="submit" className="w-full">
                      Crear espacio
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

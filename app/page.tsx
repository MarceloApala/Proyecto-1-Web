"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
export default function Home() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const harcodedUsername = "nibol";
  const harcodePassword = "Temporal123";
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (
      values.username === harcodedUsername &&
      values.password === harcodePassword
    ) {
      router.push("/main");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  }
  return (
    <div className="flex  w-screen mt-20 justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center w-full" style={{ width: "100%" }}>
            <p>
              <strong>Iniciar Sesion </strong>
            </p>
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuario</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
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
                  <Input placeholder="" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit" style={{ width: "100%" }}>
              Iniciar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

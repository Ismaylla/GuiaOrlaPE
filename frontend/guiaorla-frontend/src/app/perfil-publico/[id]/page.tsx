"use client";
import { useSearchParams } from "next/navigation";
import { PerfilPublicoScreen } from "@/components/PerfilPublico/PerfilPublicoScreen";

export default function PerfilPublicoPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const isEmpreendedor = role === "empreendedor";

  return <PerfilPublicoScreen isEmpreendedor={isEmpreendedor} />;
}
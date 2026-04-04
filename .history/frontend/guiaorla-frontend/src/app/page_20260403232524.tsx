import { getServices } from "@/services/api";
import { ServiceProvider } from "@/types/serviceProvider";

//Verificar lógica para mudança depois do build, talvez usar variáveis de ambiente para a URL da API
export default async function Home() {
  let services: ServiceProvider[] = [];

  try {
    services = await getServices();
  } catch (e) {
    console.log("API não disponível no build");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Serviços</h1>

      {services.map((s) => (
        <div key={s.id} className="border p-2 my-2">
          {s.name}
        </div>
      ))}
    </div>
  );
}
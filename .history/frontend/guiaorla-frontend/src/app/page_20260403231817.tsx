import { getServices } from "@/services/api";
import { ServiceProvider } from "@/types/serviceProvider";

export default async function Home() {
  let services = [];

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
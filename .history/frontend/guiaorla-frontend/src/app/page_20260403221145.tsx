import { getServices } from "@/services/api";

export default async function Home() {
  const services = await getServices();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Serviços</h1>

      {services.map((s: any) => (
        <div key={s.id} className="border p-2 my-2">
          {s.name}
        </div>
      ))}
    </div>
  );
}
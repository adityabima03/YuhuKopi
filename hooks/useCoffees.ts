import { fetchCoffees, type Coffee } from "@/lib/api";
import { getCoffeeImageSource } from "@/lib/coffeeImage";
import { useEffect, useState } from "react";

export interface CoffeeWithImage extends Coffee {
  imageSource: number;
}

export function useCoffees() {
  const [coffees, setCoffees] = useState<CoffeeWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCoffees();
        if (!cancelled) {
          setCoffees(
            data.map((c) => ({
              ...c,
              imageSource: getCoffeeImageSource(c.image),
            }))
          );
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Gagal memuat data");
          setCoffees([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { coffees, loading, error };
}

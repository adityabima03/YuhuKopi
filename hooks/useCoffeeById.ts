import { fetchCoffeeById, type Coffee } from "@/lib/api";
import { getCoffeeImageSource } from "@/lib/coffeeImage";
import { useEffect, useState } from "react";

export interface CoffeeWithImage extends Coffee {
  imageSource: number;
}

export function useCoffeeById(id: string | undefined) {
  const [coffee, setCoffee] = useState<CoffeeWithImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setCoffee(null);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCoffeeById(id);
        if (!cancelled && data) {
          setCoffee({
            ...data,
            imageSource: getCoffeeImageSource(data.image),
          });
        } else if (!cancelled) {
          setCoffee(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Gagal memuat detail");
          setCoffee(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { coffee, loading, error };
}

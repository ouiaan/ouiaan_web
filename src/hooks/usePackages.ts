

import { useState, useEffect } from 'react';
import { type FormValues } from '@/app/calculadora/schema'; // ¡Importamos nuestro tipo!

export interface SavedPackage {
  name: string;
  data: FormValues;
}

const STORAGE_KEY = 'quoteSnap_packages';

export function usePackages() {
  const [packages, setPackages] = useState<SavedPackage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar los paquetes desde localStorage la primera vez que se usa el hook
  useEffect(() => {
    try {
      const storedPackages = localStorage.getItem(STORAGE_KEY);
      if (storedPackages) {
        setPackages(JSON.parse(storedPackages));
      }
    } catch (error) {
      console.error("Error al cargar paquetes:", error);
      setPackages([]);
    }
    setIsLoaded(true);
  }, []);

  // Función para guardar un paquete nuevo
  const savePackage = (newPackage: SavedPackage) => {
    const updatedPackages = [...packages, newPackage];
    setPackages(updatedPackages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPackages));
  };

  // Función para borrar un paquete
  const deletePackage = (packageName: string) => {
    const updatedPackages = packages.filter(p => p.name !== packageName);
    setPackages(updatedPackages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPackages));
  };

  return { packages, savePackage, deletePackage, isLoaded };
}
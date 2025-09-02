
'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Save, FolderDown, Settings, Trash2, RotateCcw, Info } from 'lucide-react';
import { type FormValues } from '@/app/calculadora/schema';
import { usePackages } from '@/hooks/usePackages';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BackgroundGradient } from '../ui/background-gradient';

interface PackageManagerProps {
  onReset: () => void;
  onLoadPackage: (data: FormValues) => void;
}

const InfoTooltip = ({ content }: { content: string }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <span className="ml-2 cursor-help"><Info className="h-4 w-4 text-muted-foreground" /></span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
            <p className="text-sm">{content}</p>
        </TooltipContent>
    </Tooltip>
);


export function PackageManager({ onReset, onLoadPackage }: PackageManagerProps) {
  const { packages, savePackage, deletePackage, isLoaded } = usePackages();
  const { getValues } = useFormContext<FormValues>();
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [packageName, setPackageName] = useState('');

  const handleSave = () => {
    if (packageName && packageName.trim() !== '') {
      if (packages.some(p => p.name === packageName)) {
        alert("Error: Ya existe un paquete con ese nombre.");
        return;
      }
      const formData = getValues();
      savePackage({ name: packageName, data: formData });
      setPackageName('');
      setOpenSaveDialog(false);
    }
  };

  const handleLoad = (selectedPackageName: string) => {
    const selectedPackage = packages.find(p => p.name === selectedPackageName);
    if (selectedPackage) {
      onLoadPackage(selectedPackage.data);
    }
  };

  if (!isLoaded) {
    return <div className="h-[56px]"></div>; // Placeholder para evitar saltos de layout
  }

  return (
    <BackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
            <h3 className="font-headline text-lg">Gestor de Paquetes</h3>
            <InfoTooltip content="Usa esta sección para guardar tus presupuestos como plantillas. Haz clic en 'Guardar Paquete' para guardar la configuración actual, y luego usa el menú 'Cargar un Paquete' para rellenar el formulario en el futuro. Ideal para distintos tipos de servicio (bodas, retratos, etc.)." />
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <Dialog open={openSaveDialog} onOpenChange={setOpenSaveDialog}>
              <DialogTrigger asChild>
                  <Button size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guardar Paquete Nuevo</DialogTitle>
                    <DialogDescription>
                        Dale un nombre único a tu configuración actual para poder cargarla más tarde.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nombre</Label>
                        <Input
                          id="name"
                          value={packageName}
                          onChange={(e) => setPackageName(e.target.value)}
                          className="col-span-3"
                          placeholder="Ej: Boda Esencial"
                        />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleSave}>Guardar Paquete</Button>
                  </DialogFooter>
              </DialogContent>
            </Dialog>

            <Select onValueChange={handleLoad} disabled={packages.length === 0}>
              <SelectTrigger className="w-full sm:w-[180px] h-9">
                  <SelectValue placeholder="Cargar Paquete..." />
              </SelectTrigger>
              <SelectContent>
                  {packages.map(pkg => (
                    <SelectItem key={pkg.name} value={pkg.name}>{pkg.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Resetear
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={packages.length === 0}>
                    <Settings className="mr-2 h-4 w-4" />
                    Gestionar
                  </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gestionar Paquetes Guardados</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 py-4 max-h-[300px] overflow-y-auto">
                    {packages.length > 0 ? packages.map(pkg => (
                        <div key={pkg.name} className="flex items-center justify-between rounded-md border p-3">
                          <span>{pkg.name}</span>
                          <Button type="button" variant="ghost" size="icon" onClick={() => deletePackage(pkg.name)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                    )) : <p className="text-sm text-muted-foreground text-center">No tienes paquetes guardados.</p>}
                  </div>
              </DialogContent>
            </Dialog>
        </div>
      </div>
    </BackgroundGradient>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { type FormValues } from '@/app/calculadora/schema';

const profileFields: { label: string, name: keyof FormValues }[] = [
  { label: 'Nombre de la Compañía', name: 'companyName' },
  { label: 'Sitio Web', name: 'companyWebsite' },
  { label: 'Email de Contacto', name: 'companyEmail' },
  { label: 'Dirección (Opcional)', name: 'companyAddress' },
  { label: 'Teléfono (Opcional)', name: 'companyPhone' },
];

export function ProfileForm() {
  const { register, setValue, watch } = useFormContext<FormValues>(); 
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const companyLogo = watch('companyLogo');

  useEffect(() => {
    if (companyLogo && typeof companyLogo === 'string') {
      setLogoPreview(companyLogo);
    } else {
      setLogoPreview(null);
    }
  }, [companyLogo]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { 
        const base64String = reader.result as string;
        setValue("companyLogo", base64String, { shouldDirty: true, shouldTouch: true });
        setLogoPreview(base64String);
      };
      reader.readAsDataURL(file); 
    }
  };

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Ajustes de Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {profileFields.map(({ label, name }) => (
            <div key={name} className="space-y-2">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                {...register(name)}
                className="bg-neutral-950"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
                <Label htmlFor="companyLogo">Logo de la Compañía (PNG/JPG)</Label>
                <Input 
                    id="companyLogoInput"
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={handleLogoUpload} 
                    className="file:text-white"
                />
            </div>
            {logoPreview && (
                <div className="flex justify-center items-center bg-neutral-950 rounded-md p-2 h-24">
                    <Image
                        src={logoPreview}
                        alt="Vista previa del logo"
                        width={120}
                        height={60}
                        className="object-contain max-h-full"
                    />
                </div>
            )}
        </div>

        <div className="mt-6 space-y-2">
          <Label htmlFor="companyNotes">Notas Importantes / Términos</Label>
          <Textarea
            id="companyNotes"
            {...register('companyNotes')}
            className="min-h-[120px] bg-neutral-950"
          />
        </div>
        
        <div className="mt-6 space-y-2">
          <Label htmlFor="paymentInstructions">Información de Pago</Label>
          <Textarea
            id="paymentInstructions"
            {...register('paymentInstructions')}
            className="min-h-[120px] bg-neutral-950"
          />
           <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="includePaymentInfo" {...register('includePaymentInfo')} />
            <Label htmlFor="includePaymentInfo" className="text-sm font-light text-muted-foreground">
              Incluir esta información en la Factura Proforma
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
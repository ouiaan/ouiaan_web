
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SectionTitle } from '@/components/ui/SectionTitle';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
});

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: '¡Mensaje Enviado!',
      description: "Gracias por contactar. Te responderé pronto.",
    });
    form.reset();
  }

  return (
    <motion.div
      className="container mx-auto py-16 md:py-24 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionTitle>Hablemos :)</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        ¿Tienes un proyecto en mente, una pregunta sobre un producto, o simplemente quieres saludar? Escríbeme.
      </p>

      <div className="max-w-xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline text-lg text-foreground/80">Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu Nombre" {...field} className="bg-card border-border/50 h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline text-lg text-foreground/80">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} className="bg-card border-border/50 h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline text-lg text-foreground/80">Mensaje</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuéntame sobre tu proyecto o pregunta..."
                      {...field}
                      className="bg-card border-border/50 min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right">
                <button type="submit" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider text-lg">
                    <span>Enviar Mensaje</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}

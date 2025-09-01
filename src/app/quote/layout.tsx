// Este layout simple se asegura de que la página de la propuesta
// no herede el Header ni el Footer del layout principal,
// lo que evita el error de 'useContext'.
export default function QuoteLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  }
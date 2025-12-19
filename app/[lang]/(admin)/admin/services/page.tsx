import ServicesTable from '@/components/features/services/table';
import { getCurrentUser } from '@/lib/actions/auth/me';
import { getServices } from '@/lib/actions/services';

const ServicesPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    // puedes redirigir a /[lang]/signin o mostrar aviso
    return <div>Necesitas iniciar sesión</div>;
  }

  const services = await getServices({ limit: 10, offset: 0 });

  // Llamada del lado del cliente para obtener el usuario actual (Next.js 13+):
  // En un componente cliente:
  //   useEffect(() => {
  //     fetch('/api/me')
  //       .then((r) => r.json())
  //       .then(({ user }) => setUser(user));
  //   }, []);

  return (
    <div className="px-4">
      <h1>Services: {services.count}</h1>

      <ServicesTable services={services} />
    </div>
  );
};

export default ServicesPage;

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SideBar from "@/components/sideBarProfessional";
import styles from "@/styles/dashboard.module.css";
import ServicoForm from "@/components/servicoForm";
import ListaServicos from "@/components/listaServicos";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('http://localhost:3001/api/services/my', {
          method: 'GET',
          credentials: 'include', 
        });

        if (!res.ok) throw new Error('Erro ao buscar serviços');

        const data = await res.json();
        setServicos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/protected", {
          credentials: "include",
        });
        if (!res.ok) return router.push("/login");

        const data = await res.json();
        setUser(data);
        setFirstName(data.name?.split(" ")[0] ?? "Usuário");
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.paginaContainer}>
      <SideBar />
      <div className={styles.conteudoPrincipal}>
        <div className={styles.saudacaoCentralizada}>
          <p>Olá, <span className={styles.nomeDestaque}>{firstName}</span></p>
        </div>

        <div className={styles.linhaConteudo}>
          <ServicoForm onSuccess={() => console.log("Serviço criado!")} />
          <ListaServicos />
        </div>
      </div>
    </div>
  );
}

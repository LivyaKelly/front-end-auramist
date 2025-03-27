import { useEffect, useState } from "react";
import styles from "@/styles/listaServicos.module.css";

export default function ListaServicos() {
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    async function buscarServicos() {
      try {
        const res = await fetch("http://localhost:3001/api/services/my", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao buscar serviços");
        const data = await res.json();
        setServicos(data);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
      }
    }

    buscarServicos();
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.titulo}>Seus Serviços</h3>
      <div className={styles.grid}>
        {servicos.map((servico) => (
          <div key={servico.id} className={styles.card}>
            <img src={servico.urlImage} alt={servico.name} />
            <h4>{servico.name}</h4>
            <p>{servico.description}</p>
            <p><strong>Duração:</strong> {servico.duration} min</p>
            <p><strong>Preço:</strong> R$ {servico.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

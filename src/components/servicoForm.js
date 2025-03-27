import { useState, useEffect } from "react";
import styles from "@/styles/servicoForm.module.css";

export default function ServicoForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    image: null,
  });
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    buscarServicos();
  }, []);

  async function buscarServicos() {
    try {
      const res = await fetch("http://localhost:3001/api/services/my", {
        credentials: "include",
      });
      const data = await res.json();
      setServicos(data);
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
    }
  }

  async function uploadImage(file) {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("http://localhost:3001/api/upload-image", {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error("Erro ao enviar imagem");

    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await uploadImage(formData.image);

      const res = await fetch("http://localhost:3001/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          duration: Number(formData.duration),
          price: Number(formData.price),
          urlImage: imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar serviço");

      setFormData({
        name: "",
        description: "",
        duration: "",
        price: "",
        image: null,
      });
      buscarServicos();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h2>Cadastrar Novo Serviço</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* campos */}
        <input className={styles.input} type="text" placeholder="Nome do serviço" required value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <textarea className={styles.input} placeholder="Descrição" required value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <input className={styles.input} type="number" placeholder="Duração (min)" required value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
        <input className={styles.input} type="number" placeholder="Preço (R$)" required value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
        <input className={styles.input} type="file" accept="image/*" required onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Enviando..." : "Cadastrar Serviço"}
        </button>
      </form>

      <hr className={styles.hr}/>

    </div>
  );
}

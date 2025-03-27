import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Card, Button, Modal, DatePicker, TimePicker, message } from "antd";
import Image from "next/image";
import styles from "@/styles/cardServicos.module.css";

const { Meta } = Card;

export default function CardServicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isReservaModalOpen, setIsReservaModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/services");
        if (!res.ok) {
          throw new Error(
            `Erro ao buscar serviços: ${res.status} - ${res.statusText}`
          );
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setServicos(data);
        } else {
          throw new Error("Formato de dados inválido recebido da API");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, []);

  const abrirReservaModal = (servico) => {
    setServicoSelecionado(servico);
    setIsReservaModalOpen(true);
  };

  const avancarParaConfirmacao = () => {
    if (!dataSelecionada || !horaSelecionada) {
      message.warning("Por favor, selecione data e hora!");
      return;
    }
    setIsReservaModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const confirmarAgendamento = async () => {
    try {
      setIsConfirmModalOpen(false);

      const response = await fetch("http://localhost:3001/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          serviceId,
          date, 
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao confirmar o agendamento");
      }

      message.success("Agendamento confirmado com sucesso!");
    } catch (error) {
      console.error(error);
      message.error("Erro ao confirmar o agendamento. Tente novamente.");
    }
  };

  if (loading) return <p>Carregando serviços...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className={styles.servicosContainer}>
      <h2 className={styles.tituloServicos}>Serviços</h2>
      <div className={styles.listaServicos}>
        {servicos.length > 0 ? (
          servicos.map((servico) => (
            <Card
              key={servico.id}
              hoverable
              className={styles.cartaoServico}
              cover={
                <Image
                  src={servico.urlImage}
                  alt={servico.name}
                  width={300}
                  height={180}
                  className={styles.imagemCard}
                />
              }
            >
              <div className={styles.cardContent}>
                <h3 className={styles.nomeServico}>{servico.name}</h3>
                <p className={styles.descricaoServico}>
                  {servico.description || "Descrição não disponível."}
                </p>
                <div className={styles.infoBottom}>
                  <span className={styles.preco}>
                    R${servico.price.toFixed(2)}
                  </span>
                  <span className={styles.tempo}>⏱ {servico.duration} min</span>
                </div>
                <Button
                  className={styles.btnReservar}
                  onClick={() => abrirReservaModal(servico)}
                >
                  Reservar
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>Nenhum serviço disponível.</p>
        )}
      </div>

      {/* MODAL 1 - RESERVA */}
      <Modal
        title="Reserva"
        open={isReservaModalOpen}
        onCancel={() => setIsReservaModalOpen(false)}
        footer={[
          <Button key="cancelar" onClick={() => setIsReservaModalOpen(false)}>
            Cancelar
          </Button>,
          <Button
            key="continuar"
            type="primary"
            onClick={avancarParaConfirmacao}
          >
            Continuar
          </Button>,
        ]}
      >
        <p>
          <strong>Serviço:</strong> {servicoSelecionado?.name}
        </p>
        <p style={{ marginBottom: 8 }}>Selecione uma data:</p>
        <DatePicker
          style={{ width: "100%", marginBottom: 16 }}
          onChange={(date) => setDataSelecionada(date)}
        />
        <p style={{ marginBottom: 8 }}>Selecione um horário:</p>
        <TimePicker
          format="HH:mm"
          style={{ width: "100%" }}
          onChange={(time) => setHoraSelecionada(time)}
        />
      </Modal>

      {/* MODAL 2 - CONFIRMAÇÃO */}
      <Modal
        title="Confirmação do Agendamento"
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        footer={[
          <Button key="voltar" onClick={() => setIsConfirmModalOpen(false)}>
            Voltar
          </Button>,
          <Button key="confirmar" type="primary" onClick={confirmarAgendamento}>
            Confirmar Agendamento
          </Button>,
        ]}
      >
        <p>
          <strong>Serviço Selecionado:</strong> {servicoSelecionado?.name}
        </p>
        <p>
          <strong>Data e Horário:</strong>{" "}
          {dayjs(dataSelecionada).format("DD/MM/YYYY")} às{" "}
          {dayjs(horaSelecionada).format("HH:mm")}
        </p>
        <p>
          <strong>Profissional:</strong> Beatriz Silva
        </p>
        <p>
          <strong>Valor Total:</strong> R${" "}
          {servicoSelecionado?.price.toFixed(2)}
        </p>
        <p style={{ marginTop: 16 }}>
          ✨ Estamos ansiosos para cuidar de você! 🥰💇‍♀️
        </p>
      </Modal>
    </div>
  );
}

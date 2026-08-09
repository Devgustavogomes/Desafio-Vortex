import { useState, useCallback } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./OrdersPage.module.css";
import { ordersService } from "../../../../services/orders.service";
import { type Order } from "../../../../types/orders.types";
import { OrderCard } from "../../../../components/ui/OrderCard/OrderCard";
import { Button } from "../../../../components/ui/Button/Button";
import {
  Toast,
  type ToastVariant,
} from "../../../../components/ui/Toast/Toast";
import { Pagination } from "../../../../components/ui/Pagination/Pagination";

type TabType = "buying" | "selling";

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>("buying");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      if (newPage === 1) {
        prev.delete("page");
      } else {
        prev.set("page", String(newPage));
      }
      return prev;
    });
  };
  const [totalPages, setTotalPages] = useState(1);

  const [toast, setToast] = useState<{
    message: string;
    variant: ToastVariant;
  } | null>(null);

  const fetchOrders = useCallback(
    async (targetPage = page) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await ordersService.getOrders(activeTab, targetPage);
        setOrders(result.data);
        setTotalPages(result.meta.totalPages);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Erro ao carregar os pedidos. Tente novamente mais tarde.",
        );
        setToast({ message: "Erro ao carregar pedidos", variant: "error" });
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab, page],
  );

  useEffect(() => {
    let mounted = true;

    async function run() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await ordersService.getOrders(activeTab, page);
        if (mounted) {
          setOrders(result.data);
          setTotalPages(result.meta.totalPages);
        }
      } catch (err: any) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Erro ao carregar os pedidos. Tente novamente mais tarde.",
          );
          setToast({ message: "Erro ao carregar pedidos", variant: "error" });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [activeTab, page]);

  const handleAccept = async (orderId: string) => {
    try {
      await ordersService.updateOrderStatus(orderId, "accept");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "accepted" } : o)),
      );
      setToast({ message: "Pedido aceito com sucesso!", variant: "success" });
    } catch (err: any) {
      setToast({
        message:
          err.response?.data?.message || "Ocorreu um erro ao aceitar o pedido.",
        variant: "error",
      });
      throw err;
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      await ordersService.updateOrderStatus(orderId, "reject");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "rejected" } : o)),
      );
      setToast({
        message: "Pedido rejeitado com sucesso!",
        variant: "success",
      });
    } catch (err: any) {
      setToast({
        message:
          err.response?.data?.message ||
          "Ocorreu um erro ao rejeitar o pedido.",
        variant: "error",
      });
      throw err;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={`${styles.loading} glass`}>
          <p>Carregando pedidos...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`${styles.error} glass`}>
          <p>{error}</p>
          <Button
            variant="primary"
            onClick={() => fetchOrders()}
            style={{ marginTop: "1rem" }}
          >
            Tentar novamente
          </Button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className={`${styles.empty} glass`}>
          <h3>
            {activeTab === "buying"
              ? "Você ainda não possui compras"
              : "Nenhuma venda para avaliar"}
          </h3>
          <p>
            {activeTab === "buying"
              ? "Lista de pedidos que você solicitou aparecerá aqui."
              : "Lista de pedidos que você recebeu aparecerá aqui."}
          </p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            context={activeTab}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}
      </div>
    );
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      {toast && (
        <div className={styles.toastWrapper}>
          <Toast
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <header className={styles.header}>
        <h2>Meus Pedidos</h2>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "buying" ? styles.active : ""}`}
          onClick={() => handleTabChange("buying")}
        >
          Minhas Compras
        </button>
        <button
          className={`${styles.tab} ${activeTab === "selling" ? styles.active : ""}`}
          onClick={() => handleTabChange("selling")}
        >
          Minhas Vendas
        </button>
      </div>

      {renderContent()}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

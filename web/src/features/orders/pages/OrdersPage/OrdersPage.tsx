import { useState, useEffect } from 'react';
import styles from './OrdersPage.module.css';
import { ordersService } from '../../../../services/orders.service';
import { type Order } from '../../../../types/orders.types';
import { OrderCard } from '../../../../components/ui/OrderCard/OrderCard';
import { Toast, type ToastVariant } from '../../../../components/ui/Toast/Toast';

type TabType = 'buying' | 'selling';

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('buying');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [toast, setToast] = useState<{ message: string; variant: ToastVariant } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchOrders() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ordersService.getOrders(activeTab);
        if (mounted) {
          setOrders(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.response?.data?.message || 'Erro ao carregar os pedidos. Tente novamente mais tarde.');
          setToast({ message: 'Erro ao carregar pedidos', variant: 'error' });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  const handleAccept = async (orderId: string) => {
    try {
      await ordersService.updateOrderStatus(orderId, 'accept');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepted' } : o));
      setToast({ message: 'Pedido aceito com sucesso!', variant: 'success' });
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || 'Ocorreu um erro ao aceitar o pedido.', variant: 'error' });
      throw err;
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      await ordersService.updateOrderStatus(orderId, 'reject');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));
      setToast({ message: 'Pedido rejeitado com sucesso!', variant: 'success' });
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || 'Ocorreu um erro ao rejeitar o pedido.', variant: 'error' });
      throw err;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.placeholder}>
          <div className={styles.spinner}></div>
          <p>Carregando pedidos...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.placeholder}>
          <h2>Ops! Algo deu errado.</h2>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={() => setActiveTab(activeTab)}>
            Tentar novamente
          </button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className={styles.placeholder}>
          <h2>{activeTab === 'buying' ? 'Você ainda não possui compras' : 'Nenhuma venda para avaliar'}</h2>
          <p>{activeTab === 'buying' ? 'Lista de pedidos que você solicitou aparecerá aqui.' : 'Lista de pedidos que você recebeu aparecerá aqui.'}</p>
        </div>
      );
    }

    return (
      <div className={styles.ordersList}>
        {orders.map(order => (
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

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1>Meus Pedidos</h1>
        <p>Acompanhe suas compras e gerencie suas vendas.</p>
      </header>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'buying' ? styles.active : ''}`}
          onClick={() => setActiveTab('buying')}
        >
          Minhas Compras
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'selling' ? styles.active : ''}`}
          onClick={() => setActiveTab('selling')}
        >
          Minhas Vendas
        </button>
      </div>

      <div className={styles.contentArea}>
        {renderContent()}
      </div>

      {toast && (
        <div className={styles.toastWrapper}>
          <Toast 
            message={toast.message} 
            variant={toast.variant} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}
    </main>
  );
}

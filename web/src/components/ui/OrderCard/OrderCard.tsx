import { useState, useEffect } from 'react';
import styles from './OrderCard.module.css';
import { Button } from '../Button/Button';
import { type Order } from '../../../types/orders.types';
import { getItemById } from '../../../services/items.service';

interface OrderCardProps {
  order: Order;
  context: 'buying' | 'selling';
  onAccept?: (orderId: string) => Promise<void>;
  onReject?: (orderId: string) => Promise<void>;
}

export function OrderCard({ order, context, onAccept, onReject }: OrderCardProps) {
  const [itemName, setItemName] = useState<string>('Carregando item...');
  const [actionLoading, setActionLoading] = useState<'accept' | 'reject' | null>(null);

  const handleAccept = async () => {
    if (!onAccept) return;
    setActionLoading('accept');
    try {
      await onAccept(order.id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    setActionLoading('reject');
    try {
      await onReject(order.id);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function fetchItem() {
      try {
        const item = await getItemById(order.itemId);
        if (mounted) {
          setItemName(item.name);
        }
      } catch (error) {
        if (mounted) {
          setItemName(`Item #${order.itemId.substring(0, 8)}`);
        }
      }
    }

    fetchItem();

    return () => {
      mounted = false;
    };
  }, [order.itemId]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'waiting':
        return { label: 'Aguardando', className: styles.statusWaiting };
      case 'accepted':
        return { label: 'Aceito', className: styles.statusAccepted };
      case 'rejected':
        return { label: 'Rejeitado', className: styles.statusRejected };
      default:
        return { label: status, className: '' };
    }
  };

  const typeLabel = order.type === 'sale' ? 'Venda' : 'Doação';
  const statusConfig = getStatusConfig(order.status);
  
  const showActions = context === 'selling' && order.status === 'waiting';

  return (
    <div className={`${styles.card} glass`}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${statusConfig.className}`}>
          {statusConfig.label}
        </span>
        <span className={styles.typeLabel}>{typeLabel}</span>
      </div>

      <div className={styles.content}>
        <h4 className={styles.title}>{itemName}</h4>
        {order.type === 'sale' && (
          <p className={styles.price}>{formatPrice(order.price)}</p>
        )}
      </div>

      {showActions && (
        <div className={styles.actions}>
          <Button 
            variant="primary" 
            className={styles.acceptButton}
            onClick={handleAccept}
            disabled={!!actionLoading}
          >
            {actionLoading === 'accept' ? 'Processando...' : 'Aceitar'}
          </Button>
          <Button 
            variant="outline" 
            className={styles.rejectButton}
            onClick={handleReject}
            disabled={!!actionLoading}
          >
            {actionLoading === 'reject' ? 'Processando...' : 'Rejeitar'}
          </Button>
        </div>
      )}
    </div>
  );
}

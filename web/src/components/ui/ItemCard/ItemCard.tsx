import styles from './ItemCard.module.css';
import { Button } from '../Button/Button';

export type ItemStatus = 'Novo' | 'Usado' | 'Doado' | 'Reservado' | 'Vendido';

interface ItemCardProps {
  title: string;
  category: string;
  status: ItemStatus;
  imageUrl?: string;
  price?: number;
  description?: string;
  onDetailsClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onBuyClick?: () => void;
  isBuyDisabled?: boolean;
  buyLabel?: string;
}

export function ItemCard({ 
  title, 
  category, 
  status, 
  imageUrl, 
  price,
  description,
  onDetailsClick,
  onEditClick,
  onDeleteClick,
  onBuyClick,
  isBuyDisabled,
  buyLabel
}: ItemCardProps) {
  const getStatusClass = (status: ItemStatus) => {
    switch (status) {
      case 'Novo': return styles.statusNew;
      case 'Usado': return styles.statusUsed;
      case 'Doado': return styles.statusDonated;
      case 'Reservado': return styles.statusReserved;
      case 'Vendido': return styles.statusSelled;
      default: return '';
    }
  };

  const hasOwnerActions = onEditClick || onDeleteClick;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className={`${styles.card} glass`}>
      <div className={styles.imageContainer}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>Sem imagem</span>
          </div>
        )}
        <span className={`${styles.statusBadge} ${getStatusClass(status)}`}>
          {status}
        </span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.categoryAndPrice}>
          <span className={styles.category}>{category}</span>
          {price !== undefined && (
            <span className={styles.price}>{formatPrice(price)}</span>
          )}
        </div>
        <h4 className={styles.title}>{title}</h4>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        
        {hasOwnerActions ? (
          <div className={styles.ownerActions}>
            {onDetailsClick && (
              <Button 
                variant="secondary" 
                className={styles.actionButton}
                onClick={onDetailsClick}
              >
                Detalhes
              </Button>
            )}
            {onEditClick && (
              <Button 
                variant="secondary" 
                className={styles.actionButton}
                onClick={onEditClick}
              >
                Editar
              </Button>
            )}
            {onDeleteClick && (
              <Button 
                variant="outline" 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={onDeleteClick}
              >
                Excluir
              </Button>
            )}
          </div>
        ) : onBuyClick ? (
          <div className={styles.visitorActions}>
             <Button 
              variant="primary" 
              className={styles.actionButton}
              onClick={onBuyClick}
              disabled={isBuyDisabled}
              style={{ opacity: isBuyDisabled ? 0.6 : 1, cursor: isBuyDisabled ? 'not-allowed' : 'pointer' }}
            >
              {buyLabel || 'Comprar'}
            </Button>
            {onDetailsClick && (
              <Button 
                variant="secondary" 
                className={styles.actionButton}
                onClick={onDetailsClick}
              >
                Detalhes
              </Button>
            )}
          </div>
        ) : (
          <Button 
            variant="secondary" 
            className={styles.actionButton}
            onClick={onDetailsClick}
          >
            Ver Detalhes
          </Button>
        )}
      </div>
    </div>
  );
}

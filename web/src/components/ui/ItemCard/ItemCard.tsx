import styles from './ItemCard.module.css';
import { Button } from '../Button/Button';

export type ItemStatus = 'Novo' | 'Usado' | 'Doado' | 'Reservado';

interface ItemCardProps {
  title: string;
  category: string;
  status: ItemStatus;
  imageUrl?: string;
  onDetailsClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export function ItemCard({ 
  title, 
  category, 
  status, 
  imageUrl, 
  onDetailsClick,
  onEditClick,
  onDeleteClick
}: ItemCardProps) {
  const getStatusClass = (status: ItemStatus) => {
    switch (status) {
      case 'Novo': return styles.statusNew;
      case 'Usado': return styles.statusUsed;
      case 'Doado': return styles.statusDonated;
      case 'Reservado': return styles.statusReserved;
      default: return '';
    }
  };

  const hasOwnerActions = onEditClick || onDeleteClick;

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
        <span className={styles.category}>{category}</span>
        <h4 className={styles.title}>{title}</h4>
        
        {hasOwnerActions ? (
          <div className={styles.ownerActions}>
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

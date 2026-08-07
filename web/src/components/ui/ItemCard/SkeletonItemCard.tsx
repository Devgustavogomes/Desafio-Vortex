import styles from './ItemCard.module.css';
import skeletonStyles from './SkeletonItemCard.module.css';

export function SkeletonItemCard() {
  return (
    <div className={`${styles.card} glass`}>
      <div className={styles.imageContainer}>
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.imagePlaceholder}`}></div>
      </div>
      
      <div className={styles.content}>
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.categoryPlaceholder}`}></div>
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.titlePlaceholder}`}></div>
        <div className={`${skeletonStyles.skeleton} ${skeletonStyles.buttonPlaceholder}`}></div>
      </div>
    </div>
  );
}

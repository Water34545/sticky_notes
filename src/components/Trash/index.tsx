import S from './styles.module.scss';
import React, { memo } from 'react';

interface ITrash {
  width: number;
}
const Trash: React.FC<ITrash> = ({ width }) => {
  return (
    <div className={S.trash} style={{ width: `${width}px` }}>
      Move here to delete
    </div>
  );
};

export default memo(Trash);

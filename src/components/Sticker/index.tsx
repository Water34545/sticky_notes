import S from './styles.module.scss';
import React, { memo, useRef } from 'react';
import { NoteData } from '@components/App';

interface INote {
  noteData: NoteData;
  updateLocation: (id: string, top: number, left: number) => void;
}

const Sticker: React.FC<INote> = ({ noteData, updateLocation }) => {
  const offsetTop = useRef(0);
  const offsetLeft = useRef(0);

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    let element = e.target as HTMLElement;
    offsetTop.current = e.clientY - element.offsetTop;
    offsetLeft.current = e.clientX - element.offsetLeft;
    element.classList.add(S.note_hide);
  };
  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    let element = e.target as Element;
    element.classList.remove(S.note_hide);
    updateLocation(
      noteData.id,
      e.clientY - offsetTop.current,
      e.clientX - offsetLeft.current
    );
  };

  return (
    <div
      className={S.note}
      draggable
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}
      style={{
        width: `${noteData.width}px`,
        height: `${noteData.height}px`,
        background: noteData.color,
        top: `${noteData.top}px`,
        left: `${noteData.left}px`,
      }}
    >
      {noteData.text}
    </div>
  );
};

export default memo(Sticker);

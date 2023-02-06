import S from './styles.module.scss';
import React, { memo, useEffect, useRef, useState } from 'react';
import { NoteData } from '@components/App';

interface INote {
  noteData: NoteData;
  updateNote: (
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    text: string
  ) => void;
}

const Sticker: React.FC<INote> = ({ noteData, updateNote }) => {
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(
    null
  );
  const offsetTop = useRef(0);
  const offsetLeft = useRef(0);
  const textRef = useRef<null | HTMLTextAreaElement>(null);

  useEffect(() => {
    setResizeObserver(
      new ResizeObserver(() => {
        if (textRef.current) {
          updateNote(
            noteData.id,
            noteData.top,
            noteData.left,
            textRef.current.clientWidth,
            textRef.current.clientHeight,
            noteData.text
          );
        }
      })
    );
    return () => resizeObserver?.disconnect();
  }, [noteData]);

  useEffect(() => {
    if (textRef.current) {
      resizeObserver?.observe(textRef.current);
    }
  }, [resizeObserver]);

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    let element = e.target as HTMLElement;
    offsetTop.current = e.clientY - element.offsetTop;
    offsetLeft.current = e.clientX - element.offsetLeft;
    element.classList.add(S.sticker_hide);
  };
  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    let element = e.target as Element;
    element.classList.remove(S.sticker_hide);
    updateNote(
      noteData.id,
      e.clientY - offsetTop.current,
      e.clientX - offsetLeft.current,
      noteData.width,
      noteData.height,
      noteData.text
    );
  };

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(
      noteData.id,
      noteData.top,
      noteData.left,
      noteData.width,
      noteData.height,
      e.target.value
    );
  };

  return (
    <div
      className={S.sticker}
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
      <textarea
        ref={textRef}
        value={noteData.text}
        className={S.sticker_text}
        onChange={changeHandler}
        style={{
          width: `${noteData.width}px`,
          height: `${noteData.height}px`,
        }}
      />
    </div>
  );
};

export default memo(Sticker);

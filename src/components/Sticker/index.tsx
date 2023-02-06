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
  const [text, setText] = useState(noteData.text);
  const [top, setTop] = useState(noteData.top);
  const [left, setLeft] = useState(noteData.left);
  const [width, setWidth] = useState(noteData.width);
  const [height, setHeight] = useState(noteData.height);

  const offsetTop = useRef(0);
  const offsetLeft = useRef(0);
  const textRef = useRef<null | HTMLTextAreaElement>(null);
  const timeOut = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    setResizeObserver(
      new ResizeObserver(() => {
        if (textRef.current) {
          setWidth(textRef.current.clientWidth);
          setHeight(textRef.current.clientHeight);
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

  useEffect(() => {
    if (timeOut.current) {
      clearTimeout(timeOut.current);
    }
    timeOut.current = setTimeout(
      () => updateNote(noteData.id, top, left, width, height, text),
      300
    );
    return () => {
      if (timeOut.current) {
        clearTimeout(timeOut.current);
      }
    };
  }, [width, height, text]);

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    let element = e.target as HTMLElement;
    offsetTop.current = e.clientY - element.offsetTop;
    offsetLeft.current = e.clientX - element.offsetLeft;
    element.classList.add(S.sticker_hide);
  };

  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    let element = e.target as Element;
    element.classList.remove(S.sticker_hide);
    setTop(e.clientY - offsetTop.current);
    setLeft(e.clientX - offsetLeft.current);
    updateNote(
      noteData.id,
      e.clientY - offsetTop.current,
      e.clientX - offsetLeft.current,
      width,
      height,
      text
    );
  };

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div
      className={S.sticker}
      draggable
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}
      style={{
        background: noteData.color,
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      <textarea
        ref={textRef}
        value={text}
        className={S.sticker_text}
        onChange={changeHandler}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
};

export default memo(Sticker);

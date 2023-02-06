import S from './styles.module.scss';
import React, { useState, useCallback, useEffect } from 'react';
import Sticker from '@components/Sticker';
import Trash from '@components/Trash';

export const TRASH_WIDTH = 300;

export interface NoteData {
  id: string;
  text: string;
  color: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

const newNote = (): NoteData => {
  const letters = '6789AB';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 6)];
  }
  return {
    id: Math.random().toString(16).slice(2),
    text: 'Click to change text',
    color,
    width: 200,
    height: 200,
    top: 30,
    left: 10,
  };
};

const App = () => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  useEffect(() => {
    const localNotes = localStorage.getItem('notes');
    if (localNotes) {
      setNotes(JSON.parse(localNotes));
    }
  }, []);

  const handleAdd = useCallback(() => {
    setNotes((prevState) => [...prevState, newNote()]);
  }, []);

  const updateNote = useCallback(
    (
      id: string,
      top: number,
      left: number,
      width: number,
      height: number,
      text: string
    ) => {
      let targetNote = notes.find((note) => note.id === id);
      if (left + width / 2 > document.body.clientWidth - TRASH_WIDTH) {
        targetNote = undefined;
      }
      setNotes((prevState) => {
        const newState = targetNote
          ? [
              ...prevState.filter((item) => item.id !== id),
              { ...targetNote, top, left, width, height, text },
            ]
          : [...prevState.filter((item) => item.id !== id)];
        localStorage.setItem('notes', JSON.stringify(newState));
        return newState;
      });
    },
    [notes]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div onDragOver={handleDragOver} className={S.container}>
      <button onClick={handleAdd}>Add note</button>
      <Trash width={TRASH_WIDTH} />
      {notes?.map((note) => (
        <Sticker key={note.id} noteData={note} updateNote={updateNote} />
      ))}
    </div>
  );
};

export default App;

import { useEffect, useState } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL!,
  import.meta.env.VITE_SUPABASE_KEY!
);

interface Image {
  created_at: string;
  id: string;
  last_accessed_at: string;
  metadata: object;
  name: string;
  updated_at: string;
}

function App() {
  const [images, setImages] = useState([] as Array<Image>);
  const [captions, setCaptions] = useState([] as Array<string>);

  const CDNURL = import.meta.env.VITE_SUPABASE_CDN_URL!;

  async function fetchAllImages() {
    const { data, error } = await supabase.storage.from('img').list();

    if (error) console.log('error', error);
    else {
      if (data !== null) {
        setImages(
          data.filter((image) => {
            return (
              image.id !== null && image.name !== '.emptyFolderPlaceholder'
            );
          })
        );
        console.log(images);
      }
    }
  }

  async function getCaptions() {
    const { data, error } = await supabase.from('image-caption').select();
    if (error) console.log('error', error);
    else {
      console.log('captions', data);
      // setCaptions(data);
      // console.log('captions', captions);
    }
  }

  useEffect(() => {
    fetchAllImages();
    getCaptions();
  }, []);

  return (
    <>
      {images.map((image) => {
        // console.log(image);
        return <img src={CDNURL + encodeURI(image.name)} key={image.id}></img>;
      })}
    </>
  );
}

export default App;

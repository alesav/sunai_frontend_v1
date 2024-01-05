import { useState } from 'react';
import axios from 'axios';

function AddEmbedding() {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      text: text,
      dbIndex: 'db_index' // replace this with the actual index
    };

    const response = await axios.post('https://cf1.smspm.workers.dev/addopenai', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddEmbedding;

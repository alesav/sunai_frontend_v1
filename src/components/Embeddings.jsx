import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Navbar from './Navbar';
import { Table } from 'flowbite-react';
import { Button, Modal } from 'flowbite-react'
import { HiPlus, HiOutlineExclamationCircle } from 'react-icons/hi'; 

function Embeddings() {
  const [cookies, setCookie] = useCookies(["token"]);
  const [embeddings, setEmbeddings] = useState([]);
  const [openModal, setOpenModal] = useState('');
  const [text, setText] = useState('');
 const [botId, setBotId] = useState();
 const [deletedEmbedding, setDeletedEmbedding] = useState('');
const [searchText, setSearchText] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [editingEmbedding, setEditingEmbedding] = useState({ id: '', text: '' });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    let bot = searchParams.get('bot');
    setBotId(bot); 
    fetch('https://cf1.smspm.workers.dev/listembeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        index: 'db_index',
        botId: bot
      }),
    })
      .then(response => response.json())
      .then(data => setEmbeddings(data.results))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenModal(undefined)

    const data = {
      text: text,
      dbIndex: 'db_index',
      botId: botId
    };

    const response = await axios.post('https://cf1.smspm.workers.dev/addembeddings', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);

  };
/*
 const handleEditVector = async (e) => {
   e.preventDefault();
   setOpenModal(undefined);

   const data = {
     text: editingEmbedding.text,
     botId: botId,
     vectorId: editingEmbedding.id
   };

   const response = await axios.post('https://cf1.smspm.workers.dev/editembeddings', data, {
     headers: {
       'Content-Type': 'application/json'
     }
   });

   console.log(response.data);
 };
 */

  const handleDeleteVector = async (e) => {
    e.preventDefault();
    setOpenModal(undefined)
    console.log("e.target: " + deletedEmbedding)

    const data = {
      vectorId: deletedEmbedding,
      botId: botId
    };

    const response = await axios.post('https://cf1.smspm.workers.dev/deletevector', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);

  };

 const handleEditVector = async (e) => {
   e.preventDefault();
   setOpenModal(undefined);

   const data = {
     text: editingEmbedding.text,
     botId: botId,
     vectorId: editingEmbedding.id
   };

   const response = await axios.post('https://cf1.smspm.workers.dev/editembeddings', data, {
     headers: {
       'Content-Type': 'application/json'
     }
   });

   console.log(response.data);
 };

 const handleSearch = async (e) => {
   e.preventDefault();
   const response = await axios.post('https://cf1.smspm.workers.dev/searchvector', {
     text: searchText,
     botId: botId
   }, {
     headers: {
       'Content-Type': 'application/json'
     }
   });
   setSearchResults(response.data);
   setOpenModal('search');
 };

  return (
    <>
    <Navbar />
    <div className='px-5 py-3 '>
    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white ">Knowledge base {botId}</h1>
   <div className="flex items-center max-w-md mx-auto mb-4">
     <input
       type="text"
       className="w-full px-4 py-2 border rounded-l-lg focus:outline-none"
       placeholder="Search embeddings..."
       value={searchText}
       onChange={(e) => setSearchText(e.target.value)}
     />
     <button
       className="px-4 py-2 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none"
       onClick={handleSearch}
     >
       Search
     </button>
   </div>


    <p className="mb-3 text-gray-500 dark:text-gray-400">Add texts about your company here and AI will create answers based on those texts</p>

    <Table >
      <Table.Head>
        
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Text</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        
      </Table.Head>
      <Table.Body className="divide-y">
        {embeddings.map(embedding => (
          <Table.Row key={embedding.id}>
            <Table.Cell>{embedding.id}</Table.Cell>
            <Table.Cell>{embedding.text}</Table.Cell>
            <Table.Cell>
            <button onClick={() => {
               setEditingEmbedding({ id: embedding.id, text: embedding.text });
                setOpenModal('edit')
              
                }}>Edit</button>
              <button onClick={() => {
                setOpenModal('pop-up')
                setDeletedEmbedding(embedding.id)
                }}>Delete</button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    <div className="flex flex-wrap items-center gap-2 py-3">
    <Button onClick={() => setOpenModal('default')}>                                                                      
   <HiPlus className="mr-2 h-5 w-5" />                                                                                 
   <p>                                                                                                                 
     Add text                                                                                                          
   </p>                                                                                                                
 </Button>                                                                                                             
 <Modal show={openModal === 'default'} onClose={() => setOpenModal(undefined)}>                                        
   <Modal.Header>Add New Text</Modal.Header>                                                                           
   <Modal.Body>                                                                                                        
     <div className="space-y-6">                                                                                       
       <textarea className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="4"              
 placeholder="Add your text here" value={text} onChange={(e) => setText(e.target.value)}></textarea>                                                                          
     </div>                                                                                                            
   </Modal.Body>                                                                                                       
   <Modal.Footer>                                                                                                      
   <Button onClick={handleSubmit}>Add</Button>                                                      
     <Button color="gray" onClick={() => setOpenModal(undefined)}>                                                     
       Cancel                                                                                                          
     </Button>                                                                                                         
   </Modal.Footer>                                                                                                     
 </Modal> 
 <Modal show={openModal === 'pop-up'} size="md" popup onClose={() => setOpenModal(undefined)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteVector}>
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(undefined)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
     </Modal>

     <Modal show={openModal === 'edit'} onClose={() => setOpenModal(undefined)}>
       <Modal.Header>Edit Text</Modal.Header>
       <Modal.Body>
         <div className="space-y-6">
           <textarea className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="4"
             placeholder="Edit your text here" value={editingEmbedding.text} onChange={(e) => setEditingEmbedding({ ...editingEmbedding, text: e.target.value })}></textarea>
         </div>
       </Modal.Body>
       <Modal.Footer>
         <Button onClick={handleEditVector}>Edit</Button>
         <Button color="gray" onClick={() => setOpenModal(undefined)}>
           Cancel
         </Button>
       </Modal.Footer>
      </Modal>

      <Modal show={openModal === 'search'} onClose={() => setOpenModal(undefined)}>
       <Modal.Header>Vector search results</Modal.Header>
       <Modal.Body>
         <div className="space-y-6">
        {searchResults}
         </div>
       </Modal.Body>
       <Modal.Footer>
        
         <Button color="gray" onClick={() => setOpenModal(undefined)}>
           Cancel
         </Button>
       </Modal.Footer>
      </Modal>
      </div>
</div>
    </>
  );
}

export default Embeddings;

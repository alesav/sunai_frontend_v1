import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { Button, Modal, Label, TextInput, Textarea, Toast  } from 'flowbite-react';
import { HiCheck, HiExclamation, HiX, HiFire } from 'react-icons/hi';
import { Avatar } from 'flowbite-react';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BotDetails() {
  const [cookies, setCookie] = useCookies(["token"]);
  const { id } = useParams();
  const [bot, setBot] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState('user');
  const [inputMessage, setInputMessage] = useState('');
  const [currentClient, setCurrentClient] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedClient, setEditedClient] = useState({});
  const [showToast, setShowToast] = useState(false);

  const notify = () => toast.success("Wow so easy!");

  useEffect(() => {
    // Fetch bot details and set editedClient when currentClient changes
    fetch(`https://cf1.smspm.workers.dev/bots/${id}`, {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setBot(data);
        // Fetch clients
        fetch(`https://cf1.smspm.workers.dev/clients?bot_id=${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setClients(data);
            setLoading(false);
            setEditedClient(currentClient);
          })
          .catch(error => console.error('Error:', error));
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [id, currentClient]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
      console.log("Event: " + JSON.stringify(editedClient, event.target))
    setEditedClient({ ...editedClient, [name]: value });
  };

  const handleSaveChanges = async () => {
    // Validate the editedClient object
    if (!editedClient.model || !editedClient.prompt || !editedClient.system_prompt) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Start loading
      setLoading(true);
      setShowModal(false)

      const response = await fetch(`https://cf1.smspm.workers.dev/editclient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          ...editedClient,
          model: editedClient.model,
          prompt: editedClient.prompt,
          system_prompt: editedClient.system_prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      const data = await response.json();
      console.log("Data: " + JSON.stringify(data))

      // End loading and show success message
      setLoading(false);
      toast.success("Changes saved successfully");

    } catch (error) {
      // End loading and show error message
      setLoading(false);
      toast.error(error.message);

    }
  };

  const fetchMessages = async (thread) => {
    // Fetch messages of the selected client
    const response = await fetch(`https://cf1.smspm.workers.dev/messages?thread=${thread}&bot=${id}`, {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    });
    const data = await response.json();
    console.log(JSON.stringify(data))
    setMessages(data);
  };

  const createClient = async () => {
    // Send POST request to /clients with botId in the body
    const response = await fetch('https://cf1.smspm.workers.dev/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        botId: id,
        language: "en"
      }),
    });
    const data = await response.json();
    console.log("Data: " + JSON.stringify(data))
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      setMessages([...messages, {sender,message: inputMessage}]);
      const response = await fetch('https://cf1.smspm.workers.dev/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: id,
          text: inputMessage,
          systemPrompt: currentClient.system_prompt,
          prompt: currentClient.prompt,
          model: currentClient.model,
          history: []

        }),
      });
      const response2 = await fetch('https://cf1.smspm.workers.dev/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          text: inputMessage,
          sender: sender,
          bot: id,
          client: currentClient.id, 
          model: currentClient.model,
          prompt: currentClient.prompt,
          thread: currentClient.tg_client_id,
          messages

        }),
      });
      const data = await response.json();
      console.log("Data12: " + JSON.stringify(data))
      if(sender == "user"){
        setInputMessage(data.result);
        setSender('assistant')
      } else {
        setInputMessage('');
        setSender('user')
      }
      
    }
  };

  /*
  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      setMessages([...messages, {sender,message: inputMessage}]);
      const response = await fetch('http://localhost:5001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          text: inputMessage,
          sender: sender,
          bot: id,
          client: currentClient.tg_client_id, 
          model: currentClient.model,
          prompt: currentClient.prompt,
          messages

        }),
      });
      const data = await response.json();
      console.log("Data12: " + JSON.stringify(data))
      if(sender == "user"){
        setInputMessage(data.message);
        setSender('assistant')
      } else {
        setInputMessage('');
        setSender('user')
      }
      
    }
  };
  */

  return (
    <div>
      <Navbar />

    <div className="flex flex-row justify-between bg-white border-b-2">
 
      <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
       
        <div className="border-b-2 py-4 px-2">
          <input
            type="text"
            placeholder="search chatting"
            className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
          />
        </div>

        {clients.map(client => (



<div className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 ${selectedChat === client.id ? 'bg-gray-200' : ''}`} onClick={() => {
  setCurrentClient(client);
  fetchMessages(client.tg_client_id);
  setSelectedChat(client.id); // set the selected chat
}}>
           <div className="flex flex-wrap gap-2">
  
      <Avatar rounded >
      <div className="space-y-1 font-medium dark:text-white">
        <div>
          Client {client.id}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Joined in October 2023
        </div>
      </div>
      </Avatar>
    </div>
        </div>

))}

        <div
          className="flex flex-row py-4 px-2 justify-center items-center border-b-2"
        >
          <div className="w-1/4">
            <img
              src="https://source.unsplash.com/_7LbC5J-jw4/600x600"
              className="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div className="w-full">
            <div className="text-lg font-semibold">Luis1994</div>
            <span className="text-gray-500">Pick me at 9:00 Am</span>
          </div>
        </div>
        <div className="flex flex-row py-4 px-2 items-center border-b-2">
          <div className="w-1/4">
            <img
              src="https://source.unsplash.com/otT2199XwI8/600x600"
              className="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div className="w-full">
            <div className="text-lg font-semibold">Everest Trip 2021</div>
            <span className="text-gray-500">Hi Sam, Welcome</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center p-3">
        <Button onClick={createClient}>+ Create</Button>
        </div>



    
      </div>
  
      <div className="w-full px-5 flex flex-col justify-between">
        <div className="flex flex-col mt-5">
          {messages.map(message => (
            <div className={message.sender === 'assistant' ? "flex justify-start mb-4" : "flex justify-end mb-4"}>
              {message.sender === 'assistant' && 
                <img
                  src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                  className="object-cover h-8 w-8 rounded-full"
                  alt=""
                />
              }
              <div
                className={message.sender === 'assistant' ? "ml-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white" : "mr-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"}
              >
                {message.message}
              </div>
              {message.sender !== 'assistant' && 
                <img
                  src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                  className="object-cover h-8 w-8 rounded-full"
                  alt=""
                />
              }
            </div>
          ))}

        </div>
        <div className="py-5">
          <div className="mb-3">
            <input type="radio" id="user" name="sender" value="user" checked={sender === 'user'} onChange={() => setSender('user')} />
            <label htmlFor="user">User</label><br/>
            <input type="radio" id="assistant" name="sender" value="assistant" checked={sender === 'assistant'} onChange={() => setSender('assistant')} />
            <label htmlFor="assistant">Assistant</label>
          </div>
          <input
            className="w-full bg-gray-300 py-5 px-3 rounded-md"
            type="text"
            placeholder="type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    
      <div className="w-2/5 border-l-2 px-5">
        <div className="flex flex-col">
        <div className="font-semibold text-xl py-4">Settings</div>  
        <div className="font-light">                                                                                
            Model: {currentClient.model}                                                                                           
           </div>    
           <div className="font-light">                                                                                
            System prompt: {currentClient.system_prompt}                                                                                           
           </div>       
           <div className="font-light">                                                                                
            Prompt: {currentClient.prompt}                                                                                           
           </div>  
           <div className="font-light">                                                                                
            Info: {currentClient.info}                                                                                           
           </div>    
           <div className="font-light">                                                                                
            Language: {currentClient.language}                                                                                           
           </div>    

           <Button onClick={() => setShowModal(true)}>Edit</Button>
           <Modal                                                                                                              
     show={showModal}                                                                                                  
     onClose={() => setShowModal(false)}                                                                               
   >                                                                                                                   
     <Modal.Header>Edit Client</Modal.Header>                                                                          
     <Modal.Body>                                                                                                      
       <div className="space-y-6">                                                                                     
         <div>                                                                                                         
           <Label                                                                                                      
             htmlFor="model"                                                                                           
             value="Model"                                                                                             
           />                                                                                                          
           <TextInput                                                                                                  
             id="model"                                                                                                
             name="model"                                                                                              
             value={editedClient.model}                                                                                
             onChange={handleInputChange}                                                                              
           />                                                                                                          
         </div>                                                                                                        
         <div>                                                                                                         
           <Label                                                                                                      
             htmlFor="prompt"                                                                                          
             value="Prompt"                                                                                            
           />                                                                                                          
           <Textarea                                                                                                  
             id="prompt"                                                                                               
             name="prompt"                                                                                             
             value={editedClient.prompt}                                                                               
             onChange={handleInputChange}                                                                              
           />                                                                                                          
         </div>  
         <div>
         <Label
           htmlFor="systemPrompt"
           value="System Prompt"
         />
         <Textarea
           id="systemPrompt"
           name="system_prompt"
           value={editedClient.system_prompt}
           onChange={handleInputChange}
         />
       </div>                                                                                                      
       </div>                                                                                                          
     </Modal.Body>                                                                                                     
     <Modal.Footer>
    
       <Button onClick={handleSaveChanges}>
         Save Changes
       </Button>
     </Modal.Footer>
   </Modal>

           <div className="flex flex-wrap items-center justify-center p-3">                       
           <Button size="sm" onClick={async () => {                                                                              
             await fetch(`https://cf1.smspm.workers.dev/flush?thread=${currentClient.tg_client_id}&bot=${id}`, {                            
               method: 'DELETE',                                                                                       
               headers: {                                                                                              
                 'Authorization': `Bearer ${cookies.token}`,                                                           
               },                                                                                                      
             });                                                                                                       
             setMessages([]);                                                                                          
           }}>Flush Messages</Button>  
           </div>  



          </div>
        </div>
      </div>
      <div>
        <ToastContainer
position="bottom-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
      </div>
    </div>

  );


}

export default BotDetails;

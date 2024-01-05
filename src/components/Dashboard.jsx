import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { UserContext } from '../UserContext';
import Navbar from './Navbar';
import { Table } from 'flowbite-react';
import { Button, Modal, TextInput, Textarea } from 'flowbite-react'
import { HiPlus, HiOutlineExclamationCircle } from 'react-icons/hi'; 
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const userData = useContext(UserContext);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [updateCompanyId, setUpdateCompanyId] = useState("");
  const [updateCompanyName, setUpdateCompanyName] = useState("");
  const [bots, setBots] = useState([]);
  const [newBotName, setNewBotName] = useState("");
  const [newBotModel, setNewBotModel] = useState("huggingfaceh4/zephyr-7b-beta");
  const [newBotSystemPrompt, setNewBotSystemPrompt] = useState("You are helpful customer support.");
  const [newBotPrompt, setNewBotPrompt] = useState("Answer the following Question based on the Context only. Only answer from the Context. If you don't know the answer, say 'I don't know'.");
  const [newBotEmbeddingType, setNewBotEmbeddingType] = useState("bge");
  const [updateBotId, setUpdateBotId] = useState("");
  const [updateBotName, setUpdateBotName] = useState("");
  const [updateBotSystemPrompt, setUpdateBotSystemPrompt] = useState("");
  const [updateBotModel, setUpdateBotModel] = useState("");
  const [updateBotPrompt, setUpdateBotPrompt] = useState("");
  const [addCompanyPopupOpen, setAddCompanyPopupOpen] = useState(false);
  const [editCompanyPopupOpen, setEditCompanyPopupOpen] = useState(false);
  const [addBotPopupOpen, setAddBotPopupOpen] = useState(false);
  const [editBotPopupOpen, setEditBotPopupOpen] = useState(false);


  const createCompany = () => {
    fetch('https://cf1.smspm.workers.dev/companies', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cookies.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newCompanyName })
    })
      .then(response => response.json())
      .then(data => {
        setCompanies([...companies, data]);
        setNewCompanyName('');
        
      });
  };

  const updateCompany = () => {
    fetch(`http://localhost:5001/companies/${updateCompanyId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cookies.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: updateCompanyName })
    })
      .then(response => response.json())
      .then(data => {
        setCompanies(companies.map(company => company.id === updateCompanyId ? data : company));
        setUpdateCompanyId('');
        setUpdateCompanyName('');
      });
  };

  const deleteCompany = (id) => {
    fetch(`http://localhost:5001/companies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${cookies.token}`
      }
    })
      .then(() => {
        setCompanies(companies.filter(company => company.id !== id));
      });
  };

  const createBot = () => {
    fetch('https://cf1.smspm.workers.dev/bots', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cookies.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newBotName,
        model: newBotModel,
        systemPrompt: newBotSystemPrompt,
        prompt: newBotPrompt,
        companyId: selectedCompanyId,
        embeddingType: newBotEmbeddingType
      })
    })
      .then(response => response.json())
      .then(data => {
        setBots([...bots, data]);
        setNewBotName('');
      });
  };

  const updateBot = () => {
    fetch(`http://localhost:5001/bots/${updateBotId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cookies.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ systemPrompt: updateBotSystemPrompt, model: updateBotModel, prompt: updateBotPrompt })
    })
      .then(response => response.json())
      .then(data => {
        setBots(bots.map(bot => bot.id === updateBotId ? data : bot));
        setUpdateBotId('');
        setUpdateBotSystemPrompt('');
        setUpdateBotModel('');
        setUpdateBotPrompt('');
      });
  };

  const openAddCompanyPopup = () => {
    setAddCompanyPopupOpen(true);
  };

  const closeAddCompanyPopup = () => {
    setAddCompanyPopupOpen(false);
  };

  const openEditCompanyPopup = (company) => {
    setUpdateCompanyId(company.id);
    setUpdateCompanyName(company.company_name);
    setEditCompanyPopupOpen(true);
  };

  const closeEditCompanyPopup = () => {
    setEditCompanyPopupOpen(false);
  };

  const openAddBotPopup = () => {
    setAddBotPopupOpen(true);
  };

  const closeAddBotPopup = () => {
    setAddBotPopupOpen(false);
  };

  const openEditBotPopup = (bot) => {
    setUpdateBotId(bot.id);
    setUpdateBotName(bot.name);
    setUpdateBotModel(bot.model);
    setUpdateBotPrompt(bot.prompt);
    setUpdateBotSystemPrompt(bot.system_prompt);
    setEditBotPopupOpen(true);
  };

  const closeEditBotPopup = () => {
    setEditBotPopupOpen(false);
  };
  

  useEffect(() => {
    fetch("https://cf1.smspm.workers.dev/companies", {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data)
        setSelectedCompanyId(data[0].id)});

    fetch("https://cf1.smspm.workers.dev/bots", {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setBots(data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className='px-5 py-3 '>
    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white ">Dashboard</h1>
      {userData && (
        <div>
          <p>Welcome, {userData.name}!</p>
          <p>Your username is {userData.username}.</p>
        </div>
      )}
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Companies</h2>
      <input
        type="text"
        value={newCompanyName}
        onChange={(e) => setNewCompanyName(e.target.value)}
        placeholder="New company name"
      />
      <button onClick={createCompany}>Create Company</button>

      <input
        type="text"
        value={updateCompanyId}
        onChange={(e) => setUpdateCompanyId(e.target.value)}
        placeholder="ID of company to update"
      />
      <input
        type="text"
        value={updateCompanyName}
        onChange={(e) => setUpdateCompanyName(e.target.value)}
        placeholder="New name of company"
      />
      <button onClick={updateCompany}>Update Company</button>

      <Table>
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {companies.map(company => (
            <Table.Row key={company.id}>
              <Table.Cell>{company.id}</Table.Cell>
              <Table.Cell>{company.company_name}</Table.Cell>
              <Table.Cell>
                <button onClick={() => openEditCompanyPopup(company)}>Edit</button>
                <button onClick={() => deleteCompany(company.id)}>Delete</button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="flex flex-wrap items-center gap-2 py-3">
      <Button onClick={openAddCompanyPopup}>
        <HiPlus className="mr-2 h-5 w-5" />
        <p>Add Company</p>
      </Button>
      </div>

      <Modal show={addCompanyPopupOpen} onClose={closeAddCompanyPopup}>
        <Modal.Header>Add New Company</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Company name"
            />
              value={newBotModel}
              onChange={(e) => setNewBotModel(e.target.value)}
              placeholder="Model"
            />
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotSystemPrompt}
              onChange={(e) => setNewBotSystemPrompt(e.target.value)}
              placeholder="System prompt"
            />
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotPrompt}
              onChange={(e) => setNewBotPrompt(e.target.value)}
              placeholder="Prompt"
            />
            <select
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              value={newBotEmbeddingType}
              onChange={(e) => setNewBotEmbeddingType(e.target.value)}
            >
              <option value="bge">bge</option>
              <option value="OpenAi">OpenAi</option>
              <option value="Mistral">Mistral</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createCompany}>Add</Button>
          <Button color="gray" onClick={closeAddCompanyPopup}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={editCompanyPopupOpen} onClose={closeEditCompanyPopup}>
        <Modal.Header>Edit Company</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={updateCompanyName}
              onChange={(e) => setUpdateCompanyName(e.target.value)}
              placeholder="New name of company"
            />
              value={newBotModel}
              onChange={(e) => setNewBotModel(e.target.value)}
              placeholder="Model"
            />
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotSystemPrompt}
              onChange={(e) => setNewBotSystemPrompt(e.target.value)}
              placeholder="System prompt"
            />
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotPrompt}
              onChange={(e) => setNewBotPrompt(e.target.value)}
              placeholder="Prompt"
            />
            <select
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              value={newBotEmbeddingType}
              onChange={(e) => setNewBotEmbeddingType(e.target.value)}
            >
              <option value="bge">bge</option>
              <option value="OpenAi">OpenAi</option>
              <option value="Mistral">Mistral</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateCompany}>Update</Button>
          <Button color="gray" onClick={closeEditCompanyPopup}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Bots</h2>
      <Table>
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Model</Table.HeadCell>
          <Table.HeadCell>System Prompt</Table.HeadCell>
          <Table.HeadCell>Prompt</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {bots.map(bot => (
            <Table.Row key={bot.id}>
              <Table.Cell><Link to={`/bot/${bot.id}`}>{bot.id}</Link></Table.Cell>
              <Table.Cell>{bot.model}</Table.Cell>
              <Table.Cell>{bot.system_prompt}</Table.Cell>
              <Table.Cell>{bot.prompt}</Table.Cell>
              <Table.Cell>
              <Link to={`/embeddings?bot=${bot.id}`}>Embeddings</Link>
                <button onClick={() => openEditBotPopup(bot)}>Edit</button>
                <button onClick={() => deleteBot(bot.id)}>Delete</button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="flex flex-wrap items-center gap-2 py-3">
      <Button onClick={openAddBotPopup}>
        <HiPlus className="mr-2 h-5 w-5" />
        <p>Add Bot</p>
      </Button>
      </div>
      <Modal show={addBotPopupOpen} onClose={closeAddBotPopup}>
        <Modal.Header>Add New Bot</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <select
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              value={selectedCompanyId }
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company_name}
                </option>
              ))}
            </select>
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotName}
              onChange={(e) => setNewBotName(e.target.value)}
              placeholder="Bot name"
            />
             <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotModel}
              onChange={(e) => setNewBotModel(e.target.value)}
              placeholder="Model"
            />
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotSystemPrompt}
              onChange={(e) => setNewBotSystemPrompt(e.target.value)}
              placeholder="System prompt"
            />
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotPrompt}
              onChange={(e) => setNewBotPrompt(e.target.value)}
              placeholder="Prompt"
            />
            <select
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              value={newBotEmbeddingType}
              onChange={(e) => setNewBotEmbeddingType(e.target.value)}
            >
              <option value="bge">bge</option>
              <option value="OpenAi">OpenAi</option>
              <option value="Mistral">Mistral</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createBot}>Add</Button>
          <Button color="gray" onClick={closeAddBotPopup}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={editBotPopupOpen} onClose={closeEditBotPopup}>
        <Modal.Header>Edit Bot</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <TextInput
              type="text"
              value={updateBotSystemPrompt}
              onChange={(e) => setUpdateBotSystemPrompt(e.target.value)}
              placeholder="New system prompt of bot"
            />
                        <TextInput
              type="text"
              value={updateBotModel}
              onChange={(e) => setUpdateBotModel(e.target.value)}
              placeholder="Model"
            />
                                  <Textarea
              required rows={6}
              type="text"
              value={updateBotPrompt}
              onChange={(e) => setUpdateBotPrompt(e.target.value)}
              placeholder="Model">
            </Textarea>
            {/* Add inputs for other bot properties here */}
              value={newBotModel}
              onChange={(e) => setNewBotModel(e.target.value)}
              placeholder="Model"
            />
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotSystemPrompt}
              onChange={(e) => setNewBotSystemPrompt(e.target.value)}
              placeholder="System prompt"
            />
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              type="text"
              value={newBotPrompt}
              onChange={(e) => setNewBotPrompt(e.target.value)}
              placeholder="Prompt"
            />
            <select
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              value={newBotEmbeddingType}
              onChange={(e) => setNewBotEmbeddingType(e.target.value)}
            >
              <option value="bge">bge</option>
              <option value="OpenAi">OpenAi</option>
              <option value="Mistral">Mistral</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateBot}>Update</Button>
          <Button color="gray" onClick={closeEditBotPopup}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  );
};

export default Dashboard;

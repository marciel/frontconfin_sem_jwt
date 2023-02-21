import React,{useState, useEffect} from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'

import axios from 'axios';

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import logoCadastro from './assets/Estado.png'

function App() {
  const baseUrl = "https://localhost:7133/api/Estado";
  const [data, setData] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState({sigla: '', nome: ''})
  const [modalIncluir, setModalIncluir] = useState(false)
  const [modalAlterar, setModalAlterar] = useState(false)
  const [modalExcluir, setModalExcluir] = useState(false)

  const pedidoGet = async() => {
    await axios.get(baseUrl)
    .then(response => {
      console.log(response)
      setData(response.data);
    })
    .catch(error => {
      console.log(error);
    })
  }

  const pedidoPost = async() => {
    await axios.post(baseUrl, estadoSelecionado)
    .then(response => {
      setData(data.concat(response.data));
      abrirFecharModalIncluir(false);
    })
    .catch(error => {
      console.log(error);
    })
  }

  const pedidoPut = async() => {
    await axios.put(baseUrl+"/"+estadoSelecionado.sigla, estadoSelecionado)
    .then(response => {
      var dadosAuxiliares = data;
      dadosAuxiliares.map(estado =>{
        if(estado.sigla === estadoSelecionado.sigla){
          estado.nome = response.data.nome;
        }
      });
      abrirFecharModalAlterar(false);
    })
    .catch(error => {
      console.log(error);
    })
  }

  const pedidoDelete = async() => {
    await axios.delete(baseUrl+"/"+estadoSelecionado.sigla)
    .then(response => {
      setData(data.filter(estado => estado.sigla !== response.data));
      abrirFecharModalExcluir(false);
    })
    .catch(error => {
      console.log(error);
    })
  }

  useEffect(() =>{
      pedidoGet();
  })

  const handleChange = e => {
    const {name, value} = e.target;
    setEstadoSelecionado({
      ...estadoSelecionado,
      [name]: value
    });
  }

  const abrirFecharModalIncluir = (valor) => {
    setModalIncluir(valor);
  }

  const abrirFecharModalAlterar = (valor) => {
    setModalAlterar(valor);
  }

  const abrirFecharModalExcluir = (valor) => {
    setModalExcluir(valor);
  }

  const selecionarEstado =  (estado, opcao) => {
    setEstadoSelecionado(estado);
    (opcao === "Alterar") ? abrirFecharModalAlterar(true) : abrirFecharModalExcluir(true);
  }

  return (
    <div className="estado-container">
      <br />
      <h3>Cadastro de Estados</h3>
      <header>
        <img src={logoCadastro} alt="Estado" />
        <button className='btn btn-success' onClick={() => abrirFecharModalIncluir(true)}>Incluir Novo Estado</button>
      </header>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Sigla</th>
            <th>Nome</th>
            <th>Opções</th>
          </tr>
          {
          data.map(estado => (
            <tr key={estado.sigla}>
              <td>{estado.sigla}</td>
              <td>{estado.nome}</td>
              <td>
                <button className='btn btn-primary' onClick={() => selecionarEstado(estado, "Alterar")}>Alterar</button> {" "}
                <button className='btn btn-danger' onClick={() => selecionarEstado(estado, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))
        }
        </thead>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Estado</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Sigla:</label>
            <br />
            <input type={Text} className='form-control' name='sigla' onChange={handleChange} />
            <br />
            <label>Nome:</label>
            <br />
            <input type={Text} className='form-control' name='nome' onChange={handleChange}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPost()}>Incluir</button>{" "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalIncluir(false)}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalAlterar}>
        <ModalHeader>Alterar Estado</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Sigla:</label>
            <br />
            <input type={Text} className='form-control' name='sigla' onChange={handleChange} readOnly={true} 
              value={estadoSelecionado && estadoSelecionado.sigla}/>
            <br />
            <label>Nome:</label>
            <br />
            <input type={Text} className='form-control' name='nome' onChange={handleChange}
              value={estadoSelecionado && estadoSelecionado.nome}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPut()}>Alterar</button>{" "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalAlterar(false)}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalHeader>Excluir Estado</ModalHeader>
        <ModalBody>
          Confirma a exclusão do estado {estadoSelecionado && estadoSelecionado.sigla+" - "+estadoSelecionado.nome}?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoDelete()}>Excluir</button>{" "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalExcluir(false)}>Cancelar</button>
        </ModalFooter>
      </Modal>


    </div>
  );
}

export default App;

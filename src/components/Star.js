import React, {useState, useEffect} from 'react';
import './Star.css';

function Star() {

  const [parametro, setParametro] = useState ("")
  const [personagem, setPersonagem] = useState ([])
  const [fil, setFil] = useState ([])
  const [total, setTotal] = useState ()
  
  
  useEffect(()=>{

    // Função que alimenta o Banco de personagens
    async function banco(){
      let res = await fetch(`https://swapi.dev/api/people/?page=1`);
      let data = await res.json();
      const item = data.results;
      setPersonagem(item);  
    }

    // async function banco(){
    //   for (let i = 1; i < 83; i++) {
    //     let res = await fetch(`https://swapi.dev/api/people/${i}/`);
    //     let data = await res.json();
    //     setPersonagem(data)
    //     console.log(data)
    //   }
    // }

    //Função que calcula a soma dos valores das starships
    async function valorNaves(){
      var soma  = 0;
      var valor = 0;
      for (let i = 1; i < 64; i++) {
        let res = await fetch(`https://swapi.dev/api/starships/${i}/`).catch();
        let data = await res.json();
        
         valor = parseInt(data.cost_in_credits);
        if(Number.isInteger(valor)){
          soma+=valor;
        }
      }
      
      setTotal(soma.toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
      
    }
    banco();
    valorNaves();
  },[])

  //Função que limpa a mensagem de erro de campo vazio
  const limparErro = () => {
    document.getElementById("campoVazio").style.display = "none";
    document.getElementById("errou").style.display = "none"
  }
  
  //Função de pesquisar com parâmetros e condições
  const buscar = async  () => {
    const person = personagem.find((e)=>e.name===parametro)
    
    //Planeta Natal
    async function casa(){
      let res = await fetch(person.homeworld);
      let data = await res.json();
      return data.name
    }
    
    //Lista de filmes
    async function filmes(){
      await person.films.forEach(async (element)=> {
        let res = await fetch(element);
        let data = await res.json();
        setFil(data.title);  
      });
    }
    
    if (parametro !== ""){
      if (person === undefined){
        document.getElementById("errou").style.display = "block";
      }
      if (person !== undefined){
        console.log(person);
        const planetaNatal = await casa();
        await filmes(); 

        //Inserção das informações do personagem pesquisado
        document.querySelector(".resultado").innerHTML=
          `
            <div class="tituloDetalhes">
              DETALHES DO PERSONAGEM
            </div>
            <div class= "informacoes">
              <div class="personagem">
                <div>
                  Nome completo: ${person.name}
                </div>
                <div>
                  Altura: ${person.height}
                </div>
                <div>
                  Peso: ${person.mass}
                </div>
                <div>
                  Planeta natal: ${planetaNatal}
                </div>
              </div>
              <div class="filmes">
                <div class= "tituloFilmes">
                  Lista dos filmes em que apareceu:
                </div> 
                <div class="listaFilmes">
                ${fil}
                </div>
              </div>
            </div>
          `
      }
    }else{
      //Mensagem de campo vazio
      document.getElementById("campoVazio").style.display = "block";
    } 
  }

  return (
    <div className= "container">
      <div className= "header">
        <div className="titulo">
            Star Wars Info
          </div>
          <div className="descricao">
            Para obter informações sobre um personagem do universo Star Wars, digite o nome no campo abaixo e em seguida clique em "Pesquisar".
          </div>
      </div>
      <div className= "campoPesquisa">
        <div className="campoInput">
          <div>
            Nome do personagem
          </div>
          <input type="text" id="parametro" autocomplete="off" value={parametro} onInput={()=>{limparErro()}} onChange={e=>setParametro(e.target.value)} placeholder="Digite aqui"></input>
        <div id="campoVazio">Para pesquisar este campo não pode está vazio.</div>
        <div id="errou">Este pesonagem não existe no universo de Star Wars.</div>
        </div>
        <div className="campoBtn">
          <button onClick={()=>{buscar()}}>Pesquisar</button>
        </div>
      </div>
      <div className= "resultado">
      </div>
      <div className= "curiosidade">
        <div className="tituloCuriosidade">
          Curiosidade
        </div>
        <div className="descricao">
          Se alguém quisesse comprar TODAS as naves do universo Star Wars, a quantia em créditos que esse ser gastaria, seria de:
          <div className= "valorNaves"> {total} créditos</div>
        </div>
      </div>
    </div>
  );
}

export default Star;

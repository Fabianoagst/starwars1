import React, {useState, useEffect} from 'react';
import './Star.css';
import axios from 'axios';

function Star() {

  const [parametro, setParametro] = useState ("")
  const [personagem, setPersonagem] = useState ([])
  const [fil, setFil] = useState ([])
  const [total, setTotal] = useState (0)
  const [totalTela, setTotalTela] = useState ()
  
  var soma  = 0;
  var valor = 0;

  // function getPeople(page) {
  //   fetch(`https://swapi.dev/api/people/?page=`+page).then((res) => res.json()).then((data) => {
  //     const item = data.results;
      
  //     let auxPersonagem = personagem;
  //     auxPersonagem.push(...item);
  //     setPersonagem(auxPersonagem); 
      
  //     // setPersonagem([...personagem, ...item])

  //     if (data.next && data.next !== '') {
  //       getPeople(page + 1)
  //     } else {
  //       console.log(personagem)
  //     }
  //   })
  // }

  function getPeople(page) {
    axios(`https://swapi.dev/api/people/?page=`+page).then(res => {
      const item = res.data.results;
      
      let auxPersonagem = personagem;
      auxPersonagem.push(...item);
      setPersonagem(auxPersonagem); 
      
      // setPersonagem([...personagem, ...item])

      if (res.data.next && res.data.next !== '') {
        getPeople(page + 1)
      } else {
        // console.log(personagem)
      }
    })
  }


  async function valorNaves(page){
     await axios('https://swapi.dev/api/starships/?page='+ page).then(res =>{
      
      res.data.results.forEach(element => {
        valor = parseInt(element.cost_in_credits);
        if(valor){
          soma += valor
          setTotal(soma)
        }
        setTotalTela(soma);
      });
      
      if(res.data.next){
        valorNaves(page + 1)
      }
    })
  }

  useEffect(()=>{

    // Função que alimenta o Banco de personagens
    getPeople(1)
    
    //Função que calcula a soma dos valores das starships
    valorNaves(1);
  },[])

  //Função que limpa a mensagem de erro de campo vazio
  const limparErro = () => {
    document.getElementById("campoVazio").style.display = "none";
    document.getElementById("errou").style.display = "none";
  }
  
  //Função de pesquisar com parâmetros e condições
  const buscar = async  () => {
    const person = await personagem.find((e)=>e.name===parametro)

    await person.films.forEach(element => {
      let auxfilme = fil
      axios(element).then(res => {
        auxfilme.push(res.data.title)
        setFil(auxfilme)
      })
    })
    console.log(fil)

    //Planeta Natal
    async function casa(){
      let res = await fetch(person.homeworld);
      let data = await res.json();
      return data.name
    }
    
    //Lista de filmes
    // async function filmes(){
    //   await person.films.forEach(async (element)=> {
    //     let res = await fetch(element);
    //     let data = await res.json();
    //     let auxfilme = fil;
    //     auxfilme.push(data.title)
    //     // console.log(data.title)
    //     setFil(auxfilme);  
    //   });
    // } 

    
    if (parametro !== ""){
      if (person === undefined){
        document.getElementById("errou").style.display = "block";
      }
      if (person !== undefined){
        console.log(person);
        const planetaNatal = await casa(); 

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
          <div className= "valorNaves"> {totalTela} créditos</div>
        </div>
      </div>
    </div>
  );
}

export default Star;

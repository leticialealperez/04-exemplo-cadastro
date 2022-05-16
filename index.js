// CAPTURAR OS ELEMENTOS DA DOM

//ELEMENTOS DO FORMULÁRIO
let formulario = document.querySelector('#form-cadastro');
let inputRegistro = document.querySelector('#input-registro');
let inputTitulo = document.querySelector('#input-titulo');
let inputDescricao = document.querySelector('#input-descricao');

let tabelaLivros = document.querySelector('#tabela-registros');


//EVENTOS
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    adicionarNovoRegistro();
});

document.addEventListener('DOMContentLoaded', pegarDadosStorage);



function adicionarNovoRegistro(){
    let listaLivros = JSON.parse(localStorage.getItem('Meus Livros')) || [];
    
    let registroID = inputRegistro.value;

    let existe = listaLivros.some((livro) => livro.registroID == registroID)  /* '1' == 1 ou '1' == '1' ou  1 == '1' ou 1 == 1 */
    
    if(existe){
        alert("Já existe um livro cadastrado com esse registro ID!");
        inputRegistro.value = '';
        inputRegistro.focus();

        return
    }
    

    let tituloLivro = inputTitulo.value;
    let descricaoLivro = inputDescricao.value;

    let livro = {
        registroID,
        tituloLivro,
        descricaoLivro
    }

    listaLivros.push(livro);

    console.log(listaLivros);

    salvarNaTabela(livro);
    limparCampos();
    salvarNoStorage(listaLivros); 
}

function salvarNaTabela(dadosLivro){
    let novaLinha = document.createElement('tr');
    let colunaRegistro = document.createElement('td');
    let colunaTitulo = document.createElement('td');
    let colunaDescricao = document.createElement('td');
    let colunaAcoes = document.createElement('td');

    novaLinha.setAttribute('class', 'registros');
    novaLinha.setAttribute('id', dadosLivro.registroID);
    colunaRegistro.innerHTML = dadosLivro.registroID;
    colunaTitulo.innerHTML = dadosLivro.tituloLivro;
    colunaDescricao.innerHTML = dadosLivro.descricaoLivro;
    colunaAcoes.innerHTML = `
                                <button class="btn-editar">Editar</button>
                                <button class="btn-apagar" onclick="apagarRegistro(${dadosLivro.registroID})">Apagar</button>
                            `

    novaLinha.appendChild(colunaRegistro);
    novaLinha.appendChild(colunaTitulo);
    novaLinha.appendChild(colunaDescricao);
    novaLinha.appendChild(colunaAcoes);
    
    tabelaLivros.appendChild(novaLinha);
}

function limparCampos(){
    inputRegistro.value = '';
    inputTitulo.value = '';
    inputDescricao.value = '';
}


function salvarNoStorage(listaLivros){

    //setItem('chave', 'valor')
    //tornar tudo string => JSON.stringify(valor)
    localStorage.setItem('Meus Livros', JSON.stringify(listaLivros));
    
}


function pegarDadosStorage(){

    //getItem('chave')
    //transformar tudo de volta para array e objetos JSON.parse(valor)
    let dadosStorage = JSON.parse(localStorage.getItem('Meus Livros'));

    if(dadosStorage){
        for(let registro of dadosStorage){
            salvarNaTabela(registro);
        }
    }

    return
}

function apagarRegistro(registroID){
    
    let listaRegistros = JSON.parse(localStorage.getItem('Meus Livros'));
    let indiceEncontrado = listaRegistros.findIndex((livro) => livro.registroID == registroID);
    console.log(`Encontrei na posição ${indiceEncontrado}`);

    let confirma = window.confirm(`Tem certeza que deseja remover o livro de registro ID ${registroID}?`);

    if(confirma){

        let linhasTabela = document.querySelectorAll('.registros');

        for(let linha of linhasTabela){
            if(linha.id == registroID){
                console.log(linha);
                tabelaLivros.removeChild(linha);
                listaRegistros.splice(indiceEncontrado, 1);
                alert("Registroi removido!");
            }
        }

        localStorage.clear();
        salvarNoStorage(listaRegistros);


    }else{
        return
    }


}
// CAPTURAR OS ELEMENTOS DA DOM

//ELEMENTOS DO FORMULÁRIO
let formulario = document.querySelector('#form-cadastro');
let inputRegistro = document.querySelector('#input-registro');
let inputTitulo = document.querySelector('#input-titulo');
let inputDescricao = document.querySelector('#input-descricao');
let botaoCancelar = document.querySelector('#btn-cancelar');
let botaoAtualizar = document.querySelector('#btn-atualizar');
let botaoSalvar = document.querySelector('#btn-salvar');

let tabelaLivros = document.querySelector('#tabela-registros');


//EVENTOS
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    adicionarNovoRegistro();
});

document.addEventListener('DOMContentLoaded', pegarDadosStorage);
botaoCancelar.addEventListener('click', cancelarEdicao);



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
                                <button class="btn-editar" onclick="prepararEdicao(${dadosLivro.registroID})">Editar</button>
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

function cancelarEdicao(){
    limparCampos();
    botaoSalvar.setAttribute('style', 'display: inline-block');
    botaoAtualizar.setAttribute('style', 'display: none');
    botaoCancelar.setAttribute('style', 'display: none');
    inputRegistro.removeAttribute('readonly');
    inputRegistro.removeAttribute('disabled');
}

function prepararEdicao(registroID){
    botaoSalvar.setAttribute('style', 'display: none');
    botaoAtualizar.setAttribute('style', 'display: inline-block');
    botaoAtualizar.setAttribute('onclick', `atualizarRegistro(${registroID})`);
    botaoCancelar.setAttribute('style', 'display: inline-block');

    /* alert(`O registro que quero editar é ${registroID}`); */
    let listaLivros = JSON.parse(localStorage.getItem('Meus Livros'));
    let livroEncontrado = listaLivros.find((livro) => livro.registroID == registroID);

    inputRegistro.value = livroEncontrado.registroID;
    inputTitulo.value = livroEncontrado.tituloLivro;
    inputDescricao.value = livroEncontrado.descricaoLivro;
    inputRegistro.setAttribute('readonly', 'true');
    inputRegistro.setAttribute('disabled', 'true');
}

function atualizarRegistro(registroID){
    /* alert(registroID); */

    let novoRegistro = inputRegistro.value;
    let novoTitulo = inputTitulo.value;
    let novaDescricao = inputDescricao.value;

    let livroAtualizado = {
        registroID: novoRegistro,
        tituloLivro: novoTitulo,
        descricaoLivro: novaDescricao
    }

    let listaLivros = JSON.parse(localStorage.getItem('Meus Livros'));
    let indiceEncontrado = listaLivros.findIndex((livro) => livro.registroID == registroID);

    listaLivros[indiceEncontrado] = livroAtualizado;

    let linhasTabela = document.querySelectorAll('.registros');
    
    for(let linha of linhasTabela){
        if(linha.id == registroID){
            let colunas = linha.children;
            console.log(colunas);

            //equivale ao registroID
            colunas[0].innerText = livroAtualizado.registroID;
            
            //equivale ao titulo do Livro
            colunas[1].innerText = livroAtualizado.tituloLivro;

            //equivale a descricao do livro
            colunas[2].innerText = livroAtualizado.descricaoLivro;

        }
    }

    localStorage.clear();
    salvarNoStorage(listaLivros);
    cancelarEdicao();
}
window.onload = () => {

    let xhr = new XMLHttpRequest;
    xhr.onload = renderiza;
    xhr.open('GET', 'http://localhost:3000/lugares_frequentes');
    xhr.send();

    let xhr1 = new XMLHttpRequest;
    xhr1.onload = atualizaVisor;
    xhr1.open('GET', `http://localhost:3000/lugares_frequentes?id=1`);
    xhr1.send();

    let xhr2 = new XMLHttpRequest;
    xhr2.onload = renderizaUsuario;
    xhr2.open('GET', `http://localhost:3000/usuarios`);
    xhr2.send();

    //Manipula em tempo real manipulação do usuário com os elementos criados dinamicamente
    //Utiliza JQuery
    $(document).on("click", ".componenteLugar", () => {

        let query = event.target.value;
        let xhr = new XMLHttpRequest;
        xhr.onload = atualizaVisor;
        xhr.onload = renderizaLugar;
        xhr.open('GET', `http://localhost:3000/lugares_frequentes?id=${query}`);
        xhr.send();
    });

    // Função para atualizar o visor
    $(document).on("click", ".componenteLugar", () => {
        let query = event.target.value;
        let xhr = new XMLHttpRequest;
        xhr.onload = atualizaVisor;
        xhr.open('GET', `http://localhost:3000/lugares_frequentes?id=${query}`);
        xhr.send();
    });

}

const myId = 1;

function renderiza() {

    // Pego a tabela de lugares
    let table = document.querySelector(".table-lugaresFrequentes");

    // Pega objeto de lugares frequentes
    let lugaresFrequentes = JSON.parse(this.responseText);

    // Código HTML dos casos locais do usuário
    let h2CasosTotais = document.querySelector('#total > h2');
    let casosTotais = 0;

    let usuariosLocais;
    let code;
    for (let i = 0; i < lugaresFrequentes.length; i++) {

        usuariosLocais = 0;
        //Retorna os usuarios daquele local
        for (let j = 0; j < lugaresFrequentes[i].usuarios_relacionados.length; j++) {
            usuariosLocais = lugaresFrequentes[i].usuarios_relacionados[j].id_usuario;

            if (usuariosLocais === myId) {
                code = `<li
                    class="componenteLugar list-group-item d-flex list-group-item-action justify-content-between align-items-center" value="${lugaresFrequentes[i].id}">
                    ${lugaresFrequentes[i].nome}
                </li>`
                table.innerHTML += code;

                //Atualizar os casos totais no dashboard do usuário;
                casosTotais += parseInt(lugaresFrequentes[i].casos.length);
            }
        }

        h2CasosTotais.innerText = casosTotais;
    }


}

function atualizaVisor() {
    // Dados Vindos do banco de dados JSON
    let dados = JSON.parse(this.responseText);

    //Seleciono todos os elementos html que irei trabalhar dentro do meu visor
    let h2CasosProximos = document.querySelector('#proximos > h2');
    let h2CasosSuspeitos = document.querySelector('#suspeitos > h2');
    let h2CasosCertos = document.querySelector('#certos > h2');

    //Seleciona no visor o nome do lugar 
    let h2NomeLugar = document.getElementById('nomeLugar');

    //query no nome do lugar
    let nomeLugar = dados[0].nome;

    //Irei carregar os dados daquele elemento em uma variável 
    let casosProximos = 0;
    let casosSuspeitos = 0;
    let casosCertos = 0;
    for (let i = 0; i < dados[0].casos.length; i++) {
        casosProximos++;
        if (dados[0].casos[i].tipo === 'sintomas') casosSuspeitos++;
        if (dados[0].casos[i].tipo === 'confirmado') casosCertos++;
    }

    //Atualiza os dados na tela
    h2CasosProximos.innerText = casosProximos;
    h2CasosSuspeitos.innerText = casosSuspeitos;
    h2CasosCertos.innerText = casosCertos;
    h2NomeLugar.innerText = nomeLugar;
}

function renderizaLugar() {

    // Pega a div tela
    let tela = document.querySelector(".componente-lugarFrequente");

    let lugar = JSON.parse(this.responseText);

    let casosConfirmados = 0;
    let casosSuspeitos = 0;

    for (let i = 0; i < lugar[0].casos.length; i++) {
        if (lugar[0].casos[i].tipo === 'confirmado') casosConfirmados++;
        if (lugar[0].casos[i].tipo === 'sintomas') casosSuspeitos++;
    }

    let code = `
    <div class="card-body">
        <h5 class="card-title">${lugar[0].nome}</h5>
        <p class="card-text">Nome: ${lugar[0].nome} </p>
        <p class="card-text">Estado: ${lugar[0].estado} </p>
        <p class="card-text">Cidade: ${lugar[0].cidade} </p>
        <p class="card-text">CEP: ${lugar[0].cep} </p>
        <p class="card-text">Casos Confirmados: ${casosConfirmados}</p>
        <p class="card-text">Casos Suspeitos: ${casosSuspeitos} </p>
        <div class="box-buttonCrud">
            <button type="button" class="btn btn-warning editar"><i
                    class="fa fa-edit"></i></button>
            <button type="button" class="btn btn-danger excluir"><i
                    class="fa fa-trash"></i></button>
        </div>
    </div> 
    `

    tela.innerHTML = code;
}

function renderizaUsuario() {
    //Pegar o h2 onde tenho o usuario
    let h2NomeUsuario = document.getElementById('nomeUsuario');

    let dados = JSON.parse(this.responseText);

    let nomeUsuario;
    for (let i = 0; i < dados.length; i++) {
        if (myId === dados[i].id) nomeUsuario = dados[i].nome;
    }

    h2NomeUsuario.innerText = nomeUsuario;
}
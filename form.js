window.onload = () => {
    let xhr = new XMLHttpRequest;
    xhr.onload = mostraLugares;
    xhr.open('GET', `http://localhost:3000/lugares_frequentes`);
    xhr.send();

    // Requisição para pegar o usuário corrente
    let xhr3 = new XMLHttpRequest;
    xhr3.onload = viewBagUsuario;
    xhr3.open('GET', `http://localhost:3000/usuarios?id=${myId}`);
    xhr3.send();

    let opcao = document.getElementById('lugarExistente');

    opcao.addEventListener("change", () => {
        xhr1 = new XMLHttpRequest;
        xhr1.onload = atualizaCampos;
        xhr1.open('GET', `http://localhost:3000/lugares_frequentes?id=${event.target.value}`);
        xhr1.send();
    });

    adicionarLugar.onsubmit = () => {
        // Faz requisição e chama função de adicionar lugar
        event.preventDefault();
        xhr2 = new XMLHttpRequest;
        xhr2.onload = funcAdicionarLugar;
        xhr2.open('GET', `http://localhost:3000/lugares_frequentes`);
        xhr2.send();
    }

}

const myId = 1;

function viewBagUsuario() {

    let usuario = JSON.parse(this.responseText);

    let currentUsuario = usuario[0];

    localStorage.setItem('username', currentUsuario.login);
    localStorage.setItem('lugaresFrequentes', currentUsuario.lugares_frequentes);
    localStorage.setItem('caso', currentUsuario.caso);
}


function funcAdicionarLugar() {

    // Pego os dados
    let nome = document.getElementById('nomeLugar').value;
    let estado = document.getElementById('estado').value;
    let cidade = document.getElementById('cidade').value;
    let cep = document.getElementById('cep').value;

    let dados = JSON.parse(this.responseText);
    let qntId = dados.length;

    let caso = localStorage.getItem('caso');

    let json;
    let lugar;
    // Verificar se o lugar já existe
    let i = 0;
    let achou = 0
    while (achou != 1 && i < dados.length) {
        if (nome === dados[i].nome) {
            achou = 1;
        } else {
            i++;
        }
    }
    if (achou) {
        lugar = {
            "id": dados[i].id,
            "usuarios_relacionados": dados[i].usuarios_relacionados.push(
                {
                    "id_usuario" : myId
                }
            ),
            "nome": dados[i].nome,
            "estado": dados[i].estado,
            "cidade": dados[i].cidade,
            "cep": dados[i].cep,
            "casos": dados[i].casos.push(
                {
                    "id_usuario" : myId,
                    "tipo" : caso
                }
            )
        }

        let dadosAux = dados.splice(i-1, 1);
        dadosAux[i] = lugar;

        json = JSON.stringify(dadosAux);
    } else {
        // Pegar o novo Id
        qntId = dados.length + 1;
        // Cria um novo lugar
        lugar =
        {
            "id": qntId,
            "usuarios_relacionados": [
                {
                    "id_usuario": myId
                }
            ],
            "nome": nome,
            "estado": estado,
            "cidade": cidade,
            "cep": cep,
            "casos": [
                {
                    "id_usuario": myId,
                    "tipo": caso
                }
            ]
        }
        json = JSON.stringify(dados);
    }

    // Mandar pra API
    xhr = new XMLHttpRequest;
    xhr.open('POST', `http://localhost:3000/lugares_frequentes`);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.send(json);

}

function mostraLugares() {
    // Pego o retorno da requisição GET
    let dados = JSON.parse(this.responseText);

    // Selecionar a tela dos lugares
    let tela = document.querySelector('.custom-select');
    // Percorrer os dados retornados;
    for (let i = 0; i < dados.length; i++) {
        // Codigo de opções 
        let code = `
        <option value="${dados[i].id}">${dados[i].nome}</option>
        `

        tela.innerHTML += code;
    }
}

function atualizaCampos() {
    // Dados vindos do JSON
    let dados = JSON.parse(this.responseText);

    // Pegar o lugar
    let lugarSelecionado = dados[0];

    // Carregar no formulário
    let nome = lugarSelecionado.nome;
    let inputNome = document.getElementById('nomeLugar');
    inputNome.value = nome;

    let cidade = lugarSelecionado.cidade;
    let inputCidade = document.getElementById('cidade');
    inputCidade.value = cidade;

    let estado = lugarSelecionado.estado;
    let inputEstado = document.getElementById('estado');
    inputEstado.value = estado;

    let cep = lugarSelecionado.cep;
    let inputCep = document.getElementById('cep');
    inputCep.value = cep;
}


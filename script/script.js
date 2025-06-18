document.addEventListener('DOMContentLoaded', () => {
    //salvando todos os id's do html
    const btnRegistrar = document.getElementById('btnRegistrar');
    const formularioVoluntario = document.getElementById('formularioVoluntario');
    const idVoluntarioInput = document.getElementById('idVoluntario');
    const disponibilidadeFimSemanaInput = document.getElementById('disponibilidadeFimSemana');
    const areaInteresseInput = document.getElementById('areaInteresse');
    const numeroEventosInput = document.getElementById('numeroEventos');
    const corpoTabelaVoluntarios = document.querySelector('#tabelaVoluntarios tbody');
    const nomeInput = document.getElementById('nome');
    

    let voluntarios = [];

    //Função para listar os voluntarios
    const listarVoluntarios = () => {
        const voluntariosArmazenados = localStorage.getItem('voluntarios');
        if (voluntariosArmazenados) {
            voluntarios = JSON.parse(voluntariosArmazenados);//criando json de voluntarios
        }
        imprimirVoluntarios();
    };
    //função apenas para salvar JSON
    const salvarJSON = () => {
        localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
    };

    const imprimirVoluntarios = () => {
        corpoTabelaVoluntarios.innerHTML = '';
        voluntarios.forEach(voluntario => {
            const linha = corpoTabelaVoluntarios.insertRow();
            linha.innerHTML = `
                <td data-label="Voluntário">${voluntario.nome}</td>
                <td data-label="Área">${voluntario.areaInteresse}</td>
                <td data-label="Eventos">${voluntario.numeroEventos}</td>
                <td data-label="Fins de Semana">${voluntario.disponibilidadeFimSemana ? 'Sim' : 'Não'}</td>
                <td data-label="Envolvimento">${voluntario.nivelEnvolvimento}</td>
                <td data-label="Ações" class="actions">
                    <button onclick="editarVoluntario('${voluntario.id}')">Editar</button>
                    <button class="excluir" onclick="excluirVoluntario('${voluntario.id}')">Excluir</button>
                </td>
            `;
        });
    };

    //classificação de nivel
    const classificarNivelEnvolvimento = (numEventos, temDisponibilidadeFimSemana) => {
        let nivel = '';
        if (numEventos >= 1 && numEventos <= 2) {
            nivel = 'Baixo';
        } else if (numEventos >= 3 && numEventos <= 5) {
            nivel = 'Médio';
        } else if (numEventos > 5) {
            nivel = 'Alto';
        }

        if (temDisponibilidadeFimSemana && nivel !== 'Alto') {
            switch (nivel) {
                case 'Baixo':
                    nivel = 'Médio';
                    break;
                case 'Médio':
                    nivel = 'Alto';
                    break;
            }
        }
        return nivel;
    };

    window.editarVoluntario = (id) => {
        const voluntario = voluntarios.find(v => v.id === id);
        if (voluntario) {
            idVoluntarioInput.value = voluntario.id;
            nomeInput.value = voluntario.nome;
            areaInteresseInput.value = voluntario.areaInteresse;
            numeroEventosInput.value = voluntario.numeroEventos;
            disponibilidadeFimSemanaInput.checked = voluntario.disponibilidadeFimSemana;
            btnRegistrar.textContent = 'Atualizar Voluntário';
        }
    };

    const idUnico = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    //evento para gerar um formulario com id unico para cada 
    formularioVoluntario.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = idVoluntarioInput.value;
        const nome = nomeInput.value;
        const areaInteresse = areaInteresseInput.value;
        const numeroEventos = parseInt(numeroEventosInput.value);
        const disponibilidadeFimSemana = disponibilidadeFimSemanaInput.checked;
        const nivelEnvolvimento = classificarNivelEnvolvimento(numeroEventos, disponibilidadeFimSemana);

        if (id) {
            const indice = voluntarios.findIndex(v => v.id === id);
            if (indice !== -1) {
                voluntarios[indice] = { id, nome, areaInteresse, numeroEventos, disponibilidadeFimSemana, nivelEnvolvimento };
            }
            btnRegistrar.textContent = 'Clique para Registrar';
        } else {
            const novoVoluntario = {
                id: idUnico(),
                nome,
                areaInteresse,
                numeroEventos,
                disponibilidadeFimSemana,
                nivelEnvolvimento
            };
            voluntarios.push(novoVoluntario);
        }

        salvarJSON();
        imprimirVoluntarios();
        formularioVoluntario.reset();
        idVoluntarioInput.value = '';
    });

    window.excluirVoluntario = (id) => {
        if (confirm('Realmente quer excluir o voluntário?')) {
            voluntarios = voluntarios.filter(v => v.id !== id);
            salvarJSON();
            imprimirVoluntarios();
        }
    };

    listarVoluntarios();
});
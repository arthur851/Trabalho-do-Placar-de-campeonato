const buttonCadastro = document.querySelector("#cadastrar");
const listaTimes = document.querySelector("#listaTimes");

class Time {
    constructor(nome, sigla, vitorias, empates, derrotas) {
        this.nome = nome;
        this.sigla = sigla;
        this.vitorias = vitorias;
        this.empates = empates;
        this.derrotas = derrotas;
        this.golspro = 0;
        this.golscontra = 0;
        this.saldoGols = 0;
        this.pontos = 0;
    } 
    calcularPontos(golspro = 0, golscontra = 0) {
        this.pontos = this.vitorias * 3 + this.empates;
        this.golspro += golspro;
        this.golscontra += golscontra;
        this.saldoGols = this.golspro - this.golscontra;
    }
    toString() {
        return `Time: ${this.nome} (${this.sigla}) - Vitórias: ${this.vitorias}, Empates: ${this.empates}, Derrotas: ${this.derrotas}, Pontos: ${this.pontos}`;
    }
}
class Champmanager {
    constructor() {
        this.times = [];
    }
    listarTimes(time) {
        const tr = document.createElement("tr");
        const tdNome = document.createElement("td");
        const tdSigla = document.createElement("td");
        const tdBotoes = document.createElement("td");
        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.classList.add("btnRemover");
        tdNome.textContent = time.nome;
        tdSigla.textContent = time.sigla;
        tdBotoes.appendChild(btnRemover);
        tr.appendChild(tdNome);
        tr.appendChild(tdSigla);
        tr.appendChild(tdBotoes);
        listaTimes.appendChild(tr);
    }
    atualizarLista() {
        listaTimes.innerHTML = `
                <tr>
                    <th>Nome do time</td>
                    <th>Sigla do time</td>
                    <th>Opções</th>
                </tr>
            `;
            this.times.forEach((time) => {
            this.listarTimes(time);
            });
    }
    adicionarTime(nome, sigla, vitorias = 0, empates = 0, derrotas = 0) {
        const time = new Time(nome, sigla, vitorias, empates, derrotas);
        for (let t = 0; t < this.times.length; t++) {
        if (this.times[t].nome === nome || this.times[t].sigla === sigla) {
            return alert("Time já cadastrado!");
        }
        }
        time.calcularPontos();
        this.times.push(time);
        this.listarTimes(time);
        this.adicionarOpSelect(time);
    }
    adicionarOpSelect(time) {
        const selectTime1 = document.querySelector("#time1");
        const selectTime2 = document.querySelector("#time2");
        const option1 = document.createElement("option");
        option1.value = time.sigla;
        option1.textContent = time.nome;
        const option2 = document.createElement("option");
        option2.value = time.sigla;
        option2.textContent = time.nome;
        selectTime1.appendChild(option1);
        selectTime2.appendChild(option2);
    }atualizarSelects() {
        const select1 = document.querySelector("#time1");
        const select2 = document.querySelector("#time2");
        select1.innerHTML = '<option value="">Selecione</option>';
        select2.innerHTML = '<option value="">Selecione</option>';
        manager.times.forEach(time => {
            const op1 = document.createElement("option");
            op1.value = time.sigla;
            op1.textContent = time.nome;
            const op2 = op1.cloneNode(true);
            select1.appendChild(op1);
            select2.appendChild(op2);
        });
    }
    atualizarClassificacao() {
        const tabelaClassificacao = [...this.times]
        tabelaClassificacao.sort((a, b) => {
            if (b.pontos !== a.pontos)
                return b.pontos - a.pontos;
            if (b.saldoGols !== a.saldoGols)
                return b.saldoGols - a.saldoGols;
            if (b.golspro !== a.golspro)
                return b.golspro - a.golspro;
            return a.nome.localeCompare(b.nome);
        });
        const tabela = document.querySelector("#clasificacao");
        tabela.innerHTML = `
            <tr>
                <th>Posição</th>
                <th>Nome do time</th>
                <th>Jogos disputados</th>
                <th>Vitórias</th>
                <th>empates</th>
                <th>derrotas</th>
                <th>Gols pró</th>
                <th>gols contra</th>
                <th>saldo de gols</th>
                <th>Pontuação total</th>
            </tr>
        `;
        tabelaClassificacao.forEach((time, index) => {
            const tr = document.createElement("tr");
            if(index === 0){
                tr.classList.add("lider");
            }if(index === tabelaClassificacao.length - 1){
                tr.classList.add("lanterna");
            }
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${time.nome}</td>
                <td>${time.vitorias + time.empates + time.derrotas}</td>
                <td>${time.vitorias}</td>
                <td>${time.empates}</td>
                <td>${time.derrotas}</td>
                <td>${time.golspro}</td>
                <td>${time.golscontra}</td>
                <td>${time.saldoGols}</td>
                <td>${time.pontos}</td>
            `;
            tabela.appendChild(tr);
        });
    }
    registrarPartida(time1, time2, golsTime1, golsTime2) {
        if (golsTime1 < 0 || golsTime2 < 0) {
            return alert("O número de gols não pode ser negativo!");
        }else if (isNaN(golsTime1) || isNaN(golsTime2)) {
            return alert("Por favor, insira valores numéricos válidos para os gols.");
        }else{
            const t1 = this.times.find((t) => t.sigla === time1);
            const t2 = this.times.find((t) => t.sigla === time2);
            const historico = document.querySelector('#Historico_partidas')
            if (t1 && t2) {
            if (t1 === t2) {
                return alert("Selecione dois times diferentes!");
            }
            if (golsTime1 > golsTime2) {
                t1.vitorias++;
                t2.derrotas++;
            } else if (golsTime1 === golsTime2) {
                t1.empates++;
                t2.empates++;
            } else {
                t1.derrotas++;
                t2.vitorias++;
            }
            t1.calcularPontos(Number(golsTime1), Number(golsTime2));
            t2.calcularPontos(Number(golsTime2), Number(golsTime1));
            this.atualizarClassificacao();
            historico.innerHTML += `
            <tr>
                <td>${time1}</td>
                <td>${golsTime1}</td>
                <td>X</td>
                <td>${golsTime2}</td>
                <td>${time2}</td>
            </tr>`
        } else {
            if (!t1) {
                alert(`Time ${time1} não encontrado!`);
            } else if (!t2) {
                alert(`Time ${time2} não encontrado!`);
            }
            }
        }
    }
}
const manager = new Champmanager();
const formulario = document.querySelector("#cadastroTimes");
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.querySelector("#nome");
    const sigla = document.querySelector("#sigla");
    if (nome.value && sigla.value) {
        manager.adicionarTime(nome.value, sigla.value);
        manager.atualizarClassificacao()
        nome.value = "";
        sigla.value = "";
    }else{
        alert("Preencha todos os campos")
    }
});
const tabela = document.querySelector("#listaTimes");
tabela.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btnRemover")) return;
    const linha = e.target.closest("tr");
    const sigla = linha.cells[1].textContent;
    manager.times = manager.times.filter(time => time.sigla !== sigla);
    linha.remove();
    manager.atualizarClassificacao();
    manager.atualizarLista();
    manager.atualizarSelects();
});
const registrar = document.querySelector("#registrar");
registrar.addEventListener("click", () => {
    const time1 = document.querySelector("#time1").value;
    const time2 = document.querySelector("#time2").value;
    const gols1 = document.querySelector("#gols1").value;
    const gols2 = document.querySelector("#gols2").value;
    if(!time1 || !time2 || isNaN(gols1) || isNaN(gols2) ||gols1 < 0 || gols2 < 0 || gols1 === "" || gols2 === ""){
        return alert("Preencha todos os campos corretamente!");
    }else{
        manager.registrarPartida(time1, time2, Number(gols1), Number(gols2));
        document.querySelector("#gols1").value = "";
        document.querySelector("#gols2").value = "";
        const paragraf = document.querySelector("#menssagem")
        paragraf.textContent = ("PARTIDA REGISTRADA")
    }
    manager.atualizarClassificacao();
});
const sectionCadastro = document.querySelector("#cadastro");
const sectionRegPartidas = document.querySelector("#regPartidas");
const sectionClassificacao = document.querySelector("#tabelaClassificacao");
const linkCadastro = document.querySelector("#linkforcadastro");
const linkRegPartidas = document.querySelector("#linkforregPartidas");
const linkClassificacao = document.querySelector("#linkfortabelaClassificacao");
linkCadastro.addEventListener("click", () => {
    sectionCadastro.style.display = "block";
    sectionRegPartidas.style.display = "none";
    sectionClassificacao.style.display = "none";
});
linkRegPartidas.addEventListener("click", () => {
    sectionCadastro.style.display = "none";
    sectionRegPartidas.style.display = "block";
    sectionClassificacao.style.display = "none";
});
linkClassificacao.addEventListener("click", () => {
    sectionCadastro.style.display = "none";
    sectionRegPartidas.style.display = "none";
    sectionClassificacao.style.display = "block";
});
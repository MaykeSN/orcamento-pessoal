
document.getElementById('register').addEventListener('click', registerExpense);

function registerExpense(){
    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    const expense = new Expense(ano, mes, dia, tipo, descricao, valor);
    if(expense.validate())
    {
        let bd = new BD();
        bd.save(expense); 
        document.getElementById(`modal_title`).innerHTML = 'Sucesso';
        document.getElementById(`modal_content`).innerHTML = 'Despesa adicionada com sucesso!';
        document.getElementById(`modal_btn`).innerHTML = 'Voltar';
        document.getElementById(`modal_header`).className = 'modal-header text-success';
        document.getElementById(`modal_btn`).className = 'btn btn-success';
        $("#sucessoGravacao").modal('show');
    }
    else{
        document.getElementById(`modal_title`).innerHTML = 'Erro na inclusao do registro';
        document.getElementById(`modal_content`).innerHTML = 'Ha campos obrigatorios que nao foram preenchidos';
        document.getElementById(`modal_btn`).innerHTML = 'Voltar e corrigir';
        document.getElementById(`modal_header`).className = 'modal-header text-danger';
        document.getElementById(`modal_btn`).className = 'btn btn-danger';
        $("#sucessoGravacao").modal('show');
    }
}

class Expense {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validate(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false;
            }
        }

        return true;
    }
}

class BD {

    constructor(){
        let id = localStorage.getItem('id');

        if(id === null){
            localStorage.setItem('id', 0);
        }
    }

    getNextId(){
        let nextId = localStorage.getItem('id');

        var nextNumber = parseInt(nextId) + 1;
        return nextNumber;
    }

    save(expense){

        var id = this.getNextId();
        localStorage.setItem('id', id);
        localStorage.setItem(id , JSON.stringify(expense))
    }
}

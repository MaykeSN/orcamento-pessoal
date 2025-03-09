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
    
    getAllExpenses(){
        let id = localStorage.getItem('id');

        let expenses = Array();

        for (let i = 1; i <= id; i++){
            
            if(localStorage.getItem(i)){
                let expense = JSON.parse(localStorage.getItem(i));
                expense.id = i;
                expenses.push(expense);
            }
        }

        return expenses;
    }

    search(expense){
        let filteredExpenses = Array();
        filteredExpenses = this.getAllExpenses();

        if(expense.ano != '')
            filteredExpenses = filteredExpenses.filter(ex => ex.ano == expense.ano);
        
        if(expense.mes != '')        
            filteredExpenses = filteredExpenses.filter(ex => ex.mes == expense.mes);
        
        if(expense.dia != '')
            filteredExpenses = filteredExpenses.filter(ex => ex.dia == expense.dia);
        
        if(expense.tipo != '')
            filteredExpenses = filteredExpenses.filter(ex => ex.tipo == expense.tipo);
        
        if(expense.descricao != '')
            filteredExpenses = filteredExpenses.filter(ex => ex.descricao == expense.descricao);

        if(expense.valor != '')
            filteredExpenses = filteredExpenses.filter(ex => ex.valor == expense.valor);

        return filteredExpenses;
    }

    delete(id){
        localStorage.removeItem(id);
    }
}


const bd = new BD();

function registerExpense(){

    let ano = document.getElementById("ano");
    let mes = document.getElementById("mes");
    let dia = document.getElementById("dia");
    let tipo = document.getElementById("tipo");
    let descricao = document.getElementById("descricao");
    let valor = document.getElementById("valor");

    const expense = new Expense(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);
    if(expense.validate())
    {
        
        bd.save(expense); 
        document.getElementById(`modal_title`).innerHTML = 'Sucesso';
        document.getElementById(`modal_content`).innerHTML = 'Despesa adicionada com sucesso!';
        document.getElementById(`modal_btn`).innerHTML = 'Voltar';
        document.getElementById(`modal_header`).className = 'modal-header text-success';
        document.getElementById(`modal_btn`).className = 'btn btn-success';

        ano.value ='';
        mes.value ='';
        dia.value ='';
        tipo.value ='';
        descricao.value ='';  
        valor.value ='';


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


function loadListExpenses(filteredExpenses = Array(), filter = false){
    let expenses = Array();
    if(filteredExpenses.length == 0 && filter == false)
        expenses = bd.getAllExpenses();
    else
        expenses = filteredExpenses;

    let tbody = document.getElementById('list_expenses');
    tbody.innerHTML = '';
    expenses.forEach(expense => {
        let row = tbody.insertRow()
        row.insertCell(0).innerHTML = `${expense.dia}/${expense.mes}/${expense.ano}`;

        switch(expense.tipo){
            case '1':
                expense.tipo = 'Alimentacao';
                break;
            case '2':
                expense.tipo = 'Educacao';
                break;
            case '3':
                expense.tipo = 'Lazer';
                break;
            case '4':
                expense.tipo = 'Saude';
                break;
            case '5':
                expense.tipo = 'Transporte';
                break;
        }

        row.insertCell(1).innerHTML = expense.tipo;
        row.insertCell(2).innerHTML = expense.descricao;
        row.insertCell(3).innerHTML = expense.valor;

        let btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_expense_${expense.id}`;
        btn.onclick = function(){
            let id = this.id.replace('id_expense_', '');

            console.log(`removendo o id:`, id);
            bd.delete(id);
            window.location.reload();
        }
        row.insertCell(4).append(btn
        );
    });
}

function searchExpenses(){
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;


    let expense = new Expense(ano, mes, dia, tipo, descricao, valor);
    let filteredExpenses = bd.search(expense);

    loadListExpenses(filteredExpenses, true);
}
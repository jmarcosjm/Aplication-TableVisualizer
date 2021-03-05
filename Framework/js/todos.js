onload = () => {
    getToDos();
    sideMenuAnimationHandler();
    elementsPerPageHandler(tableToDoRender);
    filterCallerInit()
}

function getToDos(){ //Faz a requisição para o endpoit "todos"
    const screen = document.getElementById("screen");
    const dataType = "todos";
    screen.className = dataType;
    getData(dataType).then((e) => {
        localStorage.setItem("data",JSON.stringify(e));
        tableToDoRender(1,e);
    })

}

window.onresize = function(){ //Renderiza a tabela sempre que a viewport mudar
    tableToDoRender(actualPage,JSON.parse(localStorage.getItem("data")));
}

let actualPage;
let limitItems = 10;
let toDoTotalPages = 0;
function tableToDoRender(page,data){ //Renderiza a tabela To-Do
    actualPage = page;
    const modalCase = document.getElementById("modalCase");
    const count = (page * limitItems) - limitItems;
    toDoTotalPages = Math.ceil(data.length / limitItems);
    const delimiter = count + limitItems;
    const tBody = document.getElementById("tBody");
    const screen = document.getElementById("screen");
    const cardCase = document.querySelector(".cardCase");
    cardCase.innerHTML = "";
    let tableVisual = window.visualViewport.width > 650;
    if(page <= toDoTotalPages){
        let taskStatus
        for(let i = count; i<delimiter; i++){
            if(i == count) viewportHandler(tableVisual);
            if(data[i] != null){
                taskStatus = "Pendente";
                if(data[i].completed == true) taskStatus = "Concluido"
                if(tableVisual){
                    tBody.innerHTML += `
                    <tr class = "t${i} line">
                    <td>${data[i].userId}</td>
                    <td>${data[i].id}</td>
                    <td>${data[i].title}</td>
                    <td>${taskStatus}</td>
                    </tr>
                    `;
                    modalCase.innerHTML += `
                    <div id="t${i}" class="modal">
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat"><i class="material-icons">close</i></a>
                    <div class="modal-content">
                    <div class="headModal"><p>Id do Usuário</p></div>
                    <p>${data[i].userId}</p>
                    <div class="headModal"><p>Id da Tarefa</p></div>
                    <p>${data[i].id}</p>
                    <div class="headModal"><p>Título</p></div>
                    <p>${data[i].title}</p>
                    <div class="headModal"><p>Situação</p></div>
                    <p>${taskStatus}</p>
                    </div> 
                    </div>
                    `
                }
                else{
                    cardCase.innerHTML += `
                        <div class="headCard">
                            <p>Id do Usuário: <span>${data[i].userId}</span></p>
                            <p>Id da Tarefa: <span>${data[i].id}</span></p>
                            <p>Título: <span>${data[i].title}</span></p>
                            <p>Situação: <span>${taskStatus}</span></p>
                        </div>
                    
                    `
                }

            } 
        }   
        if(tableVisual) modalInit();
        initializePagination(toDoTotalPages,tableToDoRender);
    }
    else{
        viewportHandler(tableVisual)
        initializePagination(postTotalPages, tableToDoRender);
    }
}
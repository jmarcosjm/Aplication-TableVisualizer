onload = () => {
    getPosts();
    sideMenuAnimationHandler();
    elementsPerPageHandler(tablePostRender);
    filterCallerInit()
}

function getPosts(){ //Faz a requisição para o endpoit "posts"
    const screen = document.getElementById("screen");
    const dataType = "posts";
    screen.className = dataType;
    getData(dataType).then((e) => {
        localStorage.setItem("data",JSON.stringify(e));
        tablePostRender(1,e)
    })
}

window.onresize = function(){ //Renderiza a tabela sempre que a viewport mudar
    tablePostRender(actualPage,JSON.parse(localStorage.getItem("data")));
}


let actualPage;
let limitItems = 10;
let postTotalPages = 0;
function tablePostRender(page,data){ //Renderiza a tabela Posts
    actualPage = page;
    const modalCase = document.getElementById("modalCase");
    const count = (page * limitItems) - limitItems;
    postTotalPages = Math.ceil(data.length / limitItems);
    const delimiter = count + limitItems;
    const tBody = document.getElementById("tBody");
    const screen = document.getElementById("screen");
    const cardCase = document.querySelector(".cardCase");
    cardCase.innerHTML = "";
    const tableVisual = window.visualViewport.width > 650;
    if(page <= postTotalPages){
        for(let i = count; i<delimiter; i++){
            if(i == count) viewportHandler(tableVisual)
            if(data[i] != null){
                if(tableVisual){
                   
                    tBody.innerHTML += `
                    <tr class = "t${i} line">
                        <td>${data[i].userId}</td>
                        <td>${data[i].id}</td>
                        <td>${data[i].title}</td>
                        <td>${data[i].body}</td>
                    </tr>
                    `;
                    modalCase.innerHTML += `
                    <div id="t${i}" class="modal">
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat"><i class="material-icons">close</i></a>
                    <div class="modal-content">
                    <div class="headModal"><p>Id do Usuário</p></div>
                    <p>${data[i].userId}</p>
                    <div class="headModal"><p>Id da Postagem</p></div>
                    <p>${data[i].id}</p>
                    <div class="headModal"><p>Título</p></div>
                    <p>${data[i].title}</p>
                    <div class="headModal"><p>Conteúdo</p></div>
                    <p>${data[i].body}</p>
                    </div> 
                    </div>
                    `
                }
                else{
                    cardCase.innerHTML += `
                        <div class="headCard">
                            <p>Id do Usuário: <span>${data[i].userId}</span></p>
                            <p>Id da Postagem: <span>${data[i].id}</span></p>
                            <p>Título: <span>${data[i].title}</span></p>
                            <p>Conteúdo: <span>${data[i].body}</span></p>
                        </div>
                    `
                }
            } 
        }   
        if(tableVisual) modalInit();
        initializePagination(postTotalPages, tablePostRender);
    }
    else{
        viewportHandler(tableVisual)
        initializePagination(postTotalPages, tablePostRender);
    }
}
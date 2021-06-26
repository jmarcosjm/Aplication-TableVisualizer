onload = () => {
    getAlbums();
    sideMenuAnimationHandler();
    elementsPerPageHandler(tableAlbumRender);
    filterCallerInit()
}

function getAlbums(){ //Faz a requisição para o endpoit "albums"
    const screen = document.getElementById("screen");
    const dataType = "albums";
    screen.className = dataType;
    getData(dataType).then((e) => {
        localStorage.setItem("data",JSON.stringify(e));
        tableAlbumRender(1,e);
    })
}

window.onresize = function(){ //Renderiza a tabela sempre que a viewport mudar
    tableAlbumRender(actualPage,JSON.parse(localStorage.getItem("data")));
}


let actualPage;
let limitItems = 10;
let albumTotalPages = 0;
function tableAlbumRender(page,data){ //Renderiza a tabela Albuns
    actualPage = page;
    const modalCase = document.getElementById("modalCase");
    const count = (page * limitItems) - limitItems;
    albumTotalPages = Math.ceil(data.length / limitItems);
    const delimiter = count + limitItems;
    const tBody = document.getElementById("tBody");
    const screen = document.getElementById("screen");
    const cardCase = document.querySelector(".cardCase");
    cardCase.innerHTML = "";
    let tableVisual = window.visualViewport.width > 650;
    if(page <= albumTotalPages){
        for(let i = count; i<delimiter; i++){
            if(i == count) viewportHandler(tableVisual)
            if(data[i] != null){
                if(tableVisual){
                    tBody.innerHTML += `
                    <tr class = "t${i} line">
                        <td>${data[i].userId}</td>
                        <td>${data[i].id}</td>
                        <td>${data[i].title}</td>
                    </tr>
                    `;
                    modalCase.innerHTML += `
                    <div id="t${i}" class="modal">
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat"><i class="material-icons">close</i></a>
                    <div class="modal-content">
                    <div class="headModal"><p>Id do Usuário</p></div>
                    <p>${data[i].userId}</p>
                    <div class="headModal"><p>Id do Album</p></div>
                    <p>${data[i].id}</p>
                    <div class="headModal"><p>Título</p></div>
                    <p>${data[i].title}</p>
                    </div> 
                    </div>
                    `
                }
                else{
                    cardCase.innerHTML += `
                   
                        <div class="headCard">
                            <p>Id do Usuário: <span>${data[i].userId}</span></p>
                            <p>Id do Album: <span>${data[i].id}</span></p>
                            <p>Título: <span>${data[i].title}</span></p>
                        </div>
                    
                    `
                }
            } 
        }   
        if(tableVisual) modalInit();
        initializePagination(albumTotalPages, tableAlbumRender);
    } 
    else{
        viewportHandler(tableVisual)
        initializePagination(postTotalPages, tableAlbumRender);
    }
}
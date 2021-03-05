document.addEventListener("DOMContentLoaded", function() { //Inicializa o input select do materializecss
    const elems = document.querySelectorAll("select");
    const instances = M.FormSelect.init(elems, "");
  });

async function getData(dataType){ //Faz a requisição para o endpoint "dataType" passado como parâmetro
    const response = await axios.get(`https://jsonplaceholder.typicode.com/${dataType}`);
    return response.data;
}

function sideMenuAnimationHandler(){ //Controla a animação o menu lateral mobile
    let menuToggle = document.getElementById("mMenu-toggle");
    let sideBar = document.getElementById("sideBar");
    menuToggle.onclick = (e) => {
        let view = 300;
        if(window.visualViewport.width <= 350) view = 220;
        if(menuToggle.getBoundingClientRect().left == 0){
            menuToggle.querySelector("i").innerHTML = "arrow_back";
            menuToggle.style.transform = `translateX(${view}px)`;
            sideBar.style.transform = `translateX(0px)`;
        }
        else{
            menuToggle.querySelector("i").innerHTML = "arrow_forward";
            menuToggle.style.transform = `translateX(0px)`;
            sideBar.style.transform = `translateX(-${view}px)`;
        } 
    }
}

function modalClose(){ //Fecha qualquer modal ativa
    const blankArea = document.getElementById("blankArea")
    document.querySelectorAll(".modal").forEach((n) => n.style.display = "none"); 
    blankArea.style.display = "none";
}

function modalInit(){ //inicializa as modals quando uma fileira da tabela for clicada 
    const modalCase = document.getElementById("modalCase");
    const tBody = document.getElementById("tBody");
    modalCase.querySelectorAll(".modal-close").forEach((n) => n.onclick = modalClose); 
    tBody.querySelectorAll("tr").forEach((n) => n.onclick = function() {
            document.getElementById(`${n.classList[0]}`).style.display = "block";
            document.getElementById("blankArea").style.display = "block"
        })
}

function elementsPerPageHandler(tableRender){//Redefine a paginação para se adequar ao novo limite de itens por pagina
    document.querySelector(".EPP").querySelector(".dropdown-content").querySelectorAll("li").forEach((n) => {
        n.onclick = function(){
            const pagination = document.querySelector(".pagination");
            limitItems = parseInt(n.querySelector("span").innerHTML);
            if(pagination.classList.contains("initializated")) pagination.classList.remove("initializated");
            tableRender(1,JSON.parse(localStorage.getItem("data")))
        }
    })
}

function initializePagination(totalPages,tableRender){//Inicializa a paginação, permitindo a renderização de novas "paginas" na tabela
    const pagination = document.querySelector(".pagination");
    if(!pagination.classList.contains("initializated")){
        paginationGenerator(totalPages)
        let pages = document.querySelectorAll(".page");
        pages.forEach((n) => n.onclick = function(){
            const data = JSON.parse(localStorage.getItem("data"));
            const page = parseInt(this.querySelector("a").innerHTML);
            if(this.classList.contains("goToLast")){
                paginationSkip(this, totalPages, totalPages)
                tableRender(totalPages,data)
            } 
            else if(this.classList.contains("goToFirst")){
                paginationSkip(this, 1, totalPages)
                tableRender(1,data)
            }
            else{
                paginationUpdate(this,totalPages);
                tableRender(page,data)
            }

        });
    }
}

function paginationGenerator(totalPages){//Gera os necessarios para a paginação
    const pagination = document.querySelector(".pagination");
    pagination.classList.add("initializated");
    pagination.innerHTML = `
    <li class="disabled goToFirst page"><a href="#!"><i class="fas fa-angle-double-left"></i></a></li>
    `;
    for(let j = 1; j <= totalPages && j <= 6; j++){
        let liClass = "waves-effect";
        if(j == 1) liClass = "active first";
        if(j == (totalPages<6?totalPages:6))  liClass = "last";
        pagination.innerHTML +=`
        <li id="p${j}" class="${liClass} page"><a href="#!">${j}</a></li>
        `;
    }
    pagination.innerHTML += `
    <li class="waves-effect goToLast page"><a href="#!"><i class="fas fa-angle-double-right"></i></a></li>
    `
    if(totalPages == 1) pagination.querySelector(".goToLast").classList.add("disabled");
}

function paginationUpdate(instance,totalPages){//Atualiza os 
    const pagination = document.querySelector(".pagination");
    const oldActive = pagination.querySelector(".active");
    const pages = document.querySelectorAll(".page");
    let sum = 0;
    let limit = pagination.querySelector("#p5");
    if(oldActive.id.charAt(1) > instance.id.charAt(1)) limit = pagination.querySelector("#p2");
    if(instance.id.charAt(1) == 1 && instance.querySelector("a").innerHTML != 1) sum = -1;
    else if(instance.id.charAt(1) == 6 && instance.querySelector("a").innerHTML != totalPages) sum = 1;
    let skip;
    if(instance.querySelector("a").innerHTML == 1 || instance.querySelector("a").innerHTML == totalPages || (instance.id.charAt(1) != 1 && instance.id.charAt(1) != 6)){
        oldActive.classList.remove("active");
        instance.classList.add("active");
    }
    else{  
        oldActive.classList.remove("active");
        limit.classList.add("active");
    }
    skip = pagination.querySelector(".goToFirst");
    if(instance.querySelector("a").innerHTML != 1){
        if(skip.classList.contains("disabled")) skip.classList.remove("disabled");
    } 
    else skip.classList.add("disabled");
    skip = pagination.querySelector(".goToLast");
    if(instance.querySelector("a").innerHTML != totalPages){
        if(skip.classList.contains("disabled")) skip.classList.remove("disabled");
    } 
    else skip.classList.add("disabled")
    pages.forEach((n) => {
        if(!(n.classList.contains("goToLast") || n.classList.contains("goToFirst"))) n.querySelector("a").innerHTML = parseInt(n.querySelector("a").innerHTML) + sum;
    });
}

function paginationSkip(instance, page, totalPages){//Trata os botões de skip da paginação
    const pagination = document.querySelector(".pagination");
    const oldActive = pagination.querySelector(".active");
    const pages = document.querySelectorAll(".page");
    let base;
    let skip;
    if(totalPages > 1){
        let nPages = 0;
        pages.forEach((n) => nPages++);
        nPages -= 3;
        instance.classList.add("disabled");
        oldActive.classList.remove("active");
        if(page == totalPages){
            pagination.querySelector(".last").classList.add("active");
            base = totalPages -nPages;
            skip = pagination.querySelector(".goToFirst");
            if(skip.classList.contains("disabled")) skip.classList.remove("disabled");
        }
        else{
            pagination.querySelector(".first").classList.add("active");
            base = 1;
            skip = pagination.querySelector(".goToLast");
            if(skip.classList.contains("disabled")) skip.classList.remove("disabled");
        }
        for(let i = base, j = 1; i <= base + nPages; i++, j++){
            pages[j].querySelector("a").innerHTML = i;
        }
    }
}

function filterCallerInit(){ // inicializa a tela de filtro e seus inputs
    const blankArea = document.getElementById("blankArea")
    const btn = document.getElementById("filterActivator");
    const modalFilter = document.getElementById("modalFilter");
    const taskSearch = modalFilter.querySelector(".taskSearch");
    const key = modalFilter.querySelector("#key");
    const dataType = document.getElementById("screen").className;
    key.disabled = true;
    btn.onclick = function(){
        modalFilter.style.display = "block";
        blankArea.style.display = "block";
    }
    modalFilter.querySelector(".modal-close").onclick = modalClose;
    blankArea.onclick = modalClose;
    document.querySelector("#filterSend").onclick = function(){
        getData(dataType).then((e) => {
            localStorage.setItem("data",JSON.stringify(e));
            filterHandler();
        });
        modalClose();
    }

    modalFilter.querySelector(".dropdown-content").querySelectorAll("li").forEach((n) => {
        const dataType = document.getElementById("screen").className;
        n.onclick = function(){   
            const option = n.querySelector("span").innerHTML;
            if(option == "Situação"){
                key.style.display = "none"
                taskSearch.style.display = "block"
            }
            else{
                key.disabled = false;
                key.style.display = ""
                if(dataType == "todos") taskSearch.style.display = "none"
                if(option == "Nenhum") key.disabled = true;
            }
        }  
    });
    
}

function filterHandler(){//Trata os dados obtidos pelos inputs dos filtros e realiza a chamada para pesquisa e ordenação
    const dataType = document.getElementById("screen").className;
    const modalFilter = document.getElementById("modalFilter");
    const pagination = document.querySelector(".pagination");
    let newData = JSON.parse(localStorage.getItem("data"));
    let keyType;
    let key = modalFilter.querySelector("#key").value;
    modalFilter.querySelector(".dropdown-content").querySelectorAll("li").forEach((n) => {
        const option = n.querySelector("span").innerHTML;
        if(n.classList.contains("selected")){//Verifica qual tipo de pesquisa deve ser realizada, e trata os dados para realizar a pesquisa
            if(option == "Id do Usuário"){
                keyType = "userId";
                key = parseInt(key);
            }
            else if(option == "Título") keyType = "title";
            else if(option in {"Id da Postagem":1, "Id do Album":1,"Id da Tarefa":1}){
                keyType = "id";
                key = parseInt(key);
            } 
            else if(option == "Situação"){
                keyType = "completed";
                key = document.querySelector(".switch").querySelector(".taskValue").checked;
            } 
            else if(option == "Conteúdo") keyType = "body";
        }
    });
    if(keyType){//Se o usuario nao tiver selecionado "nenhum" no campo de tipo de pesquisa, a pesquisa é chamada
        newData = search(newData,keyType,key);
    } 
    if(document.querySelector(".sortType").checked) newData = quicksort(newData,0,newData.length-1); //Se o usuario marcar ordenação decrescente, o quicksort é chamado
    localStorage.setItem("data",JSON.stringify(newData));
    pagination.classList.remove("initializated")
    switch(dataType){//Atualiza os dados da tabela, baseado no tipo da tabela
        case "posts":
            tablePostRender(1,newData);
            break;
        case "albums":
            tableAlbumRender(1,newData);
            break;
        case "todos":
            tableToDoRender(1,newData);
            break;
    }
}

function search(data,objectField,key){
    let newData = [];
    let atribute;
    if(typeof key === "string"){
        let index;
        key = key + " "
        for(let i = 0; i<data.length; i++){
            atribute = data[i][`${objectField}`];
            index = atribute.indexOf(key);
            if(index > -1 && (atribute.charAt(index + key.length - 1) == " " || atribute.charAt(index + key.length - 1) == "") && (atribute.charAt(index - 1) == " " || atribute.charAt(index - 1) == ""))
            {
                newData.push(data[i]);
            } 
        }
    }
    else{
        for(let i = 0; i<data.length; i++){
            if(data[i][`${objectField}`] == key) newData.push(data[i]);
        }
    }
   
    return newData;
}

function partition(newData, esq, dir) {
    let pivot = newData[Math.floor((dir + esq) / 2)];
    let i = esq; 
    let j = dir; 
    while (i <= j) {
        while (newData[i].id > pivot.id) {
            i++;
        }
        while (newData[j].id < pivot.id) {
            j--;
        }
        if (i <= j) {
            swap(newData, i, j);
            i++;
            j--;
        }
    }
    return i;
}

function quicksort(newData, esq, dir) { //Algoritmo de ordenação quicksort
    let index;
    if (newData.length > 1) {
        index = partition(newData, esq, dir);
        if (esq < index - 1) {
            quicksort(newData, esq, index - 1);
        }
        if (index < dir) {
            quicksort(newData, index, dir);
        }
    }
    return newData;
}

function swap(newData, i, j){ //Realiza a troca entre dois elementos do vetor de dados
    const temp = newData[i];
    newData[i] = newData[j];
    newData[j] = temp;
}

function viewportHandler(tableVisual){// modifica o estilo da tabela baseado na viewport
    if(tableVisual){
        document.querySelector("table").style.display = "table";
        document.querySelector(".instruction").style.display = "block";
        document.querySelector(".box").style.padding = "15px 15px";
        document.getElementById("screen").style.backgroundColor = "rgba(0, 0, 51, 0.849)"
        document.getElementById("tBody").innerHTML = "";
        document.getElementById("modalCase").innerHTML = "";
    }
    else{
        document.querySelector(".box").style.padding = 0;
        document.getElementById("screen").style.backgroundColor = "rgba(0, 0, 0, 0)"
        document.querySelector("table").style.display = "none";
        document.querySelector(".instruction").style.display = "none";
    }
}
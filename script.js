/**
 * Global Var
 */
let dialogBox; 
let formTodoItem;
let containerTodoItem;
let listTodoItem;
let newToDo;
let tri;
let filtre;

let triValue;
let filtreValue;

/**
 * Var Parti Bonus
 */

let displayedListTodoItem = {};

/**
 *  Dom ready call
 */
window.onload = ready;

/**
 * Functions called when the DOM is ready
 */
function ready(){
    loadFromLocalStorage();
    if (listTodoItem==null) listTodoItem = [];

    dialogBox = document.getElementById('ajoutlist');   
    containerTodoItem = document.getElementById('todolist')
    formTodoItem = document.querySelectorAll('input');
    tri = document.getElementById('tri')
    filtre = document.getElementById('filtreFait');

    //tri.value=triValue;
    //filtre.value=filtreValue;
    displayTodos()
}

function displayTodos() {
    // empty the list
    containerTodoItem.innerHTML = "";
    for(item of listTodoItem) {
        if (filtreValue == "done_done"){
            if (item.fini){
                containerTodoItem.appendChild(writeTodoItem(item));
            }
        }else if (filtreValue == "done_not"){
            if (!item.fini){
                containerTodoItem.appendChild(writeTodoItem(item));
            }
        }else{
            containerTodoItem.appendChild(writeTodoItem(item));
        }
        // add a single todo item inside the listTodoItem div
        //console.log(containerTodoItem.lastChild);
    }
}

function showCreateTodoItem(){
    dialogBox.showModal();
}

function closeModal() {
    dialogBox.close();
}

function onCreateTodoItem(event){
    event.preventDefault();
    
    newToDo = {
        titre: formTodoItem[0].value,
        description: formTodoItem[1].value,
        dateCreation: new Date(),
        dateFin : formTodoItem[2].value,
        fini : false
    }
    listTodoItem.push(newToDo);
    saveToLocalStorage(listTodoItem);
    closeModal();
    displayTodos();
}
/**
 * Create a formated HTML String of a ToDo Element
 * @param {*} todoItem TodoElement to display
 * return the HTML formated string
 */
function writeTodoItem(todoItem){
    let todoItemHtml = document.createElement("div");
    todoItemHtml.classList.add('todoItem');
    if(todoItem.fini){
        todoItemHtml.classList.add('completed');
    }else if(new Date(todoItem.dateFin) < new Date()){
        todoItemHtml.classList.add('late');
    }
    todoItemHtml.id = `item${listTodoItem.indexOf(todoItem)}`;
    todoItemHtml.onclick = onClickTodoItem;
    /*
    let todoTitre = document.createElement("p");
    todoTitre.classList.add("todoItemTitre");
    todoTitre.textContent=`Titre : ${todoItem.titre}`;
    todoItemHtml.appendChild(todoTitre);
    */
    let beginDate = new Intl.DateTimeFormat(['ban', 'id']).format(new Date(todoItem.dateCreation))
    let endDate = new Intl.DateTimeFormat(['ban', 'id']).format(new Date(todoItem.dateFin))

    todoItemHtml.innerHTML =`
                    
            <p class='todoItemTitre'> Titre : <br> ${todoItem.titre} </input></p>
            <p class='todoItemDescription'> Description : <br> ${todoItem.description} </p>
            <p class='todoItemDateCreation'> Créer le <br> ${beginDate} </p>
            <p class='todoItemDateFin'> Echéance le <br> ${endDate} </p>            
        `;
    let btnDone = document.createElement("button");
    btnDone.innerText = todoItem.fini ? 'fait' : 'pas fait';
    btnDone.onclick=switchDone;
    let btnModify = document.createElement("button");
    btnModify.classList.add("EditButton");
    btnModify.innerText="Modifier";
    let btnDelete = document.createElement("button");
    btnDelete.classList.add("EditButton");
    btnDelete.innerText="Supprimer"
    btnDelete.onclick=onDeletedTodoItem;
    //btnDelete.onclick=onDeletedTodoItem(event,listTodoItem.indexOf(todoItem));
    todoItemHtml.appendChild(btnDone);
    todoItemHtml.appendChild(btnModify);
    todoItemHtml.appendChild(btnDelete);       
    return todoItemHtml;
}


function onClickTodoItem(event){
    let div = event.target.parentElement
    
    for (elemTodo of document.getElementsByClassName("todoItem")){
        elemTodo.classList.remove("biggerBox")
        //dltButton.remove;
        //updButton.remove;
    }
    div.classList.add("biggerBox") 
/*
    let dltButton = document.createElement('button')
    let updButton = document.createElement('button')

    dltButton.innerText = 'supprimer le Todo'
    updButton.innerText = 'modifier le Todo'

    
    dltButton.classList.add("display-button") 
    updButton.classList.add("display-button") 
    div.appendChild(dltButton)
    div.appendChild(updButton)
    /*
    dltButton.onclick = onDeletedTodoItem;
    updButton.onclick = onUpdateTodoItem;
*/
    
}

function onDisplayTodoItem(){
    console.log(loadFromLocalStorage())
}

/*function onUpdateTodoItem(e){
    let newinfos = {}
    listTodoItem.splice(index,1, newinfos);
    saveToLocalStorage();
}*/

function switchDone(e){
    e.stopPropagation();
    console.log(e.target.parentElement.id.replace("item",""));
    index = e.target.parentElement.id.replace("item","");
    listTodoItem[index].fini = !listTodoItem[index].fini;
    if(listTodoItem[index].fini){
        e.target.parentElement.classList.add("completed");
    }else{
        e.target.parentElement.classList.remove("completed");
    }

    saveToLocalStorage();
    displayTodos();
}

function onDeletedTodoItem(e){
    e.stopPropagation();
    console.log(e.target.parentElement.id.replace("item",""));
    index = e.target.parentElement.id.replace("item","");
    listTodoItem.splice(index,1);
    saveToLocalStorage();
    displayTodos();
}

function filtrage(event){
    filtreValue=event.target.value.trim();
    displayTodos();
}

function triTodo(event) {
    console.log(event.target.value)

    if(event.target.value=='date_asc') {
        listTodoItem.sort((a, b) => {
            return new Date(a.dateCreation) - new Date(b.dateCreation);
        })
    }else if (event.target.value=='date_desc' ) {
        listTodoItem.sort((a, b) => {
            return new Date(b.dateCreation) - new Date(a.dateCreation);
        })
    }else {
        listTodoItem.sort((a, b) => {
            console.log(a.titre)
            console.log(b.titre)
            return a.titre - b.titre
        })
    }

    saveToLocalStorage();
    displayTodos();    
}

function loadFromLocalStorage(){
    if (localStorage.getItem("listTodoItem")){
        listTodoItem = JSON.parse(localStorage.getItem("listTodoItem"));
    }else {
     listTodoItem = [];
    }

    if (localStorage.getItem("tri")){
        triValue=localStorage.getItem("tri");
    }else{
        triValue="date_default"
    }

    if (localStorage.getItem("filtre")){
        filtreValue=localStorage.getItem("filtre");
    }else{
        filtreValue="done_all"
    }
}

function saveToLocalStorage(){
    localStorage.setItem("listTodoItem", JSON.stringify(listTodoItem));
    localStorage.setItem("tri", JSON.stringify(triValue));
    localStorage.setItem("filtre", JSON.stringify(filtreValue));
}

/*
    format d'un todo element : 
    {
        titre:"Le Titre",
        description:" Blabla la description",
        dateCreation: new Date(),
        dateFin : new Date("jj/mm/aaaa"),
        fini : false
    }
*/
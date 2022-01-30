let selectedTodo = null;
let editMode=false;

const baseUrl = "http://localhost:3000/";


function Authorize() {
            document.location.href = "https://www.strava.com/oauth/authorize?client_id=77276&redirect_uri=http://127.0.0.1:5500/&response_type=code&scope=activity:read_all"
}

function getCode(){

  const urlParams = new URLSearchParams(document.location.href);
  alert(urlParams.get('code'));
}


const createTodoListItem = (todo) => {
  // luodaan uusi LI-elementti
  let li = document.createElement("li");
  // luodaan uusi id-attribuutti
  let li_attr = document.createAttribute("id");
  // kiinnitetään tehtävän/todon id:n arvo luotuun attribuuttiin
  li_attr.value = todo._id;
  // kiinnitetään attribuutti LI-elementtiin
  li.setAttributeNode(li_attr);
  // luodaan uusi tekstisolmu, joka sisältää tehtävän/todon tekstin
  let text = document.createTextNode(todo.text);
  // lisätään teksti LI-elementtiin
  li.appendChild(text);
  //----------------------------------------------------------------
  let span = document.createElement("span");
  let span_attr = document.createAttribute("class");
  span_attr.value = "edit";  
  span.setAttributeNode(span_attr);  
  let edit = document.createTextNode(" Edit ");
  span.appendChild(edit);
  span.onclick = function () {
    editTodo(todo);
  };
  li.appendChild(span);
  //----------------------------------------------------------------

  // luodaan uusi SPAN-elementti, käytännössä x-kirjan, jotta tehtävä saadaan poistettua
  span = document.createElement("span");
  // luodaan uusi class-attribuutti
  span_attr = document.createAttribute("class");
  // kiinnitetään attribuuttiin delete-arvo, ts. class="delete", jotta saadaan tyylit tähän kiinni
  span_attr.value = "delete";
  // kiinnitetään SPAN-elementtiin yo. attribuutti
  span.setAttributeNode(span_attr);
  // luodaan tekstisolmu arvolla x
  let x = document.createTextNode(" x ");
  // kiinnitetään x-tekstisolmu SPAN-elementtiin (näkyville)
  span.appendChild(x);
  // määritetään SPAN-elementin onclick-tapahtuma kutsumaan removeTodo-funkiota
  span.onclick = function () {
    removeTodo(todo._id);
  };
  // lisätään SPAN-elementti LI-elementtin
  li.appendChild(span);
  // palautetaan luotu LI-elementti
  // on siis muotoa: <li>Muista soittaa...<span class="remove">x</span></li>
  return li;
};

const strava=async()=>{


//Authorize();
  let response = await fetch(baseUrl + "strava");
  let todos = await response.json();
  console.log(todos);
  
  // HUOM 77276 minun stravaID jakossa jonkun toisnekin kirjautuneen???
  //let response = await fetch("https://www.strava.com/oauth/authorize?client_id=77276"); //&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read_all");
  //let todos = await response.json();
  //console.log(todos);
}

const showTodos = (todos) => {
  let todosList = document.getElementById("todosList");
  let infoText = document.getElementById("infoText");
  // no todos
  if (todos.length === 0) {
    infoText.innerHTML = "Ei tehtäviä";
  } else {
    todos.forEach((todo) => {
      let li = createTodoListItem(todo);
      todosList.appendChild(li);
    });
    infoText.innerHTML = "";
  }
};

const loadTodos = async () => {
  let response = await fetch(baseUrl + "todos");
  let todos = await response.json();
  console.log(todos);
  showTodos(todos);
};

const addTodo = async () => {
  const newTodo = document.getElementById("newTodo");
  const data = { text: newTodo.value };

  if (!editMode) {
    const response = await fetch(baseUrl + "todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let todo = await response.json();
    let todosList = document.getElementById("todosList");
    let li = createTodoListItem(todo);
    todosList.appendChild(li);
  } else {

    updateTodo(data);
  }

  let infoText = document.getElementById("infoText");
  infoText.innerHTML = "";
  newTodo.value = "";
};

const editTodo = (todo) => {
  editMode=true;
  selectedTodo = todo;
  let newTodo = document.getElementById("newTodo");
  newTodo.value = todo.text;
  let button = document.getElementById("button");
  button.className="buttonEdit";
  button.innerText="Tallenna"; 
};

const updateTodo = async (data) => {

  const response = await fetch(baseUrl + "todos/" + selectedTodo._id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let responseJson = await response.json();
  const item = document.getElementById(selectedTodo._id);
  item.childNodes[0].nodeValue=responseJson.text;
  selectedTodo.text=responseJson.text;

  item.childNodes[1].onclick = function () {
    editTodo(selectedTodo);
  };

  button.className="";
  button.innerText="Lisää";

  editMode=false;
  
};

const removeTodo = async (id) => {
  const response = await fetch(baseUrl + "todos/" + id, {
    method: "DELETE",
  });
  let responseJson = await response.json();
  let li = document.getElementById(id);
  li.parentNode.removeChild(li);

  let todosList = document.getElementById("todosList");
  if (!todosList.hasChildNodes()) {
    let infoText = document.getElementById("infoText");
    infoText.innerHTML = "Ei tehtäviä";
  }
};

const init = () => {
  let infoText = document.getElementById("infoText");
  infoText.innerHTML = "Ladataan tehtävälista palvelimelta, odota...";
  loadTodos();
};

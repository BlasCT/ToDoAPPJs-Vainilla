const form = document.querySelector("form");
const input = document.querySelector("input");
const tasks = document.querySelector("#tasks");
const backdrop = document.querySelector(".backdrop-container");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showOrHideBackDrop(true);
  const tasks = await get();
  const search = tasks.find((task) => task.name === input.value.toUpperCase());

  if (search !== undefined) {
    alert("Ya existe la tarea");
    return;
  }

  const data = await post({
    name: input.value.toUpperCase(),
    status: 1,
  });
  showOrHideBackDrop(false);
  getTasks();
});

async function deleteTasks(element) {
  showOrHideBackDrop(true);
  //dataset y .getAttribute() sirve para traer el data-id del html
  const id = element.getAttribute("data-id");
  const ok = await destroy(id);
  if (!ok) {
    alert("Algo salio Mal");
    return;
  } else {
  }
  //element.parent sirve para llegar al padre del button
  // element.parentElement.parentElement.parentElement.style.display = "none";
  //closest es una version nás corta del parentElement
  element.closest(".card").style.display = "none";
  // console.log(data)
  showOrHideBackDrop(false);
}

async function updateTasks(element) {
  showOrHideBackDrop(true);
  const newText = prompt("Ingrese el texto");
  const id = element.getAttribute("data-id");
  const ok = await put(id, {
    name: newText,
  });
  if (!ok) {
    alert("Algo salio Mal");
    return;
  }

  const newTasks = document.querySelector(`#name-${id}`);
  newTasks.textContent = newText;
  showOrHideBackDrop(false);
}

async function getTasks() {
  showOrHideBackDrop(true);
  const data = await get();
  input.value = "";
  input.focus();
  tasks.innerHTML = "";
  data.forEach((task) => {
    tasks.innerHTML += `
    <div id="card-${task.id}" class="card mt-3 ${
      task.status === 2 ? `bg-success-subtle` : ``
    }" 
    }>
      <div class="card-body">
        <div>
          <h4 id="name-${task.id}">${task.name}</h4>
        </div>
        ${
          task.status !== 2
            ? `<div class="botones">
                <button onclick="endTask(this)" data-id="${task.id}" class="btn btn-primary">Terminado</button>
                <button onclick="updateTasks(this)" data-id="${task.id}" class="btn btn-warning">Editar</button>
                <button onclick="deleteTasks(this)" data-id="${task.id}" class="btn btn-danger">Eliminar</button>
             </div>`
            : ``
        }
      </div>
    </div>`;
  });
  showOrHideBackDrop(false);
}
getTasks();
//<img src="${element.avatar}" />

async function endTask(element) {
  showOrHideBackDrop(true);
  const id = element.getAttribute("data-id");
  const ok = await put(id, {
    status: 2,
  });

  if (!ok) {
    alert("Algo salio Mal");
    return;
  }

  const card = document.querySelector(`#card-${id}`);

  card.classList.add("bg-success-subtle");
  element.closest(".botones").remove();
  showOrHideBackDrop(false);
}

function showOrHideBackDrop(show = true) {
  backdrop.style.display = show ? "block" : "none";
}

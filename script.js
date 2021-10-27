const root = document.getElementById("root");
const downLoadForm = document.createElement("form");
downLoadForm.setAttribute("id", "download-form");

const loadData = () => {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => renderData(data))
    .catch((error) => {
      error && alert("Произошла ошибка при загрузке данных");
    });
};

const renderData = (data) => {
  data.forEach((element) => {
    renderItem(element);
  });
  createBtn();
};

const renderItem = (item) => {
  const { name, path } = item;
  const formItem = document.createElement("div");
  formItem.className = "download-item";
  const title = document.createElement("label");
  const input = document.createElement("input");
  title.htmlFor = name;
  title.innerText = name;
  title.className = "download-item__title";
  input.id = name;
  input.type = "checkbox";
  input.dataset.url = path;
  input.className = "download-item__input";
  formItem.append(title);
  formItem.append(input);
  downLoadForm.append(formItem);
  activeInput(input, title, formItem);
};

const createBtn = () => {
  const btn = document.createElement("button");
  btn.className = "download-btn";
  btn.innerText = "Загрузить";
  btn.addEventListener("click", (e) => {
    e.preventDefault();
  });
  downLoadForm.append(btn);
};

const activeInput = (input, title, formItem) => {
  input.addEventListener("change", (e) => {
    if (e.target.checked) {
      formItem.className = "download-item download-item__active";
      title.className = 'download-item__title download-item__title-active'
    } else {
      formItem.className = "download-item";
      title.className = 'download-item__title'
    }
  });
};

const start = () => {
  root.append(downLoadForm);
  loadData();
};

start();

const root = document.getElementById("root");
const downLoadForm = document.createElement("form");
downLoadForm.setAttribute("id", "download-form");
downLoadForm.action = "#";

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
  btn.type = "submit";
  downLoadForm.append(btn);
};

const activeInput = (input, title, formItem) => {
  input.addEventListener("change", (e) => {
    if (e.target.checked) {
      formItem.className = "download-item download-item__active";
      title.className = "download-item__title download-item__title-active";
      input.className = "download-item__input download-item__input-active";
    } else {
      formItem.className = "download-item";
      title.className = "download-item__title";
      input.className = "download-item__input";
    }
  });
};

const start = () => {
  root.append(downLoadForm);
  loadData();
  localStorage.setItem('isDownload', 'false')
};

start();

let Promise = window.Promise;
if (!Promise) {
  Promise = JSZip.external.Promise;
}


function urlToPromise(url) {
  return new Promise(function (resolve, reject) {
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

let $form = $("#download-form").on("submit", function () {
  resetMessage();
  const zip = new JSZip();
  // проверка на неотмеченные инпуты
  if ($(this).find(":checked").length === 0) {
    return null;
  }
  // проверка на первичную загрузку
  if(localStorage.isDownload === 'false'){
    if(!confirm('Скачать файлы?')){
      return null
    }else{
      localStorage.setItem('isDownload', 'true')
    }
  }

  // поиск всех отмеченных инпутов
  $(this)
    .find(":checked")
    .each(function () {
      let $this = $(this);
      let url = $this.data("url");
      let filename = url.replace(/.*\//g, "");
      zip.file(filename, urlToPromise(url), { binary: true });
    });
  // генерируем архив
  zip
    .generateAsync({ type: "blob" }, function updateCallback(metadata) {
      let msg = `Прогресс архивации файлов : ${metadata.percent.toFixed(2)} %`;
      showMessage(msg);
    })
    .then(
      function callback(blob) {
        // отгружаем архив
        saveAs(blob, `audio_${dateFormat()}.zip`);
        showMessage("Готово!");
      },
      function (e) {
        showError(e);
      }
    );

  return false;
});


function resetMessage() {
  $("#result").removeClass().text("");
}

function showMessage(text) {
  resetMessage();
  $("#result").text(text);
}

function showError(text) {
  resetMessage();
  $("#result").text(text);
}

const dateFormat = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1  < 10 ? `0${date.getMonth()}`: date.getMonth() + 1  ;
  let day = date.getDate() < 10 ?  `0${date.getDate()}`: date.getDate();
  let hour = date.getHours() < 10 ? `0${date.getHours()}`: date.getHours();
  let min = date.getMinutes() < 10 ? `0${date.getMinutes()}`: date.getMinutes();
  let seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}`: date.getSeconds();
  return `${day}${month}${year}_${hour}${min}${seconds}`;
};

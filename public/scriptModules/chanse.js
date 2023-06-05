
class DataProvider {
  constructor(url) {
    this.url = url;
    this.xhr = new XMLHttpRequest();
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.xhr.open('GET', this.url);
      this.xhr.onload = () => {
        if (this.xhr.status === 200) {
          const data = JSON.parse(this.xhr.response);
          resolve(data);
        } else {
          reject(`Ошибка получения данных: ${this.xhr.status}`);
        }
      };
      this.xhr.send();
    });
  }
}

class ContentEditor {
  constructor(dataProvider) {
    this.dataProvider = dataProvider;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.dataProvider.getData()
        .then((data) => {
          let dataBlocks = data.dataTwo;
          let dataElements = data.dataOne.map(item => item.split('|$')[0]);
          let dataFSize = data.dataOne.map(item => item.split('|$')[1]);
          if (dataElements.length || dataFSize.length) {
            this.updateBlocks(dataBlocks);
            this.updateEditableElements(dataElements, dataFSize);
          }
          resolve();
        })
        .catch((error) => {
          reject(`Ошибка получения данных: ${error}`);
        });
    });
  }

  updateBlocks(dataBlocks) {
    let blocks = document.querySelectorAll('.check__content');
    blocks.forEach((el, index) => {
      console.log(`51 chanse.js `, `block${index}`, dataBlocks[index]);
      el.parentElement.setAttribute(`block${index}`, dataBlocks[index]);
      el.setAttribute('show_block', dataBlocks[index]);
      if (el.parentElement.getAttribute(`block${index}`) === 'true') {
        el.parentElement.style.display = 'none';
      } else {
        el.parentElement.style.display = 'block';
      }
    });
  }

  updateEditableElements(dataElements, dataFSize) {
    let editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach((el, index) => {
      el.textContent = dataElements[index];
      if (index >= 4) {
        el.style.fontSize = dataFSize[index] + 'px';
      }
    });
  }
}


class ImageUploader {
  constructor(username) {
    this.username = username;
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  generateUuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  replaceImage(currentInput, imgFileName) {
    const imgTarget = currentInput.parentElement.previousElementSibling;
    imgTarget.setAttribute('src', `https://storage.googleapis.com/img_bucket_trial/${imgFileName.name}`);
  }

  handleImageUpload(inputElement, index) {
    return new Promise((resolve, reject) => {
      let postid = this.generateUuid();
      let file = inputElement.files[0];
      console.log(file, ' file finded');
      let blob = file.slice(0, file.size, 'image/jpeg');
      let newFile = new File([blob], `${this.username}_${index}_${postid}_post.jpeg`, { type: 'image/jpeg' });
      let formData = new FormData();
      console.log(newFile);
      console.log(this.username);
      formData.append('imgfile', newFile);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload');
      xhr.onload = function () {
        if (xhr.status === 200) {
          const result = xhr.responseText;
          if (result === 'Success') {
            resolve(newFile);
          } else {
            reject('Произошла ошибка при загрузке файла');
          }
        } else {
          reject(`Произошла ошибка при загрузке файла: ${xhr.status}`);
        }
      };
      xhr.onerror = function () {
        reject('Произошла ошибка при загрузке файла');
      };
      xhr.send(formData);
    });
  }

  initialize() {
    document.querySelectorAll('input[name="imgfile"]').forEach((item, index) => {
      item.addEventListener('input', async (event) => {
        try {
          const inputElem = event.target;
          const newFile = await this.handleImageUpload(inputElem, index);
          this.replaceImage(item, newFile);
        } catch (error) {
          console.error(error);
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('this usernameExport', usernameExport);
  const username = window.location.pathname.split('/')[2];
  console.log(username, ' eventListener back');
  const url = `${window.location.origin}/edit_elem_cabinet/${username}`;
  let dataProvider = new DataProvider(url);
  let contentEditor = new ContentEditor(dataProvider);
  let imageUploader = new ImageUploader(usernameExport);

  let promise1 = contentEditor.initialize();
  let promise2 = imageUploader.initialize();
  
  Promise.all([promise1, promise2])
    .then(() => {

      let contentContainer = document.getElementById('contentContainer');
      contentContainer.style.visibility = 'visible';
      const loader = document.querySelector(".loader");

      loader.classList.add("loader--hidden");

     

    })
    .catch((error) => {
      
      console.error(`Ошибка при инициализации: ${error}`);
    });
});

export {DataProvider}; 
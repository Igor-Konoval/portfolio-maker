const username = window.location.pathname.split('/')[2];
// const url = `http://localhost:3000/cabinet/edit_elem_cabinet/${username ? username : ''}`;

// import { ContentEditor} from './Repository.js'

// try {
    
// const contentEditor = new ContentEditor();
// contentEditor.initialize(url);
// } catch (error) {
//     console.log(error);
// }



class ContentEditor {
    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    initialize() {
 
            this.sendAjaxRequest();
    
    }

    sendAjaxRequest() {
        this.xhr.open('GET', `http://localhost:3000/edit_elem_cabinet/${username}`);
        this.xhr.onload = () => {
            if (this.xhr.status === 200) {
                const data = JSON.parse(this.xhr.responseText);
                let dataBlocks = data.dataTwo;
                let dataElements = data.dataOne.map(item => item.split('|$')[0]);
                let dataFSize = data.dataOne.map(item => item.split('|$')[1]);
                if (dataElements.length || dataFSize.length) {
                    this.updateBlocks(dataBlocks);
                    this.updateEditableElements(dataElements, dataFSize);
                }
            } else {
                console.error('Ошибка получения данных: ' + this.xhr.status);
            }
        };
        this.xhr.send();
    }

    updateBlocks(dataBlocks) {
        let blocks = document.querySelectorAll('.check__content');
        blocks.forEach((el, index) => {
            el.parentElement.setAttribute(`block${index}`, dataBlocks[index]);
            el.setAttribute('show_block', dataBlocks[index]);
            if (el.parentElement.getAttribute(`block${index}`) === 'true') {
                el.parentElement.style.display = 'none';
            } else {
                el.parentElement.style.display = 'block';
            }
        })
    }

    updateEditableElements(dataElements, dataFSize) {
        let editableElements = document.querySelectorAll('[contenteditable]');
        editableElements.forEach((el, index)=> {
            el.textContent = dataElements[index];
            el.style.fontSize = dataFSize[index] + 'px';
        })
    }
}



let contentEditor = new ContentEditor();
contentEditor.initialize();

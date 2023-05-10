// let relateValue = [];

// const editBtn = document.querySelector('.edit-btn');
// const saveBtn = document.querySelector('.save-btn');

// function editValue(targ, index) {
//     let area = document.createElement('textArea');
//     area.className = "header_twosline_text_textArea";
//     targ.replaceWith(area);
//     area.value = relateValue[index];
//     area.addEventListener('changeArea', () => {
//         relateValue[index] = area.value;
//         area.replaceWith(targ);
//         targ.innerHTML = relateValue[index];
//     })
// }

// let allElemEdit = document.querySelectorAll('[contenteditable]');
// allElemEdit = Array.from(allElemEdit).filter(el => el.offsetParent !== null);
// allElemEdit.forEach((el, index) => {
//   let posL = el.pageXOffset + el.getBoundingClientRect().right + 10;
//   let posT = el.pageYOffset + el.getBoundingClientRect().top + el.clientHeight / 2;
//   let inp = document.createElement('input');
//   document.body.append(inp);
//   inp.type = 'number';
//   inp.className = 'f_size'
//   inp.style.display = 'none';
//   inp.style.top = posT + 'px';
//   inp.style.left = posL + 'px';
  
//   inp.addEventListener('change', (event) => {
//     el.style.fontSize = inp.value + 'px';
//   });
// });

// editBtn.addEventListener('click', () => {
//   const editableElements = document.querySelectorAll('[contenteditable]');
//   const editInputs = document.querySelectorAll('.f_size');
  
//   editableElements.forEach((el, index) => {
//     el.setAttribute('contenteditable', 'true');
//     el.onclick = function(event) {
//       if (!event.target.contenteditable) return false;
//       relateValue[index] = event.target.innerHTML;
//       editValue(event.target, index);
//     }
//     el.classList.add('editing');
//   });
  
//   window.addEventListener('scroll', () => {
//     editableElements.forEach((el, index) => {
//       const compSize = getComputedStyle(el);
//       const posL = el.getBoundingClientRect().right + 10;
//       const posT = el.getBoundingClientRect().top + el.clientHeight / 2 + window.pageYOffset;
//       editInputs[index].style.left = posL + 'px';
//       editInputs[index].style.top = posT + 'px';
//     });
//   });
  
//   editableElements.forEach((el, index) => {
//     const compSize = getComputedStyle(el);
//     const posL = el.getBoundingClientRect().right + 10;
//     const posT = el.getBoundingClientRect().top + el.clientHeight / 2 + window.pageYOffset;
//     editInputs[index].style.left = posL + 'px';
//     editInputs[index].style.top = posT + 'px';
//     editInputs[index].style.display = 'block';
//     editInputs[index].value = parseInt(compSize.fontSize);
//   });

//   editBtn.setAttribute('disabled', true);
// });

// saveBtn.addEventListener('click', () => {
//     const editableElements = document.querySelectorAll('[contenteditable="true"]');
//     let editInputs = document.querySelectorAll('.f_size');
//     editInputs.forEach(item => {
//     item.style.display = 'none';
//   })
//     editableElements.forEach((el) => {
//       el.setAttribute('contenteditable', 'false');
//       el.classList.remove('editing');
//       el.dispatchEvent(new Event('changeArea', {bubbles: true}));
//     });
//     editBtn.removeAttribute('disabled');
// });

class Editable {
  constructor(element, index, relateValue) {
    this.element = element;
    this.index = index;
    this.relateValue = relateValue;
    this.input = null;
  }

  createInput() {
    const posL = this.element.pageXOffset + this.element.getBoundingClientRect().right + 10;
    const posT = this.element.pageYOffset + this.element.getBoundingClientRect().top + (this.element.clientHeight / 2);

    this.input = document.createElement('input');
    document.body.append(this.input);
    this.input.type = 'number';
    this.input.className = 'f_size';
    this.input.style.display = 'none';
    this.input.style.top = `${posT}px`;
    this.input.style.left = `${posL}px`;

    this.input.addEventListener('change', (event) => {
      this.element.style.fontSize = `${this.input.value}px`;
    });
  }

  replaceWithTextArea() {
    const area = document.createElement('textArea');
    area.className = "header_twosline_text_textArea";
    this.element.replaceWith(area);
    area.value = this.relateValue;
    area.addEventListener('changeArea', () => {
      this.relateValue = area.value;
      area.replaceWith(this.element);
      this.element.innerHTML = this.relateValue;
    })
  }

  changeEditable() {
    this.element.setAttribute('contenteditable', 'true');
    this.element.onclick = (event) => {
      if (!event.target.contenteditable) return false;
      this.relateValue = event.target.innerHTML;
      this.replaceWithTextArea();
    }
    this.element.classList.add('editing');
  }

  changeInputPosition() {
    const compSize = getComputedStyle(this.element);
    const posL = this.element.getBoundingClientRect().right + 10;
    const posT = this.element.getBoundingClientRect().top + (this.element.clientHeight / 2) + window.pageYOffset;
    this.input.style.left = `${posL}px`;
    this.input.style.top = `${posT}px`;
  }
}

class FontSizeChanger {
  constructor() {
    this.editBtn = document.querySelector('.edit-btn');
    this.saveBtn = document.querySelector('.save-btn');
    this.editableElements = null;
    this.editInputs = null;
  }

  init() {
    this.editBtn.addEventListener('click', this.changeToEditable.bind(this));
    this.saveBtn.addEventListener('click', this.saveEditable.bind(this));

    this.editableElements = document.querySelectorAll('[contenteditable]');
    this.editableElements = Array.from(this.editableElements).filter(el => el.offsetParent !== null);

    this.editableElements.forEach((element, index) => {
      const editable = new Editable(element, index, element.innerHTML);
      editable.createInput();
      this.editInputs = document.querySelectorAll('.f_size');
      editable.changeEditable();
      editable.changeInputPosition();
    });

    window.addEventListener('scroll', () => {
      this.editableElements.forEach((element) => {
        const editable = new Editable(element, index, element.innerHTML);
        editable.changeInputPosition();
      });
    });
  }

  changeToEditable() {
    this.editableElements.forEach((element, index) => {
      const editable = new Editable(element, index, element.innerHTML);
      editable.changeEditable();
      editable.changeInputPosition();
    });

    this.editBtn.setAttribute('disabled', true);
  }

  saveEditable() {
    this.editInputs.forEach(item => {
      item.style.display = 'none';
    });

    this.editableElements.forEach(element => {
      element.setAttribute('contenteditable', 'false');
      element.classList.remove('editing');
      element.dispatchEvent(new Event('changeArea', { bubbles: true }));
    });

    this.editBtn.removeAttribute('disabled');
  }
}

const fontSizer = new FontSizeChanger();
fontSizer.init();

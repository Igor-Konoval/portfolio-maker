class TextEditor {
  constructor() {
    this.relateValue = [];
    this.editBtn = document.querySelector('.edit-btn');
    this.saveBtn = document.querySelector('.save-btn');
    this.editableElements = Array.from(document.querySelectorAll('[contenteditable]')).filter(el => el.offsetParent !== null);
    this.editInputs = [];

    this.stripStyles = this.stripStyles.bind(this);
    this.editValue = this.editValue.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.editBtnClickHandler = this.editBtnClickHandler.bind(this);
    this.saveBtnClickHandler = this.saveBtnClickHandler.bind(this);
    this.pasteHandler = this.pasteHandler.bind(this);
  }

  stripStyles(text) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    const allElements = tempDiv.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      element.removeAttribute('style');
      element.removeAttribute('class');
    }

    return tempDiv.innerText;
  }

  editValue(targ) {
    let area = document.createElement('textarea');
    area.className = "header_twosline_text_textArea";
    targ.replaceWith(area);
    area.value = targ.textContent;
    area.addEventListener('change', () => {
      area.replaceWith(targ);
      targ.textContent = area.value;
    });
    area.addEventListener('keydown', (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        area.dispatchEvent(new Event('change'));
      }
    });
  }

  scrollHandler() {
    this.editableElements.forEach((el, index) => {
      const editInput = this.editInputs[index];
      const posL = el.getBoundingClientRect().right + 10;
      const posT = el.getBoundingClientRect().top + el.clientHeight / 2 + window.pageYOffset;

      if (editInput.style.display === 'none') {
        return;
      }

      const inputWidth = parseFloat(getComputedStyle(editInput).width);
      const inputHeight = parseFloat(getComputedStyle(editInput).height);
      const windowWidth = document.documentElement.clientWidth;
      
      if (posL + inputWidth > windowWidth) {
        const targetElementTop = el.getBoundingClientRect().top + window.pageYOffset;
        const targetElementLeft = el.getBoundingClientRect().left;
        
        editInput.style.left = targetElementLeft + 'px';
        editInput.style.top = (targetElementTop - inputHeight) + 'px';
      } else {
        editInput.style.left = posL + 'px';
        editInput.style.top = posT + 'px';
      }
    });
  }

  editBtnClickHandler() {
    this.editableElements.forEach((el, index) => {
      el.setAttribute('contenteditable', 'true');

      el.onclick = function (event) {
        if (!event.target.contenteditable) return false;
        this.relateValue[index] = event.target.innerText;
        this.editValue(event.target, index);
      }.bind(this);

      el.classList.add('editing');
    });

    window.addEventListener('scroll', this.scrollHandler);

    this.editableElements.forEach((el, index) => {
      const compSize = getComputedStyle(el);
      const posL = el.getBoundingClientRect().right + 10;
      const posT = el.getBoundingClientRect().top + el.clientHeight / 2 + window.pageYOffset;

      if ( posL + getComputedStyle( this.editInputs[index]).width > document.documentElement.clientWidth) {
        posT = el.getBoundingClientRect().top + window.pageYOffset - getComputedStyle( this.editInputs[index]).height;
        posL = el.getBoundingClientRect().left;
      } 

        this.editInputs[index].style.left = posL + 'px';
        this.editInputs[index].style.top = posT + 'px';

      if (el.closest('[block0="true"], [block1="true"], [block2="true"], [block3="true"], [block4="true"], [block5="true"], [block6="true"]')) {
        this.editInputs[index].style.display = 'none';
      } else {
        this.editInputs[index].style.display = 'block';
        this.editInputs[index].value = parseInt(compSize.fontSize);
      }
      if (index <= 3) {
        this.editInputs[index].style.display = 'none';
      }
    });

    this.editBtn.style.display = 'none';
    this.saveBtn.style.display = 'block';
    
    this.editBtn.setAttribute('disabled', true);
  }

  saveBtnClickHandler() {
    window.removeEventListener('scroll', this.scrollHandler);

    this.editInputs.forEach(item => {
      item.style.display = 'none';
    });

    this.editableElements.forEach((el) => {
      el.setAttribute('contenteditable', 'false');
      el.classList.remove('editing');

      const cleanedText = this.stripStyles(el.textContent);
      el.textContent = cleanedText;
    });

    this.editBtn.style.display = 'block';
    this.saveBtn.style.display = 'none';

    this.editBtn.removeAttribute('disabled');
  }

  pasteHandler(event) {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text/plain');

    const cleanedText = this.stripStyles(pastedText);

    const activeElement = document.activeElement;
    if (activeElement && activeElement.getAttribute('contenteditable') === 'true') {
      event.preventDefault();
      document.execCommand('insertText', false, cleanedText);
    }
  }

  init() {
    this.editableElements.forEach((el, index) => {
      el.setAttribute('indexEdit', index);

      let posL = el.pageXOffset + el.getBoundingClientRect().right + 10;
      let posT = el.pageYOffset + el.getBoundingClientRect().top + el.clientHeight / 2;

      let inp = document.createElement('input');
      document.body.append(inp);
      inp.type = 'number';
      inp.className = 'f_size';
      inp.style.display = 'none';
      inp.style.top = posT + 'px';
      inp.style.left = posL + 'px';

      inp.addEventListener('change', (event) => {
        el.style.fontSize = inp.value + 'px';
      });

      this.editInputs.push(inp);
    });

    this.editBtn.addEventListener('click', this.editBtnClickHandler);
    this.saveBtn.addEventListener('click', this.saveBtnClickHandler);

    const THROTTLE_DELAY = 300;
    let throttleTimer;

    const throttleScrollHandler = () => {
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        this.scrollHandler();
        throttleTimer = null;
      }, THROTTLE_DELAY);
    };

    window.addEventListener('scroll', throttleScrollHandler);

    document.addEventListener('paste', this.pasteHandler);
  }
}

const editor = new TextEditor();
editor.init();

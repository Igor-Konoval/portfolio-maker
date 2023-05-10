let relateValue = [];

const editBtn = document.querySelector('.edit-btn');
const saveBtn = document.querySelector('.save-btn');

function editValue(targ, index) {
    let area = document.createElement('textArea');
    area.className = "header_twosline_text_textArea";
    targ.replaceWith(area);
    area.value = relateValue[index];
    area.addEventListener('changeArea', () => {
        relateValue[index] = area.value;
        area.replaceWith(targ);
        targ.innerHTML = relateValue[index];
    })
}

let allElemEdit = document.querySelectorAll('[contenteditable]');//52 true
allElemEdit = Array.from(allElemEdit).filter(el => el.offsetParent !== null);//trouble
allElemEdit.forEach((el, index) => {
  let posL = el.pageXOffset + el.getBoundingClientRect().right + 10;
  let posT = el.pageYOffset + el.getBoundingClientRect().top + el.clientHeight / 2;
  let inp = document.createElement('input');
  document.body.append(inp);
  inp.type = 'number';
  inp.className = 'f_size'
  inp.style.display = 'none';
  inp.style.top = posT + 'px';
  inp.style.left = posL + 'px';
  
  inp.addEventListener('change', (event) => {
    el.style.fontSize = inp.value + 'px';
  });
});


editBtn.addEventListener('click', () => {
  const editableElements = document.querySelectorAll('[contenteditable]');
  const editInputs = document.querySelectorAll('.f_size');
  //check parentContainer
  editableElements.forEach((el, index) => {
    el.setAttribute('contenteditable', 'true');
    el.onclick = function(event) {
      if (!event.target.contenteditable) return false;
      relateValue[index] = event.target.innerHTML;
      editValue(event.target, index);
    }
    el.classList.add('editing');
  });
  
  window.addEventListener('scroll', () => {
    editableElements.forEach((el, index) => {
      const compSize = getComputedStyle(el);
      const posL = el.getBoundingClientRect().right + 10;
      const posT = el.getBoundingClientRect().top + el.clientHeight / 2 + window.pageYOffset;
      editInputs[index].style.left = posL + 'px';
      editInputs[index].style.top = posT + 'px';
    });
  });
  
  editableElements.forEach((el, index) => {
    const compSize = getComputedStyle(el);
    const posL = el.getBoundingClientRect().right + 10;
    const posT = el.getBoundingClientRect().top + el.clientHeight / 2 + window.pageYOffset;
    editInputs[index].style.left = posL + 'px';
    editInputs[index].style.top = posT + 'px';
    editInputs[index].style.display = 'block';
    editInputs[index].value = parseInt(compSize.fontSize);
  });

  editBtn.setAttribute('disabled', true);
});

saveBtn.addEventListener('click', () => {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    let editInputs = document.querySelectorAll('.f_size');
    editInputs.forEach(item => {
    item.style.display = 'none';
  })
    editableElements.forEach((el) => {
      el.setAttribute('contenteditable', 'false');
      el.classList.remove('editing');
      el.dispatchEvent(new Event('changeArea', {bubbles: true}));
    });
    editBtn.removeAttribute('disabled');
});



/*document.querySelectorAll('.f_size').length
55
document.querySelectorAll('.contenteditable').length
0
document.querySelectorAll('[contenteditable]').length
55
document.querySelectorAll('[contenteditable="true"]').length
55*/
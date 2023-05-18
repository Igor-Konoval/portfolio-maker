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

let allElemEdit = document.querySelectorAll('[contenteditable]');
allElemEdit = Array.from(allElemEdit).filter(el => el.offsetParent !== null);

allElemEdit.forEach((el, index) => {
  let posL = el.pageXOffset + el.getBoundingClientRect().right + 10;
  let posT = el.pageYOffset + el.getBoundingClientRect().top + el.clientHeight / 2;
  el.setAttribute('indexEdit', index);
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

      const posL = el.getBoundingClientRect().right + 10;
      const posT = el.getBoundingClientRect().top + el.clientHeight / 2 + window.pageYOffset;
      
      if (editInputs[index].style.display === 'none') {
        return;
      }
      
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

    if (el.closest('[block0="true"], [block1="true"], [block2="true"], [block3="true"], [block4="true"], [block5="true"]')) {
      editInputs[index].style.display = 'none';
    } else {
      editInputs[index].style.display = 'block';
      editInputs[index].value = parseInt(compSize.fontSize);
    }
    
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

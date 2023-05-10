document.addEventListener('DOMContentLoaded', ()=> {
  let allButShowHide = document.querySelectorAll('.check__content');
  let blocks = document.querySelectorAll('.check__content');

  // blocks.forEach((item, index)=> {    
  //   if (!item.parentElement.hasAttribute(`block${index}`)) {
  //     item.parentElement.setAttribute(`block${index}`, false);
  //   }
  // })

  function hideParent(parent, index) {
   parent.setAttribute(`block${index}`, true);
   parent.style.display = 'none';
   console.log(parent.getAttribute(`block${index}`));
  }

allButShowHide.forEach((el, index) => {
  
  el.addEventListener('click', (event) => {
    let target = event.target;    
    let parent = target.parentElement;
    let elAttr = Boolean(target.getAttribute('show_block'));
    // target.setAttribute('show_block', !elAttr);//true
    target.setAttribute('show_block', true);//true
    hideParent(parent, index);
  }); 
});

const resetBlocks = document.getElementById('return__blocks');

resetBlocks.addEventListener('click', ()=> {
  document.querySelectorAll('.check__content').forEach((item, index) => {
    item.setAttribute('show_block', false);
    item.parentElement.setAttribute(`block${index}`, false);
    item.parentElement.style.display = 'block';
  })
})

})

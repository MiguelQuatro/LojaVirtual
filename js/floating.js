// small additions for floating actions and openCart/closeCart

function openCart(){
  document.body.classList.add('carrinho-aberto');
  hideFloatingActions();
}
function closeCart(){
  document.body.classList.remove('carrinho-aberto');
  showFloatingActions();
}
function showFloatingActions(){
  const el = document.getElementById('floatingActions'); if(!el) return;
  el.classList.add('aberto'); el.setAttribute('aria-hidden','false');
}
function hideFloatingActions(){
  const el = document.getElementById('floatingActions'); if(!el) return;
  el.classList.remove('aberto'); el.setAttribute('aria-hidden','true');
}

// ensure we hide floating if cart has items
(function(){
  try{
    const count = JSON.parse(localStorage.getItem('boutique-carrinho')||'[]').length;
    if(count>0) hideFloatingActions();
  }catch(e){/*ignore*/}
})();

// ============================================================
// CONTEXT HELPER — mémorise l'entreprise (contexte) sélectionnée
// entre les pages, pour éviter de la re-choisir à chaque fois.
// ============================================================
const CTX_KEY = 'al_afna_contexte_id';

function getSelectedContexteId(){
  return localStorage.getItem(CTX_KEY);
}
function setSelectedContexteId(id){
  localStorage.setItem(CTX_KEY, id);
}
function clearSelectedContexteId(){
  localStorage.removeItem(CTX_KEY);
}

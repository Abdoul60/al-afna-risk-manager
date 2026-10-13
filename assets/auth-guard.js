// Protège une page : sans session, redirige vers la connexion. Ajoute le lien Déconnexion.
(async () => {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    location.replace('login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() || 'index.html'));
    return;
  }
  const nav = document.querySelector('.nav ul');
  if (nav) {
    const li = document.createElement('li');
    li.innerHTML = '<a href="#">Déconnexion</a>';
    li.querySelector('a').onclick = async (e) => { e.preventDefault(); await supabaseClient.auth.signOut(); location.href = 'login.html'; };
    nav.appendChild(li);
  }
})();

// Global //
const burgerButton = document.querySelector('.burger');
const navMenu = document.getElementById('menu');

if (burgerButton && navMenu) {
    const navLinks = navMenu.querySelectorAll('a');

    burgerButton.addEventListener('click', () => {
        const ouvert = burgerButton.getAttribute('aria-expanded') === 'true';
        burgerButton.setAttribute('aria-expanded', String(!ouvert));
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerButton.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('open');
        });
    });
}

// Prestation.html //
const GestionAvis = {
    init() {
        this.formulaire = document.getElementById('avis-form');
        this.zoneMessage = document.getElementById('form-message');
        this.listeAvis = document.getElementById('avis-liste');

        if (!this.formulaire || !this.listeAvis) return;

        this.afficherTousAvis();
        this.formulaire.addEventListener('submit', e => this.envoiFormulaire(e));
    },

    envoiFormulaire(e) {
        e.preventDefault();
        this.effacerMessage();

        const nouvelAvis = {
            nom: this.formulaire.nom.value.trim(),
            prenom: this.formulaire.prenom.value.trim(),
            ville: this.formulaire.ville.value.trim(),
            email: this.formulaire.email.value.trim(),
            note: this.formulaire.note.value,
            texte: this.formulaire.avis.value.trim(),
            date: new Date().toLocaleDateString()
        };

        if (Object.values(nouvelAvis).some(v => !v)) {
            this.afficherMessage('Merci de remplir tous les champs avant de soumettre.', 'error');
            return;
        }

        if (nouvelAvis.nom.length < 2 ) {
            this.afficherMessage('Le nom doit contenir au moins 2 caractères.', 'error');
            return;
        }

        if (nouvelAvis.prenom.length < 2) {
            this.afficherMessage('Le prénom doit contenir au moins 2 caractères.', 'error');
            return;
        }

        if (nouvelAvis.ville.length < 2) {
            this.afficherMessage('Le nom de la ville doit contenir au moins 2 caractères.', 'error');
            return;
        }

        if (!this.emailValide(nouvelAvis.email)) {
            this.afficherMessage('Veuillez fournir une adresse email correcte.', 'error');
            return;
        }

        this.sauvegarderAvis(nouvelAvis)
            .then(() => {
                this.afficherMessage('Merci ! Votre avis a bien été enregistré.', 'success');
                this.formulaire.reset();
                this.afficherTousAvis();
            })
            .catch(() => {
                this.afficherMessage('Oups… une erreur est survenue lors de l’enregistrement.', 'error');
            });
    },

    sauvegarderAvis(avis) {
        return new Promise(resolve => {
            setTimeout(() => {
                const liste = JSON.parse(localStorage.getItem('avis')) || [];
                liste.push(avis);
                localStorage.setItem('avis', JSON.stringify(liste));
                resolve();
            }, 400);
        });
    },

    afficherTousAvis() {
        this.listeAvis.innerHTML = '';
        const avisStockes = JSON.parse(localStorage.getItem('avis')) || [];
    
        if (avisStockes.length === 0) {
            this.listeAvis.innerHTML = '<p>Aucun avis pour le moment. Soyez le premier à donner le vôtre !</p>';
            return;
        }
    
        avisStockes.slice(-5).reverse().forEach(a => {
            const article = document.createElement('article');
            article.className = 'avis';
            article.innerHTML = `
                <h3>${a.prenom} ${a.nom} – ${a.ville}</h3>
                <p><strong>Note :</strong> <span style="color: #f39c12;">${'★'.repeat(a.note)}</span></p>
                <p>${a.texte}</p>
                <small>${a.date}</small>
            `;
            this.listeAvis.appendChild(article);
        });
    }

    afficherMessage(texte, type) {
        this.zoneMessage.textContent = texte;
        this.zoneMessage.className = type;
        this.zoneMessage.setAttribute('tabindex', '-1');
        this.zoneMessage.focus();
    },

    effacerMessage() {
        this.zoneMessage.textContent = '';
        this.zoneMessage.className = '';
        this.zoneMessage.removeAttribute('tabindex');
    },

    emailValide(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    GestionAvis.init();
});

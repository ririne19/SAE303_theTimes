/*--
Déclaration et affectation des variables contenant les données ou les options

let ...=...;
--*/
/*--
Déclaration des variables globales
--*/
let evol;

//Déclaration des calques evolution
let traceVp;
let traceGaz;
let traceElec;
let legVp;
let legGaz;
let legElec;
let titre;

let areTracesVisible = true; // variable pour savoir si les traces sont visibles
let currentAngle = 0; // Angle de rotation initial

// déclaration des variables à animer en gsap
let logo;
let text;

let voiture;
let voitureBase;
let roue1;
let roue2;
let sourisX;
let sourisY;
/*--
Déclaration des fonctions classiques

function xx(xxx, xxx) {}
--*/
/*--
Déclaration des fonctions callback

function xx() {} ou function xx(event) {}
--*/
function f(loadFragment) {
  evol.append(loadFragment);
  calquesEvol();
}


//animation snapsvg
function calquesEvol() {
  //sélection des calques via leurs ID
  traceVp = evol.select("#trace_x5F_nb_x5F_vp");
  traceGaz = evol.select("#trace_x5F_gaz");
  traceElec = evol.select("#trace_x5F_elec");

  legVp = evol.select("#légende_nb_x5F_vp");
  legGaz = evol.select("#légende_gaz");
  legElec = evol.select("#légende_elec");

  titre = evol.select("#titre");

  legVp.click(() => {
    if (areTracesVisible) {
      // Si les tracés sont visibles, les cacher
      legGaz.animate({ opacity: 0.5 }, 500, () => {
        traceGaz.animate({ opacity: 0 }, 500); // Masquer le tracé
      });
      legElec.animate({ opacity: 0.5 }, 500, () => {
        traceElec.animate({ opacity: 0 }, 500);
      });
    } else {
      // Si les tracés sont cachés, les afficher
      legGaz.animate({ opacity: 1 }, 500, () => {
        traceGaz.animate({ opacity: 1 }, 500);
      });
      legElec.animate({ opacity: 1 }, 500, () => {
        traceElec.animate({ opacity: 1 }, 500);
      });
    }

    // Inverser l'état après chaque clic
    areTracesVisible = !areTracesVisible;
  });

  if (areTracesVisible) {
    legGaz.click(() => {
      traceGaz.animate(
        { opacity: 0.5, transform: "s1.2", transform: "r180" },
        500,
        mina.easeinout
      );
    });
  }

  legGaz.click(() => {
    if (areTracesVisible) {
      // Si les tracés sont visibles, les cacher
      legVp.animate({ opacity: 0.5 }, 500, () => {
        traceVp.animate({ opacity: 0 }, 500); // Masquer le tracé
      });
      legElec.animate({ opacity: 0.5 }, 500, () => {
        traceElec.animate({ opacity: 0 }, 500);
      });
    } else {
      // Si les tracés sont cachés, les afficher
      legVp.animate({ opacity: 1 }, 500, () => {
        traceVp.animate({ opacity: 1 }, 500);
      });
      legElec.animate({ opacity: 1 }, 500, () => {
        traceElec.animate({ opacity: 1 }, 500);
      });
    }

    // Inverser l'état après chaque clic
    areTracesVisible = !areTracesVisible;
  });

  traceElec.mouseover(() => {
    legElec.animate({ transform: "r180" }, 1000, mina.easeinout); // 1000 ms pour l'animation
  });
  traceElec.mouseout(() => {
    legElec.animate({ transform: "r360" }, 1000, mina.easeinout); // 1000 ms pour l'animation
  });

  document.getElementById("btnHideCars").addEventListener("click", function () {
    if (areTracesVisible) {
      // Mettre l'opacité de l'élément cars à 0 (cacher)
      traceGaz.animate({ opacity: 0 }, 500, mina.easeinout);
      traceVp.animate({ opacity: 0 }, 500, mina.easeinout);
      areTracesVisible = false;
    } else {
      // Réinitialiser l'opacité à 1 (afficher)
      traceGaz.animate({ opacity: 1 }, 500, mina.easeinout);
      traceVp.animate({ opacity: 1 }, 500, mina.easeinout);
      areTracesVisible = true;
    }
  });

  document.getElementById("rotateGraph").addEventListener("click", function () {
    currentAngle += 90; // Incrément de 90 degrés
    //console.log("Rotation de l'angle:", currentAngle); // Log pour débogage
    titre.attr("transform", `rotate(${currentAngle} 250 50)`); // Centre de rotation à (250, 50) ; ajustez selon votre graphique
  });
}

//animation gsap
function effetGsap() {
  //animation pour faire rebondir le logo
  logo = document.querySelector("#logo");
  // Vérifier si l'élément existe
  if (logo) {
    // Animation quand la souris passe dessus
    logo.addEventListener("mouseover", () => {
      gsap.to("#logo", { y: -50, duration: 0.5, ease: "bounce.out" });
    });

    // Animation quand la souris quitte l'élément
    logo.addEventListener("mouseout", () => {
      gsap.to("#logo", { y: 0, duration: 0.5, ease: "bounce.out" });
    });
  }

  // animation pour agrandir l'image
  text = document.querySelector("#imgIntro");

  if (text) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      "#imgIntro",
      { scale: 0 }, // Démarrer avec une taille de 0 (invisible ou très petit)
      {
        scale: 1, // Taille normale
        duration: 2, // Durée de l'animation
        scrollTrigger: {
          trigger: "#imgIntro", // élément qui déclenche l'animation
          start: "top 25%", // déclenchement de l'animation
          end: "top 5%", // fin de l'animation
          scrub: true, // synchro de l'animation avec le scroll
        },
      }
    );
  }
}

function souris() {
  voiture = Snap("#svg");

  grp = voiture.group(
    voiture.rect(-30, -15, 60, 30, 10, 10).attr({ fill: "#7BCD71" }), // Corps de la voiture
    voiture.circle(-20, 15, 10).attr({ fill: "#2c3e50" }), // Roue avant
    voiture.circle(20, 15, 10).attr({ fill: "#2c3e50" }) // Roue arrière
  );

  // Positionne la voiture initialement en dehors du canvas
  grp.attr({ transform: "translate(0, 0)" });

  // Détecte les mouvements de la souris
  document.addEventListener("mousemove", (event) => {
    // Calcule la position de la souris
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    // Anime la position de la voiture pour suivre la souris
    gsap.to(voiture.node, {
      //duration: 0.5, // Durée de l'animation
      x: mouseX,
      y: mouseY,
      ease: "power3.out", // Effet de fluidité
    });
  });
}

//fonction de callback pour récupérer les premiers éléments du DOM, mettre en place les abonnements, ...
function init() {
  evol = Snap("#evolution");
  Snap.load("images/graph_VP.svg", f);
  effetGsap();
  souris();
}
/*--
quand le DOM a été entièrement chargé, on peut appeler la fonction d'initialisation
--*/
window.addEventListener("load", init);

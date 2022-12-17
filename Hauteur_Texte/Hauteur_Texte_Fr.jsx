//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Hauteur_Texte
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Le script renvoie la hauteur vectorielle d'un H majuscule pour  le texte sélectionné.
    Il propose ensuite de calculer le facteur d'échelle à utiliser si l'on souhaitait lui donner une autre hauteur (toujours sur
    la base d'un H majuscule vectorisé).  Il propose enfin d'appliquer ou pas la tranformation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
var maSelection = app.activeDocument.selection; // Attribue une variable à la sélection en cours
var messageErreur = ("Il faut s\351lectionner uniquement un texte non-vectoris\351\n\(avec la fl\350che blanche s\'il fait partie d\'un groupe\)");
if(maSelection.length != 0 && maSelection[0]){; // Si la sélection en cours est un cadre de texte...
    if(maSelection[0].typename === "TextFrame"){; // Si la sélection en cours est un cadre de texte...
        TrouverHauteurActuelle(maSelection);// Appel de la fonction
        boiteDialHauteurTexte();// Appel de la fonction
                if (hauteurFinale != ""){;// Si le champ hauteur finale n'est pas vide...
                    boiteDialTransform()
                };
    }else{alert(messageErreur);// Affiche le msg d'erreur si la sélection en cours n'est pas un objet texte...
    };
    }else{alert(messageErreur);// Affiche le msg d'erreur si la sélection en cours n'est pas un objet texte...
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Boîte de dialogue N°1    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function boiteDialHauteurTexte(){;
var boiteDialHauteurTexte = new Window ("dialog", "Hauteur physique du texte"); // création de la boite de dialogue
    boiteDialHauteurTexte.alignChildren = "left"; // Aligner les différents items de la boîte de dialogue à gauche
    boiteDialHauteurTexte.center(); // Centrer la boite de dialogue
var RenvoiHautLettreActuelle = boiteDialHauteurTexte.add("statictext",undefined,"La hauteur physique du texte sélectionné est de : " + hTexteSelect.toFixed(2) + " mm.");
    RenvoiHautLettreActuelle.orientation = "row";// Organiser les éléments en ligne
var Proposition = boiteDialHauteurTexte.add("statictext",undefined,"Conna\356tre l\'\351chelle \340 appliquer sur la base d\'une hauteur vectoris\351e du texte de :", {multiline:true});
var grpHauteurTexteFinale  = boiteDialHauteurTexte.add("group"); // Création, dans la boite de dialogue,d'un groupe pour l'échelle à appliquer et son unité
    grpHauteurTexteFinale.orientation = "row";// Organiser les éléments en ligne
var HTexteFinale = grpHauteurTexteFinale.add("edittext", undefined,""); // Création de la zone de saisie "Hauteur de texte finale"
    HTexteFinale.characters = 5;// Largeur du champ en nb de caractères
var lbl_uniteHTexteFinale = grpHauteurTexteFinale.add("statictext",undefined,"mm"); // Création de la légende du champ "Hauteur de texte"
var btnOk = boiteDialHauteurTexte.add("button", undefined, "Ok"); // Création d'un bouton de validation
boiteDialHauteurTexte.show(); // Faire apparaître la boite de dialogue
hauteurFinale = HTexteFinale.text  // Déclaration de la variable dont la valeur sera renvoyée (sans "var" pour que la variable soit globale)
return (hauteurFinale);// Renvoi de la variable
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Hauteur texte sélectionné    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function TrouverHauteurActuelle(maSelection) {;
var maSelectionDupliTemp = maSelection[0].duplicate();// Duplique l'objet texte sélectionné
maSelectionDupliTemp.contents = "H";// Remplace sa valeur par un H majuscule
var maSelectionVectoTemp = maSelectionDupliTemp.duplicate().createOutline();// Duplique le H majuscule et le vectorise
hTexteSelect = (maSelectionVectoTemp.height)/2.835; // Calcule et attribue une variable globale à la hauteur du H vectorisé
rapport = maSelectionDupliTemp.height / maSelectionVectoTemp.height; // Calcule le rapport entre le H vecorisé et non-vectorisé
maSelectionDupliTemp.remove();// Supprime l'objet texte contenant un H
maSelectionVectoTemp.remove();// Supprime le H vectorisé
return(hTexteSelect,rapport);// Renvoie la hauteur du H vectorisé et le rapport vectorisé/non-vectorisé
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Boîte de dialogue N°2    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function boiteDialTransform(){;
coeff = (hauteurFinale * 100)/hTexteSelect // Calcule le coeff en % à appliquer pour amener le texte à sa hauteur finale
var boiteDialTransform = new Window ("dialog", "% de transformation"); // création de la boite de dialogue
    boiteDialTransform.alignChildren = "left"; // Aligner les différents items de la boîte de dialogue à gauche
var lblTransf = boiteDialTransform.add("statictext",undefined,"Le pourcentage \340 appliquer pour redimensionner vos objets\nsur la base d'une hauteur de lettre de " + hauteurFinale +" mm est : " , {multiline:true});
var grpTransform  = boiteDialTransform.add("group"); // Création, dans la boite de dialogue,d'un groupe pour le coeff de transformation à appliquer, son unité et sa légende
    grpTransform.alignChildren= "top";// Organiser les éléments en ligne
    grpTransform.orientation ="row";// Organiser les éléments en ligne
var valeurTransform = grpTransform.add("edittext", undefined,coeff.toFixed(2)); // Création de la zone de copie du % de transformation
    valeurTransform.characters =8; // Largeur du champ en nb de caractères
var uniteTransform = grpTransform.add("statictext", undefined,"% ");
    uniteTransform.characters = 2;// Largeur du champ en nb de caractères
var grpBoutons = boiteDialTransform.add("group"); // Création, dans la boite de dialogue,d'un groupe pour les boutons
var btnAppliquer = grpBoutons.add("button",undefined,"Appliquer",{name:"ok"});
    btnAppliquer.onClick = function(){app.activeDocument.selection[0].resize(coeff,coeff);
                                                        boiteDialTransform.close();
                                                       };
var btnAnnuler = grpBoutons.add("button",undefined,"Fermer",{name:"cancel"});
    btnAnnuler.onClick = function(){pressePapier(coeff);
                                                        boiteDialTransform.close();
                                                       };
boiteDialTransform.center(); // Centrer la boite de dialogue
boiteDialTransform.show(); // Faire apparaître la boite de dialogue
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Presse papier   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pressePapier(coeff) {
var montexte = app.activeDocument.textFrames.add(); // Créer un cadre de texte
montexte.contents = coeff;
app.selection = []; // Déselectionne tout
montexte.selected = true; // Ajoute le cadre de texte à la sélection
app.copy(); // Copie le contenu du cadre de texte
montexte.remove(); // Supprime le cadre de texte
};
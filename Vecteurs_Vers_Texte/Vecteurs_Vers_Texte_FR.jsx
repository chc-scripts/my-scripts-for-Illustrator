/*Vecteurs_Vers_Texte
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Modifier un texte vectorisé.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Utilisation :
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
        Sélectionnez deux objets : 1 GROUPE constitué d'une ou plusieurs lettres vectorisées et le même TEXTE dans la
        même police mais non-vectorisé (peu importe la différence de taille et de couleur entre les deux).
        Après éxécution du script, l'objet texte a remplacé le groupe vectoriel et peut donc être modifié en place.
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#targetengine main
var maSelection = app.activeDocument.selection
if (maSelection.length == 2) { // Vérifier que la sélection ne comporte que 2 items
app.executeMenuCommand("noCompoundPath"); // annuler d'éventuels tracés transparents
// Vérifier que les 2 éléments sélectionnés sont  bien un groupe et un cadre de texte et les distinguer
     if (maSelection[0].typename=="TextFrame"&&maSelection[1].typename=="GroupItem"){
         var monTexte = maSelection[0];
         var monGroupe = maSelection[1];
     } else if (maSelection[1].typename=="TextFrame"&&maSelection[0].typename=="GroupItem"){
         var monTexte = maSelection[1];
         var monGroupe = maSelection[0];
     } else {
         alert("Il faut sélectionner un texte non vectorisé et un texte vectorisé afin \n que script remplace le groupe vectoriel par la zone de texte.");
     };
} else {
    alert("Il faut sélectionner un texte non vectorisé et un texte vectorisé afin \n que script remplace le groupe vectoriel par la zone de texte.");
};
monTexte.textRange.verticalScale = 100; // Rétablir l'échelle du texte au cas où il serait déformé verticalement
monTexte.textRange.horizontalScale = 100; // Rétablir l'échelle du texte au cas où il serait déformé horizontalement
monTexte.textRange.characterAttributes.tracking = 0; // Mise à zéro de l'approche
var texteTmp_1 = monTexte.duplicate().createOutline(); // Dupliquer le cadre de texte et vectoriser la copie
var monEchelleV = monGroupe.height / texteTmp_1.height*100; // Trouver la différence d'échelle entre  la hauteur de cette copie et la hauteur du groupe sélectionné
    monTexte.resize(monEchelleV,monEchelleV); // Redimensionner le texte suivant cette échelle
    texteTmp_1.remove(); // Supprimer la copie vectorisée du cadre de texte
var texteTmp_2 = monTexte.duplicate().createOutline(); // Dupliquer le cadre de texte à sa nouvelle taille et vectoriser la copie
    monTexte.left += monGroupe.left - texteTmp_2.left; // Déplacer le texte de la différence de position horizontale entre cette copie et le groupe
    monTexte.top += monGroupe.top - texteTmp_2.top; // Déplacer le texte de la différence de position verticale entre cette copie et le groupe
var diffLargeur = monGroupe.width - texteTmp_2.width; // Trouver la différence de largeur entre le groupe et la copie vectorisée du texte
var monApproche = (diffLargeur*1000)/(monTexte.textRange.size*(monTexte.textRange.length-1)); // Calculer l'approche pour corriger la largeur suivant cette différence
texteTmp_2.remove(); // supprimer la copie vectorisée du cadre de texte
monTexte.textRange.characterAttributes.tracking = monApproche.toFixed(0); // Appliquer la nouvelle approche
trouverCouleurGroupe(monGroupe); // Appel de la fonction pour trouver la couleur du premier item du groupe (nécessite une boucle car il peut y avoir des groupes imbriqués
monGroupe.remove(monGroupe); // suppression du groupe
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function trouverCouleurGroupe(groupeEnCours){
    for(i=0;i<groupeEnCours.pageItems.length;i++){
        if(groupeEnCours.pageItems[i].typename != "GroupItem"){
            monTexte.textRange.fillColor = groupeEnCours.pageItems[i].fillColor;
        }else{
            trouverCouleurGroupe(groupeEnCours.pageItems[i]);
            break;
        };
    };
};
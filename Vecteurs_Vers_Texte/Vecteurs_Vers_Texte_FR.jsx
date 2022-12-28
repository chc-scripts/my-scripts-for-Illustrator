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
if (maSelection.length == 2) {
app.executeMenuCommand("noCompoundPath");
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
monTexte.textRange.horizontalScale = 100;
var texteTmp_1 = monTexte.duplicate().createOutline();
var monEchelleV = monGroupe.height / texteTmp_1.height*100;
    monTexte.resize(monEchelleV,monEchelleV);
    texteTmp_1.remove();
var texteTmp_2 = monTexte.duplicate().createOutline();
    monTexte.left += monGroupe.left - texteTmp_2.left;
    monTexte.top += monGroupe.top - texteTmp_2.top;
var diffLargeur = monGroupe.width - texteTmp_2.width;
var monApproche = (diffLargeur*1000)/(monTexte.textRange.size*(monTexte.textRange.length-1));
texteTmp_2.remove();
monTexte.textRange.characterAttributes.tracking = monApproche.toFixed(0);
trouverCouleurGroupe(monGroupe);
monGroupe.remove(monGroupe);
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
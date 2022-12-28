/*Vecteurs_Vers_Texte
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Edit vectorized text.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Utilisation :
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
        Select two objects: 1 GROUP consisting of one or more vectorized letters and the same TEXT in the same font but
         non-vectorized (regardless of the difference in size and color between the two).
         After running the script, the text object has replaced the vector group and can therefore be edited in place.
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
         alert("You have to select non-vectorized text and vectorized text so that script \n replaces the vector group with the text box.");
     };
} else {
    alert("You have to select non-vectorized text and vectorized text so that script \n replaces the vector group with the text box.");
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
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
#targetengine 'main'
$.localize = true;
$.locale = null;
var maSelection = app.activeDocument.selection
if (maSelection.length == 2) { // Check that the selection has only 2 items
app.executeMenuCommand("noCompoundPath"); // undo any CompoundPathItems
// Check that the 2 selected elements are indeed a group and a text frame and distinguish them
     if (maSelection[0].typename=="TextFrame"&&maSelection[1].typename=="GroupItem"){
         var monTexte = maSelection[0];
         var monGroupe = maSelection[1];
     } else if (maSelection[1].typename=="TextFrame"&&maSelection[0].typename=="GroupItem"){
         var monTexte = maSelection[1];
         var monGroupe = maSelection[0];
     } else {
         alert(localize({en:"You have to select non-vectorized text and vectorized text so that script \n replaces the vector group with the text box.", 
             fr:"Il faut sélectionner un texte non vectorisé et un texte vectorisé afin \n que script remplace le groupe vectoriel par la zone de texte."}));
     };
} else {
    alert(localize({en:"You have to select non-vectorized text and vectorized text so that script \n replaces the vector group with the text box.",
            fr:"Il faut sélectionner un texte non vectorisé et un texte vectorisé afin \n que script remplace le groupe vectoriel par la zone de texte."));
};
monTexte.textRange.paragraphAttributes.justification = Justification.LEFT; // text left justification
monTexte.textRange.verticalScale = 100; // Rescale text to 100% in case it is distorted vertically
monTexte.textRange.horizontalScale = 100; // Rescale text to 100% in case it is distorted horizontally
monTexte.textRange.characterAttributes.tracking = 0; // Reset tracking
var texteTmp_1 = monTexte.duplicate().createOutline(); // Duplicate the text frame and vectorize the copy
var monEchelleV = monGroupe.height / texteTmp_1.height*100; // Find the scale difference between the height of this copy and the height of the selected group
    monTexte.resize(monEchelleV,monEchelleV); // Resize text to this scale
    texteTmp_1.remove(); // Delete vectorized copy of text frame
var texteTmp_2 = monTexte.duplicate().createOutline(); // Duplicate the text frame to its new size and vectorize the copy
    monTexte.left += monGroupe.left - texteTmp_2.left; // Move the text of the horizontal position difference between this copy and the selected group
    monTexte.top += monGroupe.top - texteTmp_2.top; // Move the text of the vertical position difference between this copy and the selected group
var diffLargeur = monGroupe.width - texteTmp_2.width; // Find the difference in width between the group and the vectorized copy of the text
var monApproche = (diffLargeur*1000)/(monTexte.textRange.size*(monTexte.textRange.length-1)); // Calculate the tracking to apply to correct the width according to this difference
texteTmp_2.remove(); // remove vectorized copy of text frame
monTexte.textRange.characterAttributes.tracking = monApproche.toFixed(0); // Assign the tracking
trouverCouleurGroupe(monGroupe); // Call of the function to find the color of the first item of the group (requires a loop because there can be nested groups)
monGroupe.remove(monGroupe); // Delete group
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
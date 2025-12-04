/*Vecteurs_Vers_Texte
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Edit vectorized text.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Usage :
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Select two objects: one vectorized character or a group of vectorized characters and the same character(s) in the
        same font but non-vectorized (regardless of the difference in size and color between the two).
         After running the script, the text object has replaced the vector group and can therefore be edited in place.
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#targetengine 'main'
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false); // Fix drag and drop a .jsx file
$.localize = true;
$.locale = null;
var maSelection = app.activeDocument.selection
if (maSelection.length == 2) { // Check that the selection has only 2 items
     if (maSelection[0].typename=="TextFrame"){
         monTexte = maSelection[0];
         monObjVect = maSelection[1];
     } else if (maSelection[1].typename=="TextFrame"){
         monTexte = maSelection[1];
         monObjVect = maSelection[0];
     } else {
         alert(localize({en:"You have to select 2 objects: one is a text frame. The other is a path or a group of paths.", 
             fr:"Il faut s\351lectionner 2 objets : une zone de texte d\'une part,\n un groupe ou un trac\351 d\'autre part."}));
     };
} else {
    alert(localize({en:"You have to select 2 objects: one is a text frame. The other is a path or a group of paths.",
            fr:"Il faut s\351lectionner 2 objets : une zone de texte d\'une part,\n un groupe ou un trac\351 d\'autre part."}));
};
monTexte.textRange.paragraphAttributes.justification = Justification.LEFT; // text left justification
monTexte.textRange.verticalScale = 100; // Rescale text to 100% in case it is distorted vertically
monTexte.textRange.horizontalScale = 100; // Rescale text to 100% in case it is distorted horizontally
monTexte.textRange.characterAttributes.tracking = 0; // Reset tracking
var texteTmp_1 = monTexte.duplicate().createOutline(); // Duplicate the text frame and vectorize the copy
var monEchelleV = monObjVect.height / texteTmp_1.height*100; // Find the scale difference between the height of this copy and the height of the selected group
    monTexte.resize(monEchelleV,monEchelleV); // Resize text to this scale
    texteTmp_1.remove(); // Delete vectorized copy of text frame
var texteTmp_2 = monTexte.duplicate().createOutline(); // Duplicate the text frame to its new size and vectorize the copy
    monTexte.left += monObjVect.left - texteTmp_2.left; // Move the text of the horizontal position difference between this copy and the selected group
    monTexte.top += monObjVect.top - texteTmp_2.top; // Move the text of the vertical position difference between this copy and the selected group
if(monTexte.textRange.length>1){
    var diffLargeur = monObjVect.width - texteTmp_2.width; // Find the difference in width between the group and the vectorized copy of the text
    var monApproche = (diffLargeur*1000)/(monTexte.textRange.size*(monTexte.textRange.length-1)); // Calculate the tracking to apply to correct the width according to this difference
    monTexte.textRange.characterAttributes.tracking = monApproche.toFixed(0); // Assign the tracking
};
texteTmp_2.remove(); // remove vectorized copy of text frame
trouverCouleurGroupe(monObjVect); // Call of the function to find the color of the first item of the group (requires a loop because there can be nested groups)
monObjVect.remove(); // Delete group
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function trouverCouleurGroupe(ObjVectEnCours){
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    switch(ObjVectEnCours.typename){
        case "PathItem":
            monTexte.textRange.fillColor = ObjVectEnCours.fillColor;break;
        case "CompoundPathItem":
            monTexte.textRange.fillColor = ObjVectEnCours.pathItems[0].fillColor;break;
        case "GroupItem":
            for(i=0;i<ObjVectEnCours.pageItems.length;i++){
                   if(ObjVectEnCours.pageItems[i].typename=="PathItem"){
                        monTexte.textRange.fillColor = ObjVectEnCours.pathItems[0].fillColor;
                   }else if(ObjVectEnCours.pageItems[i].typename == "CompoundPathItem"){
                       monTexte.textRange.fillColor = ObjVectEnCours.pageItems[i].pathItems[0].fillColor;
                   }else{
                       trouverCouleurGroupe(ObjVectEnCours.pageItems[i]);
                   };
             };break;
     };
};
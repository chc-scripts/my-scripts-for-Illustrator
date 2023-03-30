//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Hauteur_Texte
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    The script returns the vector height of a capital H for the selected text.
    It proposes to calculate the scale factor to use if we wanted to give it another height (still on
    the base of a vectorized capital H).It finally proposes to apply or not the transformation to the selection
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
$.localize = true;
$.locale = null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
var uniteEnCours = app.preferences.getIntegerPreference("text/units");
decodeCurrentUnit(uniteEnCours);
var maSelection = app.activeDocument.selection; // Assign a variable to the current selection
var messageErreur = ({en:"You must select only non-vectorized text\n\(with the white arrow if it is part of a group\)", fr:"Il faut s\351lectionner uniquement un texte non-vectoris\351\n\(avec la fl\350che blanche s\'il fait partie d\'un groupe\)"});
if(maSelection.length != 0 && maSelection[0]){; // If the current selection is not empty...
    if(maSelection[0].typename === "TextFrame"){; // If the current selection is a text frame...
        TrouverHauteurActuelle(maSelection);// Call the function
        boiteDialHauteurTexte();// Call the function
                if (hauteurFinale != ""){;// If the hauteurFinale field is not empty...
                    boiteDialTransform()
                };
    }else{alert(messageErreur);// Show error msg if current selection is not a text object...
    };
    }else{alert(messageErreur);// Show error msg if current selection is not a text object...
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dialog #1    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function boiteDialHauteurTexte(){;
var boiteDialHauteurTexte = new Window ("dialog", {en:"Physical text height", fr:"Hauteur physique du texte"}); // Dialog box creation
    boiteDialHauteurTexte.alignChildren = "left"; // Align the different items of the dialog box to the left
    boiteDialHauteurTexte.center(); // Center the dialog box
var RenvoiHautLettreActuelle = boiteDialHauteurTexte.add("statictext",undefined, {en:"The physical height of the selected text is: " + hVectoSelect.toFixed(2) + textUniteEnCours + ".", fr:"La hauteur physique du texte sélectionné est de : " + hVectoSelect.toFixed(2) + textUniteEnCours + "."});
    RenvoiHautLettreActuelle.orientation = "row";// Arrange items in rows
var Proposition = boiteDialHauteurTexte.add("statictext",undefined, {en:"Know the scale to apply based on a vectorized text height of:",
                                                                                                     fr:"Conna\356tre l\'\351chelle \340 appliquer sur la base d\'une hauteur vectoris\351e du texte de :"}, {multiline:true});
var grpHauteurTexteFinale  = boiteDialHauteurTexte.add("group"); // Creation, in the dialog box, of a group for the scale to be applied and its unit
    grpHauteurTexteFinale.orientation = "row";// Arrange items in rows
var HTexteFinale = grpHauteurTexteFinale.add("edittext", undefined,""); // Create the "Final text height" input box
    HTexteFinale.characters = 5;// field width in number of characters
var localeUnit = {en:"inches", fr:"pouces"};
var ddl_uniteHTexteFinale = grpHauteurTexteFinale.add("DropDownList",undefined, ["mm", localeUnit, "pixels"]); // Create the Drop down list for the "Text height" field"
    ddl_uniteHTexteFinale.selection = ddl_uniteHTexteFinale.selection === null ? 0 : ddl_uniteHTexteFinale.selection;
var btnOk = boiteDialHauteurTexte.add("button", undefined, "Ok"); // Create a validation button
boiteDialHauteurTexte.show(); // Bring up the dialog box
hauteurFinale = HTexteFinale.text  // Declaration of the variable whose value will be returned (without "var" so that the variable is global)
monUnite = ddl_uniteHTexteFinale.selection.text;
if (ddl_uniteHTexteFinale.selection.index === 0){
    factConvers = 2.834645;
}else if (ddl_uniteHTexteFinale.selection.index === 1){
    factConvers = 72;
}else{
    factConvers = 1;
};
return (hauteurFinale,monUnite,factConvers);// Returning the variable
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Selected text height    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function TrouverHauteurActuelle(maSelection) {;
var maSelectionDupliTemp = maSelection[0].duplicate();// Duplicate the selected text object
maSelectionDupliTemp.contents = "H";// Replaces its value with a capital H
var maSelectionVectoTemp = maSelectionDupliTemp.duplicate().createOutline();// Duplicate the capital H and vectorize it
hVectoSelectPixels = maSelectionVectoTemp.height;
hVectoSelect = (maSelectionVectoTemp.height)/coefUniteEnCours; // Computes and assigns a global variable to the height of the vectorized H
rapport = maSelectionDupliTemp.height / maSelectionVectoTemp.height; // Calculate the ratio between vectorized and non-vectorized H
maSelectionDupliTemp.remove();// Deletes the text object containing an H
maSelectionVectoTemp.remove();// Remove the vectorized H
return(hVectoSelect, hVectoSelectPixels);// Returns the height of the vectorized H and the vectorized/non-vectorized ratio
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dialog #2   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function boiteDialTransform(){;
coeff = ((hauteurFinale*factConvers)*100)/hVectoSelectPixels  // Calculates the coefficient in % to apply to bring the text to its final height
var boiteDialTransform = new Window ("dialog", "% transformation"); // Dialog box creation
    boiteDialTransform.alignChildren = "left"; // Align the different items of the dialog box to the left
var lblTransf = boiteDialTransform.add("statictext",undefined, {en:"The percentage to apply to resize objects based on a letter height of\n" + hauteurFinale + " " + monUnite + " is : ", 
                                                                                             fr:"Le pourcentage \340 appliquer pour redimensionner vos objets\nsur la base d'une hauteur de lettre de " + hauteurFinale + " " + monUnite + " est : "} , {multiline:true});
var grpTransform  = boiteDialTransform.add("group"); // Creation, in the dialog box, of a group for the transformation coefficient to apply, its unit and its legend
    grpTransform.alignChildren= "top"; // Arrange items in rows
    grpTransform.orientation ="row";// Arrange items in rows
var valeurTransform = grpTransform.add("edittext", undefined,coeff.toFixed(2)); // Creation of the copy area of the % transformation
    valeurTransform.characters =8; // Field width in number of characters
var uniteTransform = grpTransform.add("statictext", undefined,"% ");
    uniteTransform.characters = 2;// Field width in number of characters
var grpBoutons = boiteDialTransform.add("group"); // Creation, in the dialog box, of a group for the buttons
var btnAppliquer = grpBoutons.add("button",undefined, {en:"Apply", fr:"Appliquer"},{name:"ok"});
    btnAppliquer.onClick = function(){app.activeDocument.selection[0].resize(coeff,coeff);
                                                        boiteDialTransform.close();
                                                       };
var btnAnnuler = grpBoutons.add("button",undefined, {en:"Close", fr:"Fermer"}, {name:"cancel"});
    btnAnnuler.onClick = function(){pressePapier(coeff);
                                                        boiteDialTransform.close();
                                                       };
boiteDialTransform.center(); // Center the dialog box
boiteDialTransform.show(); // Bring up the dialog box
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Decode current unit   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decodeCurrentUnit(uniteEnCours) {
    switch (uniteEnCours) {
        case 0 :
            coefUniteEnCours = 72;
            textUniteEnCours = {en:" inches",fr:" pouces"};
            return(coefUniteEnCours, textUniteEnCours);
            break;
        case 1 :
            coefUniteEnCours = 2.834645;
            textUniteEnCours = " mm";
            return(coefUniteEnCours, textUniteEnCours);
            break;
        case 2 :
            coefUniteEnCours = 1;
            textUniteEnCours = " points";
            return(coefUniteEnCours, textUniteEnCours);
            break;
        case 6 :
            coefUniteEnCours = 1;
            textUniteEnCours = " pixels";
            return(coefUniteEnCours, textUniteEnCours);
            break;
    };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Clipboard   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pressePapier(coeff) {
var montexte = app.activeDocument.textFrames.add(); // Create a text frame
montexte.contents = coeff;
app.selection = []; // Deselect all
montexte.selected = true; // Add the text frame to the selection
app.copy(); // Copy the contents of the text frame
montexte.remove(); // Remove the text frame
};

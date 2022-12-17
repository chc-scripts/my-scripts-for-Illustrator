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
var maSelection = app.activeDocument.selection; // Assign a variable to the current selection
var messageErreur = ("You must select only non-vectorized text\n\(with the white arrow if it is part of a group\)");
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
//    Dialog #1    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function boiteDialHauteurTexte(){;
var boiteDialHauteurTexte = new Window ("dialog", "Physical text height"); // Dialog box creation
    boiteDialHauteurTexte.alignChildren = "left"; // Align the different items of the dialog box to the left
    boiteDialHauteurTexte.center(); // Center the dialog box
var RenvoiHautLettreActuelle = boiteDialHauteurTexte.add("statictext",undefined,"The physical height of the selected text is: " + hTexteSelect.toFixed(2) + " mm.");
    RenvoiHautLettreActuelle.orientation = "row";// Arrange items in rows
var Proposition = boiteDialHauteurTexte.add("statictext",undefined,"Know the scale to apply based on a vectorized text height of:", {multiline:true});
var grpHauteurTexteFinale  = boiteDialHauteurTexte.add("group"); // Creation, in the dialog box, of a group for the scale to be applied and its unit
    grpHauteurTexteFinale.orientation = "row";// Arrange items in rows
var HTexteFinale = grpHauteurTexteFinale.add("edittext", undefined,""); // Create the "Final text height" input box
    HTexteFinale.characters = 5;// field width in number of characters
var lbl_uniteHTexteFinale = grpHauteurTexteFinale.add("statictext",undefined,"mm"); // Create the label for the "Text height" field"
var btnOk = boiteDialHauteurTexte.add("button", undefined, "Ok"); // Create a validation button
boiteDialHauteurTexte.show(); // Bring up the dialog box
hauteurFinale = HTexteFinale.text  // Declaration of the variable whose value will be returned (without "var" so that the variable is global)
return (hauteurFinale);// Returning the variable
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Selected text height    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function TrouverHauteurActuelle(maSelection) {;
var maSelectionDupliTemp = maSelection[0].duplicate();// Duplicate the selected text object
maSelectionDupliTemp.contents = "H";// Replaces its value with a capital H
var maSelectionVectoTemp = maSelectionDupliTemp.duplicate().createOutline();// Duplicate the capital H and vectorize it
hTexteSelect = (maSelectionVectoTemp.height)/2.835; // Computes and assigns a global variable to the height of the vectorized H
rapport = maSelectionDupliTemp.height / maSelectionVectoTemp.height; // Calculate the ratio between vectorized and non-vectorized H
maSelectionDupliTemp.remove();// Deletes the text object containing an H
maSelectionVectoTemp.remove();// Remove the vectorized H
return(hTexteSelect,rapport);// Returns the height of the vectorized H and the vectorized/non-vectorized ratio
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dialog #2   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function boiteDialTransform(){;
coeff = (hauteurFinale * 100)/hTexteSelect // Calculates the coefficient in % to apply to bring the text to its final height
var boiteDialTransform = new Window ("dialog", "% transformation"); // Dialog box creation
    boiteDialTransform.alignChildren = "left"; // Align the different items of the dialog box to the left
var lblTransf = boiteDialTransform.add("statictext",undefined,"The percentage to apply to resize objects based on a letter height of\n" + hauteurFinale +" mm is : " , {multiline:true});
var grpTransform  = boiteDialTransform.add("group"); // Creation, in the dialog box, of a group for the transformation coefficient to apply, its unit and its legend
    grpTransform.alignChildren= "top"; // Arrange items in rows
    grpTransform.orientation ="row";// Arrange items in rows
var valeurTransform = grpTransform.add("edittext", undefined,coeff.toFixed(2)); // Creation of the copy area of the % transformation
    valeurTransform.characters =8; // Field width in number of characters
var uniteTransform = grpTransform.add("statictext", undefined,"% ");
    uniteTransform.characters = 2;// Field width in number of characters
var grpBoutons = boiteDialTransform.add("group"); // Creation, in the dialog box, of a group for the buttons
var btnAppliquer = grpBoutons.add("button",undefined,"Apply",{name:"ok"});
    btnAppliquer.onClick = function(){app.activeDocument.selection[0].resize(coeff,coeff);
                                                        boiteDialTransform.close();
                                                       };
var btnAnnuler = grpBoutons.add("button",undefined,"Close",{name:"cancel"});
    btnAnnuler.onClick = function(){pressePapier(coeff);
                                                        boiteDialTransform.close();
                                                       };
boiteDialTransform.center(); // Center the dialog box
boiteDialTransform.show(); // Bring up the dialog box
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

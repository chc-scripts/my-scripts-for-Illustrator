/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Renum_Calques_PlansW_En
/*
>=---------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=---------------------------------------------------------------------------------------------------------------------------------------------
renumber the layers and / or the artboards with the possibility of adding a Prefix and/or a Suffix
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
$.localize = true;
$.locale = null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
annul = false;
if (app.documents.length > 0) { // Check if  an Illustrator document  is open
    var doc = app.activeDocument // Create a variable for the active document
    boiteDialRenommer(); // Call the function to bring a dialog box up
    if (!annul && cochePlans + cocheCalques === 0){
        alert(localize({en:"You must check at least one box \(\'Artboards\' or \'Layers\'\) for the script to work", fr:"Vous devez cocher l'une des 2 cases 'Plans de travail' ou 'Calques pour que le script agisse"}))
    };
    renommer(); // Call the function to rename layers and / or artboards
} else {
  alert (localize({en:"There is no open document.", fr:"Il n'y a pas de document ouvert."})) // Shows an alert if there is no open document
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////    Creation of a dialog box    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function boiteDialRenommer(){;
    var boiteDialRenommer = new Window ("dialog", {en:"renumber the layers and / or the artboards", fr:"Renommer les calques et/ou les plans de travail"});
    boiteDialRenommer.alignChildren = "left"; // Align the different items of the dialog box to the left
    boiteDialRenommer.center(); // Center the dialog box
/////// Prefix
    var grpPrefixe = boiteDialRenommer.add("group"); // Creation, in the dialog box, of a group for the Prefix and its label
            grpPrefixe.orientation = "row";// Organize items by row
    var lbl_Prefixe= grpPrefixe.add("statictext",undefined, {en:"Enter the Prefix :", fr:"Entrez le pr\351fixe :"}); // Create the Prefix label
    var champPrefixe = grpPrefixe.add("edittext", undefined,"");// Create the field to enter the Prefix value
            champPrefixe.characters = 20;// Field's width in number of characters
            champPrefixe.active=true;// The focus will be placed on this field
/////// Starting value
    var grpPointDepart  = boiteDialRenommer.add("group"); // Creation, in the dialog box, of a group for the Starting value number and its label
            grpPointDepart.orientation = "row";// Organize items by row
    var lbl_Debut= grpPointDepart.add("statictext",undefined, {en:"Starting value :", fr:"Valeur de d\351part :"}); // Create the Starting value label
    var champDebut = grpPointDepart.add("edittext", undefined,""); // Create the field to enter the Starting value
            champDebut.characters = 10;// Field's width in number of characters
    var alphaNum = grpPointDepart.add("Checkbox",undefined, "Alpha_Num"); // Create the check box "AlphaNum"
            alphaNum.value = false;
/////// Suffix
    var grpSuffixe= boiteDialRenommer.add("group"); // Creation, in the dialog box, of a group for the Suffix and its label
            grpSuffixe.orientation = "row";// Organize items by row
    var lbl_Suffixe= grpSuffixe.add("statictext",undefined, {en:"Enter the Suffix :", fr:"Entrez le suffixe :"}); // Create the Suffix label
    var champSuffixe = grpSuffixe.add("edittext", undefined,"");// Create the field to enter the Suffix
            champSuffixe.characters = 20;// Field's width in number of characters
/////// Target-s
    var grpCibles  = boiteDialRenommer.add("group"); // Creation, in the dialog box, of a group for the targets and their labels
            grpCibles.orientation = "row";// organiser les éléments en ligne
    var ciblePlans = grpCibles.add("Checkbox",undefined, {en:"Artboards", fr:"Plans de travail"}); // Create the check box "Artboards"
            ciblePlans.value = false;
            ciblePlans.helpTip = "Apply to artboards";
    var cibleCalques = grpCibles.add("Checkbox",undefined, {en:"Layers", fr:"Calques"}); // Create the check box "Layers"
            cibleCalques.value = false;
/////// Boutons
    var grpBoutons   = boiteDialRenommer.add("group"); // Creation, in the dialog box, of a group for the buttons Ok et Cancel
            grpBoutons.orientation = "row";// Organize items by row
    var btnLancer = grpBoutons.add("button", undefined, "Ok"); // Creata button to validate
    var btnAnnul = grpBoutons.add("button", undefined, {en:"Cancel", fr:"Annuler"},{name:'cancel'}); // Creata button to cancel
        btnAnnul.onClick = function(){annul = true;
                                                      boiteDialRenommer.close();};
boiteDialRenommer.show(); // Bring up the dialog box
// Assign values to several variables when Ok is clicked
    if (btnLancer.onClick =true) { // 
        if(champDebut.text !== ""){;
         debut = champDebut.text; 
         }else{
             debut=1
         };
         Prefix = champPrefixe.text;
         Suffix = champSuffixe.text;
         cocheCalques = cibleCalques.value
         cochePlans = ciblePlans.value
         cocheAlphaNum = alphaNum.value
     return (debut,Prefix,Suffix,cochePlans,cocheCalques,cocheAlphaNum); // Return the variables
    };
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////    Rename the layers and / or the artboards  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function renommer () {
  if (cocheCalques ===true ){
        for (i = 0; i < doc.layers.length; i++) { // Creation of a loop passing on each layer
        var compteur = parseInt (debut,10)+i; // Creation of a variable incremented from the starting value
                if (debut === ""){
                     doc.layers[i].name =Prefix + "0" + (i+1) + Suffix // Number the layers from 01 if there is no starting value
                } else {
                    if (compteur<=9) {
                        doc.layers[i].name =Prefix + "0" + compteur + Suffix // Number the layers from 01 to 09
                    } else {
                        if (compteur>99){
                            if (cocheAlphaNum===true){
                                noEnCours = String(compteur.toString()).substr(0,2);
                                uniteEnCours = String(compteur.toString()).substr(2,1);
                                encodageNumero()
                                doc.layers[i].name = Prefix+ codeCentaine + uniteEnCours + Suffix // Number the layers from from a starting value higher than 10  and encoded if higher than 99
                                }else{
                                    doc.layers[i].name = Prefix+compteur + Suffix // Number the layers from from a starting value higher than 100
                                    };
                         }else{
                        doc.layers[i].name = Prefix+compteur + Suffix // Number the layers from a starting value higher than 10 and without encoding
                        };
                      };
                   };
               };
        };
     if (cochePlans === true) {
           for (j = 0; j < doc.artboards.length; j++) { // Creation of a loop passing on each artboard
    var compteur = parseInt (debut,10)+j; // Creation of a variable incremented from the starting value
            if (debut === ""){
                 doc.artboards[j].name =Prefix + "0" + (j+1) + Suffix // Number the artboards from 01 if there is no starting value
            } else {
                if (compteur<=9) {
                    doc.artboards[j].name =Prefix + "0" +compteur + Suffix // Number the artboards from 01 to 09
                } else {
                         if (compteur>99){
                            if (cocheAlphaNum===true){
                                noEnCours = String(compteur.toString()).substr(0,2);
                                uniteEnCours = String(compteur.toString()).substr(2,1);
                                encodageNumero()
                                doc.artboards[j].name = Prefix+ codeCentaine + uniteEnCours + Suffix // Number the artboards from from a starting value higher than 10  and encoded if higher than 99
                                }else{
                                    doc.artboards[j].name = Prefix+compteur + Suffix // Number the artboards from from a starting value higher than 100
                                    };
                         }else{
                    doc.artboards[j].name = Prefix+compteur + Suffix // Number the artboards from a starting value higher than 10 and without encoding
                        };
                    };
                };
            };
       };
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////    Encode number higher than100  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function encodageNumero(){
            switch(noEnCours){
                case "10":
                    codeCentaine = "a"  break;
                case "11":
                    codeCentaine = "b"  break;
                case "12":
                    codeCentaine = "c"  break;
                case "13":
                    codeCentaine = "d"  break;
                case "14":
                    codeCentaine = "e"  break;
                case "15":
                    codeCentaine = "f"  break;
                case "16":
                    codeCentaine = "g"  break;
                case "17":
                    codeCentaine = "h"  break;
                case "18":
                    codeCentaine = "i"  break;
                case "19":
                    codeCentaine = "j"  break;
                case "20":
                    codeCentaine = "k"  break;
                case "21":
                    codeCentaine = "l"  break;
                case "22":
                    codeCentaine = "m" break;
                case "23":
                    codeCentaine = "n"  break;
                case "24":
                    codeCentaine = "o"  break;
                case "25":
                    codeCentaine = "p"  break;
                case "26":
                    codeCentaine = "q"  break;
                case "27":
                    codeCentaine = "r"  break;
                case "28":
                    codeCentaine = "s"  break;
                case "29":
                    codeCentaine = "t"  break;
                case "30":
                    codeCentaine = "u"  break;
                case "31":
                    codeCentaine = "v"  break;
                case "32":
                    codeCentaine = "w"  break;
                case "33":
                    codeCentaine = "x"  break;
                case "34":
                    codeCentaine = "y"  break;
                case "35":
                    codeCentaine = "z"  break;
                };
        return codeCentaine;
};
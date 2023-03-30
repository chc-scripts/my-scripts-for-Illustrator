////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*SupprPetitsObjets
>=-----------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=-----------------------------------------------------------------------------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Delete objects whose width and/or height are less than the chosen dimension
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
$.localize = true;
$.locale = null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
// Declare variables for the active document
monFichier = app.activeDocument;
maSelection = monFichier.selection;
comptage = 0;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dialog Box  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var boiteDial = new Window("dialog", {en:"Delete small objects", fr:"Suppression petits objets"}); 
    boiteDial.orientation = "column"; 
    boiteDial.alignChildren = ["left","top"]; 
//// Panel_1
var Panneau1 = boiteDial.add("panel", [0,0,198,150], {en:"Smaller than", fr:"Inf\351rieurs \340"}); 
    Panneau1.orientation = "column"; 
    Panneau1.alignChildren = ["left","top"]; 
/////// Width_Group
var groupeLargeur = Panneau1.add("group", [5,5,180,50]); 
    groupeLargeur.orientation = "row"; 
    groupeLargeur.alignChildren = ["left","center"]; 
var sttLargeur = groupeLargeur.add("statictext", [5,15,55,40], {en:"Width: ", fr:"Largeur "}); 
var edtValLargeur = groupeLargeur.add('edittext',[57,15,101,40],0.2);
var localiseUnit = {en:"inches", fr:"pouces"};
var lstUnit = groupeLargeur.add("dropdownlist", [106,15,175,40], ["mm",localiseUnit,"pixels"]); 
        lstUnit.selection = 0; 
/////// Divider_1
var diviseur_1 = Panneau1.add('panel', [8,55,180,57], undefined);
/////// And_Or_Group
var groupeEtOu = Panneau1.add("group", [5,62,168,88]); 
    groupeEtOu.orientation = "row"; 
    groupeEtOu.alignChildren = ["left","center"]; 
var opEt = groupeEtOu.add("radiobutton", [5,5,49,20], {en:"And", fr:"Et"}); 
var opOu = groupeEtOu.add("radiobutton", [54,5,91,20], {en:"Or", fr:"Ou"}); 
    opOu.value = true; 
/////// Divider_2
var diviseur_2 = Panneau1.add('panel', [8,93,1/0,95], undefined);
/////// Height_Group
var groupeHauteur = Panneau1.add("group", [5,100,173,135],); 
var sttHauteur = groupeHauteur.add("statictext", [5,5,55,30], {en:"Height:", fr:"Hauteur"}); 
var edtValHauteur = groupeHauteur.add('edittext',[57,5,101,30],""); 
var reprUnit = groupeHauteur.add("statictext", [106,5,169,30], lstUnit.selection.text);
//// Panel_2
var Panneau2 = boiteDial.add("panel", [0,160,198,240], {en:"Apply to:", fr:"Appliquer \340 :"}); 
    Panneau2.orientation = "column"; 
    Panneau2.alignChildren = ["left","top"]; 
var rdmaSelection = Panneau2.add("radiobutton", [10,15,210,40], {en:"the selection", fr:"la s\351lection"});
var rdmonDoc = Panneau2.add("radiobutton", [10,45,220,72], {en:"All in the document", fr:"tout le document"});
rdmaSelection.value = true;
monChoixSelect = true;
//// Panel_3
var Panneau3 = boiteDial.add("panel", [0,160,198,200], {en:"Number of deleted objects: ", fr: "Nb objets supprim\351s : "}); 
    Panneau3.orientation = "row"; 
    Panneau3.alignChildren = ["left","top"];
    Panneau3.graphics.backgroundColor = Panneau3.graphics.newBrush (Panneau3.graphics.BrushType.SOLID_COLOR,[0.4,0.5,0.4]);
var monCompteur = Panneau3.add("statictext", [15,10,50,25], "");
/////// User_Actions
edtValLargeur.onChange = function(){majComptage()};
lstUnit.onChange = function(){reprUnit.text=lstUnit.selection.text
                                                majComptage()};                     
opEt.onClick = function(){majComptage()};
opOu.onClick = function(){majComptage()};
edtValHauteur.onChange = function(){majComptage()};
rdmaSelection.onClick = function(){ if (rdmaSelection.value === true) {
                                                                        if(maSelection.length < 1){
                                                                            alert(localize({en:"Impossible, nothing is selected !", fr:"Impossible, rien n\'est sélectionn\351 !"}));
                                                                            rdmonDoc.value = true;
                                                                            monChoixSelect = false;
                                                                        } else {
                                                                            monChoixSelect = true;
                                                                            majComptage();
                                                                        };
                                                                } else {
                                                                    monChoixSelect = false;
                                                                    majComptage();
                                                                };
                                              };
rdmonDoc.onClick = function(){ if (rdmaSelection.value === true) {
                                                                        if(maSelection.length < 1){
                                                                            alert(localize({en:"Impossible, nothing is selected !", fr:"Impossible, rien n\'est sélectionn\351 !"}));
                                                                            rdmonDoc.value = true;
                                                                            monChoixSelect = false;
                                                                        } else {
                                                                            monChoixSelect = true;
                                                                            majComptage();
                                                                        };
                                                                } else {
                                                                    monChoixSelect = false;
                                                                    majComptage();
                                                                };
                                                };
/////// Group_Buttons
var groupeBoutons = boiteDial.add("group", undefined); 
    groupeBoutons.orientation = "row"; 
var btnOk = groupeBoutons.add("button", undefined, {en:"Validate", fr:"Valider"}, {name: 'ok'}); 
       btnOk.onClick = function() { if(monChoixSelect) { 
                                                           decoderUnite();
                                                           supprPetitsObjSelection(x,y)
                                                     } else {
                                                           decoderUnite();
                                                           supprPetitsObjFichier(x,y)
                                                     };
                                                 boiteDial.close()
                                                 };
var btnCancel = groupeBoutons.add("button", undefined, {en:"Cancel", fr:"Annuler"}, {name: 'cancel'});  
        btnCancel.onClick = function() {boiteDial.close()};
majComptage()
boiteDial.show();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Counter Update    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function majComptage() {
    i = comptage = 0;
        decoderUnite();
        if(monChoixSelect) { 
                ComptagePetitsObjetsSelection(x,y)
        } else {
                ComptagePetitsObjetsFichier(x,y)
        };
    monCompteur.text = comptage;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Delete small objects in the selection    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function supprPetitsObjSelection(){
        if (x != null){
            if (y != null ){
                if (opEt.value) {
                    for (i =0;i<maSelection.length;i++){
                        if (maSelection[i].width<x && maSelection[i].height<y ){
                            maSelection[i].remove();
                            comptage = comptage + 1;
                        };
                    };
                } else {
                    for (i =0;i<maSelection.length;i++){
                        if (maSelection[i].width<x || maSelection[i].height<y){
                            maSelection[i].remove();
                            comptage = comptage + 1;
                        };
                    };
                };
            } else {
                for (i =0;i<maSelection.length;i++){
                    if (maSelection[i].width<x ){
                        maSelection[i].remove();
                        comptage = comptage + 1;
                    };
                };
            };
        } else {
             if (y != null){
                for (i =0;i<maSelection.length;i++){
                    if (maSelection[i].height<y ){
                        maSelection[i].remove();
                        comptage = comptage + 1;
                    };
                };
            } else {
                    alert(localize({en:"At least 1 of the 2 Width/Height fields must contain a value", fr:"Au moins 1 des 2 champs hauteur/largeur doit contenir une valeur"}));
            };
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Delete small objects troughout the file    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function supprPetitsObjFichier(){
        if (x != null){
            if (y != null && opEt.value === true){
                for (i = monFichier.pageItems.length-1;i>=0;i--){
                    if (monFichier.pageItems[i].width<x && monFichier.pageItems[i].height<y ){
                        monFichier.pageItems[i].remove();
                    };
                };
            } else {
                for (i = monFichier.pageItems.length-1;i>=0;i--){
                    if (monFichier.pageItems[i].width<x ){
                        monFichier.pageItems[i].remove();
                    };
                };
            };
        } else {
             if (y != null){
                for (i = monFichier.pageItems.length-1;i>=0;i--){
                    if (monFichier.pageItems[i].height<y ){
                        monFichier.pageItems[i].remove();
                    };
                };
            } else {
                    alert(localize({en:"At least 1 of the 2 Width/Height fields must contain a value", fr:"Au moins 1 des 2 champs hauteur/largeur doit contenir une valeur"}));
            };
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Decode Unit    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decoderUnite(){
    switch (lstUnit.selection.index) {
        case 0 :
            x = edtValLargeur.text != "" ? edtValLargeur.text*2.834645 : null;
            y = edtValHauteur.text != "" ? edtValHauteur.text*2.834645 : null;
            return(x,y);
            break;
        case 1 :
            x = edtValLargeur.text != "" ? edtValLargeur.text*72 : null;
            y = edtValHauteur.text != "" ? edtValHauteur.text*72 : null;
            return(x,y);
            break;
        case 2 :
            x = edtValLargeur.text != "" ? edtValLargeur.text : null;
            y = edtValHauteur.text != "" ? edtValHauteur.text : null;
            return(x,y);
            break;
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Count small objects in the selection    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ComptagePetitsObjetsSelection(x,y){
        if (x != null){
            if (y != null ){
                if (opEt.value) {
                    for (i =0;i<maSelection.length;i++){
                        if (maSelection[i].width<x && maSelection[i].height<y ){
                            comptage = comptage + 1;
                        };
                    };
                } else {
                    for (i =0;i<maSelection.length;i++){
                        if (maSelection[i].width<x || maSelection[i].height<y){
                            comptage = comptage + 1;
                        };
                    };
                };
            } else {
                for (i =0;i<maSelection.length;i++){
                    if (maSelection[i].width<x ){
                        comptage = comptage + 1;
                    };
                };
            };
        } else {
             if (y != null){
                for (i =0;i<maSelection.length;i++){
                    if (maSelection[i].height<y ){
                        comptage = comptage + 1;
                    };
                };
            } else {
                    alert(localize({en:"At least 1 of the 2 Width/Height fields must contain a value", fr:"Au moins 1 des 2 champs hauteur/largeur doit contenir une valeur"}));
            };
        };
        return (comptage);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Delete small objects in the file    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ComptagePetitsObjetsFichier(x,y){
        if (x != null){
            if (y != null ){
                if (opEt.value) {
                    for (i =0;i<monFichier.pageItems.length;i++){
                        if (monFichier.pageItems[i].width<x && monFichier.pageItems[i].height<y ){
                            comptage = comptage + 1;
                        };
                    };
                } else {
                    for (i =0;i<monFichier.pageItems.length;i++){
                        if (monFichier.pageItems[i].width<x || monFichier.pageItems[i].height<y){
                            comptage = comptage + 1;
                        };
                    };
                };
            } else {
                for (i =0;i<monFichier.pageItems.length;i++){
                    if (monFichier.pageItems[i].width<x ){
                        comptage = comptage + 1;
                    };
                };
            };
        } else {
             if (y != null){
                for (i =0;i<monFichier.pageItems.length;i++){
                    if (monFichier.pageItems[i].height<y ){
                        comptage = comptage + 1;
                    };
                };
            } else {
                    alert(localize({en:"At least 1 of the 2 Width/Height fields must contain a value", fr:"Au moins 1 des 2 champs hauteur/largeur doit contenir une valeur"}));
            };
        };
        return (comptage);
};
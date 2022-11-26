////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*SupprPetitsObjets
>=-----------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=-----------------------------------------------------------------------------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Supprimer les objets dont la largeur et/ou la hauteur sont inférieures à la dimension choisie
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
// Déclaration de variables pour le document actif
monFichier = app.activeDocument;
maSelection = monFichier.selection;
comptage = 0;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Boîte de dialogue  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var boiteDial = new Window("dialog"); 
    boiteDial.text = "Suppression petits objets :"; 
    boiteDial.orientation = "column"; 
    boiteDial.alignChildren = ["left","top"]; 
//// Panneau_1
var Panneau1 = boiteDial.add("panel", [0,0,198,150], "Inf\351rieurs \340"); 
    Panneau1.orientation = "column"; 
    Panneau1.alignChildren = ["left","top"]; 
/////// Groupe_Largeur
var groupeLargeur = Panneau1.add("group", [5,5,180,50]); 
    groupeLargeur.orientation = "row"; 
    groupeLargeur.alignChildren = ["left","center"]; 
var sttLargeur = groupeLargeur.add("statictext", [5,15,48,40], "Largeur "); 
var edtValLargeur = groupeLargeur.add('edittext',[57,15,101,40],0.2); 
var lstUnit = groupeLargeur.add("dropdownlist", [106,15,175,40], ["mm","pouces","pixels"]); 
        lstUnit.selection = 0; 
/////// Diviseur_1
var diviseur_1 = Panneau1.add('panel', [8,55,180,57], undefined);
/////// Groupe_Et_Ou
var groupeEtOu = Panneau1.add("group", [5,62,168,88]); 
    groupeEtOu.orientation = "row"; 
    groupeEtOu.alignChildren = ["left","center"]; 
var opEt = groupeEtOu.add("radiobutton", [5,5,49,20], "Et"); 
var opOu = groupeEtOu.add("radiobutton", [54,5,91,20], "Ou"); 
    opOu.value = true; 
/////// Diviseur_2
var diviseur_2 = Panneau1.add('panel', [8,93,180,95], undefined);
/////// Group_Height
var groupeHauteur = Panneau1.add("group", [5,100,173,135],); 
var sttHauteur = groupeHauteur.add("statictext", [5,5,55,30], "Hauteur"); 
var edtValHauteur = groupeHauteur.add('edittext',[57,5,101,30],""); 
var reprUnit = groupeHauteur.add("statictext", [106,5,169,30], lstUnit.selection.text);
        //reprUnit.enabled =false;
//// Panneau_2
var Panneau2 = boiteDial.add("panel", [0,160,198,240], "Appliquer \340 :"); 
    Panneau2.orientation = "column"; 
    Panneau2.alignChildren = ["left","top"]; 
var rdmaSelection = Panneau2.add("radiobutton", [10,15,210,40], "la s\351lection");
var rdmonDoc = Panneau2.add("radiobutton", [10,45,220,72], "tout le document");
rdmaSelection.value = true;
monChoixSelect = true;
//// Panneau_3
var Panneau3 = boiteDial.add("panel", [0,160,198,200], "Nb objets supprim\351s : "); 
    Panneau3.orientation = "row"; 
    Panneau3.alignChildren = ["left","top"];
    Panneau3.graphics.backgroundColor = Panneau3.graphics.newBrush (Panneau3.graphics.BrushType.SOLID_COLOR,[0.5,0.5,0.5]);
    Panneau3.graphics.foregroundColor = Panneau3.graphics.newPen (Panneau3.graphics.PenType.SOLID_COLOR,[1,1,1],1);
var monCompteur = Panneau3.add("statictext", [15,10,50,25], "");
monCompteur.graphics.foregroundColor = monCompteur.graphics.newPen (boiteDial.graphics.PenType.SOLID_COLOR, [1,1, 1], 1);
/////// Actions utilisateur
edtValLargeur.onChange = function(){majComptage()};
lstUnit.onChange = function(){reprUnit.text=lstUnit.selection.text
                                                majComptage()};                     
opEt.onClick = function(){majComptage()};
opOu.onClick = function(){majComptage()};
edtValHauteur.onChange = function(){majComptage()};
rdmaSelection.onClick = function(){ if (rdmaSelection.value === true) {
                                                                        if(maSelection.length < 1){
                                                                            alert("Impossible, rien n\'est sélectionn\351 !");
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
                                                                            alert("Impossible, rien n\'est sélectionn\351 !");
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
var btnOk = groupeBoutons.add("button", undefined, "Valider", {name: "ok"}); 
       btnOk.onClick = function() { if(monChoixSelect) { 
                                                           decoderUnite();
                                                           supprPetitsObjSelection(x,y)
                                                     } else {
                                                           decoderUnite();
                                                           supprPetitsObjFichier(x,y)
                                                     };
                                                 boiteDial.close()
                                                 };
var btnCancel = groupeBoutons.add("button", undefined, "Annuler", {name: "cancel"});  
        btnCancel.onClick = function() {boiteDial.close()};
majComptage()
boiteDial.show();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Mise à jour de l'aperçu    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//    Supprimer les petits objets dans la sélection    //////////////////////////////////////////////////////////////////////////////////////////////////
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
                    alert("Au moins u1 des 2 champs hauteur/largeur doit contenir une valeur");
            };
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Supprimer les petits objets dans tout le fichier    ////////////////////////////////////////////////////////////////////////////////////////////////
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
                    alert("Au moins 1 des 2 champs hauteur/largeur doit contenir une valeur");
            };
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Decode Unit    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decoderUnite(){
    switch (lstUnit.selection.text) {
        case "mm" :
            x = edtValLargeur.text != "" ? edtValLargeur.text*2.834645 : null;
            y = edtValHauteur.text != "" ? edtValHauteur.text*2.834645 : null;
            return(x,y);
            break;
        case "pouces" :
            x = edtValLargeur.text != "" ? edtValLargeur.text*72 : null;
            y = edtValHauteur.text != "" ? edtValHauteur.text*72 : null;
            return(x,y);
            break;
        case "pixels" :
            x = edtValLargeur.text != "" ? edtValLargeur.text : null;
            y = edtValHauteur.text != "" ? edtValHauteur.text : null;
            return(x,y);
            break;
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Compter les petits objets à supprimer dans la sélection    //////////////////////////////////////////////////////////////////////////////
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
                    alert("Au moins 1 des 2 champs hauteur/largeur doit contenir une valeur");
            };
        };
        return (comptage);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Compter les petits objets à supprimer dans tout le fichier    ////////////////////////////////////////////////////////////////////////////
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
                    alert("Au moins 1 des 2 champs hauteur/largeur doit contenir une valeur");
            };
        };
        return (comptage);
};
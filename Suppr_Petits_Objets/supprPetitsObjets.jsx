/*SupprPetitsObjets
>=-----------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=-----------------------------------------------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
En : Delete selected objects whose width and/or height are less than the chosen dimension including if
they are a part of a compounnd path item.
>=-----------------------------------------------------------------------------------------------------------------------------------------
Fr :Supprimer les objets sélectionnés dont la largeur et/ou la hauteur sont inférieures à la dimension
choisie y compris s'ils sont inclus dans des tracés transparents.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false); // Fix drag and drop a .jsx file
$.localize = true;
$.locale = null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
maSelection = app.activeDocument.selection;
var objGroupes = 0;
premUtil = true;
for(b=0;b<app.activeDocument.selection.length;b++){
    if(app.activeDocument.selection[b].typename === "GroupItem"){
        objGroupes = objGroupes+1
   };
    if(objGroupes>0){
        alert(localize({en: "There are "  + objGroupes + " in the selection",fr: "Il y a " + objGroupes + " groupe\(s\) dans la sélection"}));
        break;
    };
};
if(app.activeDocument.selection.length < 1){
    alert(localize({en: "No way, nothing is selected",fr:"Impossible, rien n\'est sélectionn\351 !"}));
}else if (objGroupes===0){
   //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    var boiteDial = new Window("dialog"); 
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
        boiteDial.text = {en:"Delete small objects", fr:"Suppression petits objets"};
        boiteDial.orientation = "column"; 
        boiteDial.alignChildren = ["left","top"]; 
    //// Panneau_1
    var Panneau1 = boiteDial.add("panel", [5,5,305,81], {en:"Apply To:", fr:"Appliquer \340 :"});
        Panneau1.orientation = "column"; 
        Panneau1.alignChildren = ["left","top"];
    var ckbTraces =Panneau1.add("checkBox",[10,15,290,35],{en:"Path Items", fr:"Tracés"});
    var ckbTTransp =Panneau1.add("checkBox",[10,40,290,60],{en:"Paths in Compound Path Items", fr:"Tracés inclus dans tracés transparents"});
    ckbTraces.value = true;
    ckbTTransp.value = true;
    choixTypeTrace = 3;
    //// Panneau_2
    var Panneau2 = boiteDial.add("panel", [5,96,305,220],{en:"Smaller Than:", fr:"Inf\351rieurs \340 : "}); 
        Panneau2.orientation = "column"; 
        Panneau2.alignChildren = ["left","top"]; 
    /////// Groupe_Largeur
    var groupeLargeur = Panneau2.add("group", [5,5,290,45]);
        groupeLargeur.orientation = "row"; 
        groupeLargeur.alignChildren = ["left","center"]; 
    var sttLargeur = groupeLargeur.add("statictext", [5,5,59,25], {en:"Width: ", fr:"Largeur : "}); 
    var edtValLargeur = groupeLargeur.add('edittext',[62,5,110,27],1);  
    edtValLargeur.characters = 4
    var x = edtValLargeur.text;
    var localiseUnit = {en:"inches", fr:"pouces"};
    var lstUnit = groupeLargeur.add("dropdownlist", [115,5,180,25], ["mm",localiseUnit,"pixels"]);
            lstUnit.selection = 0; 
    /////// Diviseur_1
    var diviseur_1 = Panneau2.add('panel', [5,40,185,42], undefined);
    /////// Groupe_Et_Ou
    var groupeEtOu = Panneau2.add("group",  [5,45,290,70]); 
        groupeEtOu.orientation = "row"; 
        groupeEtOu.alignChildren = ["left","center"]; 
    var opEt = groupeEtOu.add("radiobutton",  [20,5,63,30], {en:"And", fr:"Et"}); 
    var opOu = groupeEtOu.add("radiobutton",  [68,5,113,30], {en:"Or", fr:"Ou"}); 
        opOu.value = true; 
        if(opEt.value === true){
            choixSelect= 2;
            }else{
            choixSelect= 1;};
    /////// Diviseur_2
    var diviseur_2 = Panneau2.add('panel', [5,75,185,77], undefined);
    /////// Groupe_Hauteur
    var groupeHauteur = Panneau2.add("group",  [5,81,290,106],); 
    var sttHauteur = groupeHauteur.add("statictext", [5,5,59,25], {en:"Height:", fr:"Hauteur"}); 
    var edtValHauteur = groupeHauteur.add('edittext',[62,5,110,25],edtValLargeur.text);
    edtValHauteur.characters = 4;
    var y = edtValLargeur.text;
    var reprUnit = groupeHauteur.add("statictext", [115,5,180,25], lstUnit.selection.text);
    /////// Groupe_Barre_de_progression
    var grpProgressBar = boiteDial.add("group", [5,225,305,240]);
    grpProgressBar.alignChildren = "column";
    var maBarre2 = grpProgressBar.add("progressbar", [0, 2, 250, 12], 0, 100);  
    var texteMaBarre2 = grpProgressBar.add("statictext", [255, 0, 305, 15], " 0%"); 
    //// Panneau_Comptage
    var Panneau4 = boiteDial.add("panel",[5,245,305,290], "Nb objets \340 supprimer :"); 
        Panneau4.orientation = "row"; 
        Panneau4.alignChildren = ["left","top"];
        Panneau4.graphics.backgroundColor = Panneau4.graphics.newBrush (Panneau4.graphics.BrushType.SOLID_COLOR,[0.5,0.5,0.5]);
        Panneau4.graphics.foregroundColor = Panneau4.graphics.newPen (Panneau4.graphics.PenType.SOLID_COLOR,[1,1,1],1);
        monCompteur = Panneau4.add("statictext",[5,10,290,30], "");
        monCompteur.graphics.foregroundColor = monCompteur.graphics.newPen (boiteDial.graphics.PenType.SOLID_COLOR, [1,1, 1], 1);
    /////// Actions utilisateur
    ckbTraces.onClick = function(){if (ckbTraces.value === true){
                                                        if (ckbTTransp.value === true){
                                                            choixTypeTrace = 3;
                                                        } else {
                                                            choixTypeTrace = 1;
                                                        };
                                                    } else {
                                                        if (ckbTTransp.value === true){
                                                            choixTypeTrace = 2;
                                                        } else {
                                                            choixTypeTrace = 0;
                                                        };
                                                    };
                                                    majComptage(choixTypeTrace,choixSelect);
                                                };
    ckbTTransp.onClick = function(){if (ckbTTransp.value === true){
                                                            if (ckbTraces.value === true){
                                                                choixTypeTrace = 3;
                                                            } else {
                                                                choixTypeTrace = 2;
                                                            };
                                                        } else {
                                                            if (ckbTraces.value === true){
                                                                choixTypeTrace = 1;
                                                        } else {
                                                            choixTypeTrace = 0;
                                                            };
                                                        };
                                                        majComptage(choixTypeTrace,choixSelect);
                                                    };
    edtValLargeur.onChanging = function(){majComptage(choixTypeTrace,choixSelect)};
    lstUnit.onChange = function(){reprUnit.text=lstUnit.selection.text
                                                    majComptage(choixTypeTrace,choixSelect)};      
    opOu.onClick = function(){if(opOu.value === true){
                                                choixSelect = 1;
                                                majComptage(choixTypeTrace,choixSelect);
                                                }else{
                                                choixSelect = 2;
                                                majComptage(choixTypeTrace,choixSelect);
                                                };
                                                };
    opEt.onClick = function(){if(opOu.value === true){
                                                choixSelect = 1;
                                                majComptage(choixTypeTrace,choixSelect);
                                                }else{
                                                choixSelect = 2;
                                                majComptage(choixTypeTrace,choixSelect);
                                                };
                                                };
    edtValHauteur.onChanging = function(){majComptage(choixTypeTrace,choixSelect)};
    /////// Groupe_Boutons
    var groupeBoutons = boiteDial.add("group", undefined); 
        groupeBoutons.orientation = "row"; 
    var btnOk = groupeBoutons.add("button", undefined, {en:"Validate", fr:"Valider"}, {name: 'ok'}); 
           btnOk.onClick = function() {  decoderUnite();
                                                        if (ckbTraces.value === true) {
                                                            if (ckbTTransp.value === true) {
                                                                SupprTracesTransparents(x,y,choixSelect,choixTypeTrace);
                                                                SupprTraces(x,y,choixSelect,comptageSuppr);
                                                            } else {
                                                                comptageSuppr = 0;
                                                                SupprTraces(x,y,choixSelect,comptageSuppr);
                                                            };
                                                        } else {
                                                            if (ckbTTransp.value === true) {
                                                                SupprTracesTransparents(x,y,choixSelect,choixTypeTrace);
                                                            };
                                                        };
                                                    boiteDial.close();
                                                    };
    var btnCancel = groupeBoutons.add("button", undefined, {en:"Cancel", fr:"Annuler"}, {name: 'cancel'});  
            btnCancel.onClick = function() {boiteDial.close()};
    majComptage(choixTypeTrace,choixSelect)
    boiteDial.show();
};
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
function SupprTraces(x,y){
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
var i,j;
    if (x != null){
        if (y != null ){
            if (choixSelect === 2) {
                for (i =0;i<maSelection.length;i++){
                    if(maSelection[i].typename === "PathItem"){
                        if (maSelection[i].width<x && maSelection[i].height<y ){
                            maSelection[i].selected = true;
                           comptageSuppr = comptageSuppr+1;
                           maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(comptageSuppr));
                           texteMaBarre2.text = maBarre2.value+" %";
                           boiteDial.update();
                        } else {
                           maSelection[i].selected = false;
                        };
                    };
                };
            } else {
                for (i =0;i<maSelection.length;i++){
                    if(maSelection[i].typename === "PathItem"){
                        if (maSelection[i].width<x || maSelection[i].height<y){
                            maSelection[i].selected = true;
                           comptageSuppr = comptageSuppr+1;
                           maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(comptageSuppr));
                           texteMaBarre2.text = maBarre2.value+" %";
                           boiteDial.update();
                        } else {
                            maSelection[i].selected = false;
                            
                        };
                    };
                };
            };
        } else {
            for (i =0;i<maSelection.length;i++){
                if(maSelection[i].typename === "PathItem"){
                    if (maSelection[i].width<x ){
                            maSelection[i].selected = true;
                           comptageSuppr = comptageSuppr+1;
                           maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(comptageSuppr));
                           texteMaBarre2.text = maBarre2.value+" %";
                           boiteDial.update();
                        } else {
                            maSelection[i].selected = false;
                    };
                };
            };
        };
    } else {
         if (y != null){
            for (i =0;i<maSelection.length;i++){
                if(maSelection[i].typename === "PathItem"){
                    if (maSelection[i].height<y ){
                            maSelection[i].selected = true;
                           comptageSuppr = comptageSuppr+1;
                           maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(comptageSuppr));
                           texteMaBarre2.text = maBarre2.value+" %";
                           boiteDial.update();
                        } else {
                            maSelection[i].selected = false;
                    };
                };
            };
        } else {
                alert(localize({en:"At least 1 of the 2 Width/Height fields must contain a value", fr:"Au moins 1 des 2 champs hauteur/largeur doit contenir une valeur"}));
        };
    };
    if( maSelection.length>0){
        app.executeMenuCommand('clear');
     };
app.redraw();
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
function SupprTracesTransparents(x,y){
//------------------------------------------------------------------------------------------------------------------------------------------------------------
    var i = j =h = 0;
    comptageSuppr = 0;
    if (x != null){
        if (y != null ){
            if (choixSelect === 2) {
               for (j=0;j<maSelection.length;j++){
                    if(maSelection[j].typename === "CompoundPathItem"){
                        for (i =0;i<maSelection[j].pathItems.length;i++){
                            if(maSelection[j].pathItems[i].width === maSelection[j].width && maSelection[j].pathItems[i].height === maSelection[j].height){
                               maSelection[j].pathItems[i].selected = false;
                            }else if (maSelection[j].pathItems[i].width <x && maSelection[j].pathItems[i].height<y){
                                maSelection[j].pathItems[i].selected = true;
                               comptageSuppr = comptageSuppr+1;
                               maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(comptageSuppr));
                               texteMaBarre2.text = maBarre2.value+" %";
                               boiteDial.update();
                            } else {
                               maSelection[j].pathItems[i].selected = false;
                            };
                        };
                    };
                };
           } else {
                for (j=0;j<maSelection.length;j++){
                    if(maSelection[j].typename === "CompoundPathItem"){
                        for (i =0;i<maSelection[j].pathItems.length;i++){
                            if(maSelection[j].pathItems[i].width === maSelection[j].width && maSelection[j].pathItems[i].height === maSelection[j].height){
                               maSelection[j].pathItems[i].selected = false;
                            }else if (maSelection[j].pathItems[i].width<x || maSelection[j].pathItems[i].height<y){
                                maSelection[j].pathItems[i].selected = true;
                               comptageSuppr = comptageSuppr+1;
                               maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(comptageSuppr));
                               texteMaBarre2.text = maBarre2.value+" %";
                               boiteDial.update();
                            } else {
                                maSelection[j].pathItems[i].selected = false;
                            };
                        };
                    };
                };
            };
        } else {
            for (j=0;j<maSelection.length;j++){
                if(maSelection[j].typename === "CompoundPathItem"){
                    for (i =0;i<maSelection[j].pathItems.length;i++){
                        if (maSelection[j].pathItems[i].width<x){
                                maSelection[j].pathItems[i].selected = true;
                               comptageSuppr = comptageSuppr+1;
                               maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(comptageSuppr));
                               texteMaBarre2.text = maBarre2.value+" %";
                               boiteDial.update();
                            } else {
                                maSelection[j].pathItems[i].selected = false;
                        };
                    };
                };
    };
        };
    } else {
         if (y != null){
             for (j=0;j<maSelection.length;j++){
                    if(maSelection[j].typename === "CompoundPathItem"){
                        for (i =0;i<maSelection[j].pathItems.length;i++){
                            if (maSelection[j].pathItems[i].height<y){
                                maSelection[j].pathItems[i].selected = true;
                               comptageSuppr = comptageSuppr+1;
                               maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(comptageSuppr));
                               texteMaBarre2.text = maBarre2.value+" %";
                               boiteDial.update();
                            } else {
                                maSelection[j].pathItems[i].selected = false;
                            };
                        };
                    };
                };
        } else {
                alert(localize({en:"At least 1 of the 2 Width/Height fields must contain a value", fr:"Au moins 1 des 2 champs hauteur/largeur doit contenir une valeur"}));
        };
    };
if(choixTypeTrace===2){
    if(maSelection.length>0){
        app.executeMenuCommand('clear');
     };
};
};
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
function decoderUnite(){
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------------------------------------------------------------------------------------
function majComptage(choixTypeTrace,choixSelect){
//------------------------------------------------------------------------------------------------------------------------------------------------------------
if(premUtil){
    var maFenetre = new Window("palette", {en:"Counting objects", fr:"Comptage objets"}, [150, 150, 600, 260]);   
    var monPanneau = maFenetre.add("panel", [10, 10, 440, 100], {en:"Progress", fr:"Progression"});  
    var maBarre = monPanneau.add("progressbar", [20, 35, 410, 60], 0, 100);  
    var texteMaBarre = monPanneau.add("statictext", [20, 20, 70, 35], "0%"); 
    var texteProgress = monPanneau.add("statictext", [290, 20, 435, 35]);
    maFenetre.show(); 
};
    decoderUnite();
    var i = j = k = nBPI = nBCPI = decompte = 0;
    if(choixSelect===1){
        for (k=0;k<app.activeDocument.selection.length;k++){
            decompte = decompte + 1
            if(premUtil){
                 maBarre.value = Math.round((100/ app.activeDocument.selection.length)*(decompte));
                 texteProgress.text = "Objet n°" +(decompte) +" sur " +  app.activeDocument.selection.length;
                 texteMaBarre.text = maBarre.value+" %";
                 maFenetre.update();
            }else{
                 maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(decompte));
                 texteMaBarre2.text = maBarre2.value+" %";
                 boiteDial.update();
            };
            if(app.activeDocument.selection[k].typename === "PathItem"){
                if (app.activeDocument.selection[k].width<x || app.activeDocument.selection[k].height<y){
                     nBPI = nBPI+1;
                };
            }else if(app.activeDocument.selection[k].typename === "CompoundPathItem"){
                for (i =0;i<app.activeDocument.selection[k].pathItems.length;i++){
                    if (app.activeDocument.selection[k].pathItems[i].width<x || app.activeDocument.selection[k].pathItems[i].height<y){
                         nBCPI = nBCPI+1;
                    };
                 };
            };
        };
    }else{
        for (k=0;k<app.activeDocument.selection.length;k++){
            decompte = decompte + 1
            if(premUtil){
                 maBarre.value = Math.round((100/ app.activeDocument.selection.length)*(decompte));
                 texteProgress.text = "Objet n°" +(decompte) +" sur " +  app.activeDocument.selection.length;
                 texteMaBarre.text = maBarre.value+" %";
                 maFenetre.update();
            }else{
                 maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(decompte));
                 texteMaBarre2.text = maBarre2.value+" %";
                 boiteDial.update();
            };
            if(app.activeDocument.selection[k].typename === "PathItem"){
                if (app.activeDocument.selection[k].width<x && app.activeDocument.selection[k].height<y){
                     nBPI = nBPI+1;
                };
            }else if(app.activeDocument.selection[k].typename === "CompoundPathItem"){
                for (i =0;i<app.activeDocument.selection[k].pathItems.length;i++){
                    if (app.activeDocument.selection[k].pathItems[i].width<x && app.activeDocument.selection[k].pathItems[i].height<y){
                         nBCPI = nBCPI+1;
                     if(premUtil){
                         maBarre.value = Math.round((100/ app.activeDocument.selection.length)*(nBPI + nBCPI));
                         texteProgress.text = "Objet n°" +(nBPI + nBCPI) +" sur " +  app.activeDocument.selection.length;
                         texteMaBarre.text = maBarre.value+" %";
                         maFenetre.update();
                     }else{
                         maBarre2.value = Math.round((100/ app.activeDocument.selection.length)*(nBPI + nBCPI));
                         texteMaBarre2.text = maBarre2.value+" %";
                         boiteDial.update();
                     };
                    };
                 };
            };
        };
    };
   switch(choixTypeTrace) {
        case 0:
            monCompteur.text = {en:"0 PathItem and 0 in CompoundPathItem", fr:"0 tracé et 0 dans tracé transparent"};
            break;
        case 1:
            monCompteur.text = {en:nBPI + " PathItem and 0 in CompoundPathItem", fr:nBPI + " tracés et 0 dans tracé transparent"};
            break;
        case 2:
            monCompteur.text = {en:"0 PathItem and " + nBCPI + " in CompoundPathItem", fr:"0 tracé et " + nBCPI + " dans tracés transparents"};
            break;
        case 3:
            monCompteur.text = {en:nBPI + " PathItems and " + nBCPI + " in CompoundPathItems", fr:nBPI + " tracés et " + nBCPI + " dans tracés transparents"};
            break;
    };
premUtil = false;
if(maFenetre){
maFenetre.close();
};
};
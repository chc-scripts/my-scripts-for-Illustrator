/*=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
En:     This script allows you to add vector hatches to the selected objects (paths or compoundpaths) dependant of their
            parent layers.
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Fr ;      Ce script permet d’ajouter des hachures vectorielles aux objets sélectionnés (tracés ou tracé transparents) en
            fonction du calque sur lequel ils sont positionnés.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false);
$.localize = true;
$.locale =null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
coeff = 2.834645;
var boiteDialTH = new Window ('dialog', {en:"Hatching Type",fr:"Type de hachures"});
boiteDialTH.alignChildren = "left";
boiteDialTH.spacing = 5;
var grpFormeHachures = boiteDialTH.add("group")
var chkDroites = grpFormeHachures.add("radiobutton",undefined,{en:"Straight lines",fr:"Droites"});
var chkCourbes = grpFormeHachures.add("radiobutton",undefined,{en:"Curves",fr:"Courbes"});
chkCourbes.value = true;
formeHachures = "Courbes";
chkDroites.onClick = function(){formeHachures = "Droites"};
chkCourbes.onClick = function(){formeHachures = "Courbes"};
var grpBoutons = boiteDialTH.add("group")
var btnOk = boiteDialTH.add("button", undefined,{en:"Ok",fr:"Ok"}, {name: 'ok'});
boiteDialTH.show();
var nbSel = app.activeDocument.selection.length;
$.hiresTimer;
var tabPaths = [];
var tabComs = [];
var a = b = c = 0;
for(a=0;a<nbSel;a++){
    if (app.activeDocument.selection[a].typename === "PathItem"){
        tabPaths.push(app.activeDocument.selection[a]);
        b=b+1
    }else{
        tabComs.push(app.activeDocument.selection[a]);
        c=c+1
    };
};
app.activeDocument.selection = null;
for(a=0;a<tabPaths.length;a++){
    typeObj="P"
   app.activeDocument.selection = null;
    tabPaths[a].selected = true;
    if(app.activeDocument.selection[0].stroked===true){
            couleur = app.activeDocument.selection[0].strokeColor;
            app.activeDocument.selection[0].filled = false;
    }else{
            couleur = app.activeDocument.selection[0].fillColor;
            app.activeDocument.selection[0].filled = false;
            app.activeDocument.selection[0].strokeColor = couleur;
    };
    choixCalque()
};
for(a=0;a<tabComs.length;a++){
    typeObj="C"
   app.activeDocument.selection = null;
    tabComs[a].selected = true;
    if(app.activeDocument.selection[0].pathItems[0].stroked===true){
            couleur = app.activeDocument.selection[0].pathItems[0].strokeColor;
    }else{
            couleur = app.activeDocument.selection[0].pathItems[0].fillColor;
            app.activeDocument.selection[0].pathItems[0].filled = false;
            app.activeDocument.selection[0].pathItems[0].strokeColor = couleur;
    };
    choixCalque()
};
app.executeMenuCommand('deselectall');
var time = $.hiresTimer; // stop Chrono
var monTemps = MillisecondesEnTempsLisible(time);
if (time<60){
    alert(localize({en: nbSel + " items transformed in "+ time.toFixed(0) + " seconds", fr: nbSel + " items traités en "+ time.toFixed(0) + " secondes"}));
}else{
        alert(localize({en: nbSel + " items transformed in "+ monTemps, fr: nbSel + " items traités en "+ monTemps}));
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function choixCalque(){
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    perim = parseFloat((app.activeDocument.selection[0].width*2+app.activeDocument.selection[0].height).toFixed(0));
    x0 = app.activeDocument.selection[0].left;
    y0 = app.activeDocument.selection[0].top;
    L0 = app.activeDocument.selection[0].width;
    H0 = app.activeDocument.selection[0].height;
    switch(app.activeDocument.selection[0].parent.name){
           case "Noir-5" :
                        action(app.activeDocument.selection[0].parent.name);
                    break;
           case "Noir-55" :
                        action(app.activeDocument.selection[0].parent.name);
                    break;
           case "Noir+62" :
                        action(app.activeDocument.selection[0].parent.name);
                    break;
           case "Gris_Foncé-55" :
                        action(app.activeDocument.selection[0].parent.name);
                    break;
           case "Gris_Foncé+62" :
                        action(app.activeDocument.selection[0].parent.name);
                    break;
           case "Gris_Clair+62" :
                        action(app.activeDocument.selection[0].parent.name);
                    break;
    };
    valider();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function recueilDonnees(couleurCalque) {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    switch(couleurCalque){
           case "Noir-5" :
                        espacement = 1.2*coeff;epTrait = 0.35*coeff;angle = -5;
                        if(formeHachures === "Droites"){
                            poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = 0;poignees_p2_y = 0;
                        }else{
                            poignees_p1_x = perim/1.8;poignees_p1_y =perim/1.8;poignees_p2_x = perim/(-1.8);poignees_p2_y = 0;
                        };break;
           case "Noir-55" :
                        espacement = 1.2*coeff;epTrait = 0.35*coeff;angle = -55;
                        if(formeHachures === "Droites"){
                            poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = 0;poignees_p2_y = 0;break;
                        }else{
                            poignees_p1_x = perim/1.8;poignees_p1_y = 0;poignees_p2_x = perim/(-1.8);poignees_p2_y = perim/1.8
                        };break;
           case "Noir+62" :
                        espacement = 1.2*coeff;epTrait = 0.35*coeff;angle = 62;
                        if(formeHachures === "Droites"){
                            poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = 0;poignees_p2_y = 0;break;
                        }else{
                            poignees_p1_x = perim/1.8;poignees_p1_y =perim/1.8;poignees_p2_x = perim/(-1.8);poignees_p2_y = 0;
                        };break;
           case "Gris_Foncé-55" :
                        espacement = 1.5*coeff;epTrait = 0.35*coeff;angle = -55;
                        if(formeHachures === "Droites"){
                            poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = 0;poignees_p2_y = 0;break;
                        }else{
                            poignees_p1_x = perim/1.8;poignees_p1_y = 0;poignees_p2_x = perim/(-1.8);poignees_p2_y = perim/1.8
                        };break;
           case "Gris_Foncé+62" :
                        espacement = 1.5*coeff;epTrait = 0.35*coeff;angle = 62;
                                                if(formeHachures === "Droites"){
                            poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = 0;poignees_p2_y = 0;break;
                        }else{
                            poignees_p1_x = perim/1.8;poignees_p1_y =perim/1.8;poignees_p2_x = perim/(-1.8);poignees_p2_y = 0;
                        };break;;
           case "Gris_Clair+62" :
                        espacement = 1.5*coeff;epTrait = 0.35*coeff;angle = 62;
                                                if(formeHachures === "Droites"){
                            poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = 0;poignees_p2_y = 0;break;
                        }else{
                            poignees_p1_x = perim/1.8;poignees_p1_y =perim/1.8;poignees_p2_x = perim/(-1.8);poignees_p2_y = 0;
                        };break;
           };
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
  function action(couleurCalque){
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    var monCalque = app.activeDocument.selection[0].layer
    var j=k=0;
    recueilDonnees(couleurCalque);
    app.activeDocument.selection[0].name = "copieBaseSelection";
    if(app.activeDocument.selection[0].typename === "PathItem"){
            app.activeDocument.selection[0].filled = true;
            app.activeDocument.selection[0].stroked = false;
    }else{
            for(n=0;n<app.activeDocument.selection[0].pathItems.length;n++){
                    app.activeDocument.selection[0].pathItems[n].filled = true;
                    app.activeDocument.selection[0].pathItems[n].stroked = false;
            };
     };
   var grpHachures = monCalque.groupItems.add();
   grpHachures.name = "grpHachures";
   var lignes = new Array();
   var p1 = new Array();
   var p2 = new Array();
           for (i=0;i<(perim)/espacement;i++){
                    lignes[i] = grpHachures.pathItems.add();
                    lignes[i].name = "ligne" + i
                    p1[i] = lignes[i].pathPoints.add();
                    p1[i].anchor = [x0, y0-(espacement*i)];
                    p1[i].rightDirection = p1[i].leftDirection = [p1[i].anchor[0]+poignees_p1_x,p1[i].anchor[1]+poignees_p1_y];
                    p2[i] = lignes[i].pathPoints.add();
                    p2[i].anchor = [(x0+perim), y0-(espacement*i)];
                    p2[i].rightDirection = p2[i].leftDirection = [p2[i].anchor[0]+poignees_p2_x,p2[i].anchor[1]+poignees_p2_y];
                    lignes[i].stroked = true;
                    lignes[i].strokeWidth = epTrait;
                    lignes[i].strokeColor = couleur
           };
    grpHachures.rotate(angle, true, false, false, false, Transformation.CENTER)
    grpHachures.left = x0-(grpHachures.width - L0)/2;
    grpHachures.top = y0+(grpHachures.height - H0)/2;
    var limGH_0=grpHachures.geometricBounds[0]-10;
    var limGH_1=grpHachures.geometricBounds[1]+10;
    var limGH_2=grpHachures.geometricBounds[2]+10;
    var limGH_3=grpHachures.geometricBounds[3]-10;
    var masque = monCalque.pathItems.add();
            masque.name = "masque";
            masque.setEntirePath([[limGH_0,limGH_1], [limGH_0, limGH_3], [limGH_2, limGH_3], [limGH_2, limGH_1]]);
            masque.closed = true;
    monCalque.selection = null;
    var groupeTemp = monCalque.groupItems.add();
    gBN(typeObj,"copieBaseSelection").move(groupeTemp, ElementPlacement.PLACEATBEGINNING)
    gBN("P","masque").move(groupeTemp, ElementPlacement.PLACEATBEGINNING)
    groupeTemp.selected = true;
    app.executeMenuCommand('compoundPath');
    gBN("G","grpHachures").selected = true;
    app.executeMenuCommand('ungroup');
     if (typeObj =="P"){app.executeMenuCommand('ungroup');};
    app.executeMenuCommand('Make Planet X');
    app.executeMenuCommand('Expand Planet X');
    app.executeMenuCommand('ungroup');
    var j=k=n=0;
    if(app.activeDocument.selection[0].typename === "GroupItem"){
       for (j;j<2;j++){
           if(app.activeDocument.selection[j].pageItems[0].typename === "CompoundPathItem"){
               k=j
           };
           if(app.activeDocument.selection[j].pageItems[0].filled === true){
               k=j
           };
       };
       app.activeDocument.selection[k].remove();
    }else{
        for(n;n<app.activeDocument.selection.length;n++){
            app.activeDocument.selection[n].remove();
        };
        if(app.activeDocument.selection[0]){
            app.activeDocument.selection[0].remove();
        };
    };
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function gBN(typeObj,objet) {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    if (typeObj === "C") {
        monItem = app.activeDocument.compoundPathItems.getByName(objet);
    }else if (typeObj === "G") {
        monItem = app.activeDocument.groupItems.getByName(objet);
    }else{
        monItem = app.activeDocument.pathItems.getByName(objet);
    };
    return (monItem);
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function valider() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
   monCalque = "";
   couleurCalque = "";
    perim = "";
    couleur = "";
    x0 = "";
    y0 = "";
    L0 = "";
    H0 = "";
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function MillisecondesEnTempsLisible(millisecondes){
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var heures = millisecondes / (1000000*60*60);
  var heuresAbs = Math.floor(heures);
  var h = heuresAbs > 9 ? heuresAbs : '0' + heuresAbs;
  var minutes = (heures - heuresAbs) * 60;
  var minutesAbs = Math.floor(minutes);
  var txtMinutes = minutesAbs < 2 ? {en:" minute and " ,fr:" minute et "} : {en:" minutes and "  ,fr:" minutes et "};
  var m = minutesAbs > 9 ? minutesAbs : '0' +  minutesAbs;
  var secondes = (minutes - minutesAbs) * 60;
  var secondesAbs = Math.floor(secondes);
  var txtSecondes = secondesAbs < 2 ? {en:" second" ,fr:" seconde"} : {en:" seconds", fr:" secondes"};
  var s = secondesAbs > 9 ? secondesAbs : '0' + secondesAbs;
  return  m + txtMinutes + s + txtSecondes 
};
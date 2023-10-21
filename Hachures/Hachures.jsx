//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Hachures
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
En:     This script allows you to add vector hatches to the selected object (path or compoundpath). A preview function
            allows you to view live changes related to settings. The values entered in the dialog box are saved in a .json file to
            be reloaded on the next launch of the script.
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Fr ;      Ce script permet d’ajouter des hachures vectorielles à l’objet sélectionné (tracé ou tracé transparent). Une fonction
            d’aperçu permet de visualiser en direct les changements liés aux réglages. Les valeurs entrées dans la boite de
            dialogue sont conservées dans un fichier .json pour être rechargées au lancement suivant du script.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false); // Fix drag and drop a .jsx file
$.localize = true;
$.locale =null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
var nomScript = 'Hachures',
    fichierParam = {
        name: nomScript + '_param.json',
        folder: Folder.myDocuments + '/CC_Scripts/'
    };
    selection = app.activeDocument.selection;
    monCalque = selection[0].layer
    var nbSel = selection.length;
    typeObj=0
    if (nbSel === 1){
        coulParDefaut = new RGBColor();coulParDefaut.red = 0;coulParDefaut.green = 0;coulParDefaut.blue = 0;
            if(selection[0].typename === "PathItem"){
                typeObj = "P"
                    if(selection[0].stroked===true){
                            couleur = selection[0].strokeColor;
                            selection[0].filled = false;
                    }else{
                            couleur = selection[0].fillColor;
                            selection[0].filled = false;
                            selection[0].strokeColor = couleur;
                    };
            };
            if(selection[0].typename === "CompoundPathItem"){
                typeObj = "C"
                    if(selection[0].pathItems[0].stroked===true){
                            couleur = selection[0].pathItems[0].strokeColor;
                    }else{
                            couleur = selection[0].pathItems[0].fillColor;
                    };
            };
            if (typeObj !=0){
                    selection[0].name = "baseSelection";
                    
                    perim = parseFloat((selection[0].width*2+selection[0].height).toFixed(0));
                    x0 = selection[0].left;
                    y0 = selection[0].top;
                    L0 = selection[0].width;
                    H0 = selection[0].height;
     defaire = false;
//---------------------------------------------------------------------------------------------------------------------------------------------------------
//     Dialog box
//---------------------------------------------------------------------------------------------------------------------------------------------------------
//==  Charger les données enregistrées à la précédente session
      boiteDial = new Window ('dialog', {en:"Hatch", fr:"Hachurer"});
      boiteDial.orientation = "column";
      boiteDial.alignChildren =  ["fill", "center"];
      boiteDial.alignment = "left";
      //==  Groupe Espacement
      var grpEspacement = boiteDial.add('group');
            grpEspacement.orientation = "row";
            grpEspacement.spacing = 3;
      var lblEspacement = grpEspacement.add ("statictext", undefined, {en:"Spacing:", fr:"Espacement :"});
            lblEspacement.size = [80, 18];
      var txtEspacement = grpEspacement.add ("edittext", undefined, 4);
            txtEspacement.characters = 4;
            txtEspacement.size = [60, 23];
      var lblUnitEsp = grpEspacement.add ("statictext", undefined, 'mm');
            lblUnitEsp.size = [25, 18];
      //==  Groupe Inclinaison
      var grpAngle = boiteDial.add('group');
            grpAngle.orientation = "row";
            grpAngle.spacing = 3;
      var lblAngle = grpAngle.add ("statictext", undefined, {en:"Gradient:", fr:"Inclinaison :"});
            lblAngle.size = [80, 18];
      var txtAngle = grpAngle.add ("edittext", undefined, 45);
            txtAngle.characters = 4;
            txtAngle.size = [60, 23]; 
      var lblUnitAngle = grpAngle.add ("statictext", undefined, {en:"Degrees", fr:"degr\351s"});
            lblUnitAngle.size = [50, 18];
      //==  Groupe Epaisseur trait
      var grpEpTrait = boiteDial.add('group');
            grpEpTrait.orientation = "row";
            grpEpTrait.spacing = 3;
      var lblEpTrait = grpEpTrait.add ("statictext", undefined, {en:"Thickness:", fr:"\311paisseur :"});
            lblEpTrait.size = [80, 18];
      var txtEpTrait = grpEpTrait.add ("edittext", undefined, 0.5);
            txtEpTrait.characters = 4;
            txtEpTrait.size = [60, 23];
      var lblUnitEpTrait = grpEpTrait.add ("statictext", undefined, 'mm');
            lblUnitEpTrait.size = [35, 18];
      //==  Option prendre la couleur de l'objet sélectionné
      var ckbConserCoul = boiteDial.add("checkbox", undefined, {en:"Preserve color", fr:"Conserver couleur"});
            ckbConserCoul.alignment = "left";
      var grpBoutons = boiteDial.add('group');
            grpBoutons.orientation = "row";
            grpBoutons.alignChildren =  ["fill", "center"];
      var btnOk = grpBoutons.add('button', undefined, 'OK', {name: 'ok'});
      var btnAnnuler = grpBoutons.add('button', undefined, {en:"Cancel", fr:"Annuler"}, {name: 'cancel'});
      //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
     txtEspacement.onChange = function() {majApercu();};
     txtAngle.onChange = function() {majApercu();};
     txtEpTrait.onChange = function() {majApercu();};
     ckbConserCoul.onClick =  function() {majApercu();};
     btnOk.onClick = function () {valider(); boiteDial.close();};
     btnAnnuler.onClick = function() {  if (defaire) {
                                                            app.activeDocument.selection[0].remove();
                                                            gBN(typeObj,"baseSelection").selected = true;
                                                            defaire = false;
                                                        };
                                                    boiteDial.close();}
      boiteDial.onClose = function() {sauverParametres()};
      //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
      verifDossierParam();
      chargerParametres ();
      boiteDial.center();
      majApercu();
      boiteDial.show();
              } else {
                    alert(localize({en:"You must select one path or one compound path.", fr:"La s\351lection doit \352tre compos\351e d\un trac\351ou d'un trac\351 transparent"}));
              };
     } else {
        alert(localize({en:"You must select one path or one compound path.", fr:"La s\351lection doit \352tre compos\351e d\un trac\351ou d'un trac\351 transparent"}));
     };
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function majApercu() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    if (defaire) {
       app.activeDocument.selection[0].remove();
       app.activeDocument.selection = null;
       gBN(typeObj,"baseSelection").selected = true;
    }else{
        defaire = true;
        app.redraw();
    };
    action()
    app.redraw();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function recueilDonnees() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    espacement = parseFloat(txtEspacement.text*2.834645);
    epTrait = parseFloat(txtEpTrait.text*2.834645);
    angle = parseFloat(txtAngle.text);
    ConserCoul = ckbConserCoul.value
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
  function action(){
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    recueilDonnees();
    app.copy();
    app.executeMenuCommand('pasteInPlace');
    selection[0].name = "copieBaseSelection";

    if(selection[0].typename === "PathItem"){
            selection[0].filled = true;
            selection[0].stroked = false;
    }else{
            for(n=0;n<selection[0].pathItems.length;n++){
                    selection[0].pathItems[n].filled = true;
                    selection[0].pathItems[n].stroked = false;
            };
     };
   var grpHachures = monCalque.groupItems.add();
   grpHachures.name = "grpHachures";
   var lignes = new Array();
   for (i=0;i<(perim)/espacement;i++){
            lignes[i] = grpHachures.pathItems.add();
            lignes[i].name = "ligne" + i
            lignes[i].setEntirePath([[x0, y0-(espacement*i)], [(x0+perim), y0-(espacement*i)]]);
            lignes[i].stroked = true;
            lignes[i].strokeWidth = epTrait;
            if (ConserCoul){lignes[i].strokeColor = couleur
            }else{
                lignes[i].strokeColor = coulParDefaut;
            };
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
    var j=k=0;
           for (j;j<2;j++){
                       if(app.activeDocument.selection[j].pageItems[0].typename == "CompoundPathItem"){
                           k=j
                      };
                       if(app.activeDocument.selection[j].pageItems[0].filled == true){
                           k=j
                      };
           };
    app.activeDocument.selection[k].remove();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function gBN(typeObj,objet) {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    if (typeObj === "C") {
        monItem = monCalque.compoundPathItems.getByName(objet);
    }else if (typeObj === "G") {
        monItem = monCalque.groupItems.getByName(objet);
    }else{
        monItem = monCalque.pathItems.getByName(objet);
    };
    return (monItem);
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function verifDossierParam() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    var monDossier = new Folder(fichierParam.folder);
    if (!monDossier.exists) monDossier.create();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function sauverParametres() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------  
    try{
    var paramHach = new File(fichierParam.folder + fichierParam.name),
        donnees = [txtEspacement.text,txtAngle.text,txtEpTrait.text,ckbConserCoul.value].toString();
        paramHach.open('w');
        paramHach.write(donnees);
        paramHach.close();
    }catch(e){$.errorMessage(e);}
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function chargerParametres() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    var paramHach = File(fichierParam.folder + fichierParam.name);
    if (paramHach.exists) {
        try {
            paramHach.open('r');
            var donnees = paramHach.read().split('\n'),
            mesValeurs = donnees[0].split(',');
            txtEspacement.text = parseFloat(mesValeurs[0]);
            txtAngle.text = parseFloat(mesValeurs[1]);
            txtEpTrait.text = parseFloat(mesValeurs[2]);
            ckbConserCoul.value =(mesValeurs[3]==='true');
            } catch (e) {}
        paramHach.close();
    };
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function valider() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    monCalque.selection = null;
    gBN(typeObj,"baseSelection").selected = true;
    app.executeMenuCommand('sendForward');
    monCalque.selection = null;
};
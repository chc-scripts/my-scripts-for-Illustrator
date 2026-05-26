/*-----------------------------------------------------------------------------------------------------------------------------------------------------
Auteur : Christian Condamine (christian.condamine@laposte.net)
-------------------------------------------------------------------------------------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
En : Prerequisites : save the file [Nuances_3_Tons_Gris] somewhere on your computer and update the
        link to this file on line 30 of this script.
        
        Select the objects to process:
            - The 1st stage: vectorize the image according to the settings in this script except the choice of the
                swatches palette whish is not accessible via scripting. So, at the end of this first stage, you'll have
                to access manually to the  [Image Trace] window and the field [palette] to choose 
                [Nuances_3_Tons_Gris].
            -  The 2nd stage: expand the vectorization effect, create and name new layers. Then move every item
                dependant of its "red" color value.
>=--------------------------------------------------------------------------------------------------------------------------------------------------
Fr : Pré-requis : enregistrez le fichier [Nuances_3_Tons_Gris] sur votre ordinateur et mettez à jour le lien
        vers ce fichier à la ligne 30 de ce script.

        Sélectionner les objets à traiter :
              - 1ère étape, vectorise l'image suivant les paramètres indiqués dans le script à l'exception du choix
                    de la palette de couleur qui n'est pas atteignable via un script. À la fin de cette 1ère étape il faut
                    donc accéder à la fenêtre [vectorisation de l'image] et dans le champ [palette] pour choisir
                    [Nuances_3_Tons_Gris].
              - 2ème étape, décompose l'effet de vectorisation,crée et nomme de nouveaux calques puis répartit
                    chaque item sur ces calques en fonction de sa valeur de couleur "red".
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false);
var monLien = '/C/Users/YourID/AppData/Roaming/Adobe/Adobe Illustrator 30 Settings/fr_FR/x64/Nuancier/Nuances_3_Tons_Gris.ai';
$.localize = true;
$.locale =null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
    var monFichier = app.activeDocument;
    var maSelection = monFichier.selection;
    var nbSel = maSelection.length;
    if(monFichier.layers.length != 1){
        alert(localize({en: "At this point, there must be only only one layer in the document",fr:"À cette étape, il ne doit y avoir qu'un calque dans le document"}));
    }else{
        monFichier.layers[0].name = "calque 1";
    };
    if(maSelection[0].typename==='group'){
        app.executeMenuCommand('ungroup');;
    };
    var boiteDial = new Window("dialog",{en:"preparing the document",fr:"Pr\351paration du document"}); 
        boiteDial.alignChildren = ["center","top"]; 
    var grp_1 = boiteDial.add("group");  
        grp_1.orientation = "column"; 
        grp_1.alignChildren = "left";
    var rdb_1 = grp_1.add('radiobutton',[0,0,200,30], {en:"1 - Vectorize the image\n       -> Nuances_3_Tons_Gris",fr:"1 - Vectoriser  l\'image\n       -> Nuances_3_Tons_Gris"});
    var rdb_2 = grp_1.add('radiobutton',[0,0,200,30], {en:"2 - Create the layers and\n    allocate items",fr:"2 - Cr\351er les calques et\n    répartir les tracés"});
    rdb_1.value = true;
    var grpBoutons = boiteDial.add("group")
    var btnOk = grpBoutons.add("button", undefined,{en:"Ok",fr:"Ok"}, {name: 'ok'});
    var btnAnnul = grpBoutons.add("button", undefined, {en:"Cancel",fr:"Annuler"}, { name: 'cancel' });
    btnAnnul.onClick =  function() {
                                  boiteDial.close();
                                  };
    btnOk.onClick =  function() {
                                  if(rdb_1.value === true){
                                      ouvrirNuancier();
                                      vectoriserImage();
                                      boiteDial.close();
                                  }else{creationDesCalques();
                                      repartitionDesObjets();
                                      peuplerCalques();
                                      boiteDial.close();
                                  };
                              };
boiteDial.show();
//-----------------------------------------------------------------------------------------------------------------------------------------------------
function creationDesCalques(){
//-----------------------------------------------------------------------------------------------------------------------------------------------------
app.activeDocument.selection[0].tracing.expandTracing();
app.executeMenuCommand('selectall');
app.executeMenuCommand('ungroup');
	var calque_N5_NexistePas = true;
	var calque_N55_NexistePas = true;
	var calque_N62_NexistePas = true;
	var calque_GF55_NexistePas = true;
	var calque_GF62_NexistePas = true;
	var calque_GC62_NexistePas = true;
	var calque_GTC_NexistePas = true;
    for(i = 0; i < activeDocument.layers.length; i++){
            if(activeDocument.layers[i].name == "Noir-5"){
                calque_N5 = activeDocument.activeLayer = activeDocument.layers[i];
                calque_N5.locked = false;
                calque_N5.visible = true;
                calque_N5_NexistePas = false;
            };
            if(activeDocument.layers[i].name == "Noir-55"){
                calque_N55 = activeDocument.activeLayer = activeDocument.layers[i];
                calque_N55.locked = false;
                calque_N55.visible = true;
                calque_N55_NexistePas = false;
            };
            if(activeDocument.layers[i].name == "Noir+62"){
                calque_N62 = activeDocument.activeLayer = activeDocument.layers[i];
                calque_N62.locked = false;
                calque_N62.visible = true;
                calque_N62_NexistePas = false;
            };
            if(activeDocument.layers[i].name == "Gris_Clair"){
                calque_GC62 = activeDocument.activeLayer = activeDocument.layers[i];
                calque_GC62.locked = false;
                calque_GC62.visible = true;
                calque_GC62_NexistePas = false;
            };
            if(activeDocument.layers[i].name == "Gris_Très_Clair"){
                calque_GTC = activeDocument.activeLayer = activeDocument.layers[i];
                calque_GTC.locked = false;
                calque_GTC.visible = true;
                calque_GTC_NexistePas = false;
            };
    };
      if(calque_GTC_NexistePas){
                calque_GTC = monFichier.layers.add();
                calque_GTC.name = "Gris_Très_Clair";
      };
      if(calque_GC62_NexistePas){
                calque_GC62 = monFichier.layers.add();
                calque_GC62.name = "Gris_Clair+62";
      };
      if(calque_GF62_NexistePas){
                calque_GF62 = monFichier.layers.add();
                calque_GF62.name = "Gris_Foncé+62";
      };
      if(calque_GF55_NexistePas){
                calque_GF55 = monFichier.layers.add();
                calque_GF55.name = "Gris_Foncé-55";
      };
      if(calque_N62_NexistePas){
                calque_N62 = monFichier.layers.add();
                calque_N62.name = "Noir+62";
      };
      if(calque_N55_NexistePas){
                calque_N55 = monFichier.layers.add();
                calque_N55.name = "Noir-55";
      };
      if(calque_N5_NexistePas){
                calque_N5 = monFichier.layers.add();
                calque_N5.name = "Noir-5";
      };
};
//-----------------------------------------------------------------------------------------------------------------------------------------------------
function repartitionDesObjets(){
//-----------------------------------------------------------------------------------------------------------------------------------------------------
app.executeMenuCommand('Colors9');
var nbPI= app.activeDocument.pathItems.length;
var nbCPI= app.activeDocument.compoundPathItems.length;
var j , k
for(j = 0; j<nbPI;j++){
    switch (app.activeDocument.pathItems[j].fillColor.red){
        case 26 :
            app.activeDocument.pathItems[j].move(calque_N62, ElementPlacement.PLACEATEND);break;
        case 89 :
            app.activeDocument.pathItems[j].move(calque_GF62, ElementPlacement.PLACEATEND);break;
        case 166 :
            app.activeDocument.pathItems[j].move(calque_GC62, ElementPlacement.PLACEATEND);break;
        case 227 :
            app.activeDocument.pathItems[j].move(calque_GTC, ElementPlacement.PLACEATEND);break;
    };
};
app.activeDocument.selection = null;
exclusion();
app.activeDocument.selection = null;
};
//-----------------------------------------------------------------------------------------------------------------------------------------------------
function vectoriserImage(){
//-----------------------------------------------------------------------------------------------------------------------------------------------------
if (app.activeDocument.documentColorSpace != "DocumentColorSpace.RGB"){
    changerProfilColorimetrique();
};
var monImage = app.activeDocument.selection[0].trace();
var mesOptions = monImage.tracing.tracingOptions;
mesOptions.fills = true;
mesOptions.strokes = false;
mesOptions.ignoreWhite = false;
mesOptions.livePaintOutput = false;
mesOptions.tracingMode = TracingModeType.TRACINGMODECOLOR;
mesOptions.maxColors = 4;
mesOptions.resample = true;
mesOptions.resampleResolution = 72;
mesOptions.snapCurveToLines = false;
mesOptions.pathFidelity = 1;
mesOptions.cornerFidelity = 0;
mesOptions.noiseFidelity = 1;
mesOptions.outputToSwatches = false;
mesOptions.threshold = 128;
mesOptions.minArea = 5;
mesOptions.pathFitting = 2.0;
mesOptions.preprocessBlur = 1.0;
mesOptions.tracingMethod = TracingMethodType.TRACINGMETHODABUTTING;
mesOptions.viewMode = ViewType.TRACINGVIEWVECTORTRACINGRESULT;
app.redraw();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function exclusion() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
var nbCalques = app.activeDocument.layers.length;
app.activeDocument.selection = null;
var maNuance
for(var y = 0;y<nbCalques;y++){
    if(app.activeDocument.layers[y].pageItems.length != 0){
    app.activeDocument.layers[y].hasSelectedArtwork = true;
    maNuance = app.activeDocument.selection[0].fillColor;
    app.executeMenuCommand('group');
    app.executeMenuCommand('Live Pathfinder Exclude');
    app.executeMenuCommand('expandStyle');
    app.executeMenuCommand('ungroup');
    app.activeDocument.selection = null;
    };
};
};
//-----------------------------------------------------------------------------------------------------------------------------------------------------
function peuplerCalques(){
//-----------------------------------------------------------------------------------------------------------------------------------------------------
for (var k = 0; k < app.activeDocument.layers["Noir+62"].pageItems.length; k++) {
        var pos = app.activeDocument.layers["Noir+62"].pageItems[k].position
        var newItem = app.activeDocument.layers["Noir+62"].pageItems[k].duplicate(app.activeDocument.layers["Noir-5"], ElementPlacement.PLACEATEND)
        newItem.position = pos
    };
for (var k = 0; k < app.activeDocument.layers["Noir+62"].pageItems.length; k++) {
        var pos = app.activeDocument.layers["Noir+62"].pageItems[k].position
        var newItem = app.activeDocument.layers["Noir+62"].pageItems[k].duplicate(app.activeDocument.layers["Noir-55"], ElementPlacement.PLACEATEND)
        newItem.position = pos
    };
for (var k = 0; k < app.activeDocument.layers["Gris_Foncé+62"].pageItems.length; k++) {
        var pos = app.activeDocument.layers["Gris_Foncé+62"].pageItems[k].position
        var newItem = app.activeDocument.layers["Gris_Foncé+62"].pageItems[k].duplicate(app.activeDocument.layers["Gris_Foncé-55"], ElementPlacement.PLACEATEND)
        newItem.position = pos
    };
app.activeDocument.layers["Gris_Très_Clair"].remove();
app.activeDocument.layers["calque 1"].remove();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function ouvrirNuancier() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
var theFile = new File(monLien);
var openOpt = new OpenOptions();
openOpt.openAs=LibraryType.SWATCHES;
app.open(theFile,null,openOpt);
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function dupliquerCalque() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
var set = 'dupliquerCalque',
    action = 'dupCalque',
    actionStr = ['/version 3',
'/name [ ' + set.length,
        ascii2Hex(set),
']',
'/isOpen 1',
'/actionCount 1',
'/action-1 {',
	'/name [ ' + action.length,
        ascii2Hex(action),
	']',
	'/keyIndex 0',
	'/colorIndex 0',
	'/isOpen 1',
	'/eventCount 1',
	'/event-1 {',
		'/useRulersIn1stQuadrant 0',
		'/internalName (ai_plugin_Layer)',
		'/localizedName [ 6',
			'43616c717565',
		']',
		'/isOpen 0',
		'/isOn 1',
		'/hasDialog 0',
		'/parameterCount 2',
		'/parameter-1 {',
			'/key 1836411236',
			'/showInPalette -1',
			'/type (integer)',
			'/value 1',
		'}',
		'/parameter-2 {',
			'/key 1851878757',
			'/showInPalette -1',
			'/type (ustring)',
			'/value [ 23',
				'4475706c6971756572206c612073c3a96c656374696f6e',
			']',
		'}',
	'}',
'}'].join('\n');
createAction(actionStr, set);
actionStr = null;
app.doScript(action, set,false);
app.unloadAction(set,"");
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function changerProfilColorimetrique() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
var set = 'Change_CS',
    action = 'CS_To_RGB',
    actionStr = ['/version 3',
        '/name [ ' + set.length,
        ascii2Hex(set),
        ']',
'/isOpen 1',
'/actionCount 1',
'/action-1 {',
        '/name [ ' + action.length,
        ascii2Hex(action),
        ']',
	'/keyIndex 0',
	'/colorIndex 0',
	'/isOpen 1',
	'/eventCount 1',
	'/event-1 {',
		'/useRulersIn1stQuadrant 0',
		'/internalName (adobe_commandManager)',
		'/localizedName [ 32',
			'416363c3a964657220c3a020756e6520636f6d6d616e6465206465206d656e75',
		']',
		'/isOpen 0',
		'/isOn 1',
		'/hasDialog 0',
		'/parameterCount 2',
		'/parameter-1 {',
			'/key 1769238125',
			'/showInPalette -1',
			'/type (ustring)',
			'/value [ 13',
				'646f632d636f6c6f722d726762',
			']',
		'}',
		'/parameter-2 {',
			'/key 1818455661',
			'/showInPalette -1',
			'/type (ustring)',
			'/value [ 23',
				'4d6f646520647520646f63756d656e74203a2052564220',
			']',
		'}',
	'}',
'}'].join('\n');
createAction(actionStr, set);
actionStr = null;
app.doScript(action, set,false);
app.unloadAction(set,"");
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function createAction (str, act) {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    var f = new File('~/' + act+ '.aia');  
    f.open('w');
    f.write(str);
    f.close();
    app.loadAction(f);
    f.remove();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function  ascii2Hex (hex) {
    return hex.replace(/./g, function (a) {return a.charCodeAt(0).toString(16)})
};
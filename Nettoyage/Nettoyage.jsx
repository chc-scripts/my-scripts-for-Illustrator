﻿//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Nettoyage
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Clear the file in use of a number of obsolete items
      Choose via a dialog box to apply one or more of the 16 possible actions to the selection or to the document:
      - remove or undo clipping masks
      - break links to symbols
      - remove styles
      - Expand :
            > Gradients
            > Live paints
            > Envelopes
            > Appearance
     - Clean the pallets:
            > Shape
            > Shades
            > Symbols
      - Embed images
      - Reduce image resolution
      - Delete guides (or place them on a dedicated layer)
      - Delete empty layers and sub-layers
      - Remove empty text frames, single dots and invisible objects
     
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Management of the preview  inspired by Alexander Ladygin's tutorial (https://ladyginpro.ru/blog/create-preview-in-dialog/). 
*/
#targetengine 'main'
var nomScript = 'Nettoyage',
    fichierParam = {
        name: nomScript + '_param.json',
        folder: Folder.myDocuments + '/CC_Scripts/'
    }
// Déclaration de variables pour le document actif
monFichier = app.activeDocument;
maSelection = monFichier.selection;
nbSymbolesSelect = 0
for (i =0;i<maSelection.length;i++){
    if(maSelection[i].typename === "SymbolItem"){
        nbSymbolesSelect = nbSymbolesSelect +1;
        maSelection[i].name = "monSymbole" + nbSymbolesSelect;
    };
};
$.localize = true;
$.locale = null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    dialog Box    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  Window
    var dialog = new Window("dialog", {en:"Cleaning", fr:"Nettoyage"}); 
        dialog.orientation = "column"; 
        dialog.alignChildren = ["left","top"]; 
        dialog.spacing = 10; 
        dialog.margins = 16;
        dialog.graphics.backgroundColor = dialog.graphics.newBrush (dialog.graphics.BrushType.SOLID_COLOR,[0.3,0.3,0.3]);
////  Apply to
    var panAppliquerA = dialog.add("panel", [0,0,330,50], {en:"Apply to:", fr:"Appliquer \340 :"}); 
        panAppliquerA.orientation = "row"; 
        panAppliquerA.alignChildren = ["left","top"]; 
        panAppliquerA.spacing = 14; 
        panAppliquerA.graphics.backgroundColor = panAppliquerA.graphics.newBrush (panAppliquerA.graphics.BrushType.SOLID_COLOR,[0.2,0.2,0.2]);
        panAppliquerA.margins = [10,15,10,10];
    var rdmaSelection = panAppliquerA.add("radiobutton", [10,15,150,34], {en:"selection \(except *\)", fr:"la sélection \(sauf *\)"});
    var rdmonDoc = panAppliquerA.add("radiobutton", [160,15,330,34], {en:"Document", fr:"tout le document"}); 
////  Cancel
    var panAnnuler = dialog.add("panel", [0,0,330,50], {en:"clipping masks", fr:"Masques d\'\351cr\352tage"}); 
        panAnnuler.orientation = "row"; 
        panAnnuler.alignChildren = ["left","top"]; 
        panAnnuler.spacing = 14; 
        panAnnuler.margins = [10,15,10,10];
        panAnnuler.graphics.backgroundColor = panAnnuler.graphics.newBrush (panAnnuler.graphics.BrushType.SOLID_COLOR,[0.4,0.4,0.5]);
    var rdIgnorMasqEcr = panAnnuler.add("radiobutton", [10,15,80,30], {en:"Ignore", fr:"Ignorer"});
    var rdAnnulMasqEcr = panAnnuler.add("radiobutton", [85,15,150,30], {en:"Cancel", fr:"Annuler"});
    var rdSupprMasqEcr = panAnnuler.add("radiobutton", [155,15,270,30], {en:"Delete", fr:"Supprimer"});
////  Symbols
    var grpSymbolesStyles = dialog.add("group", [0,0,330,50], undefined); 
        panSymboles = grpSymbolesStyles.add("panel", [0,0,150,50], {en:"Symbols", fr:"Symboles"});
        panSymboles.margins = [10,15,10,10];
        panSymboles.graphics.backgroundColor = panSymboles.graphics.newBrush (panSymboles.graphics.BrushType.SOLID_COLOR,[0.4,0.4,0.4]);
    var ckbRompreSymboles = panSymboles.add("checkbox", [10,15,160,34], {en:"Expand", fr:"Rompre les liens"});
////  Graphic Styles
        panStyles = grpSymbolesStyles.add("panel", [160,0,330,50], {en:" Graphic Styles \(*\)", fr:"Styles \(*\)"});
        panStyles.margins = [10,15,10,10];
        panStyles.graphics.backgroundColor = panStyles.graphics.newBrush (panStyles.graphics.BrushType.SOLID_COLOR,[0.4,0.4,0.4]);
    var ckbSupprStyles = panStyles.add("checkbox", [10,15,130,34], {en:"Delete", fr:"Supprimer"});
////  Expand
    var panDecomposer = dialog.add("panel",  [0,0,330,80], {en:"Expand", fr:"D\351composer"}); 
        panDecomposer.orientation = "row"; 
        panDecomposer.alignChildren = ["left","top"]; 
        panDecomposer.spacing = 14; 
        panDecomposer.margins = [10,15,10,10];
        panDecomposer.graphics.backgroundColor = panDecomposer.graphics.newBrush (panDecomposer.graphics.BrushType.SOLID_COLOR,[0.5,0.4,0.4]);
    var ckbdecompDegraFormes = panDecomposer.add("checkbox", [10,15,150,30],  {en:"Blended paths", fr:"D\351grad\351s de formes"}); 
    var ckbDecompPeintures = panDecomposer.add("checkbox",[160,15,350,30],  {en:"Live paints", fr:"Peintures dynamiques"});
    var ckbDecompEnveloppes = panDecomposer.add("checkbox", [10,45,100,60],  {en:"Envelopes", fr:"Enveloppes"}); 
    var ckbDecompAspect = panDecomposer.add("checkbox", [110,45,210,60],  {en:"Appearence", fr:"Aspect"}); 
    var ckbDecompTout = panDecomposer.add("checkbox", [215,45,250,60],  {en:"All", fr:"Tout"}); 
////  Clean palettes
    var panNettoyerPalettes = dialog.add("panel", [0,0,330,50],  {en:"Clean palettes \(*\)", fr:"Nettoyer les palettes \(*\)"}); 
        panNettoyerPalettes.orientation = "row"; 1
        panNettoyerPalettes.alignChildren = ["left","top"]; 
        panNettoyerPalettes.spacing = 10; 
        panNettoyerPalettes.margins = [10,15,10,10];
        panNettoyerPalettes.graphics.backgroundColor = panNettoyerPalettes.graphics.newBrush (panNettoyerPalettes.graphics.BrushType.SOLID_COLOR,[0.4,0.4,0.5]);
    var ckbNettFormes = panNettoyerPalettes.add("checkbox", [10,15,80,34], {en:"Brushes", fr:"Formes"}); 
    var ckbNettNuances = panNettoyerPalettes.add("checkbox", [80,15,160,34], {en:"Swatches", fr:"Nuances"}); 
    var ckbNettSymboles = panNettoyerPalettes.add("checkbox", [160,15,280,34], {en:"Symbols", fr:"Symboles"});
////  Images
    var panImages = dialog.add("panel", [0,0,330,110], "Images"); 
        panImages.orientation = "row"; 
        panImages.alignChildren = ["left","top"]; 
        panImages.spacing = 10; 
        panImages.margins = [10,15,10,10];
        panImages.graphics.backgroundColor = panImages.graphics.newBrush (panImages.graphics.BrushType.SOLID_COLOR,[0.4,0.4,0.4]);
    var ckbIncorpImages = panImages.add("checkbox", [10,15,90,30], {en:"Embed", fr:"Incorporer"}); 
    var diviseur1 = panImages.add("panel",[100,15,104,85],undefined);
    var grpReduc = panImages.add("group", [110,15,280,110]); 
        grpReduc.orientation = "column"; 
        grpReduc.alignChildren = ["left","top"];
    var ckbReduireImages = grpReduc.add("checkbox", [10,0,80,30], {en:"Reduce", fr:"R\351duire"}); 
////  ppp
    var panResol = grpReduc.add("panel", [10,20,170,70], "ppp"); 
        panResol.orientation = "row"; 
        panResol.alignChildren = ["left","top"]; 
        panResol.spacing = 10; 
        panResol.margins = [10,15,10,10]; 
    var rd72 = panResol.add("radiobutton", [10,15,45,30], "72");
    var rd150 = panResol.add("radiobutton", [45,15,90,30], "150");
    var rd300 = panResol.add("radiobutton", [90,15,135,30], "300");
////  Guides
    var panReperes = dialog.add("panel", [0,0,330,50], {en:"Guides \(*\)", fr:"Rep\350res \(*\)"});
        panReperes.orientation = "row"; 
        panReperes.alignChildren = ["left","top"]; 
        panReperes.spacing = 10; 
        panReperes.margins = [10,15,10,10];
        panReperes.graphics.backgroundColor = panReperes.graphics.newBrush (panReperes.graphics.BrushType.SOLID_COLOR,[0.5,0.4,0.4]);
    var rdIgnoRep = panReperes.add("radiobutton", [10,15,80,30], {en:"Ignore", fr:"Ignorer"}); 
    var rdSupprRep = panReperes.add("radiobutton", [80,15,160,30], {en:"Delete", fr:"Supprimer"}); 
    var rdDeplRep = panReperes.add("radiobutton", [165,15,315,30], {en:"Create dedicated layer", fr:"Cr\351er un calque d\351di\351"}); 
////  Delete
    var panSuppr = dialog.add("panel", [0,0,330,80], {en:"Delete \(*\)", fr:"Supprimer \(*\)"});
        panSuppr.orientation = "column"; 
        panSuppr.alignChildren = ["left","top"]; 
        panSuppr.spacing = 10; 
        panSuppr.margins = [10,15,10,10];
        panSuppr.graphics.backgroundColor = panSuppr.graphics.newBrush (panSuppr.graphics.BrushType.SOLID_COLOR,[0.4,0.4,0.5]);
////  Layers and sub-layers
    var ckbCalquesVides = panSuppr.add("checkbox", [10,15,300,30],  {en:"Empty layers and sub-layers", fr:"Calques et sous-calques vides"}); 
////  Empty texts, single dots, invisibles objects
    var ckbTextesVides = panSuppr.add("checkbox", [10,45,330,60], {en:"Empty texts, single dots, invisibles objects ", fr:"Textes vides, points isol\351s, objets invisibles"}); 
////  Buttons
    var groupBoutons = dialog.add("group", [0,0,330,50]); 
        groupBoutons.orientation = "row"; 
        groupBoutons.alignChildren = ["left","top"]; 
    var BtnOk = groupBoutons.add("button", [10,0,80,45], {en:"Validate", fr:"Valider"}, {name: "ok"});
        BtnOk.onActivate = ActionsCochees = true;
    var BtnAnnuler = groupBoutons.add("button", [90,0,170,45], {en:"Cancel", fr:"Annuler"}, {name: "Cancel"}); 
        BtnAnnuler.onClick = function () {
                                                    ActionsCochees = false;
                                                    sauverParametres();
                                                    dialog.close();
                                                    };
    var BtnCocherTout = groupBoutons.add("button", [180,0,330,20], {en:"Check all", fr:"Cocher tout"}); 
        BtnCocherTout.onClick = function () {
                           rdmaSelection.value=true;
                           rdAnnulMasqEcr.value=true;
                           rdIgnorMasqEcr.value=false;
                           rdSupprMasqEcr.value=false;
                           ckbRompreSymboles.value=true;
                           ckbSupprStyles.value=true;
                           ckbdecompDegraFormes.value=true;
                           ckbDecompPeintures.value=true;
                           ckbDecompEnveloppes.value=true;
                           ckbDecompAspect.value=true;
                           ckbDecompTout.value=true;
                           ckbNettFormes.value=true;
                           ckbNettNuances.value=true;
                           ckbNettSymboles.value=true;
                           ckbIncorpImages.value=true;
                           ckbReduireImages.value=true;
                           rd72.value=true;
                           rd150.value=false;
                           rd300.value=false;
                           rdIgnoRep.value=true;
                           rdDeplRep.value=true;
                           ckbCalquesVides.value=true;
                           ckbTextesVides.value=true;
                           };
    var BtnDecocherTout = groupBoutons.add("button", [180,25,330,45], {en:"Uncheck all", fr:"Décocher tout"});                           
        BtnDecocherTout.onClick = function () {
                           rdmaSelection.value=true;  
                           rdIgnorMasqEcr.value=true;
                           rdAnnulMasqEcr.value=false;
                           rdSupprMasqEcr.value=false;
                           ckbRompreSymboles.value=false;
                           ckbSupprStyles.value=false;
                           ckbdecompDegraFormes.value=false;
                           ckbDecompPeintures.value=false;
                           ckbDecompEnveloppes.value=false;
                           ckbDecompAspect.value=false;
                           ckbDecompTout.value=false;
                           ckbNettFormes.value=false;
                           ckbNettNuances.value=false;
                           ckbNettSymboles.value=false;
                           ckbIncorpImages.value=false;
                           ckbReduireImages.value=false;
                           rd72.value=true;
                           rd150.value=false;
                           rd300.value=false;
                           rdIgnoRep.value=true;
                           rdDeplRep.value=false;
                           ckbCalquesVides.value=false;
                           ckbTextesVides.value=false;
                           };                       
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
dialog.onClose = function() {sauverParametres()};

verifDossierParam();
chargerParametres (); 
dialog.center();
dialog.show();
sauverParametres();
lancerActions();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Initial Data  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function recueilDonnees() {
compteurTotal = 0;
compteur = 0
////  rdmaSelection
    if (rdmaSelection.value) {alerteSelect = localize({en:"To selection", fr:" \340 la selection"})
        } else {alerteSelect = localize({en:" To the all document", fr:" \340 l\'ensemble du document"});};
//---------------------------------------------------------------------------------------------------------------------------------
    if (rdAnnulMasqEcr.value) {annulMasquesEcr=true,compteurTotal+= 1
        } else { annulMasquesEcr=false};
    if (rdSupprMasqEcr.value) {supprMasqEcr=true,compteurTotal+= 1
        } else { supprMasqEcr=false};
//---------------------------------------------------------------------------------------------------------------------------------
        if (ckbRompreSymboles.value) {RompreSymboles=true,compteurTotal+= 1
            } else { RompreSymboles=false};
        if (ckbSupprStyles.value) {supprStyles=true,compteurTotal+= 1
            } else { supprStyles=false};
//---------------------------------------------------------------------------------------------------------------------------------
        if(ckbdecompDegraFormes.value) {decompDegraFormes=true, compteurTotal+= 1
            } else { decompDegraFormes=false};
        if (ckbDecompPeintures.value) {decompPeintDyn=true,compteurTotal+= 1
            } else { decompPeintDyn=false};
        if(ckbDecompEnveloppes.value) {decompEnveloppes=true,compteurTotal+= 1
            } else { decompEnveloppes=false};
        if(ckbDecompAspect.value) {DecompAspect=true, compteurTotal+= 1
            } else { DecompAspect=false};
        if(ckbDecompTout.value) {DecompTout=true, compteurTotal+= 1
            } else { DecompTout=false};
//---------------------------------------------------------------------------------------------------------------------------------
        if(ckbNettFormes.value) {nettFormes=true, compteurTotal+= 1
            } else { nettFormes=false};
        if(ckbNettNuances.value) {nettNuances=true, compteurTotal+= 1
            } else { nettNuances=false};
        if(ckbNettSymboles.value) {nettSymboles=true, compteurTotal+= 1
            } else { nettSymboles=false};
//---------------------------------------------------------------------------------------------------------------------------------
        if(ckbIncorpImages.value) {incorpImages=true, compteurTotal+= 1
            } else { incorpImages=false};
        if(ckbReduireImages.value) {ReduireImages=true, compteurTotal+= 1
            } else { ReduireImages=false};
        choixdpi = rd72.value ? 72 : choixdpi = rd150.value ? 150 : 300;   
//---------------------------------------------------------------------------------------------------------------------------------
        if(rdSupprRep.value) {supprReperes=true, compteurTotal+= 1
            } else { supprReperes=false};
        if(rdDeplRep.value) {deplReperes=true, compteurTotal+= 1
            } else { deplReperes=false};
//---------------------------------------------------------------------------------------------------------------------------------
        if(ckbCalquesVides.value) {supprCalquesVides=true, compteurTotal+= 1
            } else { supprCalquesVides=false};
        if(ckbTextesVides.value) {supprZonesTexteVides=true, compteurTotal+= 1
            } else { supprZonesTexteVides=false};
//---------------------------------------------------------------------------------------------------------------------------------
alerteMasquesEcr = "";
alerteNbLiensSymbRompus = "";
alerteStylesSuppr = "";
alerteDegradForme = "";
alertePeintDyn = "";
alerteEnv = "";
alerteAspect = "";
alerteDecompTout = "";
alertePalFormes = "";
alertePalNuances = "";
alertePalSymb = "";
alerteImagesInc = "";
alerteImagesRed = "";
alerteReperesSuppr = "";
alerteReperesDepl = "";
alerteCaiqSuppr = "";
alerteTextesVides = "";
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Lanch chosen actions   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lancerActions() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //    progress bar  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fenetreProgress = new Window("palette", undefined, [150, 150, 600, 260]);   
    panProgress = fenetreProgress.add("panel", [10, 10, 440, 100], "Progression");  
    barreProgress = panProgress.add("progressbar", [20, 35, 410, 60], 0, 100); 
    barreProgress.value =0
    texteMaBarre = panProgress.add("statictext", [20, 20, 70, 35], "0%"); 
    texteProgress = panProgress.add("statictext", [300, 20, 600, 35]);
    fenetreProgress.show();
    recueilDonnees()
    if(ActionsCochees){
        if (compteurTotal === 0){
            fenetreProgress.close();
            alert(localize({en:"You have not selected any cleaning action !", fr:"Vous n\'avez s\351lectionn\351 aucune action de nettoyage !"}))
        } else {
        if (annulMasquesEcr){annulerMasquesEcretage()};
        if (supprMasqEcr){supprimerMasquesEcretage()};
//-----------------------------------------------------------------------------------
        if (RompreSymboles){RompreLiensSymboles()};
        if (supprStyles){supprimerStyles()};
//-----------------------------------------------------------------------------------
        if (decompDegraFormes){decomposerDegradesFormes()};
        if (decompPeintDyn){decomposerPeinturesDyn()};
        if (decompEnveloppes){decomposerEnveloppes()};
        if (DecompAspect){decomposerAspect()};
        if (DecompTout){decomposerTout()};
//-----------------------------------------------------------------------------------
        if (nettFormes){nettoyerFormes()};
        if (nettNuances){nettoyerNuances()};
        if (nettSymboles){nettoyerSymboles()};
//-----------------------------------------------------------------------------------
        if (incorpImages){incorporerImages()};
        if (ReduireImages){modifierResolutionImages(choixdpi)};
//-----------------------------------------------------------------------------------
        if (supprReperes){supprimerReperes()};
        if (deplReperes){deplacerReperes()};
//-----------------------------------------------------------------------------------
        if (supprZonesTexteVides){supprimerZonesTexteVides()};
        if (supprCalquesVides){supprimerCalquesVides()};
        };
    }else{     
       fenetreProgress.close();
       alert(localize({en:"Cleaning has been canceled", fr:"Le nettoyage a \351t\351 annul\351"}));
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Cancel clipping masks    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function annulerMasquesEcretage() {
if(!rdmaSelection.value){
    app.executeMenuCommand('selectall');
};
var compteurMasques =0
for (masques = monFichier.pageItems.length-1;masques>=0;masques--){
    if (monFichier.pageItems[masques].selected){
        if (monFichier.pageItems[masques].clipping===true){
            monFichier.pageItems[masques].releaseMask;
            compteurMasques++;
        };
    };
};
alerteMasquesEcr = compteurMasques >1 ? compteurMasques + {en:" clipping masks cancelled\n", fr:" masques d'\351cr\352tage annul\351s\n"}
: compteurMasques + {en:" clipping masks cancelled\n", fr:" masque d'\351cr\352tage annul\351\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Delete clipping masks    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function supprimerMasquesEcretage() {
if(!rdmaSelection.value){
    app.executeMenuCommand('selectall');
};
var compteurMasques =0
for (masques = monFichier.pageItems.length-1;masques>=0;masques--){
    if (monFichier.pageItems[masques].selected){
        if (monFichier.pageItems[masques].clipping===true){
            monFichier.pageItems[masques].remove();
            compteurMasques++;
        };
    };
};
alerteMasquesEcr = compteurMasques >1 ? compteurMasques + {en:" clipping masks deleted\n", fr:" masques d'\351cr\352tage supprim\351s\n"}
: compteurMasques + {en:" clipping masks deleted\n", fr:" masque d'\351cr\352tage supprim\351\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Break symbol links    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function RompreLiensSymboles() {
    if(rdmaSelection.value){
        var compteurSymbItems = nbSymbolesSelect;
        for (var f=1;f<nbSymbolesSelect+1;f++){
        monFichier.symbolItems.getByName("monSymbole"+f).breakLink();
        };
    }else{
        var compteurSymbItems = monFichier.symbolItems.length;
        var f = monFichier.symbolItems.length;
        if (f > 0) while (f--) {
            monFichier.symbolItems[f].breakLink();
        };
    };
alerteNbLiensSymbRompus = compteurSymbItems >1 ? compteurSymbItems + {en:" expanded symbols\n", fr:" liens à la palette symbole rompus\n"}
: compteurSymbItems + {en:" expanded symbols\n", fr:" lien à la palette symbole rompu\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Delete graphic styles     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function supprimerStyles() {
var compteurStyles =monFichier.graphicStyles.length-1;
monFichier.graphicStyles.removeAll();
alerteStylesSuppr = compteurStyles >1 ? compteurStyles + {en:" graphic styles deleted\n", fr:" styles supprim\351s\n"}
: compteurStyles + {en:" graphic styles deleted\n", fr:" style supprim\351\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Path Blend Expand    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decomposerDegradesFormes() {
if(!rdmaSelection.value){
    app.executeMenuCommand('selectall');
};
app.executeMenuCommand('Path Blend Expand');
alerteDegradForme = {en:"Blended paths expansion\n", fr:"D\351composition de d\351grad\351\(s\) de forme\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Live paint expansion    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decomposerPeinturesDyn() {
if(!rdmaSelection.value){
    app.executeMenuCommand('selectall');
};
app.executeMenuCommand('Expand Planet X');
alertePeintDyn = {en:"Live paint expansion\n", fr:"D\351composition de peinture\(s\) dynamique\(s\)\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Décomposer les enveloppes    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decomposerEnveloppes() {
if(!rdmaSelection.value){
    app.executeMenuCommand('selectall');
};
app.executeMenuCommand('Expand Envelope');
alerteEnv = {en:"Envelope expansion\n", fr:"D\351composition d'enveloppe\(s\)\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Appearence expansion (applies to styles, brushes, effects,  ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decomposerAspect() {
if(!rdmaSelection.value){
    app.executeMenuCommand('selectall');
};
app.executeMenuCommand('expandStyle');
alerteAspect = {en:"Appearence expansion \(Effects, brushes, graphic styles\)\n", fr:"D\351composition de l\'aspect \(Effets, formes, styles\)\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Expand all  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decomposerTout() {
if(!rdmaSelection.value){
    app.executeMenuCommand('selectall');
};
if (!ckbDecompAspect.value){
    app.executeMenuCommand('expandStyle');
};
app.executeMenuCommand('Expand3');
alerteDecompTout = {en:"     then, expansion of paths\n", fr:"     puis, d\351composition des trac\351s\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Clean brushes palette    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function nettoyerFormes() {
var set = 'nettoyagePalettes',
    action = 'nettoyerFormes',
    actionStr = ['/version 3',
        '/name [ ' + set.length,
        ascii2Hex(set),
        ']',
    '/isOpen 0',
    '/actionCount 1',
    '/action-1 {',
        '/name [ ' + action.length,
        ascii2Hex(action),
        ']',
        	'/keyIndex 0',
	'/colorIndex 0',
	'/isOpen 0',
	'/eventCount 2',
	'/event-1 {',
		'/useRulersIn1stQuadrant 0',
		'/internalName (ai_plugin_brush)',
		'/localizedName [ 5',
			'466f726d65',
		']',
		'/isOpen 0',
		'/isOn 1',
		'/hasDialog 0',
		'/parameterCount 1',
		'/parameter-1 {',
			'/key 1835363957',
			'/showInPalette -1',
			'/type (enumerated)',
			'/name [ 39',
				'53c3a96c656374696f6e6e6572206c657320666f726d6573206e6f6e20757469',
				'6c6973c3a96573',
			']',
			'/value 8',
		'}',
	'}',
	'/event-2 {',
		'/useRulersIn1stQuadrant 0',
		'/internalName (ai_plugin_brush)',
		'/localizedName [ 5',
			'466f726d65',
		']',
		'/isOpen 0',
		'/isOn 1',
		'/hasDialog 1',
		'/showDialog 0',
		'/parameterCount 1',
		'/parameter-1 {',
			'/key 1835363957',
			'/showInPalette -1',
			'/type (enumerated)',
			'/name [ 18',
				'5375707072696d6572206c6120666f726d65',
			']',
			'/value 3',
		'}',
	'}',
'}'].join('\n');
createAction(actionStr, set);
actionStr = null;
app.doScript(action, set,false);
app.unloadAction(set,"");
alertePalFormes= {en:"Delete unused brushes.\n", fr:"Suppression des formes non utilis\351es.\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Clean swatches palette    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function nettoyerNuances() {
var set = 'nettoyagePalettes',
    action = 'nettoyerNuances',
    actionStr = ['/version 3',
        '/name [ ' + set.length,
        ascii2Hex(set),
        ']',
        '/isOpen 0',
        '/actionCount 1',
        '/action-1 {',
        '/name [ ' + action.length,
        ascii2Hex(action),
        ']',
 	'/keyIndex 0',
	'/colorIndex 0',
	'/isOpen 1',
	'/eventCount 2',
	'/event-1 {',
		'/useRulersIn1stQuadrant 0',
		'/internalName (ai_plugin_swatches)',
		'/localizedName [ 8',
			'4e75616e63696572',
		']',
		'/isOpen 0',
		'/isOn 1',
		'/hasDialog 0',
		'/parameterCount 1',
		'/parameter-1 {',
			'/key 1835363957',
			'/showInPalette -1',
			'/type (enumerated)',
			'/name [ 40',
				'53c3a96c656374696f6e6e6572206c6573206e75616e636573206e6f6e207574',
				'696c6973c3a96573',
			']',
			'/value 11',
		'}',
	'}',
	'/event-2 {',
		'/useRulersIn1stQuadrant 0',
		'/internalName (ai_plugin_swatches)',
		'/localizedName [ 8',
			'4e75616e63696572',
		']',
		'/isOpen 0',
		'/isOn 1',
		'/hasDialog 1',
		'/showDialog 0',
		'/parameterCount 1',
		'/parameter-1 {',
			'/key 1835363957',
			'/showInPalette -1',
			'/type (enumerated)',
			'/name [ 19',
				'5375707072696d6572206c61206e75616e6365',
			']',
			'/value 3',
		'}',
	'}',
'}'].join('\n');
createAction(actionStr, set);
actionStr = null;
app.doScript(action, set,false);
app.unloadAction(set,"");
alertePalNuances= {en:"Delete unused swatches.\n", fr:"Suppression des nuances non utilis\351es.\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Clean symbols palette     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function nettoyerSymboles() {
var set = 'nettoyagePalettes',
    action = 'nettoyerSymboles',
    actionStr = ['/version 3',
        '/name [ ' + set.length,
        ascii2Hex(set),
        ']',
        '/isOpen 0',
        '/actionCount 1',
        '/action-1 {',
        '/name [ ' + action.length,
        ascii2Hex(action),
        ']',
	'/keyIndex 0',
	'/colorIndex 0',
	'/isOpen 1',
	'/eventCount 2',
	'/event-1 {',
		'/useRulersIn1stQuadrant 0',
		'/internalName (ai_plugin_symbol_palette)',
		'/localizedName [ 8',
			'53796d626f6c6573',
		']',
		'/isOpen 0',
		'/isOn 1',
		'/hasDialog 0',
		'/parameterCount 1',
		'/parameter-1 {',
			'/key 1835363957',
			'/showInPalette -1',
			'/type (enumerated)',
			'/name [ 40',
				'53c3a96c656374696f6e6e6572206c65732073796d626f6c6573206e6f6e2075',
				'74696c6973c3a973',
			']',
			'/value 12',
		'}',
	'}',
	'/event-2 {',
		'/useRulersIn1stQuadrant 0',
		'/internalName (ai_plugin_symbol_palette)',
		'/localizedName [ 8',
			'53796d626f6c6573',
		']',
		'/isOpen 0',
		'/isOn 1',
		'/hasDialog 1',
		'/showDialog 0',
		'/parameterCount 1',
		'/parameter-1 {',
			'/key 1835363957',
			'/showInPalette -1',
			'/type (enumerated)',
			'/name [ 20',
				'5375707072696d6572206c652073796d626f6c65',
			']',
			'/value 5',
		'}',
	'}',
'}'].join('\n');
createAction(actionStr, set);
actionStr = null;
app.doScript(action, set,false);
app.unloadAction(set,"");
alertePalSymb= {en:"Delete unused symbols.\n", fr:"Suppression des symboles non utilis\351s.\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Embed images    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function incorporerImages() {
var k = monFichier.placedItems.length-1;
var tabImages = []
var compteurImages = 0
if(!rdmaSelection.value){
        for (k;k>=0;k--) {
                tabImages.push(monFichier.placedItems[k])
        };
} else {
        for (k;k>=0;k--) {
            if (monFichier.placedItems[k].selected){
                tabImages.push(monFichier.placedItems[k])
            };
        };
};
var p = tabImages.length;
while (p--){
        tabImages[p].embed();
        compteurImages ++;
};
alerteImagesInc = compteurImages >1 ? compteurImages + {en:"  embeded images\n", fr:" images incorpor\351es\n"}
: compteurImages + {en:" embeded image\n", fr:" image incorpor\351e\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Change image resolution    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function modifierResolutionImages(maResolution) {
var p = monFichier.rasterItems.length-1;
var tabImages = []
var compteurImages = 0
if(!rdmaSelection.value){
        for (p;p>=0;p--) {
                tabImages.push(monFichier.rasterItems[p])
         };
} else {
        for (p;p>=0;p--) {
            if (monFichier.rasterItems[p].selected){
                tabImages.push(monFichier.rasterItems[p])
            };
        };
};
 var Rasterizer = function(resolution) {
        Rasterizer.options = new RasterizeOptions();
        Rasterizer.options.resolution = maResolution||72;
        Rasterizer.options.transparency = true;
        Rasterizer.options.antiAliasingMethod = AntiAliasingMethod.ARTOPTIMIZED;
        };
        Rasterizer.prototype.run = function (){
            var i = tabImages.length;
            while (i--){
                var sourceArt = tabImages[i];
                var clipBounds = sourceArt.visibleBounds;
                monFichier.rasterize(sourceArt,clipBounds, Rasterizer.options);
                compteurImages ++;
            };
         };
var rasterizer = new Rasterizer ()
rasterizer.run()
alerteImagesRed= compteurImages >1 ? compteurImages + {en:" reduced images ",fr:" images r\351duites \340 "} + maResolution + " dpi\n"
: compteurImages + {en:" reduced image ", fr:" image r\351duite \340 "} + maResolution + " dpi\n"

compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Delete guides    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function supprimerReperes() {
var k = monFichier.pathItems.length-1;
var tabReperes = []
var compteurRepères = 0
if(!rdmaSelection.value){
        for (k;k>=0;k--) {
            if (monFichier.pathItems[k].guides){
                tabReperes.push(monFichier.pathItems[k])
            };
        };
} else {
        for (k;k>=0;k--) {
            if (monFichier.pathItems[k].guides && monFichier.pathItems[k].selected){
                tabReperes.push(monFichier.pathItems[k])
            };
        };
};
var p = tabReperes.length;
while (p--){
        tabReperes[p].remove();
        compteurRepères ++;
};
alerteReperesSuppr = compteurRepères >1 ? compteurRepères + {en:" deleted guides\n", fr:" rep\350re supprim\351s\n"}
: compteurRepères + {en:" deleted guide\n", fr:" rep\350res supprim\351\n"}

compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Move guides    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function deplacerReperes() {
creation_CalqueReperes()
var k = monFichier.pathItems.length-1;
var tabReperes = []
var compteurRepères = 0
if(!rdmaSelection.value){
        for (k;k>=0;k--) {
            if (monFichier.pathItems[k].guides){
                tabReperes.push(monFichier.pathItems[k])
            };
        };
} else {
        for (k;k>=0;k--) {
            if (monFichier.pathItems[k].guides && monFichier.pathItems[k].selected){
                tabReperes.push(monFichier.pathItems[k])
            };
        };
};
var p = tabReperes.length;
while (p--){
        tabReperes[p].move(CalqueReperes,ElementPlacement.PLACEATEND);
        compteurRepères ++;
};
alerteReperesDepl = compteurRepères >1 ? compteurRepères + {en:" moved guides\n", fr:" rep\350res d\351plac\351s\n"}
: compteurRepères + {en:" moved guide\n", fr:" rep\350re d\351plac\351\n"}
compteur +=1;
actualiserProgression();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Delete empty layers    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function supprimerCalquesVides() {
    var emptyLayers = [];
    getEmptyLayers (monFichier, emptyLayers);
    var calquesSuppr = emptyLayers.length;
    for (var a=0; a<emptyLayers.length; a++) {
        emptyLayers[a].remove();
    };
alerteCaiqSuppr = calquesSuppr >1 ? calquesSuppr + {en:" deleted empty layers and\\or sub-layers\n", fr:" calques et\\ou sous-calques vides supprim\351s\n"}
: calquesSuppr + {en:" deleted empty layer or sub-layer\n", fr:" calque ou sous-calque vide supprim\351\n"}
compteur +=1;
actualiserProgression();
};
function getEmptyLayers(container, arr, comptage) {
    var layers = container.layers; 
	for (var k=0; k<layers.length; k++) {
        try {
            var ilayer = layers[k];
            ilayer.canDelete = true; // initialize all layers with deletion flag set to true
            // process sublayers first
            if (ilayer.layers.length>0) {
                getEmptyLayers (ilayer, arr)
            }
            // then process objects in current layer
            // if layer has a sublayer with objects, deletion flag was previously set to false
            // ignore this layer and set it's parent layer (container) to false as well, otherwise add to Empty Layers array
            if (ilayer.pageItems.length==0 && ilayer.canDelete) {
                arr.push(ilayer);
            }
            // if layer has objects, set deletion flag to false and its parent layer to false as well
            else {
                ilayer.canDelete = false;
                container.canDelete = false;
            }
        }
        catch(e){/*$.writeln (container.name)*/}
	}
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Delete empty text frames, single dots and invisible objects    //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function supprimerZonesTexteVides() {
if(ActionsCochees){
            var set = 'nettoyage',
                action = 'textesVides',
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
                    '/parameterCount 3',
                    '/parameter-1 {',
                        '/key 1769238125',
                        '/showInPalette -1',
                        '/type (ustring)',
                        '/value [ 17',
                            '636c65616e7570206d656e75206974656d',
                        ']',
                    '}',
                    '/parameter-2 {',
                        '/key 1818455661',
                        '/showInPalette -1',
                        '/type (ustring)',
                        '/value [ 9',
                            '4e6574746f79616765',
                        ']',
                    '}',
                    '/parameter-3 {',
                        '/key 1668114788',
                        '/showInPalette -1',
                        '/type (integer)',
                        '/value -2130705796',
                    '}',
                '}',
            '}'].join('\n');
createAction(actionStr, set);
actionStr = null;
app.doScript(action, set,false);
app.unloadAction(set,"");
alerteTextesVides = {en:"Deletion of empty text frames, single dots and  invisible objects", fr:"Suppression de zones de texte vides, points isol\351s et objets invisibles"}
compteur +=1;
actualiserProgression();
};         
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Actualize progress bar    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function actualiserProgression() {
    barreProgress.value = Math.round(100*(compteur/compteurTotal));
    texteMaBarre.text = barreProgress.value+"%";
    if (compteur<1){
        texteProgress.text = compteur+" action"+" on "+compteurTotal
        } else { texteProgress.text = compteur+" actions"+ {en:" on ", fr:" sur "}+compteurTotal
        };
    if(barreProgress.value<100) {
                fenetreProgress.update();
       //$.sleep(500);
    } else {
            if (compteur<2) { 
                alert(localize({en:"Cleaning is complete\n", fr:"Le nettoyage est termin\351\n"}
                +compteurTotal + {en:" action has been applied ", fr:" action a \351t\351 a \351t\351 appliqu\351e "} + alerteSelect + "\n"
                +"-------------------------------------------------------------\n"
                + alerteMasquesEcr + alerteNbLiensSymbRompus + alerteStylesSuppr
                + alerteDegradForme + alertePeintDyn + alerteEnv + alerteAspect
                + alerteDecompTout + alertePalFormes + alertePalNuances
                + alertePalSymb  + alerteImagesInc + alerteImagesRed + alerteReperesSuppr
                + alerteReperesDepl + alerteCaiqSuppr + alerteTextesVides));
            } else { 
                alert(localize({en:"Cleaning is complete\n", fr:"Le nettoyage est termin\351\n"}
                +compteurTotal +  {en:" actions have been applied ", fr:" actions ont \351t\351 appliqu\351es "} + alerteSelect + "\n"
                +"-------------------------------------------------------------\n"
                + alerteMasquesEcr + alerteNbLiensSymbRompus + alerteStylesSuppr
                + alerteDegradForme + alertePeintDyn + alerteEnv + alerteAspect
                +alerteDecompTout + alertePalFormes + alertePalNuances
                + alertePalSymb + alerteImagesInc + alerteImagesRed + alerteReperesSuppr
                + alerteReperesDepl+ alerteCaiqSuppr + alerteTextesVides));
            };
            fenetreProgress.close();
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Create guide layer    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function creation_CalqueReperes() {
	var calqueReperesNexistePas = true;
    for(i = 0; i < activeDocument.layers.length; i++){
            if(activeDocument.layers[i].name == {en:"Guides", fr:"Rep\350res"}){
                CalqueReperes = activeDocument.activeLayer = activeDocument.layers[i]; 
                calqueReperesNexistePas = false;
            }
    }
    if(calqueReperesNexistePas){
            CalqueReperes = monFichier.layers.add();
            CalqueReperes.name = {en:"Guides", fr:"Rep\350res"};
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Save settings    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sauverParametres() {
    try{
    var paramNettoyage = new File(fichierParam.folder + fichierParam.name),
        donnees = [rdmaSelection.value,
                           rdmonDoc.value,
                           rdIgnorMasqEcr.value,
                           rdAnnulMasqEcr.value,
                           rdSupprMasqEcr.value,
                           ckbRompreSymboles.value,
                           ckbSupprStyles.value,
                           ckbdecompDegraFormes.value,
                           ckbDecompPeintures.value,
                           ckbDecompEnveloppes.value,
                           ckbDecompAspect.value,
                           ckbDecompTout.value,
                           ckbNettFormes.value,
                           ckbNettNuances.value,
                           ckbNettSymboles.value,
                           ckbIncorpImages.value,
                           ckbReduireImages.value,
                           rd72.value,
                           rd150.value,
                           rd300.value,
                           rdIgnoRep.value,
                           rdSupprRep.value,
                           rdDeplRep.value,
                           ckbCalquesVides.value,
                           ckbTextesVides.value].toString();
        paramNettoyage.open('w');
        paramNettoyage.write(donnees);
        paramNettoyage.close();
    }catch(e){$.errorMessage(e);}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    load settings    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function chargerParametres() {
    var paramNettoyage = File(fichierParam.folder + fichierParam.name);
    if (paramNettoyage.exists) {
        try {
            paramNettoyage.open('r');
            var donnees = paramNettoyage.read().split('\n'),
            mesValeurs = donnees[0].split(',');
            rdmaSelection.value = (mesValeurs[0]==='true');
            rdmonDoc.value = (mesValeurs[1]==='true');
            rdIgnorMasqEcr.value = (mesValeurs[2]==='true');
            rdAnnulMasqEcr.value = (mesValeurs[3]==='true');
            rdSupprMasqEcr.value = (mesValeurs[4]==='true');
            ckbRompreSymboles.value = (mesValeurs[5]==='true');
            ckbSupprStyles.value = (mesValeurs[6]==='true');
            ckbdecompDegraFormes.value = (mesValeurs[7]==='true');
            ckbDecompPeintures.value = (mesValeurs[8]==='true');
            ckbDecompEnveloppes.value = (mesValeurs[9]==='true');
            ckbDecompAspect.value = (mesValeurs[10]==='true');
            ckbDecompTout.value = (mesValeurs[11]==='true');
            ckbNettFormes.value = (mesValeurs[12]==='true');
            ckbNettNuances.value = (mesValeurs[13]==='true');
            ckbNettSymboles.value = (mesValeurs[14]==='true');
            ckbIncorpImages.value = (mesValeurs[15]==='true');
            ckbReduireImages.value = (mesValeurs[16]==='true');
            rd72.value = (mesValeurs[17]==='true');
            rd150.value = (mesValeurs[18]==='true');
            rd300.value = (mesValeurs[19]==='true');
            rdIgnoRep.value = (mesValeurs[20]==='true');
            rdSupprRep.value = (mesValeurs[21]==='true');
            rdDeplRep.value = (mesValeurs[22]==='true');
            ckbCalquesVides.value = (mesValeurs[23]==='true');
            ckbTextesVides.value = (mesValeurs[24]==='true');
            } catch (e) {}
        paramNettoyage.close();
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Verify settings folder    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function verifDossierParam() {
    var monDossier = new Folder(fichierParam.folder);
    if (!monDossier.exists) monDossier.create();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Create, lanch, delete action scripts    /////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createAction (str, act) {
    var f = new File('~/' + act+ '.aia');  
    f.open('w');
    f.write(str);
    f.close();
    app.loadAction(f);
    f.remove();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function  ascii2Hex (hex) {
    return hex.replace(/./g, function (a) {return a.charCodeAt(0).toString(16)})
};

//==================================== NOTES =======================================//
/***
  {
    "name" : "limSel_2",
    "note" : "Dessiner les limites des items sélectionnés.",
    "image" : "12_limSel_2.png",
  }
***/
/*-----------------------------------------------------------------------------------------------------------------------------------------------------
Auteur : Christian Condamine (christian.condamine@laposte.net)
                Inspired by John Wundes (drawArtHandles.js)
-------------------------------------------------------------------------------------------------------------------------------------------------------
Usage :
>=---------------------------------------------------------------------------------------------------------------------------------------------------
En:     This script allows you to draw the boundaries of the current selection, choose its color, and adjust the size of its elements.
		Two options are available:
			- "All" corresponds to the selection of one or more objects with the black arrow.
			  In addition to the selection frame, the center points of the objects are drawn, as well as the baseline of text boxes, including
			  when "entering groups."
			- "Each" replaces the drawing of the selection frame with drawing the anchor points and handles
			  (for those that have them).
>=---------------------------------------------------------------------------------------------------------------------------------------------------
Fr :	Ce script permet de dessiner "en dur" les limites de la sélection en cours, de choisir la couleur de cette 
		représentation et la taille de ses éléments. Deux options sont possibles :
            - l'une, nommée "globale" correspond à la sélection d'un ou plusieurs objets avec la flèche noire.
                Outre le cadre de sélection, les points de centre des objets sont représentés ainsi
                que la ligne de base des zones de texte, y compris en "rentrant dans les groupes".
            - l'autre nommée "répartie" remplace le dessin du cadre de sélection par celui des points d'ancrage et
                des poignées pour qui ceux en possédent.
-------------------------------------------------------------------------------------------------------------------------------------------------------
*/
#targetengine 'main'
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false); // Fix drag and drop a .jsx file
$.localize = true;
$.locale =null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
var nomScript = 'limSel_2',
    fichierParam = {
        name: nomScript + '_param.json',
        folder: Folder.myDocuments + '/CC_Scripts/'
    };
var monFichier = app.activeDocument;
var maSelection = monFichier.selection;
var nbSel = maSelection.length;
var grpGlobal,point,grp=0;
if (nbSel > 0) {
    verifDossierParam();
    chargerParametres();
    ouvrirDial(glob,dim,coul);
} else{
		alert (localize({en:"No selection !", fr:"Pas de s\351lection !"}));
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function lancerAction() {
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    creation_vCalque();
	boitEng = null;
    point = dimAncres/3;
    if(typeSelGlobale){
         for (objEnCours=0; objEnCours < nbSel; objEnCours++){
                 vCalque[objEnCours] = vCalque.groupItems.add();
                 boitEng = maSelection[objEnCours].visibleBounds;
                switch(maSelection[objEnCours].constructor.name){
                    case "PathItem":
                            dessinerCentre (boitEng,maSelection[objEnCours],couleurTraits,point);
                            dessinerContours(maSelection[objEnCours],epTraits,couleurTraits);
                    break;
                    case "CompoundPathItem":
                            dessinerCentre (boitEng,maSelection[objEnCours],couleurTraits,point);
                            dessinerContours(maSelection[objEnCours],epTraits,couleurTraits);
                    break;
                    case "GroupItem":
                        var grpMax = maSelection[objEnCours].pageItems.length;
                           for (grp=0; grp<grpMax; grp++){
                                dessinerContours(maSelection[objEnCours].pageItems[grp],epTraits,couleurTraits)
                                boiteGrp = maSelection[objEnCours].pageItems[grp].visibleBounds;
                                dessinerCentre (boiteGrp,maSelection[objEnCours].pageItems[grp],couleurTraits,point);
                            };
                    break;
                    case "TextFrame":
                            creerLigneBase(point,maSelection[objEnCours])
                    break;
                };    
         };
        grpGlobal = vCalque.groupItems.add();
        app.executeMenuCommand('group');
        maSelection = app.activeDocument.selection;
        boitEng = maSelection[0].visibleBounds;
        creerBoiteEnglobante(boitEng,epTraits,couleurTraits,grpGlobal);
        creerCarresSel (typeSelGlobale,boitEng,epTraits,couleurTraits,dimAncres)
        app.executeMenuCommand('ungroup');
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    }else{
         for (objEnCours=0; objEnCours < nbSel; objEnCours++){
                 vCalque[objEnCours] = vCalque.groupItems.add();
                 boitEng = maSelection[objEnCours].visibleBounds;
                switch(maSelection[objEnCours].constructor.name){
                    case "PathItem":
                            dessinerCentre (boitEng,maSelection[objEnCours],couleurTraits,point);
                            dessinerContours(maSelection[objEnCours],epTraits,couleurTraits);
                            dessinerPointsEtPoignées(boitEng,maSelection[objEnCours],epTraits,couleurTraits,point);
                    break;
                    case "CompoundPathItem":
                            dessinerCentre (boitEng,maSelection[objEnCours],couleurTraits,point);
                            dessinerContours(maSelection[objEnCours],epTraits,couleurTraits);
                            for (cpi=0; cpi<maSelection[objEnCours].pathItems.length; cpi++){
                                dessinerPointsEtPoignées(boitEng,maSelection[objEnCours].pathItems[cpi],epTraits,couleurTraits,point);
                            };
                    break;
                    case "GroupItem":
                        var grpMax = maSelection[objEnCours].pageItems.length;
                           for (grp=0; grp<grpMax; grp++){
                                dessinerContours(maSelection[objEnCours].pageItems[grp],epTraits,couleurTraits)
                                boiteGrp = maSelection[objEnCours].pageItems[grp].visibleBounds;
                                dessinerCentre (boiteGrp,maSelection[objEnCours].pageItems[grp],couleurTraits,point);
                                dessinerPointsEtPoignées (boiteGrp,maSelection[objEnCours].pageItems[grp],epTraits,couleurTraits,point);
                            };
                    break;
                    case "TextFrame":
                            creerLigneBase(point,maSelection[objEnCours])
                    break;
                };
           };
     };
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function ouvrirDial(glob,dim,coul) {
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var boiteDialLimSel = new Window ('dialog', {en:"Selection\'s bounds", fr:"Limites de la sélection"});
    boiteDialLimSel.alignChildren = "left";
    boiteDialLimSel.spacing = 10;
    boiteDialLimSel.orientation = "column";
    var panTypeSel =boiteDialLimSel.add ('panel', undefined, {en:"Type of selection", fr:"Type de sélection"});
    var grpTypeSel =panTypeSel.add ('group', undefined);
           grpTypeSel.orientation = "row";
    var rdbselGlobale = grpTypeSel.add('radiobutton',undefined, {en:"All", fr:"Globale"});;
    var rdbselRepartie = grpTypeSel.add('radiobutton',undefined, {en:"Each", fr:"R\351partie"});
           rdbselGlobale.value = glob;
           if(rdbselGlobale.value){rdbselRepartie.value = false;}else{rdbselRepartie.value = true;};
    var grpAncres =boiteDialLimSel.add ('group', undefined);
           grpAncres.orientation = "row";
    var sttAncres= grpAncres .add('statictext', undefined,{en:"Anchors size", fr:"Dim ancres"});
    var txtAncres = grpAncres .add('edittext', undefined,parseInt(dim));
           txtAncres.characters = 4;
           dimAncres = parseFloat(txtAncres.text*2.834645);
           txtAncres.onChange = function(){dimAncres = parseFloat(txtAncres.text*2.834645)};
    var sttUniteAncres= grpAncres .add('statictext', undefined,"mm");
    epTraits = parseFloat(dimAncres/10);
    var grpCouleursTraits = boiteDialLimSel.add ('group', undefined);
            grpCouleursTraits.orientation = "row";
    var sttCouleurTraits= grpCouleursTraits .add('statictext', undefined,{en:"Stroke color", fr:"Couleur traits"});
                            var localiseColor2 = {en:"Green", fr:"Vert"}
                            var localiseColor3 = {en:"Blue", fr:"Bleu"}
                            var localiseColor4 = {en:"White", fr:"Blanc"} 
                            var localiseColor5 = {en:"Black", fr:"Noir"}
    var listeCouleurs = grpCouleursTraits.add('DropDownList', undefined, ["Orange", "Mauve", localiseColor2, localiseColor3,localiseColor4,localiseColor5]);
    listeCouleurs.minimumSize.width = 80;
    listeCouleurs.selection = listeCouleurs.selection === null ? coul : coul;
    couleurTraits = decoderCouleur(listeCouleurs.selection.index);
    listeCouleurs.onChange = function(){couleurTraits = decoderCouleur(listeCouleurs.selection.index);};
    var grpBoutons   = boiteDialLimSel.add("group");
            grpBoutons.orientation = "row";
    var btnOk = grpBoutons.add("button", undefined, "ok",{name:"ok"});
    btnOk.onClick = function(){typeSelGlobale =rdbselGlobale.value;
                                              couleurTraits = decoderCouleur(listeCouleurs.selection.index);
                                              dimAncres = parseFloat(txtAncres.text*2.834645);
                                              epTraits = parseFloat(dimAncres/10);
                                              lancerAction();
                                              boiteDialLimSel.close();
                                             };
    var btnAnnul = grpBoutons.add("button", undefined, {en:"Cancel", fr:"Annuler"}, {name: "cancel"});
    boiteDialLimSel.onClose = function(){sauverParametres(rdbselGlobale.value,parseInt(txtAncres.text), parseInt(listeCouleurs.selection.index))};
    boiteDialLimSel.show();
    return (epTraits,couleurTraits,dimAncres,dimAncres,typeSelGlobale);
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function creerCarresSel (typeSelGlobale,boitEng,epTraits,couleurTraits,dimAncres){
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        dessinerCarre (boitEng[0], boitEng[1],typeSelGlobale,epTraits,couleurTraits,dimAncres,vCalque);
        dessinerCarre (boitEng[0], boitEng[3],typeSelGlobale,epTraits,couleurTraits,dimAncres,vCalque);
        dessinerCarre (boitEng[2], boitEng[1],typeSelGlobale,epTraits,couleurTraits,dimAncres,vCalque);
        dessinerCarre (boitEng[2], boitEng[3],typeSelGlobale,epTraits,couleurTraits,dimAncres,vCalque);
        dessinerCarre ((boitEng[0]+boitEng[2])/2, boitEng[1],typeSelGlobale,epTraits,couleurTraits,dimAncres,vCalque);
        dessinerCarre ((boitEng[0]+boitEng[2])/2, boitEng[3],typeSelGlobale,epTraits,couleurTraits,dimAncres,vCalque);
        dessinerCarre (boitEng[0], (boitEng[1]+boitEng[3])/2,typeSelGlobale,epTraits,couleurTraits,dimAncres,vCalque);
        dessinerCarre (boitEng[2], (boitEng[1]+boitEng[3])/2,typeSelGlobale,epTraits,couleurTraits,dimAncres,vCalque);
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function dessinerCentre (boitEng,objet,couleurTraits,point){
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var gr;
    if(objet.typename != "GroupItem" && objet.typename != "TextFrame"){
        var Lx= (boitEng[2]-boitEng[0])/2-point;
        var Hy = (boitEng[3]-boitEng[1])/2+point;
        var centre = vCalque.pathItems.add();
        centre.setEntirePath([[boitEng[0]+Lx, boitEng[1]+Hy],[boitEng[0]+Lx,boitEng[3]-Hy],[boitEng[2]-Lx, boitEng[3]-Hy],[boitEng[2]-Lx, boitEng[1]+Hy]]);
        centre.closed = true;
        centre.filled = true;
        centre.stroked = false;
        centre.fillColor = couleurTraits;
    }else if (objet.typename === "GroupItem"){
        for (gr=0; gr<objet.pageItems.length; gr++){
            dessinerCentre(objet.pageItems[gr].visibleBounds,objet.pageItems[gr],couleurTraits,point)
        };
    }else{
           creerLigneBase(point,objet);
    };
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function dessinerCarre (x,y,typeSelGlobale,epTraits,couleurTraits,dimAncres){
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var carre;
    var coulBlanche = new RGBColor();
    coulBlanche.red = 255 ; coulBlanche.green = 255 ; coulBlanche.blue = 255;
    carre = vCalque.pathItems.add();
    carre.setEntirePath([[x - (dimAncres/2),y + (dimAncres/2)], [x  - (dimAncres/2),y - (dimAncres/2)], [x + (dimAncres/2),y - (dimAncres/2)],[x + (dimAncres/2),y + (dimAncres/2)],[x - (dimAncres/2),y + (dimAncres/2)]]);
    carre.closed = true;
    carre.filled = true;
    if(typeSelGlobale){
        carre.stroked = true;
        carre.strokeWidth = epTraits;
        carre.strokeColor = couleurTraits;
        carre.fillColor = coulBlanche;
    }else{
        carre.stroked = false;
        carre.fillColor = couleurTraits;
    };
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function creerBoiteEnglobante(boitEng,epTraits,couleurTraits){
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var rectangle= vCalque.pathItems.add();
    rectangle.setEntirePath([[boitEng[0], boitEng[1]], [boitEng[2],boitEng[1]], [boitEng[2],boitEng[3]],[boitEng[0], boitEng[3]],[boitEng[0], boitEng[1]]]);
    rectangle.closed = true;
    rectangle.filled = false;
    rectangle.stroked = true;
    rectangle.strokeWidth = epTraits;
    rectangle.strokeColor = couleurTraits;
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function creerLigneBase(point,monTexte) {
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var ligneBaseTexte,carreTexte;
    var largT = monTexte.width;
    var topT = monTexte.top;
    var leftT = monTexte.left;
    var diff = monTexte.top - monTexte.anchor[1];
    ligneBaseTexte = vCalque.pathItems.add();
    ligneBaseTexte.setEntirePath([[leftT, topT-diff],[leftT + largT, topT-diff]]);
    ligneBaseTexte.filled = false;
    ligneBaseTexte.stroked = true;
    ligneBaseTexte.strokeWidth = epTraits;
    ligneBaseTexte.strokeColor = couleurTraits;
    carreTexte = vCalque.pathItems.add();
    carreTexte.setEntirePath([[leftT, topT-diff+point], [leftT, topT-diff-point], [leftT+(point*2), topT-diff - point],[leftT+(point*2), topT-diff + point],[leftT, topT-diff+point]]);
    carreTexte.filled = true;
    carreTexte.stroked = false;
    carreTexte.fillColor = couleurTraits;
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function dessinerPointsEtPoignées(boitEng,objet,epTraits,couleurTraits,point){
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var mesPoints,pAncr,tang,tand,elg,elg,p,gr;
    if(objet.typename != "GroupItem" && objet.typename != "TextFrame"){
            // Points d'ancrage
            mesPoints = objet.pathPoints;
            for (p=0; p<mesPoints.length; p++){
                pAncr = app.activeDocument.pathItems.rectangle (mesPoints[p].anchor[1]+point, mesPoints[p].anchor[0]-point,point*2,point*2);
                pAncr.stroked = false;
                pAncr.filled = true;
                pAncr.fillColor = couleurTraits;
                // poignées gauche
                if (mesPoints[p].leftDirection[0] != mesPoints[p].anchor[0] || mesPoints[p].leftDirection[1] != mesPoints[p].anchor[1]){
                    tang = app.activeDocument.pathItems.add();
                    tang.setEntirePath ( [ mesPoints[p].leftDirection, mesPoints[p].anchor ] );
                    tang.stroked = true;
                    tang.strokeWidth = epTraits;
                    tang.strokeColor = couleurTraits;
                    elg = app.activeDocument.pathItems.ellipse (mesPoints[p].leftDirection[1]+point, mesPoints[p].leftDirection[0]-point,point*2,point*2);
                    elg.stroked = false;
                    elg.filled = true;
                    elg.fillColor = couleurTraits;
                };
                // poignées droite
                if (mesPoints[p].rightDirection[0] != mesPoints[p].anchor[0] || mesPoints[p].rightDirection[1] != mesPoints[p].anchor[1]){
                    tand = app.activeDocument.pathItems.add();
                    tand.setEntirePath ( [ mesPoints[p].rightDirection, mesPoints[p].anchor ] );
                    tand.stroked = true;
                    tand.strokeWidth = epTraits;
                    tand.strokeColor = couleurTraits;
                    eld = app.activeDocument.pathItems.ellipse (mesPoints[p].rightDirection[1]+point, mesPoints[p].rightDirection[0]-point,point*2,point*2);
                    eld.stroked = false;
                    eld.filled = true;
                    eld.fillColor = couleurTraits;
                };
             };
    }else if(objet.typename === "GroupItem"){
        for (gr=0; gr<objet.pageItems.length; gr++){
            dessinerPointsEtPoignées(objet.pageItems[gr].visibleBounds,objet.pageItems[gr],epTraits,couleurTraits,point)
        };
    };
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function dessinerContours(objet,epTraits,couleurTraits){
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var maCopie,cpi,gr;
    //alert("2" + " ;" + objet.typename + " ; " + grp + " ; " + objet.top)
    switch(objet.constructor.name){
        case "PathItem": 
            maCopie = objet.duplicate(vCalque,ElementPlacement.PLACEATEND);
            maCopie.filled = false;
            maCopie.stroked = true;
            maCopie.strokeWidth = epTraits;
            maCopie.strokeColor = couleurTraits;
            //alert("2" + " ;" + objet.typename + " ; " + grp + " ; " + objet.top)
            break;
        case "CompoundPathItem":
            maCopie = objet.duplicate(vCalque,ElementPlacement.PLACEATEND);
            for (cpi=0; cpi<maCopie.pathItems.length; cpi++){
                maCopie.pathItems[cpi].filled = false;
                maCopie.pathItems[cpi].stroked = true;
                maCopie.pathItems[cpi].strokeWidth = epTraits;
                maCopie.pathItems[cpi].strokeColor = couleurTraits;
            };
            break;
        case "GroupItem":
            for (gr=0; gr<objet.pageItems.length; gr++){
                dessinerContours(objet.pageItems[gr],epTraits,couleurTraits)
            };
            break;
         default:  break;
    };     
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function reinitSelection (monItem,epTraits,couleurTraits) {
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.redraw()
dessinerContours(monItem,epTraits,couleurTraits);
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decoderCouleur (couleurChoisie) {
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    couleurTraits = new RGBColor();
    switch (couleurChoisie) {
    case  0:
                couleurTraits.red = 236;couleurTraits.green = 103;couleurTraits.blue = 27;
                return (couleurTraits);break;
    case  1 :
                couleurTraits.red = 156;couleurTraits.green = 82;couleurTraits.blue = 154;
                return (couleurTraits);break;
    case  2 :
                couleurTraits.red = 103;couleurTraits.green = 179;couleurTraits.blue = 48;
                return (couleurTraits);break;
    case 3 :
                couleurTraits.red = 110;couleurTraits.green = 199;couleurTraits.blue = 217;
                return (couleurTraits);break;
    case   4 :
                couleurTraits.red = 255;couleurTraits.green =255;couleurTraits.blue = 255;
                return (couleurTraits);break;
    case   5 :
                couleurTraits.red = 29;couleurTraits.green =29;couleurTraits.blue = 29;
                return (couleurTraits);break;
    };
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function creation_vCalque() {
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var vCalqueNexistePas = true;
    for(i = 0; i < activeDocument.layers.length; i++){
            if(activeDocument.layers[i].name == "limitesSelection"){
                vCalque = activeDocument.activeLayer = activeDocument.layers[i]; 
                vCalqueNexistePas = false;
            };
    };
    if(vCalqueNexistePas){
            vCalque = monFichier.layers.add();
            vCalque.name = "limitesSelection";
    };
activeLayer = vCalque;
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function sauverParametres(glob,dim,coul) {
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    try{
    var paramLimSel = new File(fichierParam.folder + fichierParam.name),
        donnees = [glob,dim,coul,].toString();
        paramLimSel.open('w');
        paramLimSel.write(donnees);
        paramLimSel.close();
    }catch(e){$.errorMessage(e);}
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function chargerParametres() {
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var paramLimSel = File(fichierParam.folder + fichierParam.name);
    try{
        if (paramLimSel.exists) {
                paramLimSel.open('r');
                var donnees = paramLimSel.read().split('\n'),
                mesValeurs = donnees[0].split(',');
                glob = (mesValeurs[0]==='true');
                dim = parseInt(mesValeurs[1]);
                coul =mesValeurs[2];
                return(glob,dim,coul);
         };   
    }catch(e){$.errorMessage(e);}
    paramLimSel.close();
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function verifDossierParam() {
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var monDossier = new Folder(fichierParam.folder);
    var paramLimSel = File(fichierParam.folder + fichierParam.name);
    if (!monDossier.exists) monDossier.create();
    if (!paramLimSel.exists) {
       paramLimSel = new File(fichierParam.folder + fichierParam.name),
        donnees = [ true,2,0,].toString();
        paramLimSel.open('w');
        paramLimSel.write(donnees);
     };
};

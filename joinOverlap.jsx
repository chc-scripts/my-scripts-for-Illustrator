//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*JoinOverlap
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Christian Condamine - (christian.condamine@laposte.net)
Inteface modification of an original  2017  script by Mads Wolff (JOIN PATHS WITH OVERLAPPING POINTS)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Utilisation :
        L'utilisateur saisit une tolérance pour les points qui se chevauchent.
            - Les points isolés sont supprimés.
            - Les points superposés sur un même tracé sont fusionnés.
            - Les tracés ouverts avec des points qui se chevauchent sont joints.
        Seuls les tracés sélectionnés sont concernés.
        Les groupes sont pris en charge, mais pas les tracés transparents.
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Usage :
        The user enters a tolerance for the overlapping points.
            - Isolated points are deleted.
            - Overlapping points on the same path are merged.
            - Open paths with overlapping points are joined.
        Only selected paths are affected.
        Groups are supported, but compound paths are not.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
$.localize = true;
$.locale =null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
// Déclaration de variables pour le document actif
    var monFichier = app.activeDocument;
    var maSelection = monFichier.selection;
// Boucle pour déterminer si quelque chose est sélectionné ou non
    var nbItemsSelectionnes = app.activeDocument.selection.length;
    if (nbItemsSelectionnes != 0) {
        dialogTolerance()
          var nbPoints = 0;
          var nbPointsIsoles = 0;
          var nbTracesOuverts = 0;
          var nbTracesFermes = 0;
          var nbPointsPartageSuppr = 0;
          var nbPointsSuperposesJoints = 0;
          var nbTracesRestant = 0;
// lancement de l'action
  execute(monFichier.selection);
  dialOverlap(nbTracesOuverts,nbTracesFermes,nbPoints,nbPointsIsoles,nbPointsPartageSuppr,nbPointsSuperposesJoints,nbTracesRestant);
// déselectionner tout
  monFichier.selection = [];
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Boite de dialogue pour recueuillir la tolérance    ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dialogTolerance() {
    var dialTol = new Window("dialog", {en:"Overlapped anchors", fr:"Points superpos\351s"});
        dialTol.orientation = "column"; 
        dialTol.alignChildren = ["left","top"]; 
        dialTol.spacing = 10; 
        dialTol.margins = 16; 
    //// Groupe_Tolerance
    var grpTol = dialTol.add("group", undefined); 
        grpTol.orientation = "row"; 
        grpTol.alignChildren = ["left","center"]; 
        grpTol.margins = 0; 
    var lblTol = grpTol.add("statictext", undefined, {en:"Tolerance", fr:"Tol\351rance"}); 
    var edtTol = grpTol.add("editText", undefined, 0);
    edtTol.characters = 5;
    //// Groupe_Information
    var grpInfo = dialTol.add("group", undefined); 
        grpInfo.orientation = "row"; 
        grpInfo.alignChildren = ["left","center"]; 
        grpInfo.margins = 0; 
    var ckbInfo = grpInfo.add("checkbox", undefined, {en:"View action report?", fr:"Afficher résumé des opérations ?"});
        info = ckbInfo.value = true;
        ckbInfo.onClick = function(){info = ckbInfo.value;};
    //// Groupe_Boutons
    var grpBoutons = dialTol.add("group", undefined); 
        grpBoutons.orientation = "row"; 
        grpBoutons.alignChildren = ["left","center"]; 
        grpBoutons.margins = 0; 
    var btnOk = grpBoutons.add("button", undefined, "Ok"); 
            btnOk.onActivate = function() { if (edtTol.text != null){
                                                                 tolerance = edtTol.text;
                                                             }else{
                                                               tolerance = 0
                                                             };
                                                           return edtTol.text;
                                                           };
    var btnAnnuler = grpBoutons.add("button", undefined,  {en:"Cancel", fr:"Annuler"}, {name: "cancel"});
        btnAnnuler.onActivate = function() {dialTol.close()};
    dialTol.show();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Fonction execute    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function execute(itemList) {
    itemList = Array.prototype.slice.call(itemList);
    var items = [];
    var overlapClusters = [];
    for (var i = 0; i < itemList.length; i++) {
      var item = itemList[i];
      if (item.typename === "GroupItem") {
        execute(item.pageItems);
      } else if (item.typename === "PathItem") {
        if (item.pathPoints.length > 1) {
          var points = Array.prototype.slice.call(item.pathPoints);
          for (var j = 0; j < points.length; j++) {
            var point = points[j];
            var nextPoint = points[j + ((!item.closed || (j + 1 < points.length)) ? 1 : 1 - points.length)];
            if (nextPoint) {
              if (
                point.anchor[0] === nextPoint.anchor[0] &&
                point.anchor[1] === nextPoint.anchor[1] &&
                point.rightDirection[0] === point.anchor[0] &&
                point.rightDirection[1] === point.anchor[1] &&
                nextPoint.leftDirection[0] === point.anchor[0] &&
                nextPoint.leftDirection[1] === point.anchor[1]
              ) {
                nextPoint.leftDirection = point.leftDirection;
                point.remove();
                nbPointsPartageSuppr++;
              }
            }
            nbPoints++;
          }
        }
        if (item.pathPoints.length === 1) {
          item.remove();
          nbPointsIsoles++;
          nbTracesOuverts++;
        } else if (!item.closed) {
          items.push(item);
          nbTracesOuverts++;
        } else {
          nbTracesFermes++;
        }
      }
    }
    nbTracesOuverts += items.length;
    for (var i = 0; i < items.length; i++) {
      var itemA = items[i];
      var pointsA = itemA.pathPoints;
      for (var j = 0; j < pointsA.length; j++) {
        var pointA = pointsA[j];
        for (var k = i + 1; k < items.length; k++) {
          var itemB = items[k];
          var pointsB = itemB.pathPoints;
          for (var l = 0; l < pointsB.length; l++) {
            var pointB = pointsB[l];
            var overlap = tolerance === 0 ?
              (pointA.anchor[0] === pointB.anchor[0] && pointA.anchor[1] === pointB.anchor[1]) :
              (tolerance >= Math.sqrt(Math.pow(pointA.anchor[0] - pointB.anchor[0], 2) + Math.pow(pointA.anchor[1] - pointB.anchor[1], 2)));
            if (overlap) {
              if (tolerance > 0) {
                var d0 = (pointA.anchor[0] - pointB.anchor[0]) / 2;
                var d1 = (pointA.anchor[1] - pointB.anchor[1]) / 2;
                pointA.anchor = [pointA.anchor[0] - d0, pointA.anchor[1] - d1];
                pointA.leftDirection = [pointA.leftDirection[0] - d0, pointA.leftDirection[1] - d1];
                pointA.rightDirection = [pointA.rightDirection[0] - d0, pointA.rightDirection[1] - d1];
                pointB.anchor = [pointB.anchor[0] + d0, pointB.anchor[1] + d1];
                pointB.leftDirection = [pointB.leftDirection[0] + d0, pointB.leftDirection[1] + d1];
                pointB.rightDirection = [pointB.rightDirection[0] + d0, pointB.rightDirection[1] + d1];
              }
              if (itemA.overlapCluster === undefined) {
                if (itemB.overlapCluster === undefined) {
                  itemA.overlapCluster = [];
                  itemB.overlapCluster = itemA.overlapCluster;
                  itemA.overlapCluster.push(itemA);
                  itemA.overlapCluster.push(itemB);
                  overlapClusters.push(itemA.overlapCluster);
                } else {
                  itemA.overlapCluster = itemB.overlapCluster;
                  itemA.overlapCluster.push(itemA);
                }
              } else {
                itemB.overlapCluster = itemA.overlapCluster;
                itemA.overlapCluster.push(itemB);
              }
            }
          }
        }
      }
    }
    for (var i = 0; i < overlapClusters.length; i++) {
      var overlapCluster = overlapClusters[i];
      monFichier.selection = overlapCluster;
      nbPointsSuperposesJoints += monFichier.selection.length;
      nbTracesRestant++;
      app.executeMenuCommand("join");
      var joinedItem = monFichier.selection[0];
      delete joinedItem.overlapCluster;
    };
return(nbTracesOuverts,nbTracesFermes,nbPoints,nbPointsIsoles,nbPointsPartageSuppr,nbPointsSuperposesJoints,nbTracesRestant);
  };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Boite de dialogue pour rendre compte des opérations    /////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dialOverlap(a,b,c,d,e,f,g){
if (info){
    var dialOverlap = new Window("dialog",{en:"Join Paths With Overlapping Point", fr:"Traitement des points superposés"}); 
        dialOverlap.orientation = "column"; 
        dialOverlap.alignChildren = ["left","top"]; 
    // Groupe nb tracés sélectionnés
    var grpSelect = dialOverlap.add("group",[8,18,281,41]); 
        grpSelect.orientation = "row"; 
        grpSelect.alignChildren = ["left","center"]; 
        var sttSelect = grpSelect.add("statictext", [10,4,193,21], {en:"Number of selected paths:", fr:"Nombre de tracés sélectionnés :"}); 
        var edtSelect = grpSelect.add("edittext",[214,0,276,23], (a/2) +b); 
        edtSelect.characters = 5;
    // Panneau Ouverts/Fermés
    var panOuvFerm = dialOverlap.add("panel", [18,58,288,132], {en:"Including:",fr:"dont :"}); 
        panOuvFerm.orientation = "column"; 
        panOuvFerm.alignChildren = ["left","top"]; 
    // Groupe tracés ouverts
    var grpOuv = panOuvFerm.add("group", [5,11,196,35]); 
        grpOuv.orientation = "row"; 
        grpOuv.alignChildren = ["left","center"]; 
        var sttOuv = grpOuv.add("statictext",  [7,4,62,21], {en:"Open:", fr:"Ouverts :"}); 
        var edtOuv = grpOuv.add("edittext", [62,0,124,23], a/2); 
        edtOuv.characters = 5;
    // Groupe tracés fermés
    var grpFerm = panOuvFerm.add("group", [5,40,196,63]); 
        grpFerm.orientation = "row"; 
        grpFerm.alignChildren = ["left","center"]; 
        var sttFerm = grpFerm.add("statictext",  [7,4,58,21], {en:"Closed:", fr:"Fermés :"}); 
        var edtFerm = grpFerm.add("edittext", [62,0,124,23], b); 
        edtFerm.characters = 5;
    // Diviseur_1
    var div_1 = dialOverlap.add("panel",  [18,140,281,142]); 
        div_1.alignment = "fill"; 
    // Groupe points parasites
    var grpPara = dialOverlap.add("group", [8,149,281,172]); 
        grpPara.orientation = "row"; 
        grpPara.alignChildren = ["left","center"]; 
        var sttPara = grpPara.add("statictext",  [10,4,206,21], {en:"- Stray points deleted:", fr:"- Nb points isolés supprimés :"}); 
        var edtPara = grpPara.add("edittext", [214,0,276,23], d); 
        edtPara.characters = 5;
    // Groupe points superposés sur un même tracé supprimés
    var grpPointsSuppr = dialOverlap.add("group", [8,181,281,204]); 
        grpPointsSuppr.orientation = "row"; 
        grpPointsSuppr.alignChildren = ["left","center"]; 
        var sttPointsSuppr = grpPointsSuppr.add("statictext",  [10,4,210,21], {en:"- Overlapped points deleted:", fr:"- Nb points superposés supprimés :"}); 
        var edtPointsSuppr = grpPointsSuppr.add("edittext", [214,0,276,23],e); 
        edtPointsSuppr.helpTip = "... sur un  même tracé."; 
        edtPointsSuppr.characters = 5;
    // Groupe points superposés faisant partie de tracés différents
    var grpPointsFus = dialOverlap.add("group", [8,213,281,236]); 
        grpPointsFus.orientation = "row"; 
        grpPointsFus.alignChildren = ["left","center"]; 
        var sttPointsFus = grpPointsFus.add("statictext",  [10,4,206,21], {en:"- Overlapped points Merged:", fr:"- Nb points superposés fusionnés :"}); 
        var edtPointsFus = grpPointsFus.add("edittext", [214,0,276,23],f); 
        edtPointsFus.characters = 5;
    // Groupe nb tracés restant
    var grpTracesRest = dialOverlap.add("group", [8,245,281,268]); 
        grpTracesRest.orientation = "row"; 
        grpTracesRest.alignChildren = ["left","center"]; 
        var sttTracesRest = grpTracesRest.add("statictext",  [10,4,206,21], {en:"- Number of paths left:", fr:"- Nb tracés restant :"}); 
        var edtTracesRest = grpTracesRest.add("edittext", [214,0,276,23],g+b); 
        edtTracesRest.characters = 5;
    // Bouton Fermer
    var btnFerm = dialOverlap.add("button", undefined, {en:"Close", fr:"Fermer"},{name:"cancel"}); 
        btnFerm.alignment = ["center","top"];
    dialOverlap.show();
};
};
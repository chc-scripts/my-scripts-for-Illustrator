/*Marges.jsx
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
       christian.condamine@laposte.net - octobre 2022
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      Ce script est une combinaison de 2 scripts créés par MulaRahul, addMargigin.jsx and AddPadding.jsx
      (https://github.com/mulaRahul/illustrator-scripts) auquel il a été ajouté une fonction d'aperçu en temps réel inspiré
      par le tutoriel d'Alexander Ladygin's  (https://ladyginpro.ru/blog/create-preview-in-dialog/).
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Utilisation :
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
1.  Ouvrez votre document illustrator.
2.  Exécutez le script, Fichier → Scripts → ReperesMarge.jsx.
3.  La boîte de dialogue qui s'ouvre contient déjà des valeurs qui permettent de visualiser la création de repères.
     Toutes ces valeurs peuvent être changées et l'aperçu s'actualisera en temps réel
4.  Changez la valeur de la marge dans le champ de texte "Marges".
5.   La nouvelle valeur de marge sera appliquée dans toutes les directions.
6.   Par défaut, tous les plans de travail seront affectés mais vous pouvez n'affecter que les plans de travail souhaités
      en cochant l'option "Numéros".
7.   Saisissez ensuite les numéros des plans de travail choisis séparés par une virgule (ex. : 1, 3, 5) ou une séquence
      de plans de travail (ex; : 5-8) ou les deux combinés  (ex; : 1, 3, 5-8).
8.   Si vous souhaitez ajouter des marges différentes pour différentes directions, cochez la case "Différenciées" et
      saisissez les valeurs de marge pour le haut, la gauche, la droite et le bas.
9.   Si vous souhaitez ajouter des marges différentes pour les pages en vis à vis, sélectionnez "Alternées".
10. Entrez ensuite les valeurs des marges "Gauche" et "Droite" pour les plans de travail "Impairs" et "Pairs".
11. Vous pouvez choisir de créer des Repères, des Rectangles ou des Marges (ces dernières agissent sur les
       largeurs et hauteurs des plans de travail.
12. Valider enfin vos réglages avec le bouton "Créer".
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#targetengine 'main'
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);
defaire = false;
etat = false
//// Créer nuance de noir
    var blackColor = new CMYKColor();
        blackColor.cyan = 0;
        blackColor.magenta = 0;
        blackColor.yellow = 0;
        blackColor.black = 100;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Boite de dialogue   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// configuration des données de la boîte de dialogue
var configData = {
    margins: 15,
    spacing: 10,
    fillAlignment: ["fill", "center"],
    leftAlignment: ["left", "center"],
};
// Fenêtre de base
var dlg = new Window("dialog", "Ajouter rep\350re de marges");
dlg.alignChildren = ["fill", "fill"];
// Options de mise en page
var artboardOptionsContainer = dlg.add("panel", undefined, "Plans de travail");
    artboardOptionsContainer.orientation = "row";
    artboardOptionsContainer.margins = configData.margins;
    artboardOptionsContainer.alignChildren = configData.fillAlignment;
var allArtboardOption = artboardOptionsContainer.add("radiobutton", undefined, "Tous");
        allArtboardOption.value = true;
        allArtboardOption.onClick = function () { customArtboardInput.enabled = false;
                                                                    majApercu();
                                                                    };
var customArtboardOption = artboardOptionsContainer.add("radiobutton", undefined, "Numéros");
        customArtboardOption.onClick = function () { customArtboardInput.enabled = true;
                                                                            majApercu();
                                                                           };
var customArtboardInput = artboardOptionsContainer.add("edittext", undefined, "1, 3, 5-8");
    customArtboardInput.enabled = false;
    customArtboardInput.minimumSize = [100, 0];
    customArtboardInput.onChange = function() {majApercu();};
// Entrée des valeurs de marges
var marginContainer = dlg.add("panel", undefined, "Marges");
    marginContainer.margins = configData.margins;
    marginContainer.alignment = configData.fillAlignment;
    marginContainer.alignChildren = configData.leftAlignment;
var marginRadiobuttonGroup = marginContainer.add("group", undefined);
    marginRadiobuttonGroup.orientation = "column";
    marginRadiobuttonGroup.alignChildren = configData.leftAlignment;
var allMarginWrapper = marginRadiobuttonGroup.add("group", undefined);
var rd_MargesUniformes = allMarginWrapper.add("radiobutton", undefined, "Uniformes");
        rd_MargesUniformes.value = true;
        rd_MargesUniformes.onClick = function() {this.value = true;
                                                                directionalMargin.value = false;
                                                                // Champs
                                                                topMargin.enabled = false;
                                                                leftMargin.enabled = false;
                                                                rightMargin.enabled = false;
                                                                bottomMargin.enabled = false;
                                                                marginAll.enabled = true;
                                                                majApercu();
                                                            }
var marginAll = allMarginWrapper.add("edittext", undefined,15);
    marginAll.minimumSize = [60, 0];
    marginAll.onChange = function() {majApercu();};
var unitOptions = allMarginWrapper.add("dropdownlist", undefined, ["mm", "pixels","inches"]);
    unitOptions.selection = "mm";
    unitOptions.selection = unitOptions.selection === null ? 0 : unitOptions.selection;
    unitOptions.onChange = function() {majApercu();};
var directionalMargin = marginRadiobuttonGroup.add("radiobutton", undefined, "Diff\351renci\351es");
    directionalMargin.value = false;
directionalMargin.onClick = function() {this.value = true;
                                                    rd_MargesUniformes.value = false;
                                                    // Champs
                                                    topMargin.enabled = true;
                                                    leftMargin.enabled = true;
                                                    rightMargin.enabled = true;
                                                    bottomMargin.enabled = true;
                                                    marginAll.enabled = false;
                                                    majApercu();
                                                }
//// marges différenciées
    var directionalMarginPanel = marginContainer.add("group", undefined);
        directionalMarginPanel.orientation = "row";
        directionalMarginPanel.alignment = configData.leftAlignment;
//// Haut
    var topWrapper = directionalMarginPanel.add("group", undefined);
        topWrapper.orientation = "column";
        topWrapper.alignChildren = configData.leftAlignment;;
        topWrapper.add("statictext", undefined, "Haut ");
    var topMargin = topWrapper.add("edittext", undefined, "10");
        topMargin.minimumSize = [50, 0];
        topMargin.onChange = function() {majApercu();};
//// Droite
    var rightWrapper = directionalMarginPanel.add("group", undefined);
        rightWrapper.orientation = "column";
        rightWrapper.alignChildren = configData.leftAlignment;;
        rightWrapper.add("statictext", undefined, "Droite ");
    var rightMargin = rightWrapper.add("edittext", undefined, "10");
        rightMargin.minimumSize = [50, 0];
        rightMargin.onChange = function() {majApercu();};
//// Gauche
    var leftWrapper = directionalMarginPanel.add("group", undefined);
        leftWrapper.orientation = "column";
        leftWrapper.alignChildren = configData.leftAlignment;;
        leftWrapper.add("statictext", undefined, "Gauche ");
    var leftMargin = leftWrapper.add("edittext", undefined, "10");
        leftMargin.minimumSize = [50, 0];
        leftMargin.onChange = function() {majApercu();};
//// bas
    var bottomWrapper = directionalMarginPanel.add("group", undefined);
        bottomWrapper.orientation = "column";
        bottomWrapper.alignChildren = configData.leftAlignment;;
        bottomWrapper.add("statictext", undefined, "Bas ");
    var bottomMargin = bottomWrapper.add("edittext", undefined, "10");
        bottomMargin.minimumSize = [50, 0];
        bottomMargin.onChange = function() {majApercu();};
//// Traitement des pages en vis à vis
    var methodOptionsContainer = dlg.add("panel", undefined, "Pages en vis à vis");
        methodOptionsContainer.margins = configData.margins;
        methodOptionsContainer.alignChildren = configData.leftAlignment;
    var methodOptionsWrapper = methodOptionsContainer.add("group", undefined);
        methodOptionsWrapper.orientation = "row";
    var similarOption = methodOptionsWrapper.add("radiobutton", undefined, "Identiques");
        similarOption.value = true;
        similarOption.helpTip = "Même marge sur tous les plans de travail";
        similarOption.onClick = function() { alternateEvenContainer.enabled = false;
                                                               alternateOddContainer.enabled = false;
                                                               majApercu();
                                                            };
    var alternateOption = methodOptionsWrapper.add("radiobutton", undefined, "Altern\351es");
        alternateOption.helpTip = "Alterner entre les plans de travail impairs et pairs";
        alternateOption.onClick = function() { alternateEvenContainer.enabled = true;
                                                                  alternateOddContainer.enabled = true;
                                                                  majApercu();
                                                                };
//// Options d'alternance
    var alternateOddContainer = methodOptionsContainer.add("panel", undefined, "Impair");
        alternateOddContainer.orientation = "row";
        alternateOddContainer.margins = configData.margins;
        alternateOddContainer.alignment = configData.fillAlignment;
        alternateOddContainer.alignChildren = configData.fillAlignment;
        alternateOddContainer.enabled = false;
    var alternateOddLeftWrapper = alternateOddContainer.add("group", undefined);
        alternateOddLeftWrapper.add("statictext", undefined, "Gauche");
    var oddLeftMargin = alternateOddLeftWrapper.add("edittext", undefined, "10");
        oddLeftMargin.minimumSize = [40, 0];
        oddLeftMargin.onChange = function() {majApercu();};
    var alternateOddRightWrapper = alternateOddContainer.add("group", undefined);
        alternateOddRightWrapper.add("statictext", undefined, "Droite");
    var oddRightMargin = alternateOddRightWrapper.add("edittext", undefined, "10");
        oddRightMargin.minimumSize = [40, 0];
        oddRightMargin.onChange = function() {majApercu();};
    var alternateEvenContainer = methodOptionsContainer.add("panel", undefined, "Pair");
        alternateEvenContainer.orientation = "row";
        alternateEvenContainer.margins = configData.margins;
        alternateEvenContainer.alignment = configData.fillAlignment;
        alternateEvenContainer.alignChildren = configData.fillAlignment;
        alternateEvenContainer.enabled = false;
    var alternateEvenLeftWrapper = alternateEvenContainer.add("group", undefined);
        alternateEvenLeftWrapper.add("statictext", undefined, "Gauche");
    var evenLeftMargin = alternateEvenLeftWrapper.add("edittext", undefined, "10");
        evenLeftMargin.minimumSize = [40, 0];
        evenLeftMargin.onChange = function() {majApercu();};
    var alternateEvenRightWrapper = alternateEvenContainer.add("group", undefined);
        alternateEvenRightWrapper.add("statictext", undefined, "Droite");
    var evenRightMargin = alternateEvenRightWrapper.add("edittext", undefined, "10");
        evenRightMargin.minimumSize = [40, 0];
        evenRightMargin.onChange = function() {majApercu();};
//// Aspect de la matérialisation des marges
    var typeContainer = dlg.add("panel", undefined, "Cr\351er :");
        typeContainer.orientation = "row";
        typeContainer.margins = configData.margins;
        typeContainer.alignChildren = configData.leftAlignment;
    var asRect = typeContainer.add("radiobutton", undefined, "Rectangle");
        asRect.onClick = function() { if (etat) { etat = false;};
                                                        majApercu();
                                                        majApercu();};
    var asGuide = typeContainer.add("radiobutton", undefined, "Rep\350re");
        asGuide.value = true;
        asGuide.onClick = function() {if (etat) { etat = false;};
                                                        majApercu();
                                                        majApercu();};
    var asMarge = typeContainer.add("radiobutton", undefined, "Marge");
        asMarge.onClick = function() { etat = true;
                                                        majApercu();};
//// bouton "Créer"
    var grpBoutons = dlg.add("group", undefined);
    var renderBtn = grpBoutons.add("button", undefined, "Cr\351er", { name: 'ok' });
        renderBtn.alignment = configData.fillAlignment;
        renderBtn.helpTip = "Ajouter les rep\350res ou les marges au document actif";
//// bouton "Annuler"
    var cancelBtn = grpBoutons.add("button", undefined, "Annuler", { name: 'cancel' });
        cancelBtn.onClick =  function() {
                                      if (defaire) {app.undo();}
                                      if (mCalque.groupItems.length === 0) {mCalque.remove();}
                                      dlg.close();
                                      };
majApercu();               
dlg.show();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Fonctions utilitaires    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function parseInputRange(query) {
    // lit une chaîne du type "0, 2, 4 - 6" comme requête
    // et renvoie un tableau du type [ 0, 2, 4, 5, 6 ]
    var lst = query.split(",");
    var newLst = [];
    for(var i = 0; i < lst.length; i++) {
        // supprimer les espaces
        var val = lst[i].replace(" ", "");
        // Analyser si plage imbriquée
        if(val.indexOf("-") !== -1) { 
            var _lst = val.split("-");
            var start = parseInt(_lst[0]);
            var end = parseInt(_lst[1]);
            for(var i = start; i <= end; i++) {
                newLst.push(i - 1);
            }
        } else {
            newLst.push(parseInt(val) - 1);
        }
    }
    return newLst;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Création marges pour chaque plan de travail   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function artboardAddMargin(allArtboards, idx) {
    // ajouter marge au plan de travail portant l'index [idx]
    calculMarges(idx)
    // Limites des plans de travail
    var _left = allArtboards[idx].artboardRect[0];
    var _top = allArtboards[idx].artboardRect[1];
    var _right = allArtboards[idx].artboardRect[2];
    var _bottom = allArtboards[idx].artboardRect[3];
    if (asMarge.value === false){
            // calcul et position du rectangle de marges
            var _width = Math.abs(_right - _left) - (_marginLeft + _marginRight);
            var _height = Math.abs(_top - _bottom) - (_marginTop + _marginBottom);
            var _rect = mCalque.pathItems.rectangle(
                (_top - _marginTop), // position du haut du rectangle
                (_left + _marginLeft), // position de la gauche du rectangle
                _width, // largeur du rectangle
                _height, // hauteur du rectangle
            );
            _rect.name = (idx + 1).toString();
            _rect.filled = false;
            // aspect du rectangle
            if (asGuide.value) {
                // transformer le rectangle en repère
                _rect.guides = true;
            } else {
                // affecter contour du rectangle
                _rect.stroked = true;
                _rect.strokeColor = blackColor;
            }
      } else {
              allArtboards[idx].artboardRect = [
        _left - _marginLeft,
        _top + _marginTop,
        _right + _marginRight,
        _bottom - _marginBottom
        ];
       };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Rendu  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderMargin() {
    // Trouver le document actif
    try {
        var curDoc = app.activeDocument;
    } catch (_) {
        alert ("Aucun document actif trouvé. Veuillez en ouvrir un !", "Error");
        return;
    }
    // vérification des paramètres d'entrée
    var customArtboardLst;
    if (customArtboardOption.value) {
        var customArtboardLst = parseInputRange(customArtboardInput.text);
    }
    // Appel de la fonction de création d'un calque dédié au rectangle de marge
    creation_mCalque();
    var allArtboards = curDoc.artboards;
    for(var idx = 0; idx < allArtboards.length; idx++) {
        //S'il s'agit de créer des repères
            if (asMarge.value === false){
                    // tous les plans de travail
                    if (allArtboardOption.value) {
                        artboardAddMargin(allArtboards, idx);
                    };
                    // plans de travail personnalisés si Array.indexOf() ne fonctionne pas
                    else if (customArtboardLst.toString().indexOf( idx.toString() ) !== -1) {
                        artboardAddMargin(allArtboards, idx);
                    };
        // S'il s'agit de modifier la taille des plans de travail
            } else {
                    // tous les plans de travail
                    if (allArtboardOption.value) {
                        artboardAddMargin(allArtboards, idx);
                    };
                    // les plans de travail personnalisés ... définis comme Array.indexOf() ne fonctionnent pas
                    else if (contains(customArtboardLst, idx)) {
                        artboardAddMargin(allArtboards, idx);
                    };
               activeDocument.rearrangeArtboards (DocumentArtboardLayout.GridByCol,1,_marginLeft,true);
          };
    };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Création du calque "Marges"    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function creation_mCalque() {
	var mCalqueNexistePas = true;
    for(i = 0; i < activeDocument.layers.length; i++){
            if(activeDocument.layers[i].name == "Marges"){
                mCalque = activeDocument.activeLayer = activeDocument.layers[i];
                mCalque.locked = false;
                mCalque.visible = true;
                mCalqueNexistePas = false;
            };
    };
    if(mCalqueNexistePas){
            mCalque = activeDocument.layers.add();
            mCalque.name = "Marges";
    };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Calcul des marges   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculMarges(idx) {
    _marginLeft = parseFloat(marginAll.text);
    _marginTop = _marginLeft;
    _marginRight = _marginLeft;
    _marginBottom = _marginLeft;
    if (directionalMargin.value) {
        // différentes marges pour différentes directions
        _marginLeft = parseFloat(leftMargin.text);
        _marginTop = parseFloat(topMargin.text);
        _marginRight = parseFloat(rightMargin.text);
        _marginBottom = parseFloat(bottomMargin.text);
   } 
    if (alternateOption.value) {
        if ((idx + 1) % 2 == 0) {
            //numéro d'index pair signifie numéro de plan de travail impair
            _marginLeft = parseFloat(evenLeftMargin.text);
            _marginRight = parseFloat(evenRightMargin.text);
        }
        else {
            //numéro d'index impair signifie numéro de plan de travail pair
            _marginLeft = parseFloat(oddLeftMargin.text);
            _marginRight = parseFloat(oddRightMargin.text);
        }
    }
    if (unitOptions.selection.text === "mm") {
        // conversion mm en pixels
        // 1 mm = 2.834645 px
        _marginLeft *= 2.834645;
        _marginRight *= 2.834645;
        _marginTop *= 2.834645;
        _marginBottom *= 2.834645;
    }
    else if (unitOptions.selection.text === "inches") {
        // conversion inches en pixels
        // 1 in = 72 px
        _marginLeft *= 72;
        _marginRight *= 72;
        _marginTop *= 72;
        _marginBottom *= 72;
    }
return(_marginLeft,_marginRight,_marginTop,_marginBottom)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Mise à jour de l'aperçu    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function majApercu() {
        if (defaire) {
            app.undo();
        }else{
            defaire = true;
        app.redraw();
        };
        renderMargin();
        app.redraw();
};
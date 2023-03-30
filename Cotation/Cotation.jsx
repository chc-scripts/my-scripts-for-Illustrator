//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Cotation
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
This script allows you to add:
    - a horizontal and / or vertical Cotation to the selection of an objet or a group of objects.
    - or an aligned Cotation to the direct selection of segment
         It allows to choose also (in particular via a real-time preview):
             - the scale
             - the position of the Cotation (above, below, etc.)
             - the position of the reference of the quotation value for small objects
             - the symbol used
             - the color of the quotation
             - the length of the attachment lines
             - the unit
             - the size of the Cotations and all its components (value, symbol, attachment
               lines, Cotation lines).
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Management of the preview  inspired by Alexander Ladygin's tutorial (https://ladyginpro.ru/blog/create-preview-in-dialog/).   
*/
#targetengine 'main'
var nomScript = 'Cotation',
    fichierParam = {
        name: nomScript + '_param.json',
        folder: Folder.myDocuments + '/CC_Scripts/'
    };
// Variables declaration for the active document
    var monFichier = app.activeDocument;
    var maSelection = monFichier.selection
// Loop to determine if something is selected or not
    var nbItemsSelectionnes = app.activeDocument.selection.length;
    if (nbItemsSelectionnes != 0) {
        // Create a variable for a linear dimension
           monType = "LIN"
        // Loop to determine if the selection is a segment
        if (monFichier.selection[0].typename === "PathItem"){
            if (monFichier.selection[0].selectedPathPoints.length===2) {
                maSelection = monFichier.selection[0].selectedPathPoints
                                // Creation of variables for the dimension's datas (in points)
                                var p1_x = maSelection[0].anchor[0]
                                var p1_y = maSelection[0].anchor[1]
                                var p2_x = maSelection[1].anchor[0]
                                var p2_y = maSelection[1].anchor[1]
                                var cote1 = p2_x - p1_x;
                                var cote2 = p2_y - p1_y;
                                // Change the value of the variable if it is an aligned dimension
                                monType = "ALIG"
                                // Define the direction of the line (for diameter dimensioning)
                                var sensH = 1;
                                    if (p1_x > p2_x){
                                        sensH = -1
                                    };
                                var sensV = 1
                                    if (p1_y > p2_y){
                                        sensV = -1
                                    };
             };
         };
         /////// Call the function for creating the "dimension" layer
              creation_cCalque();
              defaire = false;
              ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              //    Dialog box  LIN ou ALIG    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                   $.localize = true;
                   $.locale =null;
                   if($.locale.substr(0,2) != "fr"){$.locale = "en"};
                    var boiteDialogueCotation = new Window ('dialog', "Cotation");
                    boiteDialogueCotation.alignChildren = "left";
                    boiteDialogueCotation.spacing = 5;
             /////// Scale
                    var grpEchelle = boiteDialogueCotation.add('group');
                           var lblEch = grpEchelle.add("statictext",undefined, {en:"Scale in %", fr:"\311chelle en %"});
                           txtEch = grpEchelle.add("edittext", [0,0,35,24],10);
                           txtEch.characters = 3;
                           grpEchelle.orientation = "row";
             /////// Bounds (LIN)
                    if(monType === "LIN"){
                           var panPLimites = grpEchelle.add('panel', [0,0,328,45], {en:"Bounds",fr:"Limites"},{borderStyle:'white'});
                                    panPLimites.orientation = "row";
                                    var rdVis = panPLimites.add('radiobutton',[10,15,120,30], {en:"With outlines", fr: "Avec contour"});
                                    var rdGeo = panPLimites.add('radiobutton',[120,15,260,30], {en:"Without outlines", fr:"Hors contour"});
                     };
             /////// Divider_1
                    var diviseur_1 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_1.alignment = "fill";
             /////// Cotations (LIN)
                    if(monType === "LIN"){
                            var grpCotes = boiteDialogueCotation.add('group');
                                    var grpPosition = grpCotes.add('group');
                                    var grpRenvoi = grpCotes.add('group');
                                    grpCotes.orientation = "column";
                                    grpCotes.alignChildren = "left";
                     /////// Width dimension (LIN)
                            var panPositionCoteL = grpPosition.add('panel',[0,0,225,105], {en:"Position Width Cotation",fr:"Position cote largeur"},{borderStyle:'white'});
                                    var haut = panPositionCoteL.add('radiobutton',[10,15,88,29], {en:"Above",fr:"Au dessus"});
                                    var bas = panPositionCoteL.add('radiobutton',[10,43,95,58], {en:"Below",fr:"Au dessous"});
                                    var nL = panPositionCoteL.add('radiobutton', [10,71,157,86], {en:"No width Cotation", fr:"Pas de cote de largeur"});
                                    panPositionCoteL.alignChildren = "left";
                     /////// Height dimension (LIN)
                           var panPositionCoteH = grpPosition.add('panel', [0,0,224,105], {en:"Position Height Cotation", fr:"Position cote largeur"},{borderStyle:'white'});
                                    var gauche = panPositionCoteH.add('radiobutton', [10,15,100,29], {en:"To the left", fr:"\300 gauche"});
                                    var droite = panPositionCoteH.add('radiobutton',[10,43,100,58], {en:"To the right", fr:"\300 droite"});
                                    var nH = panPositionCoteH.add('radiobutton', [10,71,200,86], {en:"No height Cotation", fr:"Pas de cote de hauteur"});
                                    panPositionCoteH.alignChildren = "left";
                     /////// Width Text Offset (LIN)
                           var panRenvoiCoteL = grpRenvoi.add('panel', [0,0,225,80], {en:"Width text offset", fr:"Renvoi texte largeur"});
                                    var rG = panRenvoiCoteL.add('radiobutton', [10,15,200,29], {en:"Offset to the left",fr:"Renvoi vers la gauche"});
                                    var rD = panRenvoiCoteL.add('radiobutton', [10,43,200,58], {en:"Offset to the right",fr:"Renvoi vers la droite"});
                                    panRenvoiCoteL.orientation = "column";
                                    panRenvoiCoteL.alignChildren = "left";
                     /////// Height Text Offset (LIN)
                           var panRenvoiCoteH = grpRenvoi.add('panel', [0,0,224,80], {en:"Height Text Offset", fr:"Renvoi texte hauteur"});
                                    var rH = panRenvoiCoteH.add('radiobutton', [10,15,200,29], {en:"Offset to the top", fr:"Renvoi vers le haut"});
                                    var rB = panRenvoiCoteH.add('radiobutton', [10,43,200,58], {en:"Offset to the bottom", fr:"Renvoi vers le bas"}); 
                                    panRenvoiCoteH.orientation = "column";
                                    panRenvoiCoteH.alignChildren = "left";
                            var mem_rdGeo,mem_rdVis,mem_haut,mem_bas,mem_nH,mem_droite,mem_gauche,
                                   mem_nL,mem_rH,mem_rB;
                     } else {
                     /////// Diameter (ALIG)
                           var ckbDiam = grpEchelle.add('checkBox', undefined, {en:"dimension a diameter", fr:"coter un diam\350tre"});
                           ckbDiam.value=false;
                     /////// Direction (ALIG)
                            var grpSensRenvoi = boiteDialogueCotation.add('group');
                                   grpSensRenvoi.orientation = "row";
                                   var panSens = grpSensRenvoi.add('panel', [0,0,90,62], {en:"Direction", fr:"Sens"});
                                   var chbInverser = panSens.add("checkbox", [10,15,150,28], {en:"Reverse", fr:"Inverser"});
                     /////// Text Offset (ALIG)
                           var panRenvoiCote = grpSensRenvoi.add('panel', [0,0,358,62], {en:"Text Offset", fr:"Renvoi texte"});
                                    var rD = panRenvoiCote.add('radiobutton', [10,15,150,28], {en:"Move text to Side A", fr:"Renvoi texte c\364t\351 A"});
                                    var rG = panRenvoiCote.add('radiobutton', [160,15,310,28], {en:"Move Text to Side B", fr:"Renvoi texte c\364t\351 B"});
                                    panRenvoiCote.orientation = "row";
                           var mem_chbInverser;
                     };
             /////// Divider_2
                    var diviseur_2 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_2.alignment = "fill";
             /////// Symbol
                    var grpFormats  = boiteDialogueCotation.add('group')
                            var panSymboles = grpFormats.add ('panel', [0,0,105,60], {en:"Symbol", fr:"Symbole"})
                            var localiseSymbol0 = {en:"Arrow", fr:"Fl\350che"};
                            var localiseSymbol1 = {en:"Dot", fr:"Point"};
                                    var listeSymboles = panSymboles.add('DropDownList', [10,15,92,34], [localiseSymbol0, localiseSymbol1, "Slash"]);
                                    listeSymboles.minimumSize.width = 80;
                                    listeSymboles.selection = listeSymboles.selection === null ? 0 : listeSymboles.selection;
              /////// Colours
                    var grpCouleurs = grpFormats.add ('panel', [0,0,105,60], {en:"Color", fr:"Couleur"})
                            var localiseColor0 = {en:"Black", fr:"Noir"}
                            var localiseColor3 = {en:"Green", fr:"Vert"}
                            var localiseColor4 = {en:"Yellow", fr:"Jaune"}
                            var localiseColor5 = {en:"White", fr:"Blanc"}
                            var listeCouleurs = grpCouleurs.add('DropDownList', [10,15,92,34], [localiseColor0, "Magenta", "Cyan", localiseColor3, localiseColor4, localiseColor5]);
                            listeCouleurs.minimumSize.width = 80;
                            listeCouleurs.selection = listeCouleurs.selection === null ? 0 : listeCouleurs.selection;
             /////// User Factor
                    var panFactUtil =grpFormats.add ('panel', [0,0,230,60], {en:"Coef Size of the Cotation", fr:"Coef taille de la cotation"})
                            var txtFactUtil = panFactUtil .add('edittext', [10,15,45,34],75);
                            txtFactUtil.characters = 4;
                            var lblpourCent= panFactUtil.add('statictext',[54,15,92,34],"%");
                            txtFactUtil.onChange = function() {majApercu();};
                            panFactUtil.orientation = "row";
                            panFactUtil.alignChildren = "top"
             /////// Divider_3
                    var diviseur_3 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_3.alignment = "fill";
             /////// Attachment lines length
                    var grpLigne3=boiteDialogueCotation.add('group')
                            var panLongLigneAtt = grpLigne3.add('panel', [0,0,245,60], {en:"Attachment Lines Length", fr:"Longueur lignes d'attache"})
                                    var fois1 = panLongLigneAtt.add('radiobutton', [10,18,47,34], "x 1");
                                    var fois2 = panLongLigneAtt.add('radiobutton', [52,18,94,34], "x 2");
                                    var fois3 = panLongLigneAtt.add('radiobutton', [99,18,141,34], "x 3");
                                    var fois4 = panLongLigneAtt.add('radiobutton', [146,18,188,34], "x 4");
                                    var fois5 = panLongLigneAtt.add('radiobutton', [193,18,235,34], "x 5");
                                    panLongLigneAtt.spacing = 5;
                                    panLongLigneAtt.orientation = "row";
             /////// Units
                           var panUnites = grpLigne3.add('panel', [0,0,100,60], {en:"Unit", fr:"Unit\351"})
                                    var ckbAffichUnit = panUnites.add('checkBox', [10,18,25,34]);
                                    var listeUnites = panUnites.add('DropDownList',[35,15,85,34], ["mm", "cm", "in", "px"]);
                                    listeUnites.minimumSize.width = 80;
                                    listeUnites.selection = listeUnites.selection === null ? 0 : listeUnites.selection;
             /////// Decimals
                           var panDec = grpLigne3.add('panel', [0,0,95,60], {en:"Decimals", fr:"D\351cimales"})
                                    var nbDec = panDec .add('edittext', [10,15,50,34],0);
                                    nbDec.characters = 4;
             /////// Divider_4
                    var diviseur_4 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_4.alignment = "fill";
             /////// Buttons
                    var grpBoutons = boiteDialogueCotation.add("group")
                            var btnOk = grpBoutons.add("button", [330,15,376,50], "Ok");
                            var btnAnnul = grpBoutons.add("button", [386,15,472,50], {en:"Cancel", fr:"Annuler"}, {name:"cancel"});
             /////// "Cancel" button action
                    btnAnnul.onClick =  function() {
                                                  if (defaire) {app.undo();}
                                                  boiteDialogueCotation.close();
                                                  };
                    boiteDialogueCotation.onClose = function() { sauverParametres()};
            /////// Load data saved in a previous session
                    verifDossierParam()
                    chargerParametres(); 
             /////// Preview update after user action
                    txtEch.onChange = function() {majApercu();};
                    if (monType === "LIN") {
                        rdVis.onClick = function() {majApercu()};
                        rdGeo.onClick = function() {majApercu()};
                        haut.onClick = function () {majApercu();};
                        bas.onClick = function () {majApercu();};
                        nL.onClick = function () {majApercu();};
                        droite.onClick = function () {majApercu();};
                        gauche.onClick = function () {majApercu();};
                        nH.onClick = function () {majApercu();};
                        rH.onClick = function () {majApercu();};
                        rB.onClick = function () {majApercu();};
                     } else {
                        chbInverser.onClick =function() {majApercu();};
                        ckbDiam.onClick = function() {majApercu();};
                    };
                    rG.onClick = function () {majApercu();};
                    rD.onClick = function () {majApercu();};
                    listeSymboles.onChange = function() {majApercu();};
                    listeCouleurs.onChange = function() {majApercu();};
                    txtFactUtil.onChange = function() {majApercu();};
                    fois1.onClick = function() {majApercu()};
                    fois2.onClick = function() {majApercu()};
                    fois3.onClick = function() {majApercu()};
                    fois4.onClick = function() {majApercu()};
                    fois5.onClick = function() {majApercu()};
                    listeUnites.onChange = function() {majApercu();};
                    ckbAffichUnit.onClick = function() {majApercu();};
                    nbDec.onChange = function() {majApercu();};
             /////// Dialog box centering
                    boiteDialogueCotation.center();
             /////// Launching the initial Cotation preview
                    majApercu();
             /////// Show the dialog box
            boiteDialogueCotation.show();
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}else {
        alert(localize({en:"Please select the object or set of objects or the segment to dimension.", fr:"Vous devez sélectionner l'objet, le groupe d'objets ou le segment à coter."}));
} ;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Update preview    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function majApercu() {
    if (defaire) {
        app.undo();
    }else{
        defaire = true;
        app.redraw();
    };
    if (monType === "LIN") {
        dessinerCotationLIN();
    } else {
        if (ckbDiam.value === true) {
            coterDiametre();
        } else {
            dessinerCotationALIG();
        };
    };
    app.redraw();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Collect initial data   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function recueilDonnees() {
// Scale
    echelle = txtEch.text
if(monType === "LIN"){
        // Bounds
            mesLimites =  rdVis.value  ? "vis" : "geo";
                    var vb0,vb1,vb2,vb3;
                    // Including path thickness
                    if(mesLimites==="vis"){
                        vb0=maSelection[0].visibleBounds[0];
                        vb1=maSelection[0].visibleBounds[1];
                        vb2=maSelection[0].visibleBounds[2];
                        vb3=maSelection[0].visibleBounds[3];
                        // Multiple selection case
                            for (var a=0;a<nbItemsSelectionnes;a++){
                                 vb0  = vb0<maSelection[a].visibleBounds[0] ? vb0 : maSelection[a].visibleBounds[0];
                                 vb1 = vb1>maSelection[a].visibleBounds[1] ? vb1 : maSelection[a].visibleBounds[1];
                                 vb2 = vb2>maSelection[a].visibleBounds[2] ? vb2 : maSelection[a].visibleBounds[2];
                                 vb3 = vb3<maSelection[a].visibleBounds[3] ? vb3 : maSelection[a].visibleBounds[3];
                            };
                    // Without path thickness
                    } else {
                        vb0=maSelection[0].geometricBounds[0];
                        vb1=maSelection[0].geometricBounds[1];
                        vb2=maSelection[0].geometricBounds[2];
                        vb3=maSelection[0].geometricBounds[3];
                        // Multiple selection case
                            for (var a=0;a<nbItemsSelectionnes;a++){
                                 vb0  = vb0<maSelection[a].geometricBounds[0] ? vb0 : maSelection[a].geometricBounds[0];
                                 vb1 = vb1>maSelection[a].geometricBounds[1] ? vb1 : maSelection[a].geometricBounds[1];
                                 vb2 = vb2>maSelection[a].geometricBounds[2] ? vb2 : maSelection[a].geometricBounds[2];
                                 vb3 = vb3<maSelection[a].geometricBounds[3] ? vb3 : maSelection[a].geometricBounds[3];
                            };
                     };
                     /////// Creation of variables for X et Y coordinates of the object (in points)
                            L = new Array(vb0,vb1,vb2,vb3);
                            largeur = (L[2]-L[0]);
                            hauteur = (L[1]-L[3]);
                     /////// Creation of variables for the location of the selection center
                            LCentre = L[0] + ((L[2]-L[0])/2);
                            HCentre = L[1] - ((L[1]-L[3])/2);
} else {
        // Direction (ALIG)
            invSens = chbInverser.value ? 1 : -1;
            x = invSens === 1 ? p2_x : p1_x;
            y = invSens === 1 ? p2_y : p1_y;
            L = new Array(p1_x,0,p2_x);
            angleDepart = invSens === 1 ? 0 : 180;
            inter_1 = invSens === 1 ? 0 : 1;
            inter_2 = invSens === 1 ? 1 : 0;
        // Offset (ALIG)
            monRenvoi = rD.value ? "A" : "B";
            maLongueur = Math.sqrt(Math.pow(cote1,2) + Math.pow(cote2,2));
};
 // Symbol
    monSymbole = listeSymboles.selection.index;
// Color
    maNuance = decoderCouleur(listeCouleurs.selection.index);
// User Coeff.
    factUtil = txtFactUtil.text;
    coefUtil = factUtil/100;
    largSymb = 11*coefUtil;
    if (monSymbole === 0) {
        hautSymb = 6*coefUtil;
    } else if (monSymbole === 2) {
        hautSymb = 11*coefUtil;
    } else {
        hautSymb = 3*coefUtil;
    };
    esp = 0.75*coefUtil
    epTrait = 0.3 * coefUtil;
// Attachment lines length coeff.
    ligAtt = fois2.value ? 2 : ligAtt = fois3.value  ? 3 : ligAtt = fois4.value ? 4 : ligAtt = fois5.value ? 5 : 1;
    u = fois2.value ? 55*coefUtil : u = fois3.value  ? 80*coefUtil : u = fois4.value ? 105*coefUtil : u = fois5.value ? 130*coefUtil : 30*coefUtil;
// Units
    dec = nbDec.text;
    choisirUnite(listeUnites.selection.text, ckbAffichUnit.value);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw the linear dimension    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function  dessinerCotationLIN() {
        recueilDonnees();
//////////// Width dimension group
            var mesure_L = cCalque.groupItems.add();
            mesure_L.name = "GroupeLargeur";
//////////// Height dimension group
            var mesure_H = cCalque.groupItems.add();
            mesure_H.name = "GroupeHauteur";
//////////// Width dimension symbol
            var symbL = new Array();
                for (var c=0; c<2;c++){
                    symbL[c] = mesure_L.pathItems.add();
                    symbL[c].name = "symbL" + c
                    var e = c*2;
                    if (monSymbole === 0){
                        DessinerFleche(symbL[c],e)
                    }else if (monSymbole === 1){
                        DessinerPoint(symbL[c],e);
                    }else{
                        DessinerSlash(symbL[c],e);
                    };
                };
//////////// Height dimension symbol
             var symbH = new Array();
                for (c=0; c<2;c++){
                    symbH[c] = mesure_H.pathItems.add();
                    symbH[c].name = "symbH" + c
                    var e = (c*2)+1;
                    if (monSymbole === 0){;
                        DessinerFleche(symbH[c],e);
                    }else if (monSymbole === 1){
                        DessinerPoint(symbH[c],e);
                    }else{
                        DessinerSlash(symbH[c],e);
                    };
                };
//////////// Width dimension attachment lines
                var ligneAtt_L = new Array();
                for (c=0; c<2;c++){
                    ligneAtt_L[c] = mesure_L.pathItems.add();
                    ligneAtt_L[c].name = "lattL" + c
                    DessinerLigneAtt(ligneAtt_L[c]);
                };
//////////// Height dimension attachment lines
                var ligneAtt_H = new Array();
                for (c=0; c<2;c++){
                    ligneAtt_H[c] = mesure_H.pathItems.add();
                    ligneAtt_H[c].name = "lattH" + c
                    DessinerLigneAtt(ligneAtt_H[c]);
                };
//////////// Texts
                var monTexte = new Array();
                for (c=0; c<2;c++){
                    monTexte[c] = c === 0 ? mesure_L.textFrames.add() : mesure_H.textFrames.add();
                    monTexte[c].textRange.characterAttributes.textFont = app.textFonts.getByName('CenturyGothic')
                    monTexte[c].textRange.size = 12*coefUtil;
                    monTexte[c].filled = true;
                    monTexte[c].stroked = false;
                    monTexte[c].textRange.characterAttributes.fillColor = maNuance;
                    monTexte[c].name = c === 0 ? "textL" : "textH";
                    monTexte[c].contents = c === 0 ? largeurFinale.replace (".", ",") : hauteurFinale.replace (".", ",");
                    monTexte[c].paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
                };
                    largTexte_L = gBN("T","textL").width;
                    hautTexte_L = gBN("T","textL").height;
                    gBN("T","textH").rotate(90,true,false,false,false,Transformation.BOTTOMLEFT);
                    largTexte_H = gBN("T","textH").width;
                    hautTexte_H = gBN("T","textH").height;
//////////// dimension lines (width)
               var ldcL = new Array();
                for (c=0; c<2;c++){
                    ldcL[c] = mesure_L.pathItems.add();
                    ldcL[c].name = "ldcL" + c
                    DessinerLigneDeCote(ldcL[c]);
                };
//////////// dimension lines (height)
                var ldcH = new Array();
                for (c=0; c<2;c++){
                    ldcH[c] = mesure_H.pathItems.add();
                    ldcH[c].name = "ldcH"+c;
                    DessinerLigneDeCote(ldcH[c]);
                };
//////////// Reposition symbols, texts and lines
                ReposLargeur();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw arrow symbol    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DessinerFleche(maFleche,e){
    var d = maFleche.name.substr(4,1);
    if (d==="L"){
            maFleche.setEntirePath([[L[e],L[1]], [L[e]+11,L[1]-3], [L[e]+11, L[1]-1.45],[L[e]+5.8,L[1]], [L[e]+11,L[1]+1.45], [L[e]+11,L[1]+3], [L[e],L[1]]]);
           maFleche.resize(parseInt(factUtil),parseInt(factUtil),true,false,false,false,false,Transformation.LEFT);
    }else{
            maFleche.setEntirePath([[L[0],L[e]], [L[0]+3,L[e]-11], [L[0]+1.45, L[e]-11], [L[0],L[e]-5.8],[L[0]-1.45,L[e]-11], [L[0]-3,L[e]-11], [L[0],L[e]]]);
//////////// User factor scaling
        maFleche.resize(factUtil,factUtil,true,false,false,false,false,Transformation.TOP)
      };
    maFleche.closed = true;
    maFleche.stroked = false;
    maFleche.filled = true;
    maFleche.fillColor = maNuance;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw dot symbol     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DessinerPoint(monPoint,e){
    var d = monPoint.name.substr(4,1);
    if (d==="L"){
        var point_0= monPoint.pathPoints.add();
            point_0.anchor=[L[e]+1.5, L[1]];
            point_0.leftDirection=[L[e]+1.5, L[1]+0.82842712470028];point_0.rightDirection=[L[e]+1.5, L[1]-0.82842712470028];
        var point_1= monPoint.pathPoints.add();
            point_1.anchor=[L[e], L[1]-1.5];
            point_1.leftDirection=[L[e]+0.82842712470028,L[1]-1.5];point_1.rightDirection=[L[e]-0.82842712470028,L[1]-1.5];
        var point_2= monPoint.pathPoints.add();
            point_2.anchor=[L[e]-1.5,L[1]];
            point_2.leftDirection=[L[e]-1.5,L[1]-0.82842712470028];point_2.rightDirection=[L[e]-1.5,L[1]+0.82842712470028];
        var point_3= monPoint.pathPoints.add();
            point_3.anchor=[L[e],L[1]+1.5];
            point_3.leftDirection=[L[e]-0.82842712470028,L[1]+1.5];point_3.rightDirection=[L[e]+0.82842712470028,L[1]+1.5]
    }else{
        var point_5= monPoint.pathPoints.add();
            point_5.anchor=[L[0]+1.5, L[e]];
            point_5.leftDirection=[L[0]+1.5, L[e]+0.82842712470028];point_5.rightDirection=[L[0]+1.5, L[e]-0.82842712470028];
        var point_6= monPoint.pathPoints.add();
            point_6.anchor=[L[0], L[e]-1.5];
            point_6.leftDirection=[L[0]+0.82842712470028,L[e]-1.5];point_6.rightDirection=[L[0]-0.82842712470028,L[e]-1.5];
        var point_7= monPoint.pathPoints.add();
            point_7.anchor=[L[0]-1.5,L[e]];
            point_7.leftDirection=[L[0]-1.5,L[e]-0.82842712470028];point_7.rightDirection=[L[0]-1.5,L[e]+0.82842712470028];
        var point_8= monPoint.pathPoints.add();
            point_8.anchor=[L[0],L[e]+1.5];
            point_8.leftDirection=[L[0]-0.82842712470028,L[e]+1.5];point_8.rightDirection=[L[0]+0.82842712470028,L[e]+1.5]
    };
//////////// Scale with user factor
    monPoint.closed = true;
    monPoint.resize(parseInt(factUtil),parseInt(factUtil),true,false,false,false,false,Transformation.CENTER);
    monPoint.stroked = false;
    monPoint.filled = true;
    monPoint.fillColor = maNuance;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw slash symbol     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DessinerSlash(monSlash,e){
    var d = monSlash.name.substr(4,1);
    if (d==="L"){
            monSlash.setEntirePath([[L[e]+4.79,L[1]+5.5], [L[e]+5.5,L[1]+4.79], [L[e]-4.79,L[1]-5.5], [L[e]-5.5,L[1]-4.79], [L[e]+4.79,L[1]+5.5]]);
    }else{
            monSlash.setEntirePath([[L[0]+4.79,L[e]+5.5], [L[0]+5.5,L[e]+4.79], [L[0]-4.79,L[e]-5.5], [L[0]-5.5,L[e]-4.79], [L[0]+4.79,L[e]+5.5]]);
    };
    monSlash.closed = true;
    monSlash.resize(parseInt(factUtil),parseInt(factUtil),true,false,false,false,false,Transformation.CENTER);
    monSlash.stroked = false;
    monSlash.filled = true;
    monSlash.fillColor = maNuance;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw attachment lines   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DessinerLigneAtt(maLAtt){
    var d = maLAtt.name.substr(4,1)
    if (d==="L"){
        var e = maLAtt.name.substr(5,1)*2
        maLAtt.setEntirePath([[L[e],L[1]],[L[e],L[1]+u]]);
    }else{
        var e = (maLAtt.name.substr(5,1)*2)+1
        maLAtt.setEntirePath([[L[0],L[e]],[L[0]-u,L[e]]]);
    };
    maLAtt.stroked = true;
    maLAtt.filled = false;
    maLAtt.strokeColor = maNuance;
    maLAtt.strokeWidth = epTrait;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw dimension lines  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DessinerLigneDeCote(maLDC){
    var d = maLDC.name.substr(3,1)
    if (d==="L"){
        var e = maLDC.name.substr(4,1)*2;
        if (e === 0){
            maLDC.setEntirePath([[L[0]+esp,L[1]+u-(3*coefUtil)],[LCentre-(largTexte_L/2)-esp,L[1]+u-(3*coefUtil)]]);
        } else {
            maLDC.setEntirePath([[L[2]-esp,L[1]+u-(3*coefUtil)],[LCentre+(largTexte_L/2)+esp,L[1]+u-(3*coefUtil)]]);
            };
    }else{
        var e = (maLDC.name.substr(4,1)*2)+1
        if (e === 1){
            maLDC.setEntirePath([[L[0]-u+(3*coefUtil),L[1]-esp],[L[0]-u+(3*coefUtil),HCentre+(hautTexte_H/2)+esp]]);
        } else {
            maLDC.setEntirePath([[L[0]-u+(3*coefUtil),L[3]+esp],[L[0]-u+(3*coefUtil),HCentre-(hautTexte_H/2)-esp]]);
        };
    };
    maLDC.stroked = true;
    maLDC.filled = false;
    maLDC.strokeColor = maNuance;
    maLDC.strokeWidth = epTrait;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Reposition symbols, texts and lines   ///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ReposLargeur(){
        var longLignaAtt = 5*ligAtt;
// dimension W
     if (!nL.value){
        if (largeur>largTexte_L+(esp*4)+(largSymb*2)) {coteL = haut.value  ? "HC" : "BC";
            panRenvoiCoteL.enabled = false;
        } else {
            panRenvoiCoteL.enabled = true;
            if (haut.value===true) {rG.value ? coteL="HrG" :  coteL="HrD";
                      } else {rG.value ? coteL="BrG" : coteL="BrD"};
           };
    }else {coteL = "nL",panRenvoiCoteL.enabled = false};
// dimension H
  if (!nH.value){
        if (hauteur>hautTexte_H+(esp*4)+(largSymb*2)) {coteH = gauche.value ? "GM" : "DM";
            panRenvoiCoteH.enabled = false;
        } else {
            panRenvoiCoteH.enabled = true;
            if (gauche.value===true) {rH.value ? coteH="GrH" :  coteH="GrB";
                      } else {rH.value ? coteH="DrH" : coteH="DrB"};
           };
    }else {coteH = "nH",panRenvoiCoteH.enabled = false}; 
// Reposition width's dimension
switch (coteL) {
        case "HC" :
                    gBN("P","symbL0").top = L[1]+u-(3*coefUtil)+(hautSymb/2);
                    gBN("P","symbL1").top = L[1]+u-(3*coefUtil)+(hautSymb/2);
                        if (monSymbole === 0) {
                            gBN("P","symbL1").rotate(180,true,false,false,false,Transformation.LEFT);
                        };
                    gBN("T","textL").top =L[1]+u + (hautTexte_L/4);
                    gBN("T","textL").left =L[0]+((largeur-largTexte_L)/2);
                    break;
        case "BC" :
                    gBN("P","symbL0").top = L[3]-u+(3*coefUtil)+(hautSymb/2);
                    gBN("P","symbL1").top = L[3]-u+(3*coefUtil)+(hautSymb/2);
                        if (monSymbole === 0) {
                            gBN("P","symbL1").rotate(180,true,false,false,false,Transformation.LEFT);
                        };
                    gBN("T","textL").top = L[3]-u+(hautTexte_L*0.75);
                    gBN("P","lattL0").top = L[3];
                    gBN("P","lattL1").top = L[3];
                    gBN("T","textL").left = L[0]+((largeur-largTexte_L)/2);
                    gBN("P","ldcL0").top = L[3]-u+(3*coefUtil)+(epTrait/2);
                    gBN("P","ldcL1").top = L[3]-u+(3*coefUtil)+(epTrait/2);
                    break;
        case "HrG" :
                    gBN("P","symbL0").top = L[1]+u-(3*coefUtil)+(hautSymb/2);
                    gBN("P","symbL1").top = L[1]+u-(3*coefUtil)+(hautSymb/2);
                        if (monSymbole === 0) {
                            gBN("P","symbL0").rotate(180,true,false,false,false,Transformation.LEFT);
                        };
                    gBN("T","textL").top = L[1]+u + (hautTexte_L/4);
                    gBN("T","textL").left = L[0]-largTexte_L-largSymb-(esp*8) ;
                    gBN("P","ldcL0").setEntirePath([[L[0],L[1]+u-(3*coefUtil)],[L[0]-largSymb-(esp*6),L[1]+u-(3*coefUtil)]]);
                    gBN("P","ldcL1").setEntirePath([[L[2],L[1]+u-(3*coefUtil)],[L[2]-largeur,L[1]+u-(3*coefUtil)]]);
                    break;
        case "HrD" :
                    gBN("P","symbL0").top = L[1]+u-(3*coefUtil)+(hautSymb/2);
                    gBN("P","symbL1").top = L[1]+u-(3*coefUtil)+(hautSymb/2);
                        if (monSymbole === 0) {
                            gBN("P","symbL0").rotate(180,true,false,false,false,Transformation.LEFT);
                        };
                    gBN("T","textL").top = L[1]+u + (hautTexte_L/4);
                    gBN("T","textL").left = L[2]+largSymb+(esp*8) ;
                    gBN("P","ldcL0").setEntirePath([[L[2],L[1]+u-(3*coefUtil)],[L[2]+largSymb+(esp*6),L[1]+u-(3*coefUtil)]]);
                    gBN("P","ldcL1").setEntirePath([[L[0],L[1]+u-(3*coefUtil)],[L[0]+largeur,L[1]+u-(3*coefUtil)]]);
                    break;
        case "BrG" :
                    gBN("P","symbL0").top = L[3]-u+(3*coefUtil)+(hautSymb/2);
                    gBN("P","symbL1").top = L[3]-u+(3*coefUtil)+(hautSymb/2);
                    if (monSymbole === 0) {
                        gBN("P","symbL0").rotate(180,true,false,false,false,Transformation.LEFT);
                    };
                    gBN("T","textL").top = L[3]-u + (hautTexte_L*0.75);
                    gBN("P","lattL0").top = L[3];
                    gBN("P","lattL1").top = L[3];
                    gBN("T","textL").left = L[0]-largTexte_L-largSymb-(esp*8) ;
                    gBN("P","ldcL0").setEntirePath([[L[0],L[3]-u+(3*coefUtil)],[L[0]-largSymb-(esp*6),L[3]-u+(3*coefUtil)]]);
                    gBN("P","ldcL1").setEntirePath([[L[2],L[3]-u+(3*coefUtil)],[L[2]-largeur,L[3]-u+(3*coefUtil)]]);
                    break;
            case "BrD" :
                    gBN("P","symbL0").top = L[3]-u+(3*coefUtil)+(hautSymb/2);
                    gBN("P","symbL1").top = L[3]-u+(3*coefUtil)+(hautSymb/2);
                    if (monSymbole === 0) {
                        gBN("P","symbL0").rotate(180,true,false,false,false,Transformation.LEFT);
                    };
                    gBN("T","textL").top = L[3]-u + (hautTexte_L*0.75);
                    gBN("P","lattL0").top = L[3];
                    gBN("P","lattL1").top = L[3];
                    gBN("T","textL").left = L[2]+largSymb+(esp*8) ;
                    gBN("P","ldcL0").setEntirePath([[L[2],L[3]-u+(3*coefUtil)],[L[2]+largSymb+(esp*6),L[3]-u+(3*coefUtil)]]);
                    gBN("P","ldcL1").setEntirePath([[L[0],L[3]-u+(3*coefUtil)],[L[0]+largeur,L[3]-u+(3*coefUtil)]]);
                    break;
            case "nL" :
                    gBN("G","GroupeLargeur").remove();
                    break;
    };
// Reposition height's dimension
switch (coteH) {
        case "GM" :
                gBN("P","symbH0").left = L[0]-u+(3*coefUtil)-(hautSymb/2);
                gBN("P","symbH1").left = L[0]-u+(3*coefUtil)-(hautSymb/2);
                    if (monSymbole === 0) {
                        gBN("P","symbH1").rotate(180,true,false,false,false,Transformation.TOP);
                    };
                gBN("T","textH").left =L[0]-u-(largTexte_H/4);
                gBN("T","textH").top =HCentre+(hautTexte_H/2);
                break;
        case "DM" :
                    gBN("P","symbH0").left = L[2]+u-(3*coefUtil)-(hautSymb/2);
                    gBN("P","symbH1").left = L[2]+u-(3*coefUtil)-(hautSymb/2);
                    if (monSymbole === 0) {
                        gBN("P","symbH1").rotate(180,true,false,false,false,Transformation.TOP);
                    };
                    gBN("T","textH").left = L[2]+u-(largTexte_H*0.75);
                    gBN("P","lattH0").left = L[2];
                    gBN("P","lattH1").left = L[2];
                    gBN("T","textH").top = HCentre+(hautTexte_H/2);
                    gBN("P","ldcH0").left = L[2]+u-(3*coefUtil)-(epTrait/2);
                    gBN("P","ldcH1").left = L[2]+u-(3*coefUtil)-(epTrait/2);
                break;
        case "GrH" :
                    gBN("P","symbH0").left = L[0]-u+(3*coefUtil)-(hautSymb/2);
                    gBN("P","symbH1").left = L[0]-u+(3*coefUtil)-(hautSymb/2);
                    if (monSymbole === 0) {
                        gBN("P","symbH0").rotate(180,true,false,false,false,Transformation.TOP);
                    };
                    gBN("T","textH").left =L[0]-u-(largTexte_H/4);
                    gBN("P","lattH0").left = L[0]-u;
                    gBN("P","lattH1").left = L[0]-u;
                    gBN("T","textH").top = L[1]+hautTexte_H+largSymb+(esp*8);
                    gBN("P","ldcH0").setEntirePath([[L[0]-u+(3*coefUtil),L[1]],[L[0]-u+(3*coefUtil),L[1]+largSymb+(esp*6)]]);
                    gBN("P","ldcH1").setEntirePath([[L[0]-u+(3*coefUtil),L[3]],[L[0]-u+(3*coefUtil),L[1]]]);
                    break;
        case "GrB" :
                    gBN("P","symbH0").left = L[0]-u+(3*coefUtil)-(hautSymb/2);
                    gBN("P","symbH1").left = L[0]-u+(3*coefUtil)-(hautSymb/2);
                    if (monSymbole === 0) {
                        gBN("P","symbH0").rotate(180,true,false,false,false,Transformation.TOP);
                    };
                    gBN("T","textH").left = L[0]-u-(largTexte_H/4);
                    gBN("P","lattH0").left = L[0]-u;
                    gBN("P","lattH1").left = L[0]-u;
                    gBN("T","textH").top = L[3]-largSymb-(esp*8) ;
                    gBN("P","ldcH0").setEntirePath([[L[0]-u+(3*coefUtil),L[3]],[L[0]-u+(3*coefUtil),L[3]-largSymb-(esp*6)]]);
                    gBN("P","ldcH1").setEntirePath([[L[0]-u+(3*coefUtil),L[1]],[L[0]-u+(3*coefUtil),L[3]]]);
                    break;
        case "DrH" :
                    gBN("P","symbH0").left = L[2]+u-(3*coefUtil)-(hautSymb/2);
                    gBN("P","symbH1").left = L[2]+u-(3*coefUtil)-(hautSymb/2);
                    if (monSymbole === 0) {
                        gBN("P","symbH0").rotate(180,true,false,false,false,Transformation.TOP);
                    };
                    gBN("T","textH").left = L[2]+u-(largTexte_H*0.75);
                    gBN("P","lattH0").left = L[2];
                    gBN("P","lattH1").left = L[2];
                    gBN("T","textH").top = L[1]+hautTexte_H+largSymb+(esp*8) ;
                    gBN("P","ldcH0").setEntirePath([[L[2]+u-(3*coefUtil),L[1]],[L[2]+u-(3*coefUtil),L[1]+largSymb+(esp*6)]]);
                    gBN("P","ldcH1").setEntirePath([[L[2]+u-(3*coefUtil),L[3]],[L[2]+u-(3*coefUtil),L[1]]]);
                    break;
        case "DrB" :
                    gBN("P","symbH0").left = L[2]+u-(3*coefUtil)-(hautSymb/2);
                    gBN("P","symbH1").left = L[2]+u-(3*coefUtil)-(hautSymb/2);
                    if (monSymbole === 0) {
                        gBN("P","symbH0").rotate(180,true,false,false,false,Transformation.TOP);
                    };
                    gBN("T","textH").left = L[2]+u-(largTexte_H*0.75);
                    gBN("P","lattH0").left = L[2];
                    gBN("P","lattH1").left = L[2];
                    gBN("T","textH").top = L[3]-largSymb-(esp*8) ;
                    gBN("P","ldcH0").setEntirePath([[L[2]+u-(3*coefUtil),L[3]],[L[2]+u-(3*coefUtil),L[3]-largSymb-(esp*6)]]);
                    gBN("P","ldcH1").setEntirePath([[L[2]+u-(3*coefUtil),L[1]],[L[2]+u-(3*coefUtil),L[3]]]);
                    break;
        case "nH" :
                    gBN("G","GroupeHauteur").remove();
                break;
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw the  aligned dimension  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function  dessinerCotationALIG() {
recueilDonnees();
///////// Create a group for the different items
        var maCote = cCalque.groupItems.add();
        maCote.name = "Cote";
///////// Draw symbols and add  to group "maCote"
        var symbL = new Array();
            for (var c=0; c<2;c++){
                symbL[c] = maCote.pathItems.add();
                symbL[c].name = "symbL" + c
                var e = c*2;
                if (monSymbole === 0){
                    DessinerFleche(symbL[c],e)
                }else if (monSymbole === 1){
                    DessinerPoint(symbL[c],e);
                }else{
                    DessinerSlash(symbL[c],e);
                };
                symbL[c].closed = true;
                if(monSymbole=== 0){
                        symbL[c].left = x + (maLongueur*c);
                        if (c === 1){symbL[c].rotate(180,true,false,false,false,Transformation.LEFT)};
                } else {
                        symbL[c].left = x - (symbL[c].width/2)+(maLongueur*c);
                };
                symbL[c].top = y + u -4 + (symbL[c].height/2);
            };
///////// Create a text frame and add  to group "maCote"
        var monTexte = maCote.textFrames.add();
                monTexte.textRange.characterAttributes.textFont = app.textFonts.getByName('CenturyGothic');
                monTexte.textRange.size = 12*coefUtil;
                monTexte.filled = true;
                monTexte.stroked = false;
                monTexte.textRange.characterAttributes.fillColor = maNuance;
                monTexte.contents = maLongueurFinale;
                monTexte.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
        var largTexte = monTexte.width;
        var hautTexte = monTexte.height;
               monTexte.top =y+u -4+ (hautTexte/2);
        if (maLongueur > largTexte * 1.2) {
            monTexte.left =x+((maLongueur-largTexte)/2);
        }else{
                if(monRenvoi==="A"){
                        monTexte.left =x + (maLongueur + largSymb + (esp*8)) ;
                }else{
                        monTexte.left =x-largSymb-(esp*8)-largTexte ;
                };
        };
///////// Rotate arrow if the dimension is offset
        if(monSymbole=== 0){
                if (maLongueur < largTexte * 1.2) {
                        symbL[0].rotate(180,true,false,false,false,Transformation.LEFT);
                        symbL[1].rotate(180,true,false,false,false,Transformation.RIGHT);
                };
        };
///////// Create the dimension lines
     /// dimension line 1
        var lgCot1 = maCote.pathItems.add();
            lgCot1.stroked = true;
            lgCot1.filled = false;
        if (maLongueur > largTexte * 1.2) {
                lgCot1.setEntirePath([[x+esp,y+u-4],[x-esp+(maLongueur-(largTexte*1.2))/2,y+u-4]]);
        }else{
            lgCot1.setEntirePath([[x,y+u-4],[x+maLongueur,y+u-4]]); 
        };
        lgCot1.strokeWidth = epTrait;
        lgCot1.strokeColor = maNuance;
     /// dimension line 2
        var lgCot2 = maCote.pathItems.add()
            lgCot2.stroked = true;
            lgCot2.filled = false;
        if (maLongueur > largTexte * 1.2) {
            lgCot2.setEntirePath([[x+(maLongueur+(largTexte *1.2))/2,y+u-4],[x-esp+maLongueur,y+u-4]]);
            panRenvoiCote.enabled = false;
        }else{
            panRenvoiCote.enabled = true;
            if(monRenvoi==="A"){
                lgCot2.setEntirePath([[x+maLongueur,y+u-4],[x+maLongueur+ largSymb +(esp*6),y+u-4]]);
            }else{
                lgCot2.setEntirePath([[x,y+u-4],[x-largSymb-(esp*6),y+u-4]]);
            };
        };
        lgCot2.strokeWidth = epTrait;
        lgCot2.strokeColor = maNuance;
///////// Create attachment lines
        var lgAtt1 = maCote.pathItems.add();
            lgAtt1.setEntirePath([[x,y],[x,y+u]]);
            lgAtt1.stroked = true;
            lgAtt1.filled = false;
            lgAtt1.strokeColor = maNuance;
            lgAtt1.strokeWidth = epTrait;
            lgAtt1.name = "lgAtt1"
        var lgAtt2 = maCote.pathItems.add();
            lgAtt2.setEntirePath([[x+maLongueur,y],[x+maLongueur,y+u]]);
            lgAtt2.stroked = true;
            lgAtt2.filled = false;
            lgAtt2.strokeColor = maNuance;
            lgAtt2.strokeWidth = epTrait;
            lgAtt2.name = "lgAtt2"
////////// Position of the dimension
       var monAngle
            monAngle = Math.atan2(cote1,cote2)*180/Math.PI;
        if (cote1<0) {
            if (cote2<0) {
                if (invSens === 1) {
                        maCote.rotate(270-monAngle,true,true,true,true,Transformation.BOTTOM);
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1-larglignAttRef),(y-Y_lgAtt1+hautlignAttRef),true,true,true,true);
                }else{
                        maCote.rotate(90-monAngle,true,true,true,true,Transformation.BOTTOM);
                        monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1),(y-Y_lgAtt1),true,true,true,true);
                };
            }else{
                if (invSens === 1) {
                        maCote.rotate(270-monAngle,true,true,true,true,Transformation.BOTTOM);
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1),(y-Y_lgAtt1+hautlignAttRef),true,true,true,true);
               }else{
                        maCote.rotate(90-monAngle,true,true,true,true,Transformation.BOTTOM);
                        monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1-larglignAttRef),(y-Y_lgAtt1),true,true,true,true);
               };
            };
       }else{
            if (cote2<0) {
                if (invSens === 1) {
                        maCote.rotate(270-monAngle,true,true,true,true,Transformation.BOTTOM);
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1-larglignAttRef),(y-Y_lgAtt1),true,true,true,true);
                        if (monAngle < 180) {
                              monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        };
                        if (monAngle > 150 && monSymbole === 2) {
                           symbL[0].rotate(90,true,true,true,true,Transformation.CENTER);
                           symbL[1].rotate(90,true,true,true,true,Transformation.CENTER);
                        };
                }else{
                        maCote.rotate(90-monAngle,true,true,true,true,Transformation.BOTTOM);
                        monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1),(y-Y_lgAtt1+hautlignAttRef),true,true,true,true);
                        if (monAngle < 180) {
                              monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        };
                        if (monAngle > 150 && monSymbole === 2) {
                           symbL[0].rotate(90,true,true,true,true,Transformation.CENTER);
                           symbL[1].rotate(90,true,true,true,true,Transformation.CENTER);
                        };
                };
            }else{
                if (invSens === 1) {
                        maCote.rotate(270-monAngle,true,true,true,true,Transformation.BOTTOM);
                        monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        X_lgAtt1 = gBN("P","lgAtt1").position[0]
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1]
                        larglignAttRef = gBN("P","lgAtt1").width
                        hautlignAttRef = gBN("P","lgAtt1").height
                        maCote.translate((x-X_lgAtt1),(y-Y_lgAtt1),true,true,true,true);
                        if (monAngle < 30 && monSymbole === 2) {
                           symbL[0].rotate(90,true,true,true,true,Transformation.CENTER);
                           symbL[1].rotate(90,true,true,true,true,Transformation.CENTER);
                        }; 
                }else{
                        maCote.rotate(90-monAngle,true,true,true,true,Transformation.BOTTOM);
                        X_lgAtt1 = gBN("P","lgAtt1").position[0]
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1]
                        larglignAttRef = gBN("P","lgAtt1").width
                        hautlignAttRef = gBN("P","lgAtt1").height
                        maCote.translate((x-X_lgAtt1-larglignAttRef),(y-Y_lgAtt1+hautlignAttRef),true,true,true,true);
                        if (monAngle < 30 && monSymbole === 2) {
                           symbL[0].rotate(90,true,true,true,true,Transformation.CENTER);
                           symbL[1].rotate(90,true,true,true,true,Transformation.CENTER);
                        }; 
                };
            };
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    dimension diameter   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function coterDiametre() {
recueilDonnees();
panRenvoiCote.enabled = false;
///////// Creation of a group containing the different items
        var  monDiametre = cCalque.groupItems.add();
////////// Find angle of selected path
        var atanMonAngle = Math.atan2(cote1,cote2);
        var monAngle = atanMonAngle*180/Math.PI;
///////// Draw symbols
        var symbL = new Array();
            for (var c=0; c<2;c++){
                symbL[c] = monDiametre.pathItems.add();
                symbL[c].name = "symbL" + c
                var e = c*2;
                if (monSymbole === 0){
                    DessinerFleche(symbL[c],e)
                }else if (monSymbole === 1){
                    DessinerPoint(symbL[c],e);
                }else{
                    DessinerSlash(symbL[c],e);
                };
                symbL[c].closed = true;
///////// Position of the symbols
                var abs,ord;
                if (c === 0){
                    abs = p1_x;
                    ord = p1_y;
                } else {
                    abs = p2_x;
                    ord = p2_y;
                };
                 symbL[c].top = ord + (symbL[c].height/2);
                if (monSymbole === 0){
                    symbL[c].left = abs;
                    if(c===0){
                        symbL[c].rotate(-90-monAngle,true,true,true,true,Transformation.LEFT);
                    } else {
                        symbL[c].rotate(90-monAngle,true,true,true,true,Transformation.LEFT);
                    };
                } else {
                    symbL[c].left = abs - (symbL[c].width/2);
                };
        };
///////// Create a text frame and add to group
        var monTexte = monDiametre.textFrames.add();
                monTexte.textRange.characterAttributes.textFont = app.textFonts.getByName('CenturyGothic');
                monTexte.textRange.size = 12*coefUtil;
                monTexte.filled = true;
                monTexte.stroked = false;
                monTexte.textRange.characterAttributes.fillColor = maNuance;
                monTexte.contents = "\330 " + maLongueurFinale;
                monTexte.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
        var largTexte = monTexte.width;
////////// Create the dimension lines and addition to the group
        var ligne1 = monDiametre.pathItems.add();
                ligne1.strokeWidth = epTrait;
                ligne1.strokeColor = maNuance;
       var ligne2 = monDiametre.pathItems.add()
                ligne2.strokeWidth = epTrait;
                ligne2.strokeColor = maNuance;
////////// Transform the selected path into a Cotation line (Change of its colour and thickness)
        activeDocument.selection[0].strokeWidth = epTrait;
        activeDocument.selection[0].strokeColor = maNuance;
////////// Create lines, place and rotate objects
             if (sensH>0) 
                if(sensV>0){
                       ligne1.setEntirePath([[x,y],[x,y+(u*0.5*coefUtil)]]);
                       ligne1.rotate((angleDepart-monAngle*sensH),true,true,true,true,Transformation.BOTTOM);
                       ligne2.setEntirePath([[x,y],[x+((monTexte.width+ (4*coefUtil))*invSens),y]]);
                       ligne2.translate(ligne1.width*invSens,ligne1.height*invSens,true,true,true,true);
                       monTexte.left=ligne2.left + (4*coefUtil*invSens*inter_2);
                       monTexte.top=ligne2.top + monTexte.height + (2*coefUtil);
                       if(monSymbole=== 2){
                           symbL[0].rotate(90,true,true,true,true,Transformation.CENTER);
                           symbL[1].rotate(90,true,true,true,true,Transformation.CENTER);
                       };
                    } else {
                                ligne1.setEntirePath([[x,y],[x,y+(u*0.5*coefUtil)]]);
                                ligne1.rotate((angleDepart-monAngle*sensH),true,true,true,true,Transformation.BOTTOM);
                                ligne2.setEntirePath([[x,y],[x+((monTexte.width+ (4*coefUtil))*invSens),y]]);
                                ligne2.translate(ligne1.width*invSens*sensH,ligne1.height*sensV*invSens,true,true,true,true);
                                monTexte.left=ligne2.left + (4*coefUtil*invSens*inter_2);
                                monTexte.top=ligne2.top + monTexte.height + (2*coefUtil);
      } else {
                if(sensV>0){
                        ligne1.setEntirePath([[x,y],[x,y+(u*0.5*coefUtil)]]);
                        ligne1.rotate((angleDepart+monAngle*sensH),true,true,true,true,Transformation.BOTTOM);
                        ligne2.setEntirePath([[x,y],[x-((monTexte.width+ (4*coefUtil))*invSens),y]]);
                        ligne2.translate(ligne1.width*sensH*invSens,ligne1.height*invSens,true,true,true,true);
                        monTexte.left=ligne2.left - (4*coefUtil*invSens*inter_1);
                        monTexte.top=ligne2.top + monTexte.height + (2*coefUtil);
                 } else {
                                ligne1.setEntirePath([[x,y],[x,y+(u*0.5*coefUtil)]]);
                                ligne1.rotate((angleDepart+monAngle*sensH),true,true,true,true,Transformation.BOTTOM);
                                ligne2.setEntirePath([[x,y],[x-((monTexte.width+ (4*coefUtil))*invSens),y]]);
                                ligne2.translate(ligne1.width*invSens*sensH,ligne1.height*invSens*sensH,true,true,true,true);
                                monTexte.left=ligne2.left - (4*coefUtil*invSens*inter_1);
                                monTexte.top=ligne2.top + monTexte.height + (2*coefUtil);
                       if(monSymbole=== 2){
                           symbL[0].rotate(90,true,true,true,true,Transformation.CENTER);
                           symbL[1].rotate(90,true,true,true,true,Transformation.CENTER);
                       };
                };
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Decode colour   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decoderCouleur (couleurChoisie) {
    maNuance = RGBColor;
    switch (couleurChoisie) {
    case 0 :
                maNuance.red = 0;maNuance.green = 0;maNuance.blue = 0;
                return (maNuance);break;
    case  1 :
                maNuance.red = 230;maNuance.green = 0;maNuance.blue = 126;
                return (maNuance);break;
    case  2 :
                maNuance.red = 0;maNuance.green = 159;maNuance.blue = 227;
                return (maNuance);break;
    case  3 :
                maNuance.red = 0;maNuance.green = 118;maNuance.blue = 50;
                return (maNuance);break;
    case  4 :
                maNuance.red = 255;maNuance.green = 236;maNuance.blue = 66;
                return (maNuance);break;
    case   5 :
                maNuance.red = 255;maNuance.green = 255;maNuance.blue = 255;
                return (maNuance);break;
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Choose unit   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function choisirUnite(uniteChoisie,affichUnit) {
    var monUnite = affichUnit ? " " + uniteChoisie : "";
    switch (uniteChoisie) {
    case "mm" :
            if (monType === "LIN"){
                largeurFinale = (largeur/(0.02834645*echelle)).toFixed(dec) + monUnite;
                hauteurFinale = (hauteur/(0.02834645*echelle)).toFixed(dec) + monUnite;
                return (largeurFinale,hauteurFinale);break;
            } else {
                maLongueurFinale = (maLongueur/(0.02834645*echelle)).toFixed(dec) + monUnite;
                return (maLongueurFinale);break;
            };
    case  "cm" :
            if (monType === "LIN"){
                largeurFinale = (largeur/(0.2834645*echelle)).toFixed(dec) + monUnite;
                hauteurFinale = (hauteur/(0.2834645*echelle)).toFixed(dec) + monUnite;
                return (largeurFinale,hauteurFinale);break;
            } else {
                maLongueurFinale = (maLongueur/(0.2834645*echelle)).toFixed(dec) + monUnite;
                return (maLongueurFinale);break;
            };
    case  "in" :
            if (monType === "LIN"){
                largeurFinale = (largeur/(0.72*echelle)).toFixed(dec) + monUnite;
                hauteurFinale = (hauteur/(0.72*echelle)).toFixed(dec) + monUnite;
                return (largeurFinale,hauteurFinale);break;
            } else {
                maLongueurFinale = (maLongueur/(0.72*echelle)).toFixed(dec) + monUnite;
                return (maLongueurFinale);break;
            };
    case  "px" :
            if (monType === "LIN"){
                largeurFinale = (largeur/(0.01*echelle)).toFixed(dec) + monUnite;
                hauteurFinale = (hauteur/(0.01*echelle)).toFixed(dec) + monUnite;
                return (largeurFinale,hauteurFinale);break;
            } else {
                maLongueurFinale = (maLongueur/(0.01*echelle)).toFixed(dec) + monUnite;
                return (maLongueurFinale);break;
            };
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Create Cotation layer   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function creation_cCalque() {
	var cCalqueNexistePas = true;
    for(i = 0; i < activeDocument.layers.length; i++){
            if(activeDocument.layers[i].name == "Cotation"){
                cCalque = activeDocument.activeLayer = activeDocument.layers[i];
                cCalque.locked = false;
                cCalque.visible = true;
                cCalqueNexistePas = false;
            };
    };
    if(cCalqueNexistePas){
            cCalque = monFichier.layers.add();
            cCalque.name = "Cotation";
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Save settings    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sauverParametres() {
    try{
    if (monType === "LIN"){
        var paramCot = new File(fichierParam.folder + fichierParam.name),
            donnees = [txtEch.text, rdGeo.value,rdVis.value,haut.value,bas.value,nH.value,droite.value,gauche.value,
            nL.value,rD.value,rG.value,rH.value,rB.value, fois1.value, fois2.value, fois3.value,
            fois4.value, fois5.value, txtFactUtil.text, listeSymboles.selection.index,
            listeCouleurs.selection.index,ckbAffichUnit.value,listeUnites.selection.index,nbDec.text,mem_chbInverser].toString()
    } else {
        var paramCot = new File(fichierParam.folder + fichierParam.name),
            donnees = [txtEch.text, mem_rdGeo,mem_rdVis,mem_haut,mem_bas,mem_nH,mem_droite,mem_gauche,
            mem_nL,rD.value,rG.value,mem_rH,mem_rB, fois1.value, fois2.value, fois3.value,
            fois4.value, fois5.value, txtFactUtil.text, listeSymboles.selection.index,
            listeCouleurs.selection.index,ckbAffichUnit.value,listeUnites.selection.index,nbDec.text,chbInverser.value].toString()
     };
        paramCot.open('w');
        paramCot.write(donnees);
        paramCot.close();
    }catch(e){$.errorMessage(e);}
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Load settings    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function chargerParametres() {
    var paramCot = File(fichierParam.folder + fichierParam.name);
    if (paramCot.exists) {
        try {
            paramCot.open('r');
            var donnees = paramCot.read().split('\n'),
            mesValeurs = donnees[0].split(',');
            txtEch.text = parseInt(mesValeurs[0]);
            rD.value = (mesValeurs[9]==='true');
            rG.value = (mesValeurs[10]==='true');
            fois1.value = (mesValeurs[13]==='true');
            fois2.value = (mesValeurs[14]==='true');
            fois3.value = (mesValeurs[15]==='true');
            fois4.value = (mesValeurs[16]==='true');
            fois5.value = (mesValeurs[17]==='true');
            txtFactUtil.text = parseInt(mesValeurs[18]);
            listeSymboles.selection =mesValeurs[19];
            listeCouleurs.selection =mesValeurs[20];
            ckbAffichUnit.value =(mesValeurs[21]==='true');
            listeUnites.selection =mesValeurs[22];
            nbDec.text = parseInt(mesValeurs[23]);
        if(monType === "LIN"){
            rdGeo.value = (mesValeurs[1]==='true');
            rdVis.value = (mesValeurs[2]==='true');
            haut.value = (mesValeurs[3]==='true');
            bas.value = (mesValeurs[4]==='true');
            nH.value = (mesValeurs[5]==='true');
            droite.value = (mesValeurs[6]==='true');
            gauche.value = (mesValeurs[7]==='true');
            nL.value = (mesValeurs[8]==='true');
            rH.value = (mesValeurs[11]==='true');
            rB.value = (mesValeurs[12]==='true');
            mem_chbInverser = (mesValeurs[24]==='true');
            return (mem_chbInverser);
        } else {
            chbInverser.value = (mesValeurs[24]==='true');
            mem_rdGeo = (mesValeurs[1]==='true');
            mem_rdVis = (mesValeurs[2]==='true');
            mem_haut = (mesValeurs[3]==='true');
            mem_bas = (mesValeurs[4]==='true');
            mem_nH = (mesValeurs[5]==='true');
            mem_droite = (mesValeurs[6]==='true');
            mem_gauche = (mesValeurs[7]==='true');
            mem_nL = (mesValeurs[8]==='true');
            mem_rH = (mesValeurs[11]==='true');
            mem_rB = (mesValeurs[12]==='true');
            return (mem_rdGeo,mem_rdVis,mem_haut,mem_bas,mem_nH,
            mem_droite,mem_gauche,mem_nL,mem_rH,mem_rB);
        };
            } catch (e) {}
        paramCot.close();
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Verify settings file    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function verifDossierParam() {
    var monDossier = new Folder(fichierParam.folder);
    if (!monDossier.exists) monDossier.create();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   GetByName function    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function gBN(typeObj,objet) {
    if (typeObj === "T") {
        monItem = monFichier.textFrames.getByName(objet);
    }else if (typeObj === "G") {
        monItem = monFichier.groupItems.getByName(objet);
    }else{
        monItem = monFichier.pathItems.getByName(objet);
    };
    return (monItem);
};
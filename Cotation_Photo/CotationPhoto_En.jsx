//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*CotationPhoto
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       Transform a straight line into a dimension line and add a text frame to dimension a photo
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Management of the preview  inspired by Alexander Ladygin's tutorial (https://ladyginpro.ru/blog/create-preview-in-dialog/).    
*/
var nomScript = 'Cotation_Photo',
    fichierParam = {
        name: nomScript + '_param.json',
        folder: Folder.myDocuments + '/CC_Scripts/'
    }
// Variables declaration for the active document
    var monFichier = app.activeDocument;
// Loop to determine if something is selected or not
    var maSelection = monFichier.selection.length;
    if (monFichier.selection[0] && monFichier.selection[0].typename === "PathItem") {
        objet_Selectionne = monFichier.selection
        // Create variables for the bounds of selection (in points)
        var MesDistances = objet_Selectionne[0].geometricBounds;
        cote1 = MesDistances[2] - MesDistances[0];
        cote2 = MesDistances[1] - MesDistances[3];
        ////////// Creation a variable for the length of the selected object (in points)
        maLongueur = objet_Selectionne[0].length;
        /////// Call the function for creating the "Cotation" layer
        creation_cCalque();
        ////////// Creation a variable for each anchor of the selected object (in points)
                var p1_x = objet_Selectionne[0].selectedPathPoints[0].anchor[0]
                var p1_y = objet_Selectionne[0].selectedPathPoints[0].anchor[1]
                var p2_x = objet_Selectionne[0].selectedPathPoints[1].anchor[0]
                var p2_y = objet_Selectionne[0].selectedPathPoints[1].anchor[1]
                // Define the direction of the line
                var sensH = 1;
                    if (p1_x > p2_x)
                    {
                        sensH=-1
                    }
                var sensV=1
                    if (p1_y > p2_y)
                    {
                        sensV=-1
                    }
     objet_Selectionne[0].hidden = true
     defaire = false;
              ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              //    Dialog box    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    var boiteDialogueCotation = new Window ('dialog', "Dimension on a photo");
                    boiteDialogueCotation.alignChildren = "left";
                    boiteDialogueCotation.spacing = 5;
             /////// Scale
                    var grpValeur = boiteDialogueCotation.add('group');
                           var panValeur = grpValeur.add('panel', [0,0,145,60], "Value");
                           txtValeur = panValeur.add("edittext", [10,15,100,34],"x");
                           txtValeur.characters = 8;
                           grpValeur.orientation = "row";
                           txtValeur.helpTip = 'Quelle valeur souhaitez-vous indiquer ?';
                           txtValeur.onChange = function() {majApercu();};
             /////// Units
                   var panUnites = grpValeur.add('panel', [0,0,105,60], "Unit")
                            var listeUnites = panUnites.add('DropDownList',[10,15,92,34], ["mm", "cm", "inches", "pixels","none"]);
                            listeUnites.minimumSize.width = 80;
                            listeUnites.selection =  listeUnites.selection === null ? 0 : listeUnites.selection;
                            listeUnites.onChange = function() {majApercu();};
             /////// Divider_1
                    var diviseur_1 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_1.alignment = "fill";
             /////// User factor
                    var grpFormats  = boiteDialogueCotation.add('group')
                            var panFactUtil =grpFormats.add ('panel', [0,0,145,60], "Coef adjustment")
                                    var txtFactUtil = panFactUtil .add('edittext', [10,15,45,34],75);
                                    txtFactUtil.characters = 4;
                                    txtFactUtil.helpTip = 'Adapt the dimension to the photo in % of the base';
                                    var lblpourCent= panFactUtil.add('statictext',[54,15,92,34],"%");
                                    txtFactUtil.onChange = function() {majApercu();};
                                    panFactUtil.orientation = "row";
                                    panFactUtil.alignChildren = "top"
              /////// Colours
                            var panCouleurs = grpFormats.add ('panel', [0,0,105,60], "Colour")
                                    var listeCouleurs = panCouleurs.add('DropDownList', [10,15,92,34], ["Blue", "Black", "Yellow", "Magenta", "Cyan","White"]);
                                    listeCouleurs.minimumSize.width = 80;
                                    listeCouleurs.selection = listeCouleurs.selection === null ? 0 : listeCouleurs.selection;
                                    listeCouleurs.onChange = function() {majApercu();};
             /////// Divider_3
                    var diviseur_3 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_3.alignment = "fill";
             /////// Buttons
                    var grpBoutons = boiteDialogueCotation.add("group")
                            var btnOk = grpBoutons.add("button", [330,15,376,50], "Ok");
                                btnOk.onActivate =  function() {defaire =false};
                            var btnAnnul = grpBoutons.add("button", [386,15,472,50], "Cancel");
             /////// Cancel button actions
                                btnAnnul.onClick =  function() {
                                                                  if (defaire) {app.undo()};
                                                                        boiteDialogueCotation.close();
                                                                  };
            boiteDialogueCotation.onClose = function() { sauverParametres()};
            verifDossierParam();
            chargerParametres (); 
            boiteDialogueCotation.center();
            majApercu();
            boiteDialogueCotation.show();
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}else {
        alert("You must select a straight line.");
};
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
        dessinerCotation();
        app.redraw();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Collect initial data   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function recueilDonnees() {
// libellé
    valeur = txtValeur.text
// Couleur
    maNuance = decoderCouleur(listeCouleurs.selection.text);
// Coeff. utilisateur
    factUtil = txtFactUtil.text;
    coefUtil = factUtil/100;
    esp = 0.75*coefUtil
    epTrait = 0.3 * coefUtil;
// Unités
    choisirUnite(listeUnites.selection.text);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Drraw the dimension    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function  dessinerCotation() {
        recueilDonnees();
////////// Create d'un group containing the diffrent items
        var maCote = cCalque.groupItems.add();
        maCote.name = "Cote";
////////// Create arrowheads and add to the group
        var fleche_1 = maCote.pathItems.add();
             fleche_1.stroked = true;
             fleche_1.filled = false;
             fleche_1.strokeColor = maNuance;
             fleche_1.strokeWidth = epTrait*2;
         var fleche_2 = maCote.pathItems.add();
             fleche_2.stroked = true;
             fleche_2.filled = false;
             fleche_2.strokeColor = maNuance;
             fleche_2.strokeWidth = epTrait*2;
////////// Get angle of selected path
        var atanMonAngle = Math.atan2(cote1,cote2);
        var monAngle = atanMonAngle*180/Math.PI;
////////// Draw arrow no1
        fleche_1.setEntirePath([[p1_x-(5*epTrait), p1_y-(20*epTrait)], [p1_x,p1_y], 
        [p1_x+(5*epTrait), p1_y-(20*epTrait)]]);
        //Draw arrow no2
        fleche_2.setEntirePath([[p2_x-(5*epTrait), p2_y+(20*epTrait)], [p2_x,p2_y], 
        [p2_x+(5*epTrait), p2_y+(20*epTrait)]]);
////////// Create a text frame and add to the group
        var monTexte = maCote.textFrames.add();
                monTexte.textRange.characterAttributes.textFont = app.textFonts.getByName('CenturyGothic');
                monTexte.textRange.size = 8*coefUtil;
                monTexte.filled = true;
                monTexte.stroked = false;
                monTexte.textRange.characterAttributes.fillColor = maNuance;
                monTexte.contents = valeurFinale;
                monTexte.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
        var largTexte = monTexte.width;
        var ligne1 = maCote.pathItems.add();
        ligne1.setEntirePath([[p1_x,p1_y],[p1_x,(p1_y-(maLongueur-(largTexte*1.2))/2)]]);
        ligne1.strokeWidth = epTrait;
        ligne1.strokeColor = maNuance;
        var ligne2 = maCote.pathItems.add()
        ligne2.setEntirePath([[p2_x,p2_y],[p2_x,(p2_y+(maLongueur-(largTexte*1.2))/2)]]);
        ligne2.strokeWidth = epTrait;
        ligne2.strokeColor = maNuance;
////////// Rotate objects
        if (sensH>0)
            if(sensV>0){
                   fleche_1.rotate(180-monAngle,true,true,true,true,Transformation.TOP);
                   fleche_2.rotate(180-monAngle,true,true,true,true,Transformation.BOTTOM);
                   ligne1.rotate(180-monAngle,true,true,true,true,Transformation.TOP);
                   ligne2.rotate(180-monAngle,true,true,true,true,Transformation.BOTTOM);
                   monTexte.left=p1_x + ((p2_x - p1_x)/2) - (monTexte.width/2); 
                   monTexte.top=p1_y + ((p2_y - p1_y)/2) + (monTexte.height/2);
                   monTexte.rotate(90-monAngle,true,true,true,true,Transformation.CENTER);
            }else {
                   fleche_1.rotate(monAngle,true,true,true,true,Transformation.TOP);
                   fleche_2.rotate(monAngle,true,true,true,true,Transformation.BOTTOM);
                   ligne1.rotate(monAngle,true,true,true,true,Transformation.TOP);
                   ligne2.rotate(monAngle,true,true,true,true,Transformation.BOTTOM);
                   monTexte.left=p1_x + ((p2_x - p1_x)/2) - (monTexte.width/2); 
                   monTexte.top=p1_y + ((p2_y - p1_y)/2) + (monTexte.height/2);
                   monTexte.rotate(-90+monAngle,true,true,true,true,Transformation.CENTER);
      }else{
            if(sensV>0){
                   fleche_1.rotate(monAngle-180,true,true,true,true,Transformation.TOP);
                   fleche_2.rotate(monAngle-180,true,true,true,true,Transformation.BOTTOM);
                   ligne1.rotate(monAngle-180,true,true,true,true,Transformation.TOP);
                   ligne2.rotate(monAngle-180,true,true,true,true,Transformation.BOTTOM);
                   monTexte.left=p1_x - ((p1_x - p2_x)/2) - (monTexte.width/2); 
                   monTexte.top=p1_y + ((p2_y - p1_y)/2) + (monTexte.height/2);
                   monTexte.rotate(270+monAngle,true,true,true,true,Transformation.CENTER);
            }else{
                   fleche_1.rotate(-monAngle,true,true,true,true,Transformation.TOP);
                   fleche_2.rotate(-monAngle,true,true,true,true,Transformation.BOTTOM);
                   ligne1.rotate(-monAngle,true,true,true,true,Transformation.TOP);
                   ligne2.rotate(-monAngle,true,true,true,true,Transformation.BOTTOM);
                   monTexte.left=p1_x - ((p1_x - p2_x)/2) - (monTexte.width/2); 
                   monTexte.top=p1_y + ((p2_y - p1_y)/2) + (monTexte.height/2);
                   monTexte.rotate(90-monAngle,true,true,true,true,Transformation.CENTER);
            };
     };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Decode colour   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decoderCouleur (couleurChoisie) {
    maNuance = RGBColor;
    switch (couleurChoisie) {
    case  "Blue" :
                maNuance.red = 3;maNuance.green = 31;maNuance.blue = 115;
                return (maNuance);break;
    case "Back" :
                maNuance.red = 0;maNuance.green = 0;maNuance.blue = 0;
                return (maNuance);break;
    case  "Yellow" :
                maNuance.red = 255;maNuance.green = 236;maNuance.blue = 66;
                return (maNuance);break;
    case  "Magenta" :
                maNuance.red = 230;maNuance.green = 0;maNuance.blue = 126;
                return (maNuance);break;
    case  "Cyan" :
                maNuance.red = 0;maNuance.green = 159;maNuance.blue = 227;
                return (maNuance);break;
    case   "White" :
                maNuance.red = 255;maNuance.green = 255;maNuance.blue = 255;
                return (maNuance);break;
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Choose unit   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function choisirUnite(uniteChoisie) {
    switch (uniteChoisie) {
    case "mm" :
                valeurFinale = valeur + " mm";
                return (valeurFinale);break;
    case  "cm" :
                valeurFinale = valeur + " cm";
                return (valeurFinale);break;
    case  "inches" :
                valeurFinale = valeur + " in";
                return (valeurFinale);break;
    case  "pixels" :
                valeurFinale = valeur + " px";
                return (valeurFinale);break;
    case  "none" :
                valeurFinale = valeur + "";
                return (valeurFinale);break;
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Create dimension layer   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function creation_cCalque() {
	var cCalqueNexistePas = true;
    for(i = 0; i < activeDocument.layers.length; i++){
            if(activeDocument.layers[i].name == "Cotation"){
                cCalque = activeDocument.activeLayer = activeDocument.layers[i]; 
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
    var paramCot = new File(fichierParam.folder + fichierParam.name),
        donnees = [listeUnites.selection.index, listeCouleurs.selection.index,txtFactUtil.text,].toString();
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
            listeUnites.selection =mesValeurs[0];
            listeCouleurs.selection =mesValeurs[1];
            txtFactUtil.text = parseInt(mesValeurs[2]);
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

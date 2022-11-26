//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*CotationPhoto
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       Transformation d'un trait en ligne de cote et zone de texte pour coter une photo.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Gestion de l'aperçu inspirée  du tutoriel d'Alexander Ladygin (https://ladyginpro.ru/blog/create-preview-in-dialog/).     
*/
var nomScript = 'Cotation_Photo',
    fichierParam = {
        name: nomScript + '_param.json',
        folder: Folder.myDocuments + '/CC_Scripts/'
    };
// Déclaration des variables pour le document actif
    var monFichier = app.activeDocument;
// Boucle pour déterminer si un objet est sélectionné ou non
    var maSelection = monFichier.selection.length;
    if (monFichier.selection[0] && monFichier.selection[0].typename === "PathItem") {
        objet_Selectionne = monFichier.selection
        // Création de variables pour les limites de la sélection (en points)
        var MesDistances = objet_Selectionne[0].geometricBounds;
        cote1 = MesDistances[2] - MesDistances[0];
        cote2 = MesDistances[1] - MesDistances[3];
        ////////// Création d'une variable pour la longueur de l'objet sélectionné (en points)
        maLongueur = objet_Selectionne[0].length;
       // Appel de la fonction de création du calque "Cotation"
        creation_cCalque();
                //Position de chaque point d'ancrage de la ligne sélectionnée
                var p1_x = objet_Selectionne[0].selectedPathPoints[0].anchor[0]
                var p1_y = objet_Selectionne[0].selectedPathPoints[0].anchor[1]
                var p2_x = objet_Selectionne[0].selectedPathPoints[1].anchor[0]
                var p2_y = objet_Selectionne[0].selectedPathPoints[1].anchor[1]
                // Définir le sens du tracé sélectionné
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
              //    Boîte de dialogue    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    var boiteDialogueCotation = new Window ('dialog', "Cotation sur photo");
                    boiteDialogueCotation.alignChildren = "left";
                    boiteDialogueCotation.spacing = 5;
             /////// Échelle
                    var grpValeur = boiteDialogueCotation.add('group');
                           var panValeur = grpValeur.add('panel', [0,0,145,60], "Valeur");
                           txtValeur = panValeur.add("edittext", [10,15,100,34],"x");
                           txtValeur.characters = 8;
                           grpValeur.orientation = "row";
                           txtValeur.helpTip = 'Quelle valeur souhaitez-vous indiquer ?';
                           txtValeur.onChange = function() {majApercu();};
             /////// Unités
                   var panUnites = grpValeur.add('panel', [0,0,105,60], "Unit\351")
                            var listeUnites = panUnites.add('DropDownList',[10,15,92,34], ["mm", "cm", "pouces", "pixels","aucune"]);
                            listeUnites.minimumSize.width = 80;
                            listeUnites.selection =  listeUnites.selection === null ? 0 : listeUnites.selection;
                            listeUnites.onChange = function() {majApercu();};
             /////// Diviseur_1
                    var diviseur_1 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_1.alignment = "fill";
             /////// Facteur utilisateur
                    var grpFormats  = boiteDialogueCotation.add('group')
                            var panFactUtil =grpFormats.add ('panel', [0,0,145,60], "Coef ajustement")
                                    var txtFactUtil = panFactUtil .add('edittext', [10,15,45,34],75);
                                    txtFactUtil.characters = 4;
                                    txtFactUtil.helpTip = 'Adapter la taille de la cotation à celle de l\'objet \050 en % de  la taille de base\051';
                                    var lblpourCent= panFactUtil.add('statictext',[54,15,92,34],"%");
                                    txtFactUtil.onChange = function() {majApercu();};
                                    panFactUtil.orientation = "row";
                                    panFactUtil.alignChildren = "top"
              /////// Couleurs
                            var panCouleurs = grpFormats.add ('panel', [0,0,105,60], "Couleur")
                                    var listeCouleurs = panCouleurs.add('DropDownList', [10,15,92,34], ["Bleu", "Noir", "Jaune", "Magenta", "Cyan","Blanc"]);
                                    listeCouleurs.minimumSize.width = 80;
                                    listeCouleurs.selection = listeCouleurs.selection === null ? 0 : listeCouleurs.selection;
                                    listeCouleurs.onChange = function() {majApercu();};
             /////// Diviseur_3
                    var diviseur_3 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_3.alignment = "fill";
             /////// Boutons
                    var grpBoutons = boiteDialogueCotation.add("group")
                            var btnOk = grpBoutons.add("button", [330,15,376,50], "Ok");
                                btnOk.onActivate =  function() {defaire =false};
                            var btnAnnul = grpBoutons.add("button", [386,15,472,50], "Annuler", { name: 'Cancel' });
             /////// Action bouton "Annuler"
                                btnAnnul.onClick =  function() {
                                                                  if (defaire) {app.undo()};
                                                              boiteDialogueCotation.close();
                                                              };
            boiteDialogueCotation.onClose = function() { sauverParametres()
                                                              };
            verifDossierParam();
            chargerParametres (); 
            boiteDialogueCotation.center();
            majApercu();
            boiteDialogueCotation.show();
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}else {
        alert("Vous devez sélectionner un segmente ligne droite.");
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Mise à jour de l'aperçu    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//    Recueillir les données initiales /////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function recueilDonnees() {
// libellé
    valeur = txtValeur.text;
// Couleur
    maNuance = decoderCouleur(listeCouleurs.selection.text);
// Coeff. utilisateur
    factUtil = txtFactUtil.text;
    coefUtil = factUtil/100;
    esp = 0.75*coefUtil;
    epTrait = 0.3 * coefUtil;
// Unités
    choisirUnite(listeUnites.selection.text);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dessiner la cotation    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function  dessinerCotation() {
        recueilDonnees();
////////// Création d'un groupe contenant les différent items
        var maCote = cCalque.groupItems.add();
        maCote.name = "Cote";
////////// Création des pointes de fleches et ajout au groupe maCote
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
////////// Quel est l'angle du tracé sélectionné ?
        var atanMonAngle = Math.atan2(cote1,cote2);
        var monAngle = atanMonAngle*180/Math.PI;
////////// Dessiner flèche n°1
        fleche_1.setEntirePath([[p1_x-(5*epTrait), p1_y-(20*epTrait)], [p1_x,p1_y],  [p1_x+(5*epTrait), p1_y-(20*epTrait)]]);
        //Dessiner flèche n°2
        fleche_2.setEntirePath([[p2_x-(5*epTrait), p2_y+(20*epTrait)], [p2_x,p2_y],  [p2_x+(5*epTrait), p2_y+(20*epTrait)]]);
////////// Création d'un cadre de texte et ajout au groupe maCote
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
        var ligne2 = maCote.pathItems.add();
        ligne2.setEntirePath([[p2_x,p2_y],[p2_x,(p2_y+(maLongueur-(largTexte*1.2))/2)]]);
        ligne2.strokeWidth = epTrait;
        ligne2.strokeColor = maNuance;
////////// Rotation des différents items
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
//   Décoder couleur   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decoderCouleur (couleurChoisie) {
    maNuance = RGBColor;
    switch (couleurChoisie) {
    case  "Bleu" :
                maNuance.red = 3;maNuance.green = 31;maNuance.blue = 115;
                return (maNuance);break;
    case "Noir" :
                maNuance.red = 0;maNuance.green = 0;maNuance.blue = 0;
                return (maNuance);break;
    case  "Jaune" :
                maNuance.red = 255;maNuance.green = 236;maNuance.blue = 66;
                return (maNuance);break;
    case  "Magenta" :
                maNuance.red = 230;maNuance.green = 0;maNuance.blue = 126;
                return (maNuance);break;
    case  "Cyan" :
                maNuance.red = 0;maNuance.green = 159;maNuance.blue = 227;
                return (maNuance);break;
    case   "Blanc" :
                maNuance.red = 255;maNuance.green = 255;maNuance.blue = 255;
                return (maNuance);break;
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Choisir l'unité   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function choisirUnite(uniteChoisie) {
    switch (uniteChoisie) {
    case "mm" :
                valeurFinale = valeur + " mm";
                return (valeurFinale);break;
    case  "cm" :
                valeurFinale = valeur + " cm";
                return (valeurFinale);break;
    case  "pouces" :
                valeurFinale = valeur + " in";
                return (valeurFinale);break;
    case  "pixels" :
                valeurFinale = valeur + " px";
                return (valeurFinale);break;
    case  "aucune" :
                valeurFinale = valeur + "";
                return (valeurFinale);break;
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Création du calque "Cotation"    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//    Sauvegarde des paramètres    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//    Charger les paramètres    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//   Vérifier le dossier des paramètres    //////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function verifDossierParam() {
    var monDossier = new Folder(fichierParam.folder);
    if (!monDossier.exists) monDossier.create();
};

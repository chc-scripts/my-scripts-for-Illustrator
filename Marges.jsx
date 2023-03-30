//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Marge.jsx
>=---------------------------------------------------------------------------------------------------------------------------------------------------------------
       christian.condamine@laposte.net - octobre 2022 
>=---------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      This script is a combination of 2 scripts created by MulaRahul, addMargigin.jsx and AddPadding.jsx 
      (https://github.com/mulaRahul/illustrator-scripts) to which is added a live preview function inspired
      by Alexander Ladygin's tutorial (https://ladyginpro.ru/blog/create-preview-in-dialog/).
      (https://ladyginpro.ru/blog/create-preview-in-dialog/).
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Usage:
>=---------------------------------------------------------------------------------------------------------------------------------------------------------------
1.   Open your illustrator document.
2.   Run the script, File → Scripts → MarkersMarge.jsx.
3.   The dialog box that opens already contains values ​​that allow you to visualize the creation of markers. All these values ​
       can be changed with a live preview
4.   Change the margin value in the "Margins" text field.
5.   The new margin value will be applied in all directions.
6.   By default, all artboards will be affected but you can only affect the desired artboards by checking the "Numbers" option.
7.   Then enter the numbers of the chosen artboards separated by a comma like "1, 3, 5")" or a range of artboards like "5-8"
       or both combined like "1, 3, 5-8".
8.   If you want to add different margins for different directions, check the "Directional" button and enter the margin values
       ​​for top, left, right and bottom.
9.   If you want to add different margins for the facing pages, select "Alternate".
10. Then enter the values ​​of the "Left" and "Right" margins for the
       "Odd" and "Even" artboards.
11. You can choose to create "Guides", "Rectangles" or
       "Margins" by increasing the widths and heights of the artboards
12.  Finally validate your settings with the "Create" button.
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#targetengine 'main'
$.localize = true;
$.locale = null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);
defaire = false;
etat = false
//// Create shade of black
    var blackColor = new CMYKColor();
        blackColor.cyan = 0;
        blackColor.magenta = 0;
        blackColor.yellow = 0;
        blackColor.black = 100;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    dialog box  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// dialog data configuration
var configData = {
    margins: 15,
    spacing: 10,
    fillAlignment: ["fill", "center"],
    leftAlignment: ["left", "center"],
};
// root window
var dlg = new Window("dialog", {en:"Add Margin or Padding", fr:"Ajouter rep\350res ou marges"});
dlg.alignChildren = ["fill", "fill"];
// Layout options
var artboardOptionsContainer = dlg.add("panel", undefined, {en:"Artboards",fr:"Plans de travail"});
    artboardOptionsContainer.orientation = "row";
    artboardOptionsContainer.margins = configData.margins;
    artboardOptionsContainer.alignChildren = configData.fillAlignment;
var allArtboardOption = artboardOptionsContainer.add("radiobutton", undefined, {en:"All", fr:"Tous"});
        allArtboardOption.value = true;
        allArtboardOption.onClick = function () { customArtboardInput.enabled = false;
                                                                    majApercu();
                                                                    };
var customArtboardOption = artboardOptionsContainer.add("radiobutton", undefined, {en:"Custom", fr:"Num\351ros"});
        customArtboardOption.onClick = function () { customArtboardInput.enabled = true;
                                                                            majApercu();
                                                                           };
var customArtboardInput = artboardOptionsContainer.add("edittext", undefined, "1, 3, 5-8");
    customArtboardInput.enabled = false;
    customArtboardInput.minimumSize = [100, 0];
    customArtboardInput.onChange = function() {majApercu();};
// Enter margin values
var marginContainer = dlg.add("panel", undefined, {en:"Margins", fr:"Marges"});
    marginContainer.margins = configData.margins;
    marginContainer.alignment = configData.fillAlignment;
    marginContainer.alignChildren = configData.leftAlignment;
var marginRadiobuttonGroup = marginContainer.add("group", undefined);
    marginRadiobuttonGroup.orientation = "column";
    marginRadiobuttonGroup.alignChildren = configData.leftAlignment;
var allMarginWrapper = marginRadiobuttonGroup.add("group", undefined);
var rd_MargesUniformes = allMarginWrapper.add("radiobutton", undefined, {en:"All", fr:"Tous"});
        rd_MargesUniformes.value = true;
        rd_MargesUniformes.onClick = function() {this.value = true;
                                                                directionalMargin.value = false;
                                                                // Fields
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
var unitOptions = allMarginWrapper.add("dropdownlist", undefined, ["mm", "pixels", {en:"inches", fr:"pouces"}]);
    unitOptions.selection = "mm";
    unitOptions.selection = unitOptions.selection === null ? 0 : unitOptions.selection;
    unitOptions.onChange = function() {majApercu();};
var directionalMargin = marginRadiobuttonGroup.add("radiobutton", undefined, {en:"Directional", fr:"Uniformes"});
    directionalMargin.value = false;
directionalMargin.onClick = function() {this.value = true;
                                                    rd_MargesUniformes.value = false;
                                                    // Fields
                                                    topMargin.enabled = true;
                                                    leftMargin.enabled = true;
                                                    rightMargin.enabled = true;
                                                    bottomMargin.enabled = true;
                                                    marginAll.enabled = false;
                                                    majApercu();
                                                }
//// different margins
    var directionalMarginPanel = marginContainer.add("group", undefined);
        directionalMarginPanel.orientation = "row";
        directionalMarginPanel.alignment = configData.leftAlignment;
//// Top
    var topWrapper = directionalMarginPanel.add("group", undefined);
        topWrapper.orientation = "column";
        topWrapper.alignChildren = configData.leftAlignment;;
        topWrapper.add("statictext", undefined, {en:"Top ", fr:"Haut "});
    var topMargin = topWrapper.add("edittext", undefined, "10");
        topMargin.minimumSize = [50, 0];
        topMargin.onChange = function() {majApercu();};
//// Right
    var rightWrapper = directionalMarginPanel.add("group", undefined);
        rightWrapper.orientation = "column";
        rightWrapper.alignChildren = configData.leftAlignment;;
        rightWrapper.add("statictext", undefined, {en:"Right ", fr:"Droite "});
    var rightMargin = rightWrapper.add("edittext", undefined, "10");
        rightMargin.minimumSize = [50, 0];
        rightMargin.onChange = function() {majApercu();};
//// Left
    var leftWrapper = directionalMarginPanel.add("group", undefined);
        leftWrapper.orientation = "column";
        leftWrapper.alignChildren = configData.leftAlignment;;
        leftWrapper.add("statictext", undefined, {en:"Left ", fr:"Gauche "});
    var leftMargin = leftWrapper.add("edittext", undefined, "10");
        leftMargin.minimumSize = [50, 0];
        leftMargin.onChange = function() {majApercu();};
//// Bottom
    var bottomWrapper = directionalMarginPanel.add("group", undefined);
        bottomWrapper.orientation = "column";
        bottomWrapper.alignChildren = configData.leftAlignment;;
        bottomWrapper.add("statictext", undefined, {en:"Bottom ", fr:"Bas "});
    var bottomMargin = bottomWrapper.add("edittext", undefined, "10");
        bottomMargin.minimumSize = [50, 0];
        bottomMargin.onChange = function() {majApercu();};
//// Facing page processing
    var methodOptionsContainer = dlg.add("panel", undefined, {en:"facing pages", fr:"Pages en vis à vis"});
        methodOptionsContainer.margins = configData.margins;
        methodOptionsContainer.alignChildren = configData.leftAlignment;
    var methodOptionsWrapper = methodOptionsContainer.add("group", undefined);
        methodOptionsWrapper.orientation = "row";
    var similarOption = methodOptionsWrapper.add("radiobutton", undefined, {en:"Similar", fr:"Identiques"});
        similarOption.value = true;
        similarOption.onClick = function() { alternateEvenContainer.enabled = false;
                                                               alternateOddContainer.enabled = false;
                                                               majApercu();
                                                            };
    var alternateOption = methodOptionsWrapper.add("radiobutton", undefined, {en:"Alternate", fr:"Altern\351es"});
        alternateOption.onClick = function() { alternateEvenContainer.enabled = true;
                                                                  alternateOddContainer.enabled = true;
                                                                  majApercu();
                                                                };
//// Alternation options
    var alternateOddContainer = methodOptionsContainer.add("panel", undefined, {en:"Odd", fr:"Impaires"});
        alternateOddContainer.orientation = "row";
        alternateOddContainer.margins = configData.margins;
        alternateOddContainer.alignment = configData.fillAlignment;
        alternateOddContainer.alignChildren = configData.fillAlignment;
        alternateOddContainer.enabled = false;
    var alternateOddLeftWrapper = alternateOddContainer.add("group", undefined);
        alternateOddLeftWrapper.add("statictext", undefined, {en:"Left", fr:"Gauche"});
    var oddLeftMargin = alternateOddLeftWrapper.add("edittext", undefined, "10");
        oddLeftMargin.minimumSize = [40, 0];
        oddLeftMargin.onChange = function() {majApercu();};
    var alternateOddRightWrapper = alternateOddContainer.add("group", undefined);
        alternateOddRightWrapper.add("statictext", undefined, "Right");
    var oddRightMargin = alternateOddRightWrapper.add("edittext", undefined, "10");
        oddRightMargin.minimumSize = [40, 0];
        oddRightMargin.onChange = function() {majApercu();};
    var alternateEvenContainer = methodOptionsContainer.add("panel", undefined, {en:"Even", fr:"Paires"});
        alternateEvenContainer.orientation = "row";
        alternateEvenContainer.margins = configData.margins;
        alternateEvenContainer.alignment = configData.fillAlignment;
        alternateEvenContainer.alignChildren = configData.fillAlignment;
        alternateEvenContainer.enabled = false;
    var alternateEvenLeftWrapper = alternateEvenContainer.add("group", undefined);
        alternateEvenLeftWrapper.add("statictext", undefined, {en:"Left", fr:"Gauche"});
    var evenLeftMargin = alternateEvenLeftWrapper.add("edittext", undefined, "10");
        evenLeftMargin.minimumSize = [40, 0];
        evenLeftMargin.onChange = function() {majApercu();};
    var alternateEvenRightWrapper = alternateEvenContainer.add("group", undefined);
        alternateEvenRightWrapper.add("statictext", undefined, {en:"Right", fr:"Droite"});
    var evenRightMargin = alternateEvenRightWrapper.add("edittext", undefined, "10");
        evenRightMargin.minimumSize = [40, 0];
        evenRightMargin.onChange = function() {majApercu();};
//// Appearance of margins
    var typeContainer = dlg.add("panel", undefined, {en:"Create", fr:"Cr\351er :"});
        typeContainer.orientation = "row";
        typeContainer.margins = configData.margins;
        typeContainer.alignChildren = configData.leftAlignment;
    var asRect = typeContainer.add("radiobutton", undefined, "Rectangle");
        asRect.onClick = function() { if (etat) {etat = false;};
                                                        majApercu();
                                                        majApercu();};
    var asGuide = typeContainer.add("radiobutton", undefined, {en:"Guides", fr:"Rep\350res"});
        asGuide.value = true;
        asGuide.onClick = function() {if (etat) {etat = false;};
                                                        majApercu();
                                                        majApercu();};
    var asMarge = typeContainer.add("radiobutton", undefined, {en:"Margins", fr:"Marges"});
        asMarge.onClick = function() {etat = true;
                                                        majApercu();};
//// "Create" button
    var grpBoutons = dlg.add("group", undefined);
    var renderBtn = grpBoutons.add("button", undefined, {en:"Create", fr:"Cr\351er"}, { name: 'ok' });
        renderBtn.alignment = configData.fillAlignment;
//// "Cancel" button
    var cancelBtn = grpBoutons.add("button", undefined, {en:"Cancel", fr:"Annuler"}, {name:'cancel'});
        cancelBtn.onClick =  function() {
                                      if (defaire) {app.undo();}
                                      if (mCalque.groupItems.length === 0) {mCalque.remove();}
                                      dlg.close();
                                      };
majApercu();               
dlg.show();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Utility functions    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function parseInputRange(query) {
    // reads a string of type "0, 2, 4 - 6" like query
    // and returns an array of type [ 0, 2, 4, 5, 6 ]
    var lst = query.split(",");
    var newLst = [];
    for(var i = 0; i < lst.length; i++) {
        // remove spaces
        var val = lst[i].replace(" ", "");
        // Scan if nested range
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
//    Creation of margins for each artboard   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function artboardAddMargin(allArtboards, idx) {
    // add margin to artboard bearing index [idx]
    calculMarges(idx)
    // Artboard limits
    var _left = allArtboards[idx].artboardRect[0];
    var _top = allArtboards[idx].artboardRect[1];
    var _right = allArtboards[idx].artboardRect[2];
    var _bottom = allArtboards[idx].artboardRect[3];
    if (asMarge.value === false){
            // calculation and position of the margin rectangle
            var _width = Math.abs(_right - _left) - (_marginLeft + _marginRight);
            var _height = Math.abs(_top - _bottom) - (_marginTop + _marginBottom);
            var _rect = mCalque.pathItems.rectangle(
                (_top - _marginTop), // rectangle top position
                (_left + _marginLeft), // rectangle left position
                _width, // rectangle width
                _height, // rectangle height
            );
            _rect.name = (idx + 1).toString();
            _rect.filled = false;
            // aspect of the rectangle
            if (asGuide.value) {
                // transform the rectangle into guide
                _rect.guides = true;
            } else {
                // affect rectangle outline
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
//    Rendering  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderMargin() {
    var curDoc = app.activeDocument;
    // checking input parameters
    var customArtboardLst;
    if (customArtboardOption.value) {
        var customArtboardLst = parseInputRange(customArtboardInput.text);
    }
    // Calling the function for creating a layer dedicated to the margin rectangle
    creation_mCalque();
    var allArtboards = curDoc.artboards;
    for(var idx = 0; idx < allArtboards.length; idx++) {
        //If it's about creating guides
            if (asMarge.value === false){
                    // all artboards
                    if (allArtboardOption.value) {
                        artboardAddMargin(allArtboards, idx);
                    };
                    // Customized artboards if Array.indexOf() doesn't work
                    else if (customArtboardLst.toString().indexOf( idx.toString() ) !== -1) {
                        artboardAddMargin(allArtboards, idx);
                    };
        // If it's about changing the size of the artboards
            } else {
                    // all artboards
                    if (allArtboardOption.value) {
                        artboardAddMargin(allArtboards, idx);
                    };
                    // Customized artboards if Array.indexOf() doesn't work
                    else if (contains(customArtboardLst, idx)) {
                        artboardAddMargin(allArtboards, idx);
                    };
               activeDocument.rearrangeArtboards (DocumentArtboardLayout.GridByCol,1,_marginLeft,true);
          };
    };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Creation of the "Margins" layer    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function creation_mCalque() {
	var mCalqueNexistePas = true;
    for(i = 0; i < activeDocument.layers.length; i++){
            if(activeDocument.layers[i].name == {en:"Margin", fr:"Marges"}){
                mCalque = activeDocument.activeLayer = activeDocument.layers[i];
                mCalque.locked = false;
                mCalque.visible = true;
                mCalqueNexistePas = false;
            };
    };
    if(mCalqueNexistePas){
            mCalque = activeDocument.layers.add();
            mCalque.name = {en:"Margin", fr:"Marges"};
    };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Calculation of margins   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculMarges(idx) {
    _marginLeft = parseFloat(marginAll.text);
    _marginTop = _marginLeft;
    _marginRight = _marginLeft;
    _marginBottom = _marginLeft;
    if (directionalMargin.value) {
        // different margins for different directions
        _marginLeft = parseFloat(leftMargin.text);
        _marginTop = parseFloat(topMargin.text);
        _marginRight = parseFloat(rightMargin.text);
        _marginBottom = parseFloat(bottomMargin.text);
   } 
    if (alternateOption.value) {
        if ((idx + 1) % 2 == 0) {
            //even index number means odd artboard number
            _marginLeft = parseFloat(evenLeftMargin.text);
            _marginRight = parseFloat(evenRightMargin.text);
        }
        else {
            //odd index number means even artboard number
            _marginLeft = parseFloat(oddLeftMargin.text);
            _marginRight = parseFloat(oddRightMargin.text);
        }
    }
    if (unitOptions.selection.text === "mm") {
        // mm to pixel converter
        // 1 mm = 2.834645 px
        _marginLeft *= 2.834645;
        _marginRight *= 2.834645;
        _marginTop *= 2.834645;
        _marginBottom *= 2.834645;
    }
    else if (unitOptions.selection.text === "inches"||unitOptions.selection.text === "es") {
        // inches to pixel converter
        // 1 in = 72 px
        _marginLeft *= 72;
        _marginRight *= 72;
        _marginTop *= 72;
        _marginBottom *= 72;
    }
return(_marginLeft,_marginRight,_marginTop,_marginBottom)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Preview update    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
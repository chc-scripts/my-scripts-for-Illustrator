//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Couleur_Calques
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      Change the working colour of the layers containing the selected objects
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine main
var maSelection = app.activeDocument.selection;
var nbObjetsSelectionnes = maSelection.length;
if  (nbObjetsSelectionnes > 0 ) {
/////// Color Pallet
        var hex = "0xF96163";
        var maNuance;
        var colorPickerRes = $.colorPicker (hex);
        if ( colorPickerRes != -1 ) {
            var r = colorPickerRes >> 16;
            var g = (colorPickerRes & 0x00ff00) >>8;
            var b = colorPickerRes & 0xff;
            maNuance = new RGBColor();
                    maNuance.red = r;
                    maNuance.green = g;
                    maNuance.blue = b;
            hex = colorPickerRes;
         };
        for (var x = 0 ; x < nbObjetsSelectionnes ; x++) {
            if (maNuance != null) {
            maSelection[x].layer.color = maNuance;
            };
        };
} else {
    alert ("You must select at least one object");
};
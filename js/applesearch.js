if (!applesearch) var applesearch = {};

// called when on user input - toggles clear fld btn
applesearch.onChange = function(fldID, btnID, e) {
	// check whether to show delete button
    var fld = document.getElementById( fldID );
	var btn = document.getElementById( btnID );
    e = e || event;
    if(fld.value.length > 0 && !this.clearBtn) {
		btn.style.background = "url('img/srch_r_f2.gif') no-repeat top left";
		btn.fldID = fldID; // btn remembers it's field
		btn.onclick = this.clearBtnClick;
		this.clearBtn = true;
	} else if(fld.value.length == 0 && this.clearBtn) {
		btn.style.background = "url('img/srch_r.gif') no-repeat top left";
		btn.onclick = null;
		this.clearBtn = false;
	}
    if(fld.value.length > 0 && e.keyCode == 13) {
        // kick off Google search here
        window.open('http://www.google.com/search?site=peterszocs.com&hl=en&q=' + fld.value + '+site%3Apeterszocs.com');
    }
}

// called when the user clicks into the search box
applesearch.onClick = function(fldID,btnID) {
	var fld = document.getElementById( fldID );
	if(fld.value == 'Search...') this.clearFld(fldID,btnID);
}

// called when the user clicks outside the search box
applesearch.onBlur = function(fldID) {
	var fld = document.getElementById( fldID );
	if(fld.value == '') fld.value = 'Search...';
}

// clears field
applesearch.clearFld = function(fldID,btnID) {
	var fld = document.getElementById( fldID );
	fld.value = "";
	this.onChange(fldID,btnID);
}

// called by btn.onclick event handler - calls clearFld for this button
applesearch.clearBtnClick = function() {
	applesearch.clearFld(this.fldID, this.id);
}
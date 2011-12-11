function refreshChart(id, name) {
	document.getElementById(id).innerHTML = name;
}

// kudos: http://snipplr.com/view/26338/cascading-select-boxes/  - Creative Commons Attribution-Share Alike 3.0 Unported License
function cascadeSelect(parent, child){
	var childOptions = child.find('option:not(.static)');
		child.data('options',childOptions);
		//console.log("childOptions: " + JSON.stringify(childOptions))
	parent.change(function(){
		childOptions.remove();
		console.log("changing");
		child
			.append(child.data('options').filter('.sub_' + this.value))
			.change();
	})

	childOptions.not('.static, .sub_' + parent.val()).remove();

}

function loadCascadedSelects(){
	var cascadeForm = $('#theForm');
	var subcounty = cascadeForm.find('#subcounty');
	var village = cascadeForm.find('#village');
	cascadeSelect(subcounty, village);
}

//window.onload = loadCascadedSelects;

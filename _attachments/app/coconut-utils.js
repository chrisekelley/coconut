function refreshChart(id, name) {
	document.getElementById(id).innerHTML = name;
}

// kudos: http://snipplr.com/view/26338/cascading-select-boxes/  - Creative Commons Attribution-Share Alike 3.0 Unported License
function cascadeSelect(parent, child){
	var childOptions = child.find('option:not(.static)');
		//console.log("sorting");
		//childOptions.sort(sortBylabelAlpha);
		child.data('options',childOptions);
		//console.log("childOptions: " + JSON.stringify(childOptions))
	parent.change(function(){
		childOptions.remove();
		console.log("changing");
		var filteredData = child.data('options').filter('.sub_' + this.value);
		var sortedFilteredData = filteredData.sort(sortBylabelAlpha);
		//console.log("sortedFilteredData: " + JSON.stringify(sortedFilteredData));
		child
			.append(sortedFilteredData)
			.change();
	});
	childOptions.not('.static, .sub_' + parent.val()).remove();
}

function sortBylabelAlpha(a,b) {
	//var result = a.label.toLowerCase() > b.label.toLowerCase();
	//console.log(a.label.toLowerCase() + ":" + b.label.toLowerCase() + "= " + result);
	var nameA=a.label.toLowerCase(), nameB=b.label.toLowerCase()
	if (nameA < nameB) //sort string ascending
		  return -1;
		 if (nameA > nameB)
		  return 1;
		 return 0; //default return value (no sorting)
	//return result;
}

function loadCascadedSelects(){
	var cascadeForm = $('#theForm');
	var subcounty = cascadeForm.find('#subcounty');
	var village = cascadeForm.find('#village');
	cascadeSelect(subcounty, village);
}

//window.onload = loadCascadedSelects;

// create-collection.js
(() => {
	'use strict'

	const createCollectForm = document.getElementById('create-collection-form');
	const addPropertyBtn = document.getElementById('collection-add-property-btn');
	const createCollectFormSubmit = document.getElementById('create-collection-form-submit');

	function addCollectionProperty(e) {
		e.preventDefault();
		let newPropElem = document.createElement('fieldset');
		newPropElem.innerHTML = '<input type="text" name="collection-property" placeholder="Collection property" /><select class="collection-property-type"><option value="string">text</option><option value="number">number</option><option value="boolean">boolean</option></select>';
		createCollectForm.insertBefore(newPropElem, addPropertyBtn);
	}

	function gatherCollectionData() {
		let collectionData = {};
		const propertiesArr = createCollectForm.getElementsByTagName('fieldset');
		const collectionTitle = document.getElementById('collection-title').value;
		let collectionProperties = {};

		for (let i = 0; i < propertiesArr.length; i++) {
			let propertyName = propertiesArr[i].getElementsByTagName('input')[0].value;
			let propertyType = propertiesArr[i].getElementsByTagName('select')[0].value;
			collectionProperties[propertyName] = propertyType;
		}

		collectionData.title = collectionTitle;
		collectionData.properties = collectionProperties;
		return collectionData;
	}

	function submitCollection(e) {
		e.preventDefault();
		let collectionData = gatherCollectionData();
		console.log(collectionData)

		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if(xhr.status === 200 && xhr.readyState === 4) {
				console.log(JSON.parse(xhr.responseText));
				// redirect with user data
			}			
		}
		xhr.open('POST', 'api/collections');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(collectionData));
	}

	(function createEventListeners() {
		createCollectFormSubmit.addEventListener('click', submitCollection);
		addPropertyBtn.addEventListener('click', addCollectionProperty);
	})();
})();
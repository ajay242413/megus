(function () {
	'use strict';
	angular.module('app').factory('MasterService', masterService);

	function masterService($http,$q,$window) {
		
		var masterService = {};

		masterService.saveState = saveState;
		masterService.updateState = updateState;
		masterService.readState = readState;
		masterService.removeState = removeState;
		masterService.saveDistrict = saveDistrict;
		masterService.updateDistrict = updateDistrict;
		masterService.readDistrict = readDistrict;
		masterService.removeDistrict = removeDistrict;
		masterService.saveRegion = saveRegion;
		masterService.readRegion = readRegion;
		masterService.updateRegion = updateRegion;
		masterService.removeRegion = removeRegion;
		masterService.saveZone = saveZone;
		masterService.readZone = readZone;
		masterService.updateZone = updateZone;
		masterService.removeZone = removeZone;
		masterService.saveArea = saveArea;
		masterService.updateArea = updateArea;
		masterService.readArea = readArea;
		masterService.readAreas = readAreas;
		masterService.removeArea = removeArea;
		masterService.saveCountry = saveCountry;
		masterService.readCountry = readCountry;
		masterService.updateCountry = updateCountry;
		masterService.removeCountry = removeCountry;
		masterService.saveCity = saveCity;
		masterService.updateCity = updateCity;
		masterService.readCity = readCity;
		masterService.removeCity = removeCity;
		masterService.saveUnit = saveUnit;
		masterService.updateUnit = updateUnit;
		masterService.readUnit = readUnit;
		masterService.removeUnit = removeUnit;
		masterService.saveSalePoint = saveSalePoint;
		masterService.updateSalePoint = updateSalePoint;
		masterService.readSalePoint = readSalePoint;
		masterService.removeSalePoint = removeSalePoint;
		masterService.saveClientDepartment = saveClientDepartment;
		masterService.updateClientDepartment = updateClientDepartment;
		masterService.readClientDepartment = readClientDepartment;
		masterService.removeClientDepartment = removeClientDepartment;
		masterService.saveClientDesignation = saveClientDesignation;
		masterService.updateClientDesignation = updateClientDesignation;
		masterService.readClientDesignation = readClientDesignation;
		masterService.removeClientDesignation = removeClientDesignation;
		masterService.saveDealerCategory = saveDealerCategory;
		masterService.updateDealerCategory = updateDealerCategory;
		masterService.readDealerCategory = readDealerCategory;
		masterService.removeDealerCategory = removeDealerCategory;
		masterService.saveProductType = saveProductType;
		masterService.readProductType = readProductType;
		masterService.updateProductType = updateProductType;
		masterService.removeProductType = removeProductType;
		masterService.saveProductName = saveProductName;
		masterService.readProductName = readProductName;
		masterService.updateProductName = updateProductName;
		masterService.removeProductName = removeProductName;
		masterService.saveProductBrand = saveProductBrand;
		masterService.readProductBrand = readProductBrand;
		masterService.updateProductBrand = updateProductBrand;
		masterService.removeProductBrand = removeProductBrand;
		masterService.readProductItemCode = readProductItemCode;
		masterService.saveProductItem = saveProductItem;
		masterService.readProductItem = readProductItem;
		masterService.updateProductItem = updateProductItem;
		masterService.removeProductItem = removeProductItem;
		masterService.findProductItem = findProductItem;
		masterService.saveSupplierCategory = saveSupplierCategory;
		masterService.readSupplierCategory = readSupplierCategory;
		masterService.updateSupplierCategory = updateSupplierCategory;
		masterService.removeSupplierCategory = removeSupplierCategory;
		masterService.saveSupplier = saveSupplier;
		masterService.readSupplier = readSupplier;
		masterService.readSupplierCode = readSupplierCode;
		masterService.updateSupplier = updateSupplier;
		masterService.removeSupplier = removeSupplier;
		masterService.saveEmpDepartment = saveEmpDepartment;
		masterService.updateEmpDepartment = updateEmpDepartment;
		masterService.readEmpDepartment = readEmpDepartment;
		masterService.removeEmpDepartment = removeEmpDepartment;
		masterService.saveEmpDesignation = saveEmpDesignation;
		masterService.saveEmpHierarchy = saveEmpHierarchy;
		masterService.updateEmpHierarchy = updateEmpHierarchy;
		masterService.readEmpHierarchy = readEmpHierarchy;
		masterService.removeEmpHierarchy = removeEmpHierarchy;
		masterService.updateEmpDesignation = updateEmpDesignation;
		masterService.readEmpDesignation = readEmpDesignation;
		masterService.removeEmpDesignation = removeEmpDesignation;
		masterService.saveFinancialYear = saveFinancialYear;
		masterService.readFinancialYear = readFinancialYear;
		masterService.updateFinancialYear = updateFinancialYear;
		masterService.deleteFinancialYear = deleteFinancialYear;
		masterService.saveLedgerGroup = saveLedgerGroup;
		masterService.readLedgerGroup = readLedgerGroup;
		masterService.updateLedgerGroup = updateLedgerGroup;
		masterService.deleteLedgerGroup = deleteLedgerGroup;
		masterService.saveVisitType = saveVisitType;
		masterService.readVisitType = readVisitType;
		masterService.updateVisitType = updateVisitType;
		masterService.removeVisitType = removeVisitType;
		masterService.saveProductAttribute = saveProductAttribute;
		masterService.readProductAttribute = readProductAttribute;
		masterService.updateProductAttribute = updateProductAttribute;
		masterService.removeProductAttribute = removeProductAttribute;

		return masterService;

		function saveState(state) {
			return $http.post('/api/master/saveState',state).then(handleSuccess, handleError);
		}

		function updateState(state) {
			return $http.put('/api/master/updateState',state).then(handleSuccess, handleError);
		}

		function readState(stateObj) {
			return $http.post('/api/master/readState', stateObj).then(handleSuccess, handleError);
		}

		function removeState(stateID) {
			return $http.post('/api/master/removeState', stateID).then(handleSuccess, handleError);
		}

		function saveRegion(region) {
			return $http.post('/api/master/saveRegion',region).then(handleSuccess, handleError);
		}

		function updateRegion(region) {
			return $http.put('/api/master/updateRegion',region).then(handleSuccess, handleError);
		}
		function readZone(regionObj) {
			return $http.post('/api/master/readZone', regionObj).then(handleSuccess, handleError);
		}
		function saveZone(region) {
			return $http.post('/api/master/saveZone',region).then(handleSuccess, handleError);
		}
		function updateZone(region) {
			return $http.put('/api/master/updateZone',region).then(handleSuccess, handleError);
		}
		function removeZone(regionID) {
			return $http.post('/api/master/removeZone', regionID).then(handleSuccess, handleError);
		}
		function readRegion(regionObj) {
			return $http.post('/api/master/readRegion', regionObj).then(handleSuccess, handleError);
		}		
		function removeRegion(regionID) {
			return $http.post('/api/master/removeRegion', regionID).then(handleSuccess, handleError);
		}		
		function saveDistrict(district) {
			return $http.post('/api/master/saveDistrict',district).then(handleSuccess, handleError);
		}
		function updateDistrict(district) {
			return $http.put('/api/master/updateDistrict',district).then(handleSuccess, handleError);
		}
		function readDistrict(distObj) {
			return $http.post('/api/master/readDistrict', distObj).then(handleSuccess, handleError);
		}
		function removeDistrict(districtID) {
			return $http.post('/api/master/removeDistrict', districtID).then(handleSuccess, handleError);
		}
		function saveArea(area) {
			return $http.post('/api/master/saveArea',area).then(handleSuccess, handleError);
		}
		function updateArea(area) {
			return $http.put('/api/master/updateArea',area).then(handleSuccess, handleError);
		}
		function readArea(areaObj) {
			return $http.post('/api/master/readArea', areaObj).then(handleSuccess, handleError);
		}
		function readAreas(areaObj) {
			return $http.post('/api/master/readAreas', areaObj).then(handleSuccess, handleError);
		}
		function removeArea(areaID) {
			return $http.post('/api/master/removeArea', areaID).then(handleSuccess, handleError);
		}
		function saveCountry(country) {
			return $http.post('/api/master/saveCountry',country).then(handleSuccess, handleError);
		}
		function readCountry(countryObj) {
			return $http.post('/api/master/readCountry', countryObj).then(handleSuccess, handleError);
		}
		function updateCountry(country) {
			return $http.put('/api/master/updateCountry', country).then(handleSuccess, handleError);
		}
		function removeCountry(countryID) {
			return $http.post('/api/master/removeCountry', countryID).then(handleSuccess, handleError);
		}
		function saveCity(cit) {
			return $http.post('/api/master/saveCity',cit).then(handleSuccess, handleError);
		}
		function updateCity(cit) {
			return $http.put('/api/master/updateCity',cit).then(handleSuccess, handleError);
		}
		function readCity(cityObj) {
			return $http.post('/api/master/readCity', cityObj).then(handleSuccess, handleError);
		}
		function removeCity(cityID) {
			return $http.post('/api/master/removeCity', cityID).then(handleSuccess, handleError);
		}
		function saveUnit(unit) {
			return $http.post('/api/master/saveUnit',unit).then(handleSuccess, handleError);
		}
		function updateUnit(unit) {
			return $http.put('/api/master/updateUnit',unit).then(handleSuccess, handleError);
		}
		function readUnit(unitObj) {
			return $http.post('/api/master/readUnit',unitObj).then(handleSuccess, handleError);
		}
		function removeUnit(unitID) {
			return $http.post('/api/master/removeUnit',unitID).then(handleSuccess, handleError);
		}
		function saveSalePoint(sp) {
			return $http.post('/api/master/saveSalePoint',sp).then(handleSuccess, handleError);
		}
		function updateSalePoint(sp) {
			return $http.put('/api/master/updateSalePoint',sp).then(handleSuccess, handleError);
		}
		function readSalePoint(spObj) {
			return $http.post('/api/master/readSalePoint',spObj).then(handleSuccess, handleError);
		}
		function removeSalePoint(spID) {
			return $http.post('/api/master/removeSalePoint',spID).then(handleSuccess, handleError);
		}
		function saveClientDepartment(obj) {
			return $http.post('/api/master/saveClientDepartment',obj).then(handleSuccess, handleError);
		}
		function updateClientDepartment(obj) {
			return $http.put('/api/master/updateClientDepartment',obj).then(handleSuccess, handleError);
		}
		function readClientDepartment(obj) {
			return $http.post('/api/master/readClientDepartment',obj).then(handleSuccess, handleError);
		}
		function removeClientDepartment(obj) {
			return $http.post('/api/master/removeClientDepartment',obj).then(handleSuccess, handleError);
		}
		function saveClientDesignation(obj) {
			return $http.post('/api/master/saveClientDesignation',obj).then(handleSuccess, handleError);
		}
		function updateClientDesignation(obj) {
			return $http.put('/api/master/updateClientDesignation',obj).then(handleSuccess, handleError);
		}
		function readClientDesignation(obj) {
			return $http.post('/api/master/readClientDesignation',obj).then(handleSuccess, handleError);
		}
		function removeClientDesignation(obj) {
			return $http.post('/api/master/removeClientDesignation',obj).then(handleSuccess, handleError);
		}
		function saveDealerCategory(obj) {
			return $http.post('/api/master/saveDealerCategory',obj).then(handleSuccess, handleError);
		}
		function updateDealerCategory(obj) {
			return $http.put('/api/master/updateDealerCategory',obj).then(handleSuccess, handleError);
		}
		function readDealerCategory(obj) {
			return $http.post('/api/master/readDealerCategory',obj).then(handleSuccess, handleError);
		}
		function removeDealerCategory(obj) {
			return $http.post('/api/master/removeDealerCategory',obj).then(handleSuccess, handleError);
		}
		function saveProductType(obj) {
			return $http.post('/api/master/saveProductType',obj).then(handleSuccess, handleError);
		}
		function readProductType() {
			return $http.get('/api/master/readProductType').then(handleSuccess, handleError);
		}
		function updateProductType(obj) {
			return $http.put('/api/master/updateProductType',obj).then(handleSuccess, handleError);
		}
		function removeProductType(obj) {
			return $http.put('/api/master/removeProductType',obj).then(handleSuccess, handleError);
		}
		function saveProductName(obj) {
			return $http.post('/api/master/saveProductName',obj).then(handleSuccess, handleError);
		}
		function readProductName() {
			return $http.get('/api/master/readProductName').then(handleSuccess, handleError);
		}
		function updateProductName(prodNameObj) {
			return $http.put('/api/master/updateProductName', prodNameObj).then(handleSuccess, handleError);
		}
		function removeProductName(obj) {
			return $http.put('/api/master/removeProductName',obj).then(handleSuccess, handleError);
		}
		function saveProductBrand(obj) {
			return $http.post('/api/master/saveProductBrand', obj).then(handleSuccess, handleError);
		}
		function readProductBrand() {
			return $http.get('/api/master/readProductBrand').then(handleSuccess, handleError);
		}
		function updateProductBrand(obj) {
			return $http.put('/api/master/updateProductBrand',obj).then(handleSuccess, handleError);
		}
		function removeProductBrand(obj) {
			return $http.put('/api/master/removeProductBrand',obj).then(handleSuccess, handleError);
		}
		function readProductItemCode() {
			return $http.get('/api/master/readProductItemCode').then(handleSuccess, handleError);
		}
		function readProductItem() {
			return $http.get('/api/master/readProductItem').then(handleSuccess, handleError);
		}
		function saveProductItem(obj) {
			return $http.post('/api/master/saveProductItem', obj).then(handleSuccess, handleError);
		}
		function updateProductItem(prodItemObj) {
			return $http.put('/api/master/updateProductItem', prodItemObj).then(handleSuccess, handleError);
		}
		function removeProductItem(obj) {
			return $http.put('/api/master/removeProductItem',obj).then(handleSuccess, handleError);
		}
		function findProductItem(obj) {
			return $http.post('/api/master/findProductItem',obj).then(handleSuccess, handleError);
		}
		function saveSupplierCategory(obj) {
			return $http.post('/api/master/saveSupplierCategory', obj).then(handleSuccess, handleError);
		}
		function readSupplierCategory() {
			return $http.get('/api/master/readSupplierCategory').then(handleSuccess, handleError);
		}
		function updateSupplierCategory(obj) {
			return $http.put('/api/master/updateSupplierCategory', obj).then(handleSuccess, handleError);
		}
		function removeSupplierCategory(obj) {
			return $http.put('/api/master/removeSupplierCategory', obj).then(handleSuccess, handleError);
		}
		function saveSupplier(obj) {
			return $http.post('/api/master/saveSupplier', obj).then(handleSuccess, handleError);
		}
		function readSupplier() {
			return $http.get('/api/master/readSupplier').then(handleSuccess, handleError);
		}
		function readSupplierCode() {
			return $http.get('/api/master/readSupplierCode').then(handleSuccess, handleError);
		}
		function updateSupplier(obj) {
			return $http.put('/api/master/updateSupplier', obj).then(handleSuccess, handleError);
		}
		function removeSupplier(obj) {
			return $http.put('/api/master/removeSupplier', obj).then(handleSuccess, handleError);
		}
		function saveEmpDepartment(obj) {
			return $http.post('/api/master/saveEmpDepartment', obj).then(handleSuccess, handleError);
		}
		function updateEmpDepartment(obj) {
			return $http.put('/api/master/updateEmpDepartment', obj).then(handleSuccess, handleError);
		}
		function readEmpDepartment(empDeptObj) {
			return $http.post('/api/master/readEmpDepartment', empDeptObj).then(handleSuccess, handleError);
		}
		function removeEmpDepartment(empDeptID) {
			return $http.post('/api/master/removeEmpDepartment', empDeptID).then(handleSuccess, handleError);
		}
		function saveEmpDesignation(obj) {
			return $http.post('/api/master/saveEmpDesignation', obj).then(handleSuccess, handleError);
		}
		function updateEmpDesignation(obj) {
			return $http.put('/api/master/updateEmpDesignation', obj).then(handleSuccess, handleError);
		}
		function readEmpDesignation(empDesigObj) {
			return $http.post('/api/master/readEmpDesignation', empDesigObj).then(handleSuccess, handleError);
		}
		function removeEmpDesignation(empDesigID) {
			return $http.post('/api/master/removeEmpDesignation',empDesigID).then(handleSuccess, handleError);
		}
		function saveEmpHierarchy(obj) {
			return $http.post('/api/master/saveEmpHierarchy', obj).then(handleSuccess, handleError);
		}
		function readEmpHierarchy(obj) {
			return $http.post('/api/master/readEmpHierarchy', obj).then(handleSuccess, handleError);
		}
		function updateEmpHierarchy(obj) {
			return $http.put('/api/master/updateEmpHierarchy', obj).then(handleSuccess, handleError);
		}
		function removeEmpHierarchy(obj) {
			return $http.put('/api/master/removeEmpHierarchy', obj).then(handleSuccess, handleError);
		}
		function saveFinancialYear(obj) {
			return $http.post('/api/master/saveFinancialYear',obj).then(handleSuccess, handleError);
		}
		function readFinancialYear(obj) {
			return $http.post('/api/master/readFinancialYear', obj).then(handleSuccess, handleError);
		}
		function updateFinancialYear(obj) {
			return $http.put('/api/master/updateFinancialYear',obj).then(handleSuccess, handleError);
		}
		function deleteFinancialYear(obj) {
			return $http.put('/api/master/deleteFinancialYear',obj).then(handleSuccess, handleError);
		}
		function saveLedgerGroup(obj) {
			return $http.post('/api/master/saveLedgerGroup',obj).then(handleSuccess, handleError);
		}
		function readLedgerGroup(obj) {
			return $http.post('/api/master/readLedgerGroup', obj).then(handleSuccess, handleError);
		}
		function updateLedgerGroup(obj) {
			return $http.put('/api/master/updateLedgerGroup',obj).then(handleSuccess, handleError);
		}
		function deleteLedgerGroup(obj) {
			return $http.put('/api/master/deleteLedgerGroup',obj).then(handleSuccess, handleError);
		}
		function saveVisitType(obj) {
			return $http.post('/api/master/saveVisitType', obj).then(handleSuccess, handleError);
		}
		function readVisitType(obj) {
			return $http.post('/api/master/readVisitType', obj).then(handleSuccess, handleError);
		}
		function updateVisitType(obj) {
			return $http.put('/api/master/updateVisitType', obj).then(handleSuccess, handleError);
		}
		function removeVisitType(obj) {
			return $http.put('/api/master/removeVisitType', obj).then(handleSuccess, handleError);
		}
		function saveProductAttribute(obj) {
			return $http.post('/api/master/saveProductAttribute', obj).then(handleSuccess, handleError);
		}
		function readProductAttribute(obj) {
			return $http.post('/api/master/readProductAttribute', obj).then(handleSuccess, handleError);
		}
		function updateProductAttribute(obj) {
			return $http.put('/api/master/updateProductAttribute', obj).then(handleSuccess, handleError);
		}
		function removeProductAttribute(obj) {
			return $http.put('/api/master/removeProductAttribute', obj).then(handleSuccess, handleError);
		}
		
		// private functions
        function handleSuccess(res) {
        	return res;
        }
        
        function handleError(res) {
        	if(!res.data.redirect) {
        		return $q.reject(res);
        	} else {
        		console.log('INFO: Explicit redirection from server to: ' + res.data.redirect);
        		$window.location = res.data.redirect;
        	}
        }		
	}
})();
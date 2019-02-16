(function () {
	'use strict';
	angular.module('app').factory('InventoryService', inventoryService);

	function inventoryService($http,$q,$window) {
		
		var inventoryService = {};
		var purValue = undefined;
		
		inventoryService.readInvoiceNumber = readInvoiceNumber;
		inventoryService.readInventory = readInventory;
		inventoryService.readInventoryById = readInventoryById;
		inventoryService.readInventoryCode = readInventoryCode;
		inventoryService.readPurchaseInvoice = readPurchaseInvoice;
		inventoryService.savePurchase = savePurchase;
		inventoryService.readSalesInvoice = readSalesInvoice;
		inventoryService.saveSales = saveSales;
		inventoryService.readSalesReturnInvoice = readSalesReturnInvoice;
		inventoryService.saveSalesReturn = saveSalesReturn;
		inventoryService.readPurchaseItems = readPurchaseItems;
		inventoryService.readSalesItems = readSalesItems;
		inventoryService.readStockTransferInvoice = readStockTransferInvoice;
		inventoryService.saveStockTransfer = saveStockTransfer;
		inventoryService.removeStockTransfer = removeStockTransfer;
		inventoryService.readPurInvoices = readPurInvoices;
		inventoryService.readSalesInvoices = readSalesInvoices;
		inventoryService.readPurchaseAck = readPurchaseAck;
		inventoryService.savePurchaseAck = savePurchaseAck;
		inventoryService.readSales = readSales;
		inventoryService.setValue = setValue;
		inventoryService.getValue = getValue;
		inventoryService.stockStatus = stockStatus;
		inventoryService.stockRegister = stockRegister;
		inventoryService.activateIMEI = activateIMEI;
		inventoryService.readRDSstockSummary = readRDSstockSummary;
		inventoryService.readDealerStockSummary = readDealerStockSummary;
		inventoryService.readIMEIinventory = readIMEIinventory;
		inventoryService.readIMEIboxNumber = readIMEIboxNumber;
		inventoryService.IMEIstatus = IMEIstatus;
		inventoryService.IMEIduplication = IMEIduplication;
		inventoryService.rdsTertiarySummary = rdsTertiarySummary;
		inventoryService.removeRDSsaleInvoice = removeRDSsaleInvoice;
		inventoryService.removeRDSpurchaseInvoice = removeRDSpurchaseInvoice;
		inventoryService.removeBrandSaleInvoice = removeBrandSaleInvoice;
		inventoryService.removeBrandPurchaseInvoice = removeBrandPurchaseInvoice;
		inventoryService.updateInvoice = updateInvoice;
		inventoryService.rdsSecondarySummary = rdsSecondarySummary;
		inventoryService.saveSalesBills = saveSalesBills;
		inventoryService.readRdsSalesReport = readRdsSalesReport;
		inventoryService.rdsPrimarySummary = rdsPrimarySummary;
		inventoryService.savePurchaseDc = savePurchaseDc;
		inventoryService.removeBrandPurchaseDcInvoice = removeBrandPurchaseDcInvoice;
		inventoryService.savePurchaseDcBill = savePurchaseDcBill;
		inventoryService.saveSaleDcBill = saveSaleDcBill;
		inventoryService.saveSaleDc = saveSaleDc;
		inventoryService.rdsActivationReport = rdsActivationReport;
		inventoryService.rdsStockReport = rdsStockReport;
		inventoryService.dealerStockReport = dealerStockReport;
		inventoryService.dcStatus = dcStatus;

		return inventoryService;

		function readInvoiceNumber(obj) {
			return $http.post('/api/inventory/readInvoiceNumber', obj).then(handleSuccess, handleError);
		}
		
		function readInventory(obj) {
			return $http.post('/api/inventory/readInventory',obj).then(handleSuccess, handleError);
		}

		function readInventoryById(obj) {
			return $http.post('/api/inventory/readInventoryById',obj).then(handleSuccess, handleError);
		}

		function readInventoryCode(obj) {
			return $http.get('/api/inventory/readInventoryCode',obj).then(handleSuccess, handleError);
		}

		function readPurchaseInvoice() {
			return $http.get('/api/inventory/readPurchaseInvoice').then(handleSuccess, handleError);
		}

		function savePurchase(pur) {
			return $http.post('/api/inventory/savePurchase',pur).then(handleSuccess, handleError);
		}

		function readSalesInvoice() {
			return $http.get('/api/inventory/readSalesInvoice').then(handleSuccess, handleError);
		}

		function saveSales(sale) {
			return $http.post('/api/inventory/saveSales',sale).then(handleSuccess, handleError);
		}

		function readSalesReturnInvoice() {
			return $http.get('/api/inventory/readSalesReturnInvoice').then(handleSuccess, handleError);
		}

		function saveSalesReturn(obj) {
			return $http.post('/api/inventory/saveSalesReturn',obj).then(handleSuccess, handleError);
		}

		function readPurchaseItems(sp) {
			return $http.post('/api/inventory/readPurchaseItems',sp).then(handleSuccess, handleError);
		}

		function readSalesItems(obj) {
			return $http.post('/api/inventory/readSalesItems',obj).then(handleSuccess, handleError);
		}

		function readStockTransferInvoice() {
			return $http.get('/api/inventory/readStockTransferInvoice').then(handleSuccess, handleError);
		}

		function saveStockTransfer(trans) {
			return $http.post('/api/inventory/saveStockTransfer',trans).then(handleSuccess, handleError);
		}

		function removeStockTransfer(trans) {
			return $http.post('/api/inventory/removeStockTransfer',trans).then(handleSuccess, handleError);
		}

		function readPurInvoices(sup) {
			return $http.post('/api/inventory/readPurInvoices',sup).then(handleSuccess, handleError);
		}

		function readSalesInvoices(par) {
			return $http.post('/api/inventory/readSalesInvoices',par).then(handleSuccess, handleError);
		}
		
		function readPurchaseAck() {
			return $http.get('/api/inventory/readPurchaseAck').then(handleSuccess, handleError);
		}

		function savePurchaseAck(obj) {
			return $http.post('/api/inventory/savePurchaseAck',obj).then(handleSuccess, handleError);
		}

		function readSales() {
			return $http.get('/api/inventory/readSales').then(handleSuccess, handleError);
		}

		function stockStatus(obj) {
			return $http.post('/api/inventory/stockStatus', obj).then(handleSuccess, handleError);
		}

		function stockRegister(obj) {
			return $http.post('/api/inventory/stockRegister', obj).then(handleSuccess, handleError);
		}

		function activateIMEI(obj) {
			return $http.post('/api/inventory/activateIMEI',obj).then(handleSuccess, handleError);
		}

		function readRDSstockSummary(obj) {
			return $http.post('/api/inventory/readRDSstockSummary',obj).then(handleSuccess, handleError);
		}

		function readDealerStockSummary() {
			return $http.get('/api/inventory/readDealerStockSummary').then(handleSuccess, handleError);
		}

		function readIMEIinventory(obj){
			return $http.post('/api/inventory/readIMEIinventory', obj).then(handleSuccess, handleError);
		}

		function readIMEIboxNumber(obj){
			return $http.post('/api/inventory/readIMEIboxNumber', obj).then(handleSuccess, handleError);
		}

		function IMEIstatus(obj){
			return $http.post('/api/inventory/IMEIstatus', obj).then(handleSuccess, handleError);
		}

		function IMEIduplication(obj){
			return $http.post('/api/inventory/IMEIduplication', obj).then(handleSuccess, handleError);
		}

		function rdsTertiarySummary(obj){
			return $http.post('/api/inventory/rdsTertiarySummary', obj).then(handleSuccess, handleError);
		}

		function removeRDSsaleInvoice(obj){
			return $http.post('/api/inventory/removeRDSsaleInvoice', obj).then(handleSuccess, handleError);
		}

		function removeRDSpurchaseInvoice(obj){
			return $http.post('/api/inventory/removeRDSpurchaseInvoice', obj).then(handleSuccess, handleError);
		}

		function removeBrandSaleInvoice(obj){
			return $http.post('/api/inventory/removeBrandSaleInvoice', obj).then(handleSuccess, handleError);
		}

		function removeBrandPurchaseInvoice(obj){
			return $http.post('/api/inventory/removeBrandPurchaseInvoice', obj).then(handleSuccess, handleError);
		}

		function updateInvoice(obj){
			return $http.post('/api/inventory/updateInvoice', obj).then(handleSuccess, handleError);
		}

		function rdsSecondarySummary(obj){
			return $http.post('/api/inventory/rdsSecondarySummary', obj).then(handleSuccess, handleError);
		}

		function saveSalesBills(obj){
			return $http.post('/api/inventory/saveSalesBills', obj).then(handleSuccess, handleError);
		}

		function readRdsSalesReport(obj){
			return $http.post('/api/inventory/readRdsSalesReport', obj).then(handleSuccess, handleError);
		}

		function rdsPrimarySummary(obj){
			return $http.post('/api/inventory/rdsPrimarySummary', obj).then(handleSuccess, handleError);
		}

		function savePurchaseDc(obj) {
			return $http.post('/api/inventory/savePurchaseDc', obj).then(handleSuccess, handleError);
		}

		function removeBrandPurchaseDcInvoice(obj) {
			return $http.post('/api/inventory/removeBrandPurchaseDcInvoice', obj).then(handleSuccess, handleError);
		}

		function savePurchaseDcBill(obj) {
			return $http.post('/api/inventory/savePurchaseDcBill', obj).then(handleSuccess, handleError);
		}

		function saveSaleDc(obj) {
			return $http.post('/api/inventory/saveSaleDc', obj).then(handleSuccess, handleError);
		}

		function rdsActivationReport(obj) {
			return $http.post('/api/inventory/rdsActivationReport', obj).then(handleSuccess, handleError);
		}

		function rdsStockReport(obj) {
			return $http.post('/api/inventory/rdsStockReport', obj).then(handleSuccess, handleError);
		}

		function dealerStockReport(obj) {
			return $http.post('/api/inventory/dealerStockReport', obj).then(handleSuccess, handleError);
		}

		function saveSaleDcBill(obj) {
			return $http.post('/api/inventory/saveSaleDcBill', obj).then(handleSuccess, handleError);
		}

		function dcStatus(obj) {
			return $http.post('/api/inventory/dcStatus', obj).then(handleSuccess, handleError);
		}

		function setValue(po){
			purValue = po;
		}

		function getValue(){
			return purValue;
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
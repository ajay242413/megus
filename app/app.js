(function() {
    'use strict';

    angular.module('app', ['ui.router', 'vsGoogleAutocomplete', 'ui.bootstrap', 'ui.calendar', 'angular.filter', 'dynamicNumber', 'datatables', 'datatables.buttons', 'datatables.colvis', 'datatables.light-columnfilter', 'datatables.bootstrap', 'angucomplete-alt'])
        .config(config)
        .run(run)
        .service('CustomService', funcCustomService);

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            // *** DASHBOARD ***
            .state('dashboard', {
                url: '/',
                templateUrl: 'dashboard/dashboard.html',
                params: {headerName: 'Dashboard',menu1: "dashboard"},
                controller: 'dashboard.IndexController',
                controllerAs: 'vm'
            })
            .state('myProfile', {
                url: '/myProfile',
                templateUrl: 'dashboard/myProfile.html',
                params: {headerName: 'My Profile',menu1: "myProfile"},
                controller: 'MyProfile.IndexController',
                controllerAs: 'vm'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'dashboard/settings.html',
                params: {headerName: 'Settings',menu1: "settings"},
                controller: 'settings.IndexController',
                controllerAs: 'vm'
            })
            // *** INVOICE ***
            .state('invoice', {
                url: '/invoice',
                templateUrl: 'invoice/index.html'
            })
            .state('invoice.purchaseDc', {
                url: '/purchaseDc',
                templateUrl: 'invoice/purchaseDc.html',
                params: {headerName: 'Purchase DC',menu1: 'invoice',menu2: 'purchaseDc'},
                controller: 'PurchaseDc.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.addPurchaseDc', {
                url: '/addPurchaseDc',
                templateUrl: 'invoice/addPurchaseDc.html',
                params: {headerName: 'New Purchase DC',menu1: 'invoice',menu2: 'purchaseDc'},
                controller: 'AddPurchaseDc.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.dcPurchaseBill', {
                url: '/dcPurchaseBill',
                templateUrl: 'invoice/dcPurchaseBill.html',
                params: {headerName: 'Purchase DC Bill', obj:null, menu1: 'invoice',menu2: 'purchaseDc'},
                controller: 'DcPurchaseBill.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.saleDc', {
                url: '/saleDc',
                templateUrl: 'invoice/saleDc.html',
                params: {headerName: 'Sale DC',menu1: 'invoice',menu2: 'saleDc'},
                controller: 'SaleDc.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.addSaleDc', {
                url: '/addSaleDc',
                templateUrl: 'invoice/addSaleDc.html',
                params: {headerName: 'New Sale DC',menu1: 'invoice',menu2: 'saleDc'},
                controller: 'AddSaleDc.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.dcSaleBill', {
                url: '/dcSaleBill',
                templateUrl: 'invoice/dcSaleBill.html',
                params: {headerName: 'Sale DC Bill', obj:null, menu1: 'invoice',menu2: 'saleDc'},
                controller: 'DcSaleBill.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.sales', {
                url: '/sales',
                templateUrl: 'invoice/sales.html',
                params: {obj: null,headerName: 'Sales',menu1: 'invoice',menu2: 'sales'},
                controller: 'Sales.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.addSales', {
                url: '/sales/addSales',
                templateUrl: 'invoice/addSales.html',
                params: {obj: null,headerName: 'New Sales',menu1: 'invoice',menu2: 'sales'},
                controller: 'AddSales.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.rdsSales', {
                url: '/sales/rdsSales',
                templateUrl: 'invoice/rdsSales.html',
                params: {obj: null,headerName: 'New Sales',menu1: 'invoice',menu2: 'sales'},
                controller: 'RDSsales.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.purchase', {
                url: '/purchase',
                templateUrl: 'invoice/purchase.html',
                params: {headerName: 'Purchase',menu1: 'invoice',menu2: 'purchase'},
                controller: 'Purchase.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.addPurchase', {
                url: '/purchase/addPurchase',
                templateUrl: 'invoice/addPurchase.html',
                params: {obj: null,headerName: 'New Purchase',menu1: 'invoice',menu2: 'purchase'},
                controller: 'AddPurchase.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.importSalesBill', {
                url: '/importSalesBill',
                templateUrl: 'invoice/importSalesBill.html',
                params: {obj: null,headerName: 'Import Sales Bill',menu1: 'invoice',menu2: 'sales'},
                controller: 'ImportSalesBill.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.purchaseAcknowledgement', {
                url: '/purchaseAcknowledgement',
                templateUrl: 'invoice/purchaseAck.html',
                params: {obj: null,headerName: 'Purchase Acknowledgement',menu1: 'invoice',menu2: 'purchase'},
                controller: 'PurchaseAck.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.ackPurchase', {
                url: '/acknowledgementPurchase',
                templateUrl: 'invoice/ackPurchase.html',
                params: {obj: null,headerName: 'Acknowledgement Purchase',menu1: 'invoice',menu2: 'purchaseAcknowledgement'},
                controller: 'AckPurchase.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.editInvoice', {
                url: '/editInvoice',
                templateUrl: 'invoice/editInvoice.html',
                params: {obj: null,headerName: 'Edit Invoice',menu1: 'invoice',menu2: null},
                controller: 'EditInvoice.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.viewInvoice', {
                url: '/viewInvoice',
                templateUrl: 'invoice/viewInvoice.html',
                params: {obj: null,headerName: 'View Invoice',menu1: 'invoice',menu2: null},
                controller: 'ViewInvoice.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.stockTransfer', {
                url: '/stockTransfer',
                templateUrl: 'invoice/stockTransfer.html',
                params: {obj: null,headerName: 'Stock Transfer',menu1: 'invoice',menu2: 'stockTransfer'},
                controller: 'StockTransfer.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.viewTransfer', {
                url: '/viewStockTransfer',
                templateUrl: 'invoice/viewTransfer.html',
                params: {obj: null,headerName: 'View Stock Transfer',menu1: 'invoice',menu2: 'stockTransfer'},
                controller: 'ViewTransfer.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.addStockTransfer', {
                url: '/stockTransfer/addStockTransfer',
                templateUrl: 'invoice/addStockTransfer.html',
                params: {obj: null,headerName: 'New Stock Transfer',menu1: 'invoice',menu2: 'stockTransfer'},
                controller: 'AddStockTransfer.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.saleReturn', {
                url: '/saleReturn',
                templateUrl: 'invoice/saleReturn.html',
                params: {obj: null,headerName: 'Sale Return',menu1: 'invoice',menu2: 'saleReturn'},
                controller: 'SaleReturn.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.addSaleReturn', {
                url: '/addSaleReturn',
                templateUrl: 'invoice/addSaleReturn.html',
                params: {obj: null,headerName: 'New Sale Return',menu1: 'invoice',menu2: 'saleReturn'},
                controller: 'AddSaleReturn.IndexController',
                controllerAs: 'vm'
            })
            .state('invoice.purchaseReturn', {
                url: '/purchaseReturn',
                templateUrl: 'invoice/purchaseReturn.html',
                params: { obj: null, headerName: 'Purchase Return', menu1: 'invoice', menu2: 'purchaseReturn' },
                controller: 'PurchaseReturn.IndexController',
                controllerAs: 'vm'
            })
            // *** INVENTORY ***
            .state('inventory', {
                url: '/inventory',
                templateUrl: 'inventory/index.html'
            })
            .state('inventory.stockStatus', {
                url: '/stockStatus',
                templateUrl: 'inventory/stockStatus.html',
                params: {obj: null,headerName: 'Stock Status',menu1: 'inventory',menu2: 'stockStatus'},
                controller: 'StockStatus.IndexController',
                controllerAs: 'vm'
            })
            .state('inventory.stockRegister', {
                url: '/stockRegister',
                templateUrl: 'inventory/stockRegister.html',
                params: {obj: null,headerName: 'Stock Register',menu1: 'inventory',menu2: 'stockRegister'},
                controller: 'StockRegister.IndexController',
                controllerAs: 'vm'
            })
            .state('inventory.imeiLookup', {
                url: '/imeiLookup',
                templateUrl: 'inventory/IMEIlookup.html',
                params: { obj: null, headerName: 'IMEI Lookup', menu1: 'inventory', menu2: 'imeiLookup' },
                controller: 'IMEIlookup.IndexController',
                controllerAs: 'vm'
            })
            .state('inventory.imeiActivation', {
                url: '/imeiActivation',
                templateUrl: 'inventory/IMEIactivation.html',
                params: {obj: null,headerName: 'IMEI Activation',menu1: 'inventory',menu2: 'imeiActivation'},
                controller: 'IMEIActivation.IndexController',
                controllerAs: 'vm'
            })
            .state('inventory.dcStatus', {
                url: '/dcStatus',
                templateUrl: 'inventory/dcStatus.html',
                params: {obj: null,headerName: 'DC Status',menu1: 'inventory',menu2: 'dcStatus'},
                controller: 'DcStatus.IndexController',
                controllerAs: 'vm'
            })
            // *** IN-SIGHTS ***
            .state('insight', {
                url: '/insight',
                templateUrl: 'insight/index.html'
            })
            .state('insight.rdsPrimary', {
                url: '/rdsPrimary',
                templateUrl: 'insight/rdsPrimary.html',
                params: { obj: null, headerName: 'Model', menu1: 'insight', menu2: 'rdsPrimary' },
                controller: 'RDSprimary.IndexController',
                controllerAs: 'vm'
            })
            .state('insight.rdsSecondary', {
                url: '/rdsSecondary',
                templateUrl: 'insight/rdsSecondary.html',
                params: { obj: null, headerName: 'Dealers', menu1: 'insight', menu2: 'rdsSecondary' },
                controller: 'RDSsecondary.IndexController',
                controllerAs: 'vm'
            })
            .state('insight.rdsTertiary', {
                url: '/rdsTertiary',
                templateUrl: 'insight/rdsTertiary.html',
                params: { obj: null, headerName: 'RDS Overiew', menu1: 'insight', menu2: 'rdsTertiary' },
                controller: 'RDStertiary.IndexController',
                controllerAs: 'vm'
            })
            .state('insight.rdsStock', {
                url: '/rdsStock',
                templateUrl: 'insight/rdsStock.html',
                params: {obj: null,headerName: 'Overview',menu1: 'insight',menu2: 'rdsStock'},
                controller: 'RDSstock.IndexController',
                controllerAs: 'vm'
            })
            .state('insight.dealerStock', {
                url: '/dealerStock',
                templateUrl: 'insight/dealerStock.html',
                params: {obj: null,headerName: 'Dealer Stock',menu1: 'insight',menu2: 'dealerStock'},
                controller: 'DealerStock.IndexController',
                controllerAs: 'vm'
            })
            .state('insight.dealerTertiary', {
                url: '/dealerTertiary',
                templateUrl: 'insight/dealerTertiary.html',
                params: {obj: null,headerName: 'Dealer Tertiary',menu1: 'insight',menu2: 'dealerTertiary'},
                controller: 'DealerTertiary.IndexController',
                controllerAs: 'vm'
            })
            // *** ACCOUNTS ***
            .state('accounts', {
                url: '/accounts',
                templateUrl: 'accounts/index.html'
            })
            .state('accounts.credit', {
                url: '/credit',
                templateUrl: 'accounts/credit.html',
                params: {obj: null,headerName: 'Credit Note',menu1: 'accounts',menu2: 'credit'},
                controller: 'Accounts.Credit.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.debit', {
                url: '/debit',
                templateUrl: 'accounts/debit.html',
                params: {obj: null,headerName: 'Debit Note',menu1: 'accounts',menu2: 'debit'},
                controller: 'Accounts.Debit.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.payment', {
                url: '/payment',
                templateUrl: 'accounts/payment.html',
                params: {obj: null,headerName: 'Payment',menu1: 'accounts',menu2: 'payment'},
                controller: 'Accounts.Payment.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.addPayment', {
                url: '/addPayment',
                templateUrl: 'accounts/addPayment.html',
                params: {obj: null,headerName: 'Add Payment',menu1: 'accounts',menu2: 'payment'},
                controller: 'Accounts.AddPayment.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.receipt', {
                url: '/receipt',
                templateUrl: 'accounts/receipt.html',
                params: {obj: null,headerName: 'Receipt ',menu1: 'accounts',menu2: 'receipt'},
                controller: 'Accounts.Receipt.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.addReceipt', {
                url: '/addReceipt',
                templateUrl: 'accounts/addReceipt.html',
                params: {obj: null,headerName: 'Add Receipt',menu1: 'accounts',menu2: 'receipt'},
                controller: 'Accounts.AddReceipt.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.ledger', {
                url: '/ledger',
                templateUrl: 'accounts/ledger.html',
                params: {obj: null,headerName: 'Ledger',menu1: 'accounts',menu2: 'ledger'},
                controller: 'Accounts.Ledger.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.ledgerStatement', {
                url: '/ledger/ledgerStatement',
                templateUrl: 'accounts/ledgerStatement.html',
                params: {obj: null,headerName: 'Ledger Statement',menu1: 'accounts',menu2: 'ledger'},
                controller: 'Accounts.LedgerStatement.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.journal', {
                url: '/journal',
                templateUrl: 'accounts/journal.html',
                params: {obj: null,headerName: 'Journal',menu1: 'accounts',menu2: 'journal'},
                controller: 'Accounts.Journal.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.contra', {
                url: '/contra',
                templateUrl: 'accounts/contra.html',
                params: {obj: null,headerName: 'Contra',menu1: 'accounts',menu2: 'contra'},
                controller: 'Accounts.Contra.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.referenceJournal', {
                url: '/referenceJournal',
                templateUrl: 'accounts/referenceJournal.html',
                params: {obj: null,headerName: 'Reference Journal',menu1: 'accounts',menu2: 'referenceJournal'},
                controller: 'Accounts.ReferenceJournal.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.addReferenceJournal', {
                url: '/addReferenceJournal',
                templateUrl: 'accounts/addReferenceJournal.html',
                params: {obj: null,headerName: 'New Reference Journal',menu1: 'accounts',menu2: 'referenceJournal'},
                controller: 'Accounts.AddReferenceJournal.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.viewReferenceJournal', {
                url: '/viewReferenceJournal',
                templateUrl: 'accounts/viewReferenceJournal.html',
                params: {obj: null,headerName: 'View Reference Journal',menu1: 'accounts',menu2: 'referenceJournal'},
                controller: 'Accounts.ViewReferenceJournal.IndexController',
                controllerAs: 'vm'
            })
            .state('accounts.cheque', {
                url: '/cheque',
                templateUrl: 'accounts/cheque.html',
                params: {obj: null,headerName: 'Cheque',menu1: 'accounts',menu2: 'cheque'},
                controller: 'Accounts.Cheque.IndexController',
                controllerAs: 'vm'
            })
            // *** HR ***
            .state('HR', {
                url: '/HR',
                templateUrl: 'HR/index.html'
            })
            .state('HR.employee', {
                url: '/employee',
                templateUrl: 'HR/employee.html',
                params: {headerName: 'HR',menu1: 'HR',menu2: 'employee'},
                controller: 'Employee.IndexController',
                controllerAs: 'vm'
            })
            .state('HR.addEmployee', {
                url: '/addEmployee',
                templateUrl: 'HR/addEmployee.html',
                params: {obj: null,headerName: 'New HR',menu1: 'HR',menu2: 'employee'},
                controller: 'HR.AddEmployee.IndexController',
                controllerAs: 'vm'
            })
            .state('HR.expenses', {
                url: '/expenses',
                templateUrl: 'HR/expenses.html',
                params: {headerName: 'Expenses',menu1: 'HR',menu2: 'expenses'},
                controller: 'HR.Expenses.IndexController',
                controllerAs: 'vm'
            })
            // *** JOURNEY ***
            .state('journey', {
                url: '/journey',
                templateUrl: 'journey/index.html'
            })
            .state('journey.liveTracking', {
                url: '/liveTracking',
                templateUrl: 'journey/liveTracking.html',
                params: {headerName: 'Live Tracking',menu1: 'journey',menu2: 'liveTracking'},
                controller: 'Journey.LiveTracking.IndexController',
                controllerAs: 'vm'
            })
            .state('journey.journeyPlan', {
                url: '/journeyPlan',
                templateUrl: 'journey/journeyPlan.html',
                params: {obj: null, headerName: 'Journey Plan',menu1: 'journey',menu2: 'journeyPlan'},
                controller: 'Journey.JourneyPlan.IndexController',
                controllerAs: 'vm'
            })
            .state('journey.newPlan', {
                url: '/newPlan',
                templateUrl: 'journey/newPlan.html',
                params: {obj: null,headerName: 'New Plan',menu1: 'journey',menu2: 'journeyPlan'},
                controller: 'Journey.NewPlan.IndexController',
                controllerAs: 'vm'
            })
            .state('journey.bulkAssign', {
                url: '/bulkAssign',
                templateUrl: 'journey/bulkAssign.html',
                params: {headerName: 'Bulk Assign',menu1: 'journey',menu2: 'journeyPlan'},
                controller: 'Journey.BulkAssign.IndexController',
                controllerAs: 'vm'
            })
            .state('journey.journeyReports', {
                url: '/journeyReports',
                templateUrl: 'journey/journeyReports.html',
                params: {headerName: 'Reports',menu1: 'journey',menu2: 'journeyReports'},
                controller: 'Journey.JourneyReports.IndexController',
                controllerAs: 'vm'
            })
            // *** MASTER ***
            .state('master', {
                url: '/master',
                abstract: true,
                templateUrl: 'master/index.html'
            })
            .state('master.client', {
                url: '/client',
                templateUrl: 'master/client.html',
                params: {obj: null,headerName: 'Client',menu1: 'master',menu2: 'client'},
                controller: 'Master.Client.IndexController',
                controllerAs: 'vm'
            })
            .state('master.addClient', {
                url: '/client/addClient',
                templateUrl: 'master/addClient.html',
                params: {obj: null,headerName: 'New Client',menu1: 'master',menu2: 'client'},
                controller: 'Master.AddClient.IndexController',
                controllerAs: 'vm'
            })
            .state('master.dealer', {
                url: '/dealer',
                templateUrl: 'master/dealer.html',
                params: {obj:null, headerName:'Dealer', menu1:'master', menu2:'dealer'},
                controller: 'Master.Dealer.IndexController',
                controllerAs: 'vm'
            })
            .state('master.addDealer', {
                url: '/dealer/addDealer',
                templateUrl: 'master/addDealer.html',
                params: {obj: null,headerName: 'New Dealer',menu1: 'master',menu2: 'dealer'},
                controller: 'Master.AddDealer.IndexController',
                controllerAs: 'vm'
            })
            .state('master.importDealer', {
                url: '/dealer/importDealer',
                templateUrl: 'master/importDealer.html',
                params: {obj: null,headerName: 'Import Dealer',menu1: 'master',menu2: 'dealer'},
                controller: 'Master.ImportDealer.IndexController',
                controllerAs: 'vm'
            })
            .state('master.product', {
                url: '/product',
                templateUrl: 'master/product.html',
                params: {obj: null,headerName: 'Products',menu1: 'master',menu2: 'product'},
                controller: 'Product.IndexController',
                controllerAs: 'vm'
            })
            .state('master.supplier', {
                url: '/supplier',
                templateUrl: 'master/supplier.html',
                params: {obj: null,headerName: 'Supplier',menu1: 'master',menu2: 'supplier'},
                controller: 'Supplier.IndexController',
                controllerAs: 'vm'
            })
            .state('master.newSupplier', {
                url: '/supplier/newSupplier',
                templateUrl: 'master/newSupplier.html',
                params: {obj: null,headerName: 'New Supplier',menu1: 'master',menu2: 'supplier'},
                controller: 'Supplier.New.IndexController',
                controllerAs: 'vm'
            })
            .state('master.accounts', {
                url: '/accounts',
                templateUrl: 'master/accounts.html',
                params: {obj: null,headerName: 'Master Accounts',menu1: 'master',menu2: 'accounts'},
                controller: 'Accounts.IndexController',
                controllerAs: 'vm'
            })
            .state('master.hr', {
                url: '/HR',
                templateUrl: 'master/hr.html',
                params: {obj: null,headerName: 'Master HR',menu1: 'master',menu2: 'hr'},
                controller: 'HRMaster.IndexController',
                controllerAs: 'vm'
            })
            .state('master.generalMaster', {
                url: '/general',
                templateUrl: 'master/general.html',
                params: {obj: null,headerName: 'General Master',menu1: 'master',menu2: 'generalMaster'},
                controller: 'General.IndexController',
                controllerAs: 'vm'
            })
            // *** REPORT ***
            .state('reports', {
                url: '/reports',
                abstract: true,
                templateUrl: 'reports/index.html'
            })
            .state('reports.geo', {
                url: '/geo',
                templateUrl: 'reports/geo.html',
                params: {obj: null,headerName: 'GEO',menu1: 'reports',menu2: 'geo'},
                controller: 'GEO.IndexController',
                controllerAs: 'vm'
            })
            .state('reports.rdsPrimaryReport', {
                url: '/rdsPrimaryReport',
                templateUrl: 'report/rdsPrimaryReport.html',
                params: {obj: null,headerName: 'RDS Primary Report',menu1: 'report',menu2: 'rdsPrimaryReport'},
                controller: 'RdsPrimaryReport.IndexController',
                controllerAs: 'vm'
            })
            .state('reports.rdsSecondaryReport', {
                url: '/rdsSecondaryReport',
                templateUrl: 'report/rdsSecondaryReport.html',
                params: {obj: null,headerName: 'RDS Secondary Report',menu1: 'report',menu2: 'rdsPrimaryReport'},
                controller: 'RdsSecondaryReport.IndexController',
                controllerAs: 'vm'
            })
            .state('reports.rdsActivationReport', {
                url: '/rdsActivationReport',
                templateUrl: 'report/rdsActivationReport.html',
                params: {obj: null,headerName: 'RDS Activation Report',menu1: 'report',menu2: 'rdsPrimaryReport'},
                controller: 'RdsActivationReport.IndexController',
                controllerAs: 'vm'
            })
            .state('reports.rdsStockReport', {
                url: '/rdsStockReport',
                templateUrl: 'report/rdsStockReport.html',
                params: {obj: null,headerName: 'RDS Stock Report',menu1: 'report',menu2: 'rdsPrimaryReport'},
                controller: 'RdsStockReport.IndexController',
                controllerAs: 'vm'
            })
            .state('reports.dealerStockReport', {
                url: '/dealerStockReport',
                templateUrl: 'report/dealerStockReport.html',
                params: {obj: null,headerName: 'Dealer Stock Report',menu1: 'report',menu2: 'dealerStockReport'},
                controller: 'DealerStockReport.IndexController',
                controllerAs: 'vm'
            })
            .state('reports.performance', {
                url: '/performance',
                templateUrl: 'report/performance.html',
                params: {obj: null,headerName: 'Performance',menu1: 'report',menu2: 'dealerStockReport'},
                controller: 'Performance.IndexController',
                controllerAs: 'vm'
            })
            .state('reports.scheme', {
                url: '/scheme',
                templateUrl: 'report/scheme.html',
                params: {obj: null,headerName: 'Scheme',menu1: 'report',menu2: 'schema'},
                controller: 'Scheme.IndexController',
                controllerAs: 'vm'
            })
        // default route
        $urlRouterProvider
        .otherwise("/");
    }

    function run($http, $rootScope, $window, $stateParams, SettingService, UserService) {
        $rootScope.stateObj = $stateParams;
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
        $rootScope.logoUrl = "../img/faces/face-1.jpg";
        UserService.getCurrentUser().then(function(user) {
            $rootScope.rootUser = user.data;
        });
        SettingService.readSetting().then(function(res){
            if(res.data.length){
                if(res.data[0].company){
                    $rootScope.rootProfile = res.data[0].company;
                    if($rootScope.rootProfile.logo){
                        $rootScope.logoUrl = '../upload_files/logo/' + $rootScope.rootProfile.logo;
                    }
                }
            }
        });
    }

    function funcCustomService() {
        var result = null;

        this.getObject = function(theObject, strProp, strLedger) {
            if(theObject instanceof Array) {
                theObject.map(item => {
                    result = this.getObject(item, strProp, strLedger);
                });
            } else if(theObject instanceof Object) {
                for(var prop in theObject) {
                    if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                        result = this.getObject(theObject[prop], strProp, strLedger);
                    }
                    if(prop === strProp) {
                        if(theObject[prop] == strLedger) {
                            return theObject;
                        }
                    }
                }
            }
            return result;
        }
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['app']);
        });
    });
})();

(function () {
	'use strict';
	angular.module('app').factory('ExcelService', excelService);

	function excelService($window) {
		
		var excelService = {};
		
        excelService.exportXLSX = exportXLSX;
        excelService.exportCSV = exportCSV;
        excelService.exportTable = exportTable;
        excelService.excelToJSON = excelToJSON;
		
		return excelService;
		
		function exportXLSX(sheetName,excelName,data){
            /* this line is only needed if you are not adding a script tag reference */
            if(typeof XLSX == 'undefined') 
                XLSX = require('xlsx');
            /* make the worksheet */
            var ws = XLSX.utils.json_to_sheet(data);
            /* add to workbook */
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            /* write workbook (use type 'binary') */
            var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
            /* generate a download */
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelName + ".xlsx");
        }

        function exportCSV(JSONData, ReportTitle, ShowLabel){
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';    
            CSV += ReportTitle + '\r\n\n';
            if (ShowLabel) {
                var row = ""; 
                for (var index in arrData[0]) {  
                    row += index + ',';
                }
                row = row.slice(0, -1);
                CSV += row + '\r\n';
            }
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);
                CSV += row + '\r\n';
            }
            if (CSV == '') {        
                alert("Invalid data");
                return;
            }   
            var fileName = ShowLabel;
            // fileName += ReportTitle.replace(/ /g,"_");   
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            var link = document.createElement("a");    
            link.href = uri;
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function exportTable(tableId,worksheetName){
            var uri = 'data:application/vnd.ms-excel;base64,';
            var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
            var base64 = function(s){
                return $window.btoa(unescape(encodeURIComponent(s)));
            }
            var format = function(s,c){
                return s.replace(/{(\w+)}/g,
                function(m,p){
                    return c[p];
                })
            }
            var table = $(tableId);
            var ctx = {
                worksheet:worksheetName,
                table:table.html()
            };
            var link = document.createElement("a");
            link.download = worksheetName + ".xls";
            link.href = uri + base64(format(template, ctx))
            link.click();
        }

        function excelToJSON(file){
            if(file){
                var reader = new FileReader();
                reader.onload = function(e){
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var sheetName = workbook.SheetNames[0];
                    var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if(excelData){
                        return excelData;
                    }
                }
                reader.onerror = function(ex){
                    return "Error";
                }
                reader.readAsBinaryString(file);
            }
        }
	}

})();
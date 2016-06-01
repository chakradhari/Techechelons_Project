// fetching data from details.txt file
var fetchDetails = function() {
  var xmlhttp = new XMLHttpRequest();
  var url = "details.txt";

  xmlhttp.onreadystatechange = function () {
    if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      var myArr = JSON.parse(xmlhttp.responseText);
      if(myArr !== '' && myArr) {
        initialArray(myArr);
        printDetails(myArr);
        filter(myArr);
      }
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
};

fetchDetails();

// This is to print options for filtering in the dropdown all the unique options
var filter = function(myArr) {
  var details = myArr;
  var newArr = [];
  details.forEach(function(value, key) {
    newArr.push(value.paymentStatus);
  })
  newArr = newArr.sort();
  var uniqueArray = [newArr[0]];
  for(var i = 1; i < newArr.length; i++) {
    if(newArr[i-1] !== newArr[i]) {
      uniqueArray.push(newArr[i]);
    }
  }
  uniqueArray.forEach(function(value, key) {
    var x = document.createElement("OPTION");
    x.setAttribute("value", value);
    var t = document.createTextNode(value);
    x.appendChild(t);
    document.getElementById('filterList').appendChild(x);
  })
};

var currentPage = 1;
var pages = 0;

var mainArray = [];
var currentArray = [];

// Saved the root array for later use
var initialArray = function(myArr) {
  mainArray = myArr;
};

// For Printing Table data initially when the page loads
var printDetails = function (myArr) {
  var details = myArr;
  currentArray = myArr;
  var table = document.querySelector("#paymentDetails");
  deleteRows();
  details.forEach(function(value, key) {
    var row = table.insertRow(key+1);
    for(var rowData in value) {
      var cell = row.insertCell(rowData);
      cell.innerHTML = value[rowData];
    }
  })
  init();
};

// Refreshing the table when an update for the rows has been made
var deleteRows = function () {
  var rowCount = paymentDetails.rows.length;
  console.log(rowCount);
  if(rowCount > 1) {
    for (var i = rowCount - 1; i > 0; i--) {
            paymentDetails.deleteRow(i);
        }
  }
}

// initializing records for pagination
 var init = function() {
   var rows = document.querySelector("#paymentDetails").rows;
   var records = rows.length-1;
   var numberofItemsPerPage = document.getElementById('numberOfitems').value;
   pages = Math.ceil(records/numberofItemsPerPage);
   printNav();
 };

// Updating the pagination DOM
 var printNav = function () {
   var element = document.querySelector("#pageNavPosition");
   var pagerHTML = '';
   for(var page = 1; page <= pages; page++) {
     pagerHTML += '<span onclick="showPage('+ page +')" class="navigation">' + page + '</span>';
   }
   element.innerHTML = pagerHTML;
   showPage(1);
 };
// To display number of records
 var showPage = function(pageNumber) {
   var numberofItemsPerPage = parseInt(document.getElementById('numberOfitems').value, 10);
   var cuurentPage = pageNumber;
   var from = (pageNumber - 1) * numberofItemsPerPage + 1;
   var to = from + numberofItemsPerPage - 1;
   console.log(from +" " +to);
   displayRecords(from, to);
 };

// Display updated records as per itemsPerPage

 var displayRecords = function(from, to) {
   var rows = document.querySelector("#paymentDetails").rows;
   for (var i = 1; i < rows.length; i++) {
       if (i < from || i > to)
           rows[i].style.display = 'none';
       else
           rows[i].style.display = '';
   }
 };

// Triggering this function when ever there is a change in filter select value
 var filterTable = function() {
   var filterValue = document.getElementById('filterList').value;
   var details = mainArray;
   var newArr = [];
   if(filterValue !== "") {
     details.forEach(function(value, key) {
       if(value.paymentStatus === filterValue) {
         console.log(value);
         newArr.push(value);
       }
     })
     console.log(newArr);
    printDetails(newArr);
   }
   else {
    printDetails(details);
   }
 };

 // Sorting the columns
 var counter = 0;
 var sort_table = function (sortValue) {
   var currentArr = currentArray;
   var bufferArray = [];
   var updatedArr = [];

   if(counter%2 === 0) {
     currentArr.forEach(function(value, key) {
       bufferArray.push(value[sortValue]);
     })
     bufferArray.sort(function(a, b) { return a-b });
     bufferArray.forEach(function(Pvalue, key) {
       currentArr.forEach(function(Cvalue, key) {
         if(Pvalue === Cvalue[sortValue]) {
           updatedArr.push(Cvalue);
         }
       })
     })
     printDetails(updatedArr);
     counter++;
   }

   else {

     currentArr.forEach(function(value, key) {
       bufferArray.push(value[sortValue]);
     })

     bufferArray.sort(function(a, b) { return b-a });

     bufferArray.forEach(function(Pvalue, key) {
       currentArr.forEach(function(Cvalue, key) {
         if(Pvalue === Cvalue[sortValue]) {
           updatedArr.push(Cvalue);
         }
       })
     })
     printDetails(updatedArr);
     counter++;
   }
 }

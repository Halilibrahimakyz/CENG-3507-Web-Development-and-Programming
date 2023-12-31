// Load student data when the page is loaded
window.onload = function() {
    loadStudentsFromLocalStorage();
};

// Function to display the student modal
function openStudentModal() {
    document.getElementById("studentModal").style.display = "block";
}

// Function to close the student modal
function closeStudentModal() {
    document.getElementById("studentModal").style.display = "none";
}

// Variables for tracking selected row index and temporary data
var selectedRowIndex;
var temp;

// Function to open the edit modal for a student
function openEditModal(button) {
    var row = button.parentNode.parentNode;
    selectedRowIndex = row.rowIndex;

    var StudendIdValue = row.cells[0].innerText;
    var StudentNameValue = row.cells[1].innerText;
    var StudentSurnameValue = row.cells[2].innerText;
    
    document.getElementById("editStudentId").value = StudendIdValue;
    document.getElementById("editStudentName").value = StudentNameValue;
    document.getElementById("editStudentSurname").value = StudentSurnameValue;
    temp=StudentNameValue + " " + StudentSurnameValue
    document.getElementById("editModal").style.display = "block";
}

// Function to update student data
function updateStudent() {

    var editStudendIdValue = document.getElementById("editStudentId").value;
    var editStudentNameValue = document.getElementById("editStudentName").value;
    var editStudentSurnameValue = document.getElementById("editStudentSurname").value;

    if (editStudendIdValue && editStudentNameValue && editStudentSurnameValue) {

        var table = document.getElementById("studentTable");
        var row = table.rows[selectedRowIndex];

        row.cells[0].innerHTML = editStudendIdValue;
        row.cells[1].innerHTML = editStudentNameValue;
        row.cells[2].innerHTML = editStudentSurnameValue;

        saveStudentsToLocalStorage();
        changeStudentsGradeToLocalStorage(editStudentNameValue,editStudentSurnameValue)
        closeEditModal();
    } else {
        alert("Please enter valid numeric values for Midterm and Final.");
    }
}

// Function to close the edit modal
function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// Function to add a new student to the table
function addStudent() {

    var idValue = document.getElementById("studentIdInput").value;
    var nameValue = document.getElementById("studentNameInput").value;
    var surnameValue = document.getElementById("studentSurnameInput").value;

    if (idValue && nameValue) {
        
        var table = document.getElementById("studentTable");
        var tbody = document.getElementById("studentTableBody");

        var newRow = tbody.insertRow();
        var idCell = newRow.insertCell(0);
        var nameCell = newRow.insertCell(1);
        var surnameCell = newRow.insertCell(2);

        var actionCell = newRow.insertCell(3);

        idCell.innerHTML = idValue;
        nameCell.innerHTML = nameValue;
        surnameCell.innerHTML = surnameValue;
        
        actionCell.innerHTML = '<button onclick="deleteStudent(this)" style="margin-right: 5px;">Delete</button>' +
        '<button onclick="openEditModal(this)" style="margin-right: 5px;">Edit</button>' +
        '<button onclick="openStudentViewModal(this)">View</button>';

        closeStudentModal();
        saveStudentsToLocalStorage();
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to delete a student from the table
function deleteStudent(button) {
    var row = button.parentNode.parentNode;
    var studentID = row.cells[0].innerText;
    var firstName = row.cells[1].innerText;
    var lastName = row.cells[2].innerText;

  
    row.parentNode.removeChild(row);

    saveStudentsToLocalStorage();
    deleteStudentsGradeToLocalStorage(firstName,lastName)
}

// Function to save student data to local storage
function saveStudentsToLocalStorage() {

    var tableRows = document.getElementById("studentTableBody").getElementsByTagName("tr");
    var data = [];

    for (var i = 0; i < tableRows.length; i++) {
        var cells = tableRows[i].getElementsByTagName("td");
        var rowData = {
            id: cells[0].innerText,
            name: cells[1].innerText,
            surname: cells[2].innerText,
        };
        data.push(rowData);
    }

    localStorage.setItem("studentData", JSON.stringify(data));
}

// Function to update associated grades in local storage with the new name and surname
function changeStudentsGradeToLocalStorage(name,surname) {
    
    var storedData = localStorage.getItem("gradeData");

    if (storedData) {
        var data = JSON.parse(storedData);

        for (var i = 0; i < data.length; i++) {
            if (data[i].gradeStudent === temp) {
                data[i].gradeStudent= name + " " + surname
              }
        }
        localStorage.setItem("gradeData", JSON.stringify(data));
        
    }
    
}

// Function to delete associated grades from local storage using the name and surname
function deleteStudentsGradeToLocalStorage(name,surname) {

    var storedData = localStorage.getItem("gradeData");

    if (storedData) {
       
        var data = JSON.parse(storedData);

        var newData = data.filter(function(item) {
            return item.gradeStudent !== name + " " + surname;
        });
    
        localStorage.setItem("gradeData", JSON.stringify(newData));
    }
    
}

// Function to load student data from local storage and populate the table
function loadStudentsFromLocalStorage() {

    var storedData = localStorage.getItem("studentData");

    if (storedData) {
        var data = JSON.parse(storedData);

        document.getElementById("studentTableBody").innerHTML = "";

        for (var i = 0; i < data.length; i++) {

            var newRow = document.getElementById("studentTableBody").insertRow();
            var idCell = newRow.insertCell(0);
            var nameCell = newRow.insertCell(1);
            var surnameCell = newRow.insertCell(2);
            var actionCell = newRow.insertCell(3);

            idCell.innerHTML = data[i].id;
            nameCell.innerHTML = data[i].name;
            surnameCell.innerHTML = data[i].surname;

            actionCell.innerHTML = '<button onclick="deleteStudent(this)" style="margin-right: 5px;">Delete</button>' +
            '<button onclick="openEditModal(this)" style="margin-right: 5px;">Edit</button>' +
            '<button onclick="openStudentViewModal(this)">View</button>';
        }
    }
}

// Function to open the student view modal and display associated grades
function openStudentViewModal(button) {

    var row = button.parentNode.parentNode;
    selectedRowIndex = row.rowIndex;

    var studentNameValue = row.cells[1].innerText;
    var studentSurnameValue = row.cells[2].innerText;

    var storedData = localStorage.getItem("gradeData");
    
    if (storedData) {

        var data = JSON.parse(storedData);
        var tableBody = document.getElementById("StudentWithTableBody");
        tableBody.innerHTML = "";

        for (var i = 0; i < data.length; i++) {

            if (data[i].gradeStudent == studentNameValue + " " +studentSurnameValue) {

                var newRow = tableBody.insertRow();
                var gradeCourseCell = newRow.insertCell(0);
                var gradeStudentCell = newRow.insertCell(1);
                var midtermCell = newRow.insertCell(2);
                var finalCell = newRow.insertCell(3);
                var avarageCell = newRow.insertCell(4);
                var letterGradeCell = newRow.insertCell(5);

                gradeCourseCell.innerHTML = data[i].gradeCourse;
                gradeStudentCell.innerHTML = data[i].gradeStudent;
                midtermCell.innerHTML = data[i].midterm;
                finalCell.innerHTML = data[i].final;
                avarageCell.innerHTML = data[i].avarage;
                letterGradeCell.innerHTML = data[i].letterGrade;
            }
        }

        calculateAndAppendGeneralAverageStudent();
    }

    document.getElementById("viewStudentModal").style.display = "block";
}

// Function to calculate and display the general average of the student
function calculateAndAppendGeneralAverageStudent() {
    var tableBody = document.getElementById("StudentWithTableBody");
    var rows = tableBody.getElementsByTagName("tr");
    var totalAverage = 0;

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        var averageValue = parseFloat(cells[4].innerText);
        totalAverage += averageValue;
    }

    var generalAverage = (rows.length > 0) ? totalAverage / rows.length : 0;
    var generalAverageRow = document.getElementById("generalAverageRow");
    var generalAverageValue = document.getElementById("generalAverageValue");
    
    generalAverageValue.innerText = generalAverage.toFixed(2);
}

// Function to close the student view modal
function closeCourseViewModal() {
    document.getElementById("viewStudentModal").style.display = "none";
}

// Function to search for students in the table based on input
function searchStudents() {

    var input = document.getElementById("searchInputStudent");
    var filter = input.value.toUpperCase();

    var table = document.getElementById("studentTable");
    var tbody = table.getElementsByTagName("tbody")[0];
    var rows = tbody.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        var name = cells[1].innerText.toUpperCase();

        if (name.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

// Function to sort the student table based on the selected column
function sortTableStudents(columnIndex) {

    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("studentTable");
    switching = true;

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("td")[columnIndex];
            y = rows[i + 1].getElementsByTagName("td")[columnIndex];

            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
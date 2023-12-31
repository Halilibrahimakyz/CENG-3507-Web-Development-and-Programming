// Load grade data when the page is loaded
window.onload = function () {
    loadGradesFromLocalStorage();
};

// Function to display the grade modal and set input options
function openGradeModal() {
    document.getElementById("gradeModal").style.display = "block";
    setInputs();
}

// Function to close the grade modal
function closeGradeModal() {
    document.getElementById("gradeModal").style.display = "none";
}

// Variable to track selected row index
var selectedRowIndex;

// Function to open the edit modal for a grade
function openEditModal(button) {

    var row = button.parentNode.parentNode;
    selectedRowIndex = row.rowIndex;

    var gradeCourseValue = row.cells[0].innerText;
    var gradeStudentValue = row.cells[1].innerText;
    var midtermValue = row.cells[2].innerText;
    var finalValue = row.cells[3].innerText;

    document.getElementById("editGradeCourse").value = gradeCourseValue;
    document.getElementById("editGradeStudent").value = gradeStudentValue;
    document.getElementById("editMidterm").value = midtermValue;
    document.getElementById("editFinal").value = finalValue;
    document.getElementById("editModal").style.display = "block";
}

// Function to update grade data
function updateGrade() {
    var editGradeCourseValue = document.getElementById("editGradeCourse").value;
    var editMidtermValue = document.getElementById("editMidterm").value;
    var editFinalValue = document.getElementById("editFinal").value;

    if (!isNaN(editMidtermValue) && !isNaN(editFinalValue)) {

        var table = document.getElementById("gradeTable");
        var row = table.rows[selectedRowIndex];

        row.cells[2].innerHTML = editMidtermValue;
        row.cells[3].innerHTML = editFinalValue;
        var grades =calculateLetterGrade(editMidtermValue, editFinalValue, editGradeCourseValue);
        row.cells[4].innerHTML = grades.avarageGrade;;
        row.cells[5].innerHTML =  grades.letterGrade;;

        saveGradesToLocalStorage();

        closeEditModal();
    } else {
        alert("Please enter valid numeric values for Midterm and Final.");
    }
}

// Function to close the edit modal
function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// Function to set input options based on stored course and student data
function setInputs() {

    var storedCourseData = localStorage.getItem('courseData');
    var storedStudentData = localStorage.getItem('studentData');

    if (storedCourseData) {

        var selectElement = document.getElementById('gradeCourseInput');
        if (selectElement) {

            while (selectElement.options.length > 0) {
                selectElement.remove(0);
            }
        }
        var courseData = JSON.parse(storedCourseData);

        courseData.forEach(function (course) {

            var optionElement = document.createElement('option');
            optionElement.value = course.name;
            optionElement.textContent = course.name;
            selectElement.appendChild(optionElement);

        });
    }

    if (storedStudentData) {

        var selectElement = document.getElementById('gradeStudentInput');
        if (selectElement) {

            while (selectElement.options.length > 0) {
                selectElement.remove(0);
            }
        }
        var studentData = JSON.parse(storedStudentData);

        studentData.forEach(function (student) {

            var optionElement = document.createElement('option');
            optionElement.value = student.name + " " + student.surname;
            optionElement.textContent = student.name + " " + student.surname;
            selectElement.appendChild(optionElement);

        });
    }
}

// Function to add a new grade to the table
function addGrade() {

    var gradeCourseValue = document.getElementById("gradeCourseInput").value;
    var gradeStudentValue = document.getElementById("gradeStudentInput").value;
    var midtermValue = document.getElementById("midtermInput").value;
    var finalValue = document.getElementById("finalInput").value;

    if (gradeCourseValue && gradeStudentValue) {

        var table = document.getElementById("gradeTable");
        var tbody = document.getElementById("gradeTableBody");

        var newRow = tbody.insertRow();
        var gradeCourseCell = newRow.insertCell(0);
        var gradeStudentCell = newRow.insertCell(1);
        var midtermCell = newRow.insertCell(2);
        var finalCell = newRow.insertCell(3);
        var avarageCell = newRow.insertCell(4);

        var letterGradeCell = newRow.insertCell(5);
        var actionCell = newRow.insertCell(6);

        gradeCourseCell.innerHTML = gradeCourseValue;
        gradeStudentCell.innerHTML = gradeStudentValue;
        midtermCell.innerHTML = midtermValue;
        finalCell.innerHTML = finalValue;
        var grades =calculateLetterGrade(midtermValue, finalValue, gradeCourseValue);
        avarageCell.innerHTML = grades.avarageGrade;

        letterGradeCell.innerHTML = grades.letterGrade;

        actionCell.innerHTML = '<button onclick="deleteGrade(this)" style="margin-right: 5px;">Delete</button>' +
        '<button onclick="openEditModal(this)">Edit</button>';
        closeGradeModal();
        saveGradesToLocalStorage();
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to delete a grade from the table
function deleteGrade(button) {

    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    saveGradesToLocalStorage();
}

// Function to save grade data to local storage
function saveGradesToLocalStorage() {

    var tableRows = document.getElementById("gradeTableBody").getElementsByTagName("tr");
    var data = [];
    for (var i = 0; i < tableRows.length; i++) {

        var cells = tableRows[i].getElementsByTagName("td");
        var rowData = {
            gradeCourse: cells[0].innerText,
            gradeStudent: cells[1].innerText,
            midterm: cells[2].innerText,
            final: cells[3].innerText,
            avarage: cells[4].innerText,
            letterGrade: cells[5].innerText,

        };

        data.push(rowData);
    }
    localStorage.setItem("gradeData", JSON.stringify(data));
}

// Function to load grade data from local storage
function loadGradesFromLocalStorage() {

    var storedData = localStorage.getItem("gradeData");

    if (storedData) {

        var data = JSON.parse(storedData);
        document.getElementById("gradeTableBody").innerHTML = "";

        for (var i = 0; i < data.length; i++) {
            var newRow = document.getElementById("gradeTableBody").insertRow();
            var gradeCourseCell = newRow.insertCell(0);
            var gradeStudentCell = newRow.insertCell(1);
            var midtermCell = newRow.insertCell(2);
            var finalCell = newRow.insertCell(3);
            var avarageCell = newRow.insertCell(4);
            var letterGradeCell = newRow.insertCell(5);
            var actionCell = newRow.insertCell(6);

            gradeCourseCell.innerHTML = data[i].gradeCourse;
            gradeStudentCell.innerHTML = data[i].gradeStudent;
            midtermCell.innerHTML = data[i].midterm;
            finalCell.innerHTML = data[i].final;
            avarageCell.innerHTML = data[i].avarage;
            letterGradeCell.innerHTML = data[i].letterGrade;

            actionCell.innerHTML = '<button onclick="deleteGrade(this)" style="margin-right: 5px;">Delete</button>' +
                       '<button onclick="openEditModal(this)">Edit</button>';
        }
    }
}

// Function to calculate letter grade and average based on midterm and final scores
function calculateLetterGrade(midterm, final, courseName) {

    if (isNaN(midterm) || isNaN(final) || midterm < 0 || midterm > 100 || final < 0 || final > 100) {
        return "Geçersiz Not";
    }

    var storedCourseData = localStorage.getItem('courseData');
    var courseData;
    var pointscale;

    if (storedCourseData) {
        courseData = JSON.parse(storedCourseData);
        // 'web' olan kursu bul ve pointscale değerini al
        var courseInfo = courseData.find(course => course.name === courseName);
        if (courseInfo) {
            pointscale = courseInfo.pointScale;
           
        }
    } else {
        console.log("LocalStorage'da kayıtlı bir courseData bulunamadı.");
    }

    var letterGrade;
    var score = (midterm * 0.4) + (final * 0.6);

    switch (pointscale) {
        case "10":
            switch (true) {
                case (score >= 90):
                    letterGrade = "A";
                    break;
                case (score >= 80):
                    letterGrade = "B";
                    break;
                case (score >= 70):
                    letterGrade = "C";
                    break;
                case (score >= 60):
                    letterGrade = "D";
                    break;
                default:
                    letterGrade = "F";
                    break;
            }
            break;

        case "7":
            switch (true) {
                case (score >= 93):
                    letterGrade = "A";
                    break;
                case (score >= 85):
                    letterGrade = "B";
                    break;
                case (score >= 77):
                    letterGrade = "C";
                    break;
                case (score >= 70):
                    letterGrade = "D";
                    break;
                default:
                    letterGrade = "F";
                    break;
            }
            break;

        default:
            return "Invalid Point Scale";
    }

    return { letterGrade: letterGrade, avarageGrade: score };
}

// Function to sort the grade table based on the selected column
function sortTableGrades(columnIndex) {

    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("gradeTable");
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
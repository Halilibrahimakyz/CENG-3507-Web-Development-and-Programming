// Load grade data when the page is loaded
window.onload = function () {
    loadCoursesFromLocalStorage();
};

// Function to open the course modal
function openCourseModal() {
    document.getElementById("courseModal").style.display = "block";
}

// Function to close the course modal
function closeCourseModal() {
    document.getElementById("courseModal").style.display = "none";
}

var selectedRowIndex;
var temp;

// Function to open the edit modal for a course
function openEditModal(button) {
    var row = button.parentNode.parentNode;
    selectedRowIndex = row.rowIndex;

    var courseIdValue = row.cells[0].innerText;
    var courseNameValue = row.cells[1].innerText;
    var pointScaleValue = row.cells[2].innerText;
    document.getElementById("editCourseId").value = courseIdValue;
    document.getElementById("editCourseName").value = courseNameValue;
    document.getElementById("editCoursePointScale").value = pointScaleValue;
    temp=courseNameValue
    document.getElementById("editModal").style.display = "block";
}

// Function to update course information
function updateCourse() {

    var editCourseIdValue = document.getElementById("editCourseId").value;
    var editCourseNameValue = document.getElementById("editCourseName").value;
    var editPointScaleValue = document.getElementById("editCoursePointScale").value;

    if (editCourseIdValue && editCourseNameValue && editPointScaleValue) {

        var table = document.getElementById("courseTable");
        var row = table.rows[selectedRowIndex];

        row.cells[0].innerHTML = editCourseIdValue;
        row.cells[1].innerHTML = editCourseNameValue;
        row.cells[2].innerHTML = editPointScaleValue;

        saveCoursesToLocalStorage();
        changeCourseGradeToLocalStorage(editCourseNameValue)
        closeEditModal(); 
    } else {
        alert("Please enter valid numeric values for Midterm and Final.");
    }
}

// Function to close the edit modal
function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// Function to add a new course
function addCourse() {
    
    var idValue = document.getElementById("courseIdInput").value;
    var nameValue = document.getElementById("courseNameInput").value;
    var PointScaleValue = document.getElementById("coursePointScaleInput").value;

    if (idValue && nameValue && PointScaleValue) {

        var table = document.getElementById("courseTable");
        var tbody = document.getElementById("courseTableBody");

        var newRow = tbody.insertRow();
        var idCell = newRow.insertCell(0);
        var nameCell = newRow.insertCell(1);
        var PointScaleCell = newRow.insertCell(2);

        var actionCell = newRow.insertCell(3);

        idCell.innerHTML = idValue;
        nameCell.innerHTML = nameValue;
        PointScaleCell.innerHTML = PointScaleValue

        actionCell.innerHTML = '<button onclick="deleteCourse(this)" style="margin-right: 5px;">Delete</button>' +
        '<button onclick="openEditModal(this)" style="margin-right: 5px;">Edit</button>'+
        '<button onclick="openCourseViewModal(this)">View</button>';

        closeCourseModal();
        saveCoursesToLocalStorage();
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to delete a course
function deleteCourse(button) {

    var row = button.parentNode.parentNode;
    var courseName = row.cells[1].innerText;

    row.parentNode.removeChild(row);

    saveCoursesToLocalStorage();
    deleteCoursesGradeToLocalStorage(courseName)
}

// Function to delete course-related grades from local storage
function deleteCoursesGradeToLocalStorage(courseName) {
    
    var storedData = localStorage.getItem("gradeData");

    if (storedData) {
        var data = JSON.parse(storedData);

        var newData = data.filter(function(item) {
            return item.gradeCourse !== courseName;
        });
    
        localStorage.setItem("gradeData", JSON.stringify(newData));
        
    }
    
}

// Function to save course data to local storage
function saveCoursesToLocalStorage() {

    var tableRows = document.getElementById("courseTableBody").getElementsByTagName("tr");
    var data = [];

    for (var i = 0; i < tableRows.length; i++) {
        var cells = tableRows[i].getElementsByTagName("td");
        var rowData = {
            id: cells[0].innerText,
            name: cells[1].innerText,
            pointScale: cells[2].innerText
        };
        data.push(rowData);
    }

    localStorage.setItem("courseData", JSON.stringify(data));
}

// Function to change course-related grades in local storage
function changeCourseGradeToLocalStorage(name) {
    var storedData = localStorage.getItem("gradeData");

    if (storedData) {
        var data = JSON.parse(storedData);

        for (var i = 0; i < data.length; i++) {

            if (data[i].gradeCourse === temp) {              
                
                var grades =updateLetterGrade(data[i].midterm, data[i].final, temp);

                data[i].gradeCourse=name
                data[i].avarage=grades.avarageGrade
                data[i].letterGrade=grades.letterGrade
              }
        }

        localStorage.setItem("gradeData", JSON.stringify(data));
        
    }  
}

// Function to load courses from local storage
function loadCoursesFromLocalStorage() {

    var storedData = localStorage.getItem("courseData");

    if (storedData) {
        var data = JSON.parse(storedData);

        document.getElementById("courseTableBody").innerHTML = "";

        for (var i = 0; i < data.length; i++) {
            var newRow = document.getElementById("courseTableBody").insertRow();
            var idCell = newRow.insertCell(0);
            var nameCell = newRow.insertCell(1);
            var PointScaleCell = newRow.insertCell(2);
            var actionCell = newRow.insertCell(3);

            idCell.innerHTML = data[i].id;
            nameCell.innerHTML = data[i].name;
            PointScaleCell.innerHTML= data[i].pointScale;

            actionCell.innerHTML = '<button onclick="deleteCourse(this)" style="margin-right: 5px;">Delete</button>' +
            '<button onclick="openEditModal(this)" style="margin-right: 5px;">Edit</button>' +
            '<button onclick="openCourseViewModal(this)">View</button>';
        }
    }
}

// Function to update letter grade based on midterm, final, and course name
function updateLetterGrade(midterm, final, courseName) {

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

// Function to open the course view modal
function openCourseViewModal(button) {
    var row = button.parentNode.parentNode;
    selectedRowIndex = row.rowIndex;

    var courseNameValue = row.cells[1].innerText;

    var storedData = localStorage.getItem("gradeData");
    if (storedData) {
        var data = JSON.parse(storedData);

        var tableBody = document.getElementById("CourseWithTableBody");
        tableBody.innerHTML = "";

        for (var i = 0; i < data.length; i++) {
            if (data[i].gradeCourse == courseNameValue) {
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

        calculateAndAppendGeneralAverage();
    }

    document.getElementById("viewCourseModal").style.display = "block";
}

// Function to search for a course in the table
function searchCourse() {

    var input = document.getElementById("searchInputCourse");
    var filter = input.value.toUpperCase();

    var table = document.getElementById("courseTable");
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

// Function to calculate and append the general average for courses
function calculateAndAppendGeneralAverage() {

    var tableBody = document.getElementById("CourseWithTableBody");
    var rows = tableBody.getElementsByTagName("tr");
    var totalAverage = 0;
    var successfulCount = 0;
    var unsuccessfulCount = 0;

    for (var i = 0; i < rows.length; i++) {

        var cells = rows[i].getElementsByTagName("td");
        var averageValue = parseFloat(cells[4].innerText);
        totalAverage += averageValue;
        var letterGrade = cells[5].innerText.trim().toUpperCase();

        if (letterGrade === "F") {
            unsuccessfulCount++;
        } else {
            successfulCount++;
        }
    }

    var generalAverage = (rows.length > 0) ? totalAverage / rows.length : 0;

    var successfulCountElement = document.getElementById("successfulCount");
    var unsuccessfulCountElement = document.getElementById("unsuccessfulCount");

    successfulCountElement.innerText = successfulCount;
    unsuccessfulCountElement.innerText = unsuccessfulCount;

    var generalAverageRow = document.getElementById("generalAverageRow");
    var generalAverageValue = document.getElementById("generalAverageValue");

    generalAverageValue.innerText = generalAverage.toFixed(2);

}

// Function to close the course view modal
function closeCourseViewModal() {
    document.getElementById("viewCourseModal").style.display = "none";
}

// Function to sort the course table based on a column
function sortTableCourse(columnIndex) {

    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("courseTable");
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

// Function to filter the course table based on success or failure
function filterTable() {
    
    var filterValue = document.getElementById("successFilter").value;
    
    var tableBody = document.getElementById("CourseWithTableBody");
    var rows = tableBody.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var letterGradeCell = row.cells[5].textContent; 

        if (filterValue === "all" || (filterValue === "successful" && letterGradeCell !== "F") || (filterValue === "unsuccessful" && letterGradeCell === "F")) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}
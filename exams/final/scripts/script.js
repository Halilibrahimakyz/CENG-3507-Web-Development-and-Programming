// Function to be executed when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
    var currentPagePath = window.location.pathname;

    if (currentPagePath.includes("courses")) {
        highlightNavItem("courses");
    } else if (currentPagePath.includes("students")) {
        highlightNavItem("students");
    } else if (currentPagePath.includes("grades")) {
        highlightNavItem("grades");
    }
});

// Function to highlight a specific navigation item
function highlightNavItem(itemId) {
    console.log("highlightNavItem fonksiyonu çalıştı");
    var currentNavbarItem = document.getElementById(itemId);
    if (currentNavbarItem) {
        console.log("Navbar item bulundu: ", currentNavbarItem);
        currentNavbarItem.classList.add("active");
    } else {
        console.log("Navbar item bulunamadı");
    }
}



// Function to check if local storage is empty and fetch data if necessary
isLocalStorageEmpty()
function isLocalStorageEmpty() {

    var courseData = localStorage.getItem('courseData');
    var studentData = localStorage.getItem('studentData');
    var gradeData = localStorage.getItem('gradeData');
    var jsonCourseData = JSON.parse(courseData);
    var jsonStudentData = JSON.parse(studentData);
    var jsongradeData = JSON.parse(gradeData);

    if (jsonCourseData == null || jsonCourseData.length == 0) {
        fetch('./json/courses.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('courseData', JSON.stringify(data));
            })
            .catch(error => console.error('Hata:', error));
    }
    if (jsonStudentData == null || jsonStudentData.length == 0) {
        fetch('./json/students.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('studentData', JSON.stringify(data));
            })
            .catch(error => console.error('Hata:', error));
    }
    if (jsongradeData == null || jsongradeData.length == 0) {
        fetch('./json/grades.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('gradeData', JSON.stringify(data));
            })
            .catch(error => console.error('Hata:', error));
    }
}


// localStorage.clear();
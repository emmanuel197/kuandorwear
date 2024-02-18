// // Get the buttons and the input element
// var resetBtn = document.getElementById("reset-btn");
// var applyBtn = document.getElementById("apply-btn");
// var filterInput = document.getElementById("filter-input");

// // Add a click event listener to the reset button
// resetBtn.addEventListener("click", function () {
//   // Reset the input value to default
//   filterInput.value = "default";
//   // Loop through all the checkboxes and uncheck them
//   var checkboxes = document.querySelectorAll("input[type='checkbox']");
//   for (var i = 0; i < checkboxes.length; i++) {
//     checkboxes[i].checked = false;
//   }
// });

// // Add a click event listener to the apply button
// applyBtn.addEventListener("click", function () {
//   // Get the selected values from the checkboxes
//   var selectedValues = [];
//   var checkboxes = document.querySelectorAll("input[type='checkbox']");
//   for (var i = 0; i < checkboxes.length; i++) {
//     if (checkboxes[i].checked) {
//       selectedValues.push(checkboxes[i].parentNode.textContent.trim());
//     }
//   }
//   // Set the input value to the selected values
//   filterInput.value = selectedValues.join(", ");
//   // Do something with the input value, such as sending it to a server or displaying it on the page
//   console.log(filterInput.value);
// });

var resetBtn = $("#reset-btn");
var applyBtn = $("#apply-btn");

console.log(resetBtn.innerHTML)
// Add a click event listener to the buttons
resetBtn.add(applyBtn).on("click", function () {
  // Toggle the active class for the clicked button
  $(this).toggleClass("active");
  // Remove the active class from the other button
  $(this).siblings().removeClass("active");
});

console.log("it works!");
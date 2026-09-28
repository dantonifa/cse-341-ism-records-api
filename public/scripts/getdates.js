function getDates() {
  var date = new Date();
  let year = date.getFullYear();
  document.getElementById("currentyear").innerHTML = year;
  document.getElementById("lastModified").innerHTML = date;
}
getDates();

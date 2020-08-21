//jshint esversion:7
module.exports = getDate;
function getDate() {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let day = today.toLocaleDateString("en-UK", options);
  return day;

}

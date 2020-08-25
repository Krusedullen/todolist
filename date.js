//jshint esversion:7

//specifys getDate as a function of this module and exports it. This can be called throught with date.getDate();
exports.getDate = function () {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return today.toLocaleDateString("en-UK", options);
}

exports.getDay = function() {
  const today = new Date();
  const options = {
    weekday: "long",
  };
  return today.toLocaleDateString("en-UK", options);
}

export const convertUnixTimestampToTime = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();

  // Convert hours to 12-hour format and determine AM/PM
  const formattedHours = hours % 12 || 12;
  const amPm = hours < 12 ? "AM" : "PM";

  const formattedTime = `${formattedHours} : ${minutes.substr(-2)} ${amPm}`;
  return formattedTime;
};

export const getCurrentDate = () => {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = today.getFullYear();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[today.getDay()];

  const formattedDate = `${day}/${month}/${year} ${dayOfWeek}`;
  return formattedDate;
};

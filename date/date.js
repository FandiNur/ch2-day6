
// date funcion
module.exports.getFormatTime = (waktu) => {
  let month = [
    "Januari",
    "Febuari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  let date = waktu.getDate();
  let monthIndex = waktu.getMonth();
  let year = waktu.getFullYear();

  let fullTime = `${date} ${month[monthIndex]} ${year}`;
  return fullTime;
}

module.exports.getDistanceTime = (startDate, endDate) => {
  let start = startDate;
  let end = endDate;

  let duration = end.getTime() - start.getTime();
  let day = Math.round(duration / (1000 * 3600 * 24));
  let month = Math.round(day / 30);
  duration = month <= 0 ? day + " day" : month + " month";

  if (start > end) {
    alert("check Your Date");
  } else if (start < end) {
    return `${duration} `;
  }
}

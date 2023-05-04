const charts =
  "./charts.csv" ||
  "https://raw.githubusercontent.com/ablwr/billboard-astrology/charts.csv";

const sunResults = document.getElementById("sunResults");
const moonResults = document.getElementById("moonResults");
const risingResults = document.getElementById("risingResults");
const date = document.getElementById("date");
const submit = document.getElementById("submit");

submit?.addEventListener("click", (e) => {
  window.location.hash = `#${date.value}`;
  getReading(date.value);
});

function doUpdate() {
  const parsed = window.location.hash.match(/#(?<date>[0-9]{4}-[0-9]{2}-[0-9]{2})/);
  if (parsed.groups.date !== undefined) {
    getReading(parsed.groups.date);
    date.value = parsed.groups.date;
  }
}

window.addEventListener("hashchange", doUpdate)

if (window.location.hash) {
  doUpdate()
}

function getNextNearestSaturday(date) {
  const dateDiff = 6 - new Date(date).getUTCDay();
  let result = new Date(date);
  result.setDate(result.getDate() + dateDiff);
  return result;
}

function getReading(selectedDate) {
  // todo: handle this for user
  // also edge cases like too old, too young
  if (!date.value) console.log("no date selected");

  Papa.parse(charts, {
    download: true,
    error: function () {
      console.log("Parsing error");
    },
    complete: function (data) {
      // Hacky way to not deal with timezones
      const birthday = new Date(selectedDate + "T12:00:00");
      // All Billboard dates are a Saturday
      let sun = getNextNearestSaturday(birthday);

      let sunChart = data.data.find((d) => {
        return d[0].toString() === sun.toISOString().slice(0, 10);
      });

      sunResults.innerHTML = `<h3>${sunChart[1]}</h3>${sunChart[2]}`;

      let moon = new Date(selectedDate + "T12:00:00");
      moon.setMonth(moon.getMonth() - 9);
      moon = getNextNearestSaturday(moon);

      let moonChart = data.data.find((d) => {
        return d[0].toString() === moon.toISOString().slice(0, 10);
      });

      moonResults.innerHTML = `<h3>${moonChart[1]}</h3>${moonChart[2]}`;

      let rising = new Date(selectedDate + "T12:00:00");
      rising = getNextNearestSaturday(
        rising.setFullYear(rising.getFullYear() + 13)
      );
      let risingChart = data.data.find((d) => {
        return d[0].toString() === rising.toISOString().slice(0, 10);
      });

      risingResults.innerHTML = `<h3>${risingChart[1]}</h3>${risingChart[2]}`;
    },
  });
}

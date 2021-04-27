onmessage = () => {
  generateRecords();
};
const countries = [
  "India",
  "USA",
  "China",
  "Japan",
  "Russia",
  "Germany",
  "France",
  "Canada",
];
const jobTitles = ["manager", "developer", "tester"];
function generateRecords(numRows = 10) {
  let i = 0;
  let records = [];
  // this.loading = true;
  while (i < numRows) {
    let e = {
      id: i + 1,
      firstName: generateString(4),
      lastName: generateString(4),
      jobTitle: jobTitles[getnerateNumber(0, jobTitles.length)],
      country: countries[getnerateNumber(0, countries.length)],
      workHours_q1: getnerateNumber(500, 800),
      workHours_q2: getnerateNumber(500, 800),
      workHours_q3: getnerateNumber(500, 800),
      workHours_q4: getnerateNumber(500, 800),
    };

    e.emailAddress = e.firstName + "_" + e.lastName + "@xyz.com";
    e.salary_q1 = e.workHours_q1 * 500;
    e.salary_q2 = e.workHours_q2 * 500;
    e.salary_q3 = e.workHours_q3 * 500;
    e.salary_q4 = e.workHours_q4 * 500;
    records.push(e);
    i++;
  }
  postMessage(records);
  // this.loading = false;
}
function generateString(length = 4) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
function getnerateNumber(lowestNumber, highestNumber) {
  return (
    Math.floor(Math.random() * (highestNumber - lowestNumber)) + lowestNumber
  );
}

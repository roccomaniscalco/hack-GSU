const API_KEY = "1746e141194bb3c5a7187530792f8912";
let state = "GA";
let relevantBills;
let recentBills;

$(window).on("load", () => {
  const loadRecentBills = () => {
    $.ajax({
      url: `https://api.legiscan.com/?key=${API_KEY}&op=getMasterList&state=${state}`,
      method: "GET",
    }).then((response) => {
      recentBills = sortByDate(response.masterlist);
      displayFeed(recentBills);
    });

    const sortByDate = (obj) => {
      return Object.values(obj)
        .sort((a, b) => new Date(a.last_action_date) - new Date(b.last_action_date))
        .reverse();
    };
  };

  const loadRelevantBills = () => {
    $.ajax({
        url: `https://api.legiscan.com/?key=${API_KEY}&op=search&state=${state}`,
        method: "GET",
      }).then((response) => {
        relevantBills = Object.values(response.searchresult);
        displayFeed(relevantBills);
      });
  };

  const getBill = (billID) => {
    $.ajax({
      url: `https://api.legiscan.com/?key=${API_KEY}&op=getgetBill&id=${billID}`,
      method: "GET",
    }).then(function (response) {});
  };

  const displayFeed = (bills) => {
    console.log(bills);
  };

  $("#recent").on("click", () => {
    if (recentBills == undefined) loadRecentBills();
    else displayFeed(recentBills);
  });
  $("#relevant").on("click", () => {
    if (relevantBills == undefined) loadRelevantBills();
    else displayFeed(relevantBills);
  });
});

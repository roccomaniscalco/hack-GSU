const API_KEY = "1746e141194bb3c5a7187530792f8912";
const state = "GA";
const bills = [];

$(window).on("load", () => {
  // Get Relevant Searches
  $.ajax({
    url: `https://api.legiscan.com/?key=${API_KEY}&op=search&state=${state}`,
    method: "GET",
  }).then((response) => {
    getBills(Object.values(response.searchresult));
  });

  // Get Specific Bill Info
  const getBills = (searches) => {
    console.log(searches);
    for (let i = 0; i < searches.length - 1; i++) {
      $.ajax({
        url: `https://api.legiscan.com/?key=${API_KEY}&op=getBill&id=${searches[i].bill_id}`,
        method: "GET",
      }).then((response) => {
        bills.push(response.bill);
        appendToFeed(response.bill, i);
      });
    }
  };

  // Display Bills In Feed
  const appendToFeed = (bill, i) => {
    const status = decodeBillStatus(bill.status)
    $("nav").append(
      `<div class="card" data-bill-index="${i}">
        <div>
          <h1>${bill.bill_number}</h1>
          <span class="${status}">${status}</span>
        </div>
        <p>${bill.title}</p>
      </div>`
    );
  };

  // Convert Status Number To Feed
  const decodeBillStatus = (statusNum) => {
    switch (statusNum) {
      case 1:
        return "Introduced";
      case 2:
        return "Engrossed";
      case 3:
        return "Enrolled";
      case 4:
        return "Passed";
      case 5:
        return "Vetoed";
      case 6:
        return "failed";
    }
  };

  // Register User Interaction
  $("nav").on("click", "div", function () {
    $("nav").children().removeClass("selected");
    $(this).addClass("selected");
  });
});

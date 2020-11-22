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
    const status = decodeBillStatus(bill.status);
    $("nav").append(
      `<div class="nav-card" data-bill-index="${i}">
        <div class="space-between">
          <h2>${bill.bill_number}</h2>
          <span class="${status}">${status}</span>
        </div>
        <p>${bill.title}</p>
      </div>`
    );
  };

  // Writes Bill Info To Content
  const writeToContent = (billIndex) => {
    const bill = bills[billIndex];
    $("section").empty();
    $("section").append(
      `<div class="section-header">
        <h1>${bill.bill_number}</h1>
        <div>
          <span style="color: #208a4c; margin-right: 10px;">
            <i class="far fa-thumbs-up fa-3x"></i>
          </span>
          <span style="color: #a34643">
            <i class="far fa-thumbs-down fa-3x fa-flip-horizontal"></i>
          </span>
        </div>
      </div>
      <h2><span>Description</span></h2>
      <p>${bill.description}</p>
      <h2><span>Sponsors</span></h2>`
    );

    bill.sponsors.forEach((sponsor) => {
      $("section").append(
        `<span class="sponsor">${sponsor.role} ${sponsor.name}</span>
      <h2><span>Progress</span></h2>`
      );
    });

    bill.history.forEach((moment) => {
      $("section").append(
        `<div class="progress"> 
        <span class="date">${moment.date}</span>
        <span class="action"> ${moment.action} </span> 
        </div>`
      );
    });
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
    if (this.dataset.billIndex) {
      $("nav").children().removeClass("selected");
      $(this).addClass("selected");
      writeToContent(this.dataset.billIndex);
    }
  });
});

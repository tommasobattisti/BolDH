
// DIVIDE EVENTS IN ACTIVE AND CONCLUDED EVENTS AND SORT THEM BY DATE
export function divideEvents(agendaArray){
  let activeArr = [];
  let concludedArr = [];
  // for each event in agendaArray check if it is concluded or active and push it in the corresponding array
  agendaArray.forEach(function (item) { 
    let itemIndex = agendaArray.indexOf(item);
    let endDate; 
    item.id = itemIndex;
    if (item.date.includes("-")){ // if event is a range of dates, take the last date of the range as the end date
      let dateRange = item.date.split("-");
      endDate = dateRange[1].trim();
      var parts = endDate.split("/");
    } else {
      endDate = item.date.trim();
      var parts = endDate.split("/");
    }
    endDate =  new Date(parts[2], parts[1] - 1, parts[0]); // create a date object from the end date of the event
    let today = new Date(); 
    endDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    // if end date is before today, event is concluded, else it is active
    if (endDate < today) {
      concludedArr.push(item);
    } else {
      activeArr.push(item);
    };
  });

  return [activeArr, concludedArr]
};


// _________________________________________________________________________________________________________________________
// SORT EVENTS BY DATE
export function sortEvents(arr){
  arr.sort(function(a, b){ // sort events by date with a and b being two events in the array (look at MDN Array.prototype.sort() for more info)
    if (!a.date.includes("-") && !b.date.includes("-")){ // if both events are single dates (not ranges of dates)
      var partsA = a.date.split("/"); // split date string in day, month and year
      var partsB = b.date.split("/"); // split date string in day, month and year
      var dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]); // create a date object from the date string (month - 1 because months start from 0)
      var dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]); // create a date object from the date string (month - 1 because months start from 0)
      return dateB - dateA; // return the difference between the two dates (if positive, a is more recent than b)
    } else if (a.date.includes("-") && b.date.includes("-")){ // if both events are ranges of dates (not single dates)
      var dateRangeA = a.date.split("-"); // split date range string in start date and end date
      var dateRangeB = b.date.split("-");
      var endDateA = dateRangeA[1].trim(); // take the end date of the range as the end date of the event (trim to remove white spaces)
      var endDateB = dateRangeB[1].trim();
      var partsA = endDateA.split("/"); // split date string in day, month and year
      var partsB = endDateB.split("/");
      var dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]); // create a date object from the date string (month - 1 because months start from 0)
      var dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);
      return dateB - dateA; // return the difference between the two dates (if positive, a is more recent than b)
    } else if (a.date.includes("-") && !b.date.includes("-")){ // if a is a range of dates and b is a single date
      var dateRangeA = a.date.split("-"); // ... it follows the same logic as above
      var endDateA = dateRangeA[1].trim(); // ... it follows the same logic as above
      var partsA = endDateA.split("/");
      var dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]); // ... it follows the same logic as above
      var partsB = b.date.split("/");
      var dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);
      return dateB - dateA;
    } else if (!a.date.includes("-") && b.date.includes("-")){ // if a is a single date and b is a range of dates
      var dateRangeB = b.date.split("-"); // ... it follows the same logic as above
      var endDateB = dateRangeB[1].trim(); // ... it follows the same logic as above
      var partsB = endDateB.split("/");
      var dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]); // ... it follows the same logic as above
      var partsA = a.date.split("/");
      var dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]);
      return dateB - dateA;
    }
  });
  return arr; // return sorted array
};


// _________________________________________________________________________________________________________________________
// POPULATE CARDS WITH DATA FROM JSON AND ADD THEM TO THE WEBSITE
const arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="66" height="50" viewBox="0 0 66 50" fill="none"><path d="M0 25H64M64 25L41.7391 1M64 25L41.7391 49" stroke="#F2F2F2" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';

export function populateCard(tp, item) { // tp is the type of card (news, active or concluded event), item is the object containing the data
  // Create html elements for shared content among the different types of cards
  let itemDivision = "<p class='card-division'>" + item.division + "</p>";
  let itemType = "<p class='card-type'>" + item.type + "</p>";
  // Manage title lenght avoiding too long content and breaking after a specific number of characters
  let itemTitle = "";
  if (item.title.length > 120) {
    let newTitle = item.title.substring(0, 120) + "...";
    itemTitle = "<h4 class='card-title'>" + newTitle + "</h4>";;
  } else {
    itemTitle = "<h4 class='card-title'>" + item.title + "</h4>";
  }
  // Manage card text lenght avoiding too long content and breaking after a specific number of characters
  let itemText = ""; // !!! It could be changed with subtitle for events
  let textToGet; 
  if (tp === 'news'){
    textToGet = item.text
  } else {
    textToGet = item.subtitle
  }
  if (textToGet.length > 200) {
    let newText = textToGet.substring(0, 200) + "...";
    itemText = "<p class='card-text'>" + newText + "</p>";
  } else {
    itemText = "<p class='card-text'>" + textToGet + "</p>";
  }
  // Create html element containing title and text of the card
  let itemTextDiv = "<div class='card-text-div'>"+ itemTitle + itemText +"</div>";
  // Create variable for the entire card box and the info div containing news or events tags
  let box = "";
  let infoDiv = "";
  // depending on the type of card, create the card box and the info div containing news or events tags
  if (tp === "news") {
    box = document.getElementById("news-box-container");
    infoDiv = "<div class='card-info-div'>" + itemDivision + itemType +"</div>"; // I put division tag and type of news in the tag info div for news
  } else {
    let itemDate;
    if(tp === "concluded") {
      box = document.getElementById("agenda-box-container");
      itemDate = "<p class='agenda-"+tp+"'>" + item.date + "</p>"; // I define the date tag for concluded events 
    } else {
      box = document.getElementById("agenda-box-container");
      itemDate = "<p class='agenda-"+tp+"'>" + item.date + "</p>";  // I define the date tag for active events
    }
    let itemPlace = "<p class='card-place'>" + item.place + "</p>"; // I define the place tag for both kinds of events
    infoDiv = "<div class='card-info-div'>" + itemDivision + itemType +  itemPlace + itemDate + "</div>"; // I put division tag, type of event, place and date in the tag info div for events
  };
  // Create html elements containing main content and link arrow
  let itemContentA = "<div class='card-box-content-a'>"+ infoDiv + itemTextDiv +"</div>";
  let arrowDiv = "<div class='card-arrow-cnt'>"+ arrow +"</div></div>";
  // Depending on the type of card, create the card box with the corresponding class and populate it with the content
  // Insert url link directly in the card of news and treat it as an anchor card
  // Insert onclick function in the card of events to populate the modal with the corresponding event data and content
  // Concluded and active events have different classes that determine the color of the date tag and the card aspect and animation on over and out 
  if (tp === "news") {
    let itemUrl = item.url;
    let newElement = "<a class='cb card-box news-box' href='"+ itemUrl +"' target='_blank'>"+ itemContentA + arrowDiv +"</a>"
    return [box, newElement]
  } else if (tp === "concluded"){
    let newElement = "<div class='cb card-box-concluded event-box'>"+ itemContentA + arrowDiv +"</div>";
    return [box, newElement]
  } else {
    let newElement = "<div class='cb card-box event-box'>"+ itemContentA + arrowDiv +"</div>";
    return [box, newElement]
  }
};


export function populateModal(id, eventStatus, agendaArray){ // eventStatus is the status of the event (active or concluded) and it is used to define the color of the date tag
  let modalContent = document.getElementById("modal-content"); // get modal content element 
  modalContent.innerHTML = ""; // reset modal content 
  let event = agendaArray.find(x => x.id === id);  // find event in agendaArray with id equal to the id of the event clicked in the card
  let eventTitle = "<h4 id='modal-title'>"+event.title+"</h4>"; // create title and subtitle of the event in the modal
  let eventSubtitle = "<p class='subtitle' id='modal-sbt'>"+event.subtitle+"</p>";
  var modalTitleSubtitle = "<div id='modal-t-sbt-cnt'>"+ eventTitle + eventSubtitle +"</div>"; 
  // create date and place tags of the event in the modal
  let eventDate = "<p class='modal-tag modal-date-"+eventStatus+"'>"+event.date+" "+event.time+"</p>";
  let eventPlace = "<p class='modal-tag modal-date-"+eventStatus+"'>"+event.place_extended+"</p>";
  // create division and type tags of the event in the modal
  let eventDivision = "<p class='modal-tag'>"+event.division+"</p>"
  let eventType = "<p class='modal-tag'>"+event.type+"</p>"
  let divisionType = "<div id='modal-division-type-cnt'>"+ eventDivision + eventType +"</div>";
  // compose the group of tags of the event in the modal
  let tagGroup = "<div id='modal-tag-group'>"+ divisionType + eventDate + eventPlace +"</div>";
  // Set the main content variable and populate it with the text, image and links of the event
  let mainContent = ""
  let eventText = event.text;
  mainContent += eventText;
  // if event has an image, create the image tag and add it to the main content
  if (event.image){
    let eventImg = "<div id='modal-img-cnt'><img src='"+event.image.url+"' alt='"+event.image.alt+"'></div>"; 
    mainContent += eventImg;
  };
  // if event has links, create the links tags and add them to the main content
  let eventLinks = "";
  if (event.downloads){ // if event has download links, create the download links tags and add them to the main content
    event.downloads.forEach(function (evDwnl){
      let aTag = '<a class="boldh-btn secondary-btn" target="_blank" href="'+evDwnl.url+'" download>'+evDwnl.text+'</a>';
      eventLinks += aTag; 
    });
  };
  if (event.urls){ // if event has external links, create the external links tags and add them to the main content
    event.urls.forEach(function (evUrl){
      let aTag = "<a class='boldh-btn dark-btn link-btn target='_blank' href="+evUrl.url+">"+evUrl.text+"<div class='boldh-btn-arrow-cnt'>"+arrow+"</div></a>";
      eventLinks += aTag;
    });
  };
  // if event has links, create the links tags and add them to the main content, else (implicit) do nothing
  if (eventLinks != ""){
    let eventLinksCnt = "<div id='modal-link-group'>"+eventLinks+"</div>";
    mainContent += eventLinksCnt;
  };
  // create html of the main content of the event in the modal and add it as the inner html of the modal content with title, subtitle and tags
  let modalMainContent = "<div id='modal-main-cnt'>"+ mainContent +"</div>"
  modalContent.innerHTML = modalTitleSubtitle + tagGroup + modalMainContent;
  // open modal and display modal content and overlay. Finally disable scroll of the body
  document.getElementById("modal-overlay").style.display = "flex";
  document.getElementById("expansion-container").style.display = "flex";
  document.body.style.overflow = "hidden";
}

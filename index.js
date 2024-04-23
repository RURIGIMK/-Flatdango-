$(document).ready(function() {
    // Function to fetch films data from the API
    function fetchFilmsData() {
        $.ajax({
            url: "http://localhost:3000/films", // API endpoint for fetching films data
            method: "GET",
            success: function(response) {
                // Once data is fetched successfully, populate sidebar, posters, and showing info
                populateFilmsSidebar(response);
                populatePostersAndShowingInfo(response);
            },
            error: function(xhr, status, error) {
                console.error("Error fetching films data:", error);
            }
        });
    }

    // Function to populate films sidebar
    function populateFilmsSidebar(filmsData) {
        var filmsList = $("#films");
        filmsData.forEach(function(film) {
            var listItem = $("<li>").addClass("film item").attr("data-id", film.id).text(film.title);
            filmsList.append(listItem);
        });
    }

    // Function to show poster and showing info of selected film
    function showFilmInfo(filmId) {
        // Hide all posters and showing info
        $(".poster, .showing-info").hide();
        
        // Show the poster and showing info of the selected film
        $("#poster" + filmId + ", #showing" + filmId).show();
    }

    // Function to handle click on film name
    $(document).on("click", ".film.item", function() {
        var filmId = $(this).data("id");
        showFilmInfo(filmId);
    });

    // Function to populate posters and showing info
    function populatePostersAndShowingInfo(filmsData) {
        var postersDiv = $("#posters");
        var showingInfoDiv = $("#showing-info");
        filmsData.forEach(function(film) {
            // Create poster image element
            var posterImg = $("<img>").addClass("ui fluid image poster").attr({
                "src": film.poster,
                "alt": film.title,
                "id": "poster" + film.id
            });
            postersDiv.append(posterImg);

            // Create showing info element
            var showingInfo = $("<div>").addClass("showing-info showing").attr("id", "showing" + film.id);
            var segmentDiv = $("<div>").addClass("ui segment");
            var header = $("<h4>").addClass("ui header").text(film.title);
            var runtimeP = $("<p>").text("Runtime: " + film.runtime + " minutes");
            var descriptionP = $("<p>").text("Description: " + film.description);
            var showtimeP = $("<p>").text("Showtime: " + film.showtime);
            var remainingTicketsP = $("<p>").text("Tickets Remaining: " + film.capacity);
            var buyButton = $("<button>").addClass("ui button buy-ticket").text("Buy Ticket").click(function() {
                buyTicket(film.id);
            });
            segmentDiv.append(header, runtimeP, descriptionP, showtimeP, remainingTicketsP, buyButton);
            showingInfo.append(segmentDiv);
            showingInfoDiv.append(showingInfo);
        });
    }

    // Function to handle buying a ticket
    function buyTicket(filmId) {
        var remainingTicketsP = $("#showing" + filmId).find("p:contains('Tickets Remaining')");
        var buyButton = $("#showing" + filmId).find(".buy-ticket");
        var remainingTickets = parseInt(remainingTicketsP.text().split(": ")[1]);
        if (remainingTickets > 0) {
            remainingTickets--;
            remainingTicketsP.text("Tickets Remaining: " + remainingTickets);
            if (remainingTickets === 0) {
                remainingTicketsP.text("Sold Out");
                buyButton.prop("disabled", true).text("Sold Out");
            }
            // Here you can add logic to update the remaining tickets in your backend database
        }
    }

    // Call function to fetch films data from the API
    fetchFilmsData();
});

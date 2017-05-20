////////////////////////////////////////////////////////////////////////////////
// Helper: formatTime
// parameters: timestamp
// description: Formats timestamps to make them pretty and more human readable.
// return: String of month/day/year
////////////////////////////////////////////////////////////////////////////////
Handlebars.registerHelper('formatTime', function (posted) {
    var time = posted.replace('T', ':');
    var date = time.split(":")[0];
    var year = Number(date.split("-")[0]);
    var month = Number(date.split("-")[1]);
    var day = Number(date.split("-")[2]);
    var months = {
        "January": 1,
        "February ": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12,
    };
    for(var i in months){
        if(month == months[i]){
            month = i;
        }
    }
    return month + " " + day + " " + year;
})

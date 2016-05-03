/*
 * Prepare and start Next/Last Draw widget
 */
function setTimerWidget()
{
    var customDrawDate = new Date(2016, 4, 3, 3, 30, 55);
    if (isOldTime(customDrawDate))
    {
        populateLastDrawWidget(customDrawDate);
        customDrawDate = nextDraw(customDrawDate);
    } else
    {
        populateLastDrawWidget(getLastDraw(customDrawDate));
        lastDraw();
    }

    var diff = getDifference(customDrawDate);

    if (diff <= 0)
    {
        populateLastDrawWidget(customDrawDate);
        setTimerWidget(nextDraw(customDrawDate));
    }

    populateNextDrawWidget(customDrawDate);
}

/*
 * Returns difference in dates
 * @param {Date} drawDate
 * @param {Number} diff
 */
function getDifference(drawDate)
{
    var now = new Date();
    var diff = 1;
    nextDrawDate = new Date(drawDate);
    var timeDiff = nextDrawDate.getTime() - now.getTime();

    if (timeDiff <= 0)
    {
        console.log("TIME's UP! -> Next Draw Date");
        diff = 0;
    }
    return diff;
}

/*
 * Populates apprpopriate DOM elements with date/time values
 * @param {Date} date
 */
function populateNextDrawWidget(date)
{
    var now = new Date();
    nextDrawDate = new Date(date);
    var timeDiff = nextDrawDate.getTime() - now.getTime();
    var s = Math.floor(timeDiff / 1000);
    var m = Math.floor(s / 60);
    var h = Math.floor(m / 60);
    var d = Math.floor(h / 24);

    // Set remainders
    h %= 24;
    m %= 60;
    s %= 60;

    document.getElementById("timer-next-day").innerHTML = date.getDate();
    document.getElementById("timer-next-month").innerHTML = getMonthName(date.getMonth());
    document.getElementById("timer-next-year").innerHTML = date.getFullYear();
    document.getElementById("timer-day").innerHTML = formatTime(d, 2);
    document.getElementById("timer-hour").innerHTML = formatTime(h, 2);
    document.getElementById("timer-min").innerHTML = formatTime(m, 2);
    document.getElementById("timer-sec").innerHTML = formatTime(s, 2);
}

/*
 * Populates apprpopriate DOM elements with date/time values
 * @param {Date} date
 */
function populateLastDrawWidget(date)
{
    var lastDrawDate = new Date(date);
    document.getElementById("timer-last-day").innerHTML = lastDrawDate.getDate();
    document.getElementById("timer-last-month").innerHTML = getMonthName(lastDrawDate.getMonth());
    document.getElementById("timer-last-year").innerHTML = lastDrawDate.getFullYear();
}

/*
 * Validate if "Next Draw Date" is "old"
 * @param {Date} date
 * @return {Boolean} true/false
 */
function isOldTime(date)
{
    var now = new Date();
    var drawDate = new Date(date);
    var timeDiff = drawDate.getTime() - now.getTime();

    if (timeDiff <= 0)
    {
        return true;
    } else
    {
        return false;
    }
}

/*
 * Returns next valid draw date
 * @param {Date} date
 * @return {Date} nextDrawDate
 */
function nextDraw(date)
{
    var now = new Date();
    var todayNumber = now.getDay();
    //var wedInitDraw = new Date(2016, 3, 27, 20, 0, 0);
    //var satInitDraw = new Date(2016, 3, 30, 20, 0, 0);
    var nextWednesday = new Date(getNextDay("Wednesday"));
    var nextSaturday = new Date(getNextDay("Saturday"));
    var wedDraw = 2, satDraw = 5;
    var custDraw = new Date(date);
    var custNum = custDraw.getDay();
    var old = isOldTime(custDraw);
    var nextDrawDate = "";

    if (old)
    {
        date = 0;
    }

    if (date === 0)
    {
        if (todayNumber <= wedDraw)
        {// Wed
            nextDrawDate = nextWednesday;
        }
        if (todayNumber > wedDraw && todayNumber <= satDraw)
        {// Sat
            nextDrawDate = nextSaturday;
        }
    } else
    {
        if (todayNumber <= custNum && custNum <= wedDraw) {// Mon, Tue
            nextDrawDate = custDraw;
        }
        if (todayNumber <= custNum && custNum > wedDraw && custNum <= satDraw) {// Thur, Fri
            nextDrawDate = custDraw;
        }
        if (todayNumber <= custNum && custNum > satDraw) {// Sun
            nextDrawDate = custDraw;
        }
        if (todayNumber > custNum && todayNumber <= wedDraw) {// Wed
            nextDrawDate = nextWednesday;
        }
        if (todayNumber > custNum && todayNumber > wedDraw && todayNumber <= satDraw) {// Sat
            nextDrawDate = nextSaturday;
        }
    }
    return nextDrawDate;
}


/*
 * Returns last draw date
 * @param {Date} date
 * @return {Date} lastDrawDate
 */
function getLastDraw(date)
{
    var currentDraw = new Date(date);
    var lastWednesday = new Date(getPrevDay("Wednesday"));
    var lastSaturday = new Date(getPrevDay("Saturday"));
    var diffWed = lastWednesday.getTime() - currentDraw.getTime();
    var diffSat = lastSaturday.getTime() - currentDraw.getTime();

    if (diffWed < diffSat)
    {
        lastDrawDate = lastSaturday;
        console.log("last sat " + lastSaturday);
    } else
    {
        lastDrawDate = lastWednesday;
        console.log("last wed " + lastWednesday);
    }

    return lastDrawDate;
}

/*
 * Returns next weekday date ex. getNextDay("Sunday") => next Sunday date
 * @param {String} day
 * @return {Date} nextWeekDay
 */
function getNextDay(day)
{
    var nextDay = getWeekDayNumber(day);
    var now = new Date();
    var dayNow = now.getDay();
    var nextWeekDay = (dayNow < nextDay) ? nextDay - dayNow : nextDay + (7 - dayNow);

    nextWeekDay = nextWeekDay * 24 * 60 * 60 * 1000;
    nextWeekDay = new Date(now.getTime() + nextWeekDay);
    nextWeekDay.setHours(20, 0, 0);

    return new Date(nextWeekDay);
}

/*
 * Returns previous weekday date ex. getPrevDay("Sunday") => last Sunday date
 * @param {String} day
 * @return {Date} lastWeekDay
 */
function getPrevDay(day)
{
    var prevDay = getWeekDayNumber(day);
    var now = new Date();
    var dayNow = now.getDay();
    var lastWeekDay = (dayNow > prevDay) ? dayNow - prevDay : dayNow + (7 - prevDay);

    lastWeekDay = lastWeekDay * 24 * 60 * 60 * 1000;
    lastWeekDay = new Date(now.getTime() - lastWeekDay);
    lastWeekDay.setHours(20, 0, 0);

    return new Date(lastWeekDay);
}

/*
 * Returns the formated time ex. formatTime(4, 2) returns '02'.s
 * @param {Number} number
 * @param {Number} f
 * @return {String} number
 */
function formatTime(number, f)
{
    var number = number;
    var format = (f === undefined || typeof f === 'undefined' || isNaN(f)) ? 2 : f;
    var prefix = "";

    if (number < 10)
    {
        for (var i = 0; i < format - 1; i++)
        {
            prefix += "0";
        }
        number = prefix + number;
    }
    return number;
}

/*
 * Returns the name of the month
 * @param {Number} monthNum
 * @return {String} monthName
 */
function getMonthName(monthNum)
{
    var monthName = "";
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthName = monthNames[monthNum];
    return monthName;
}

/*
 * Returns the number of the week day
 * @param {Number} dayName
 * @return {String} weekDayNum
 */
function getWeekDayNumber(dayName)
{
    var weekDayNum = "";
    var weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (var i = 0; i < weekDayNames.length; i++)
    {
        if (weekDayNames[i] === dayName)
        {
            weekDayNum = i;
            break;
        }
    }
    return weekDayNum;
}

/*
 * Returns the name of the week day
 * @param {Number} dayNum
 * @return {String} weekDayName
 */
function getWeekDayName(dayNum)
{
    var weekDayName = "";
    var weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    weekDayName = weekDayNames[dayNum];
    return weekDayName;
}


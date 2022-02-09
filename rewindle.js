function clear_local_storage() {
    var dark_theme = false;
    if (localStorage.getItem("darkTheme") == "true") dark_theme = true;
    localStorage.clear();
    if (dark_theme == true) localStorage.setItem("darkTheme", "true");
    else localStorage.setItem("darkTheme", "false");
}

function reset_all() {
    if (window.confirm("Are you sure? All progress will be reset.")) {
        clear_local_storage();
        localStorage.setItem("DateOffset", 1);
        location.reload();
    }
}

function offset_day(allowed = false) {
    if (event.key === 'Enter') {
        allowed = true;
    }
    if (!allowed) return;
    clear_local_storage();
    if (document.getElementById("day_rewind_count").value >= 1) localStorage.setItem("DateOffset", document.getElementById("day_rewind_count").value);
    else localStorage.setItem("DateOffset", 1);
    location.reload();
}

function current_day_setting() {
    var date = new Date(Date.now());
    if (localStorage.getItem("DateOffset") != null) {
        date.setDate(date.getDate() - localStorage.getItem("DateOffset"));
    }
    document.getElementById("current_chrono").innerHTML = date.toDateString();;
}

function set_dark_theme() {
    var a = document.querySelector("body");
    if (localStorage.getItem("darkTheme") == "true") {
        a.classList.add("nightmode");
    }
    else {
        a.classList.remove("nightmode");
    }
}

function load_custom_values() {
    if (localStorage.getItem("DateOffset") != null) {
        if (localStorage.getItem("DateOffset") <= 0) localStorage.setItem("DateOffset", 1);
    }
    else localStorage.setItem("DateOffset", 1);
    document.getElementById("day_rewind_count").value = localStorage.getItem("DateOffset");
    current_day_setting();
    set_dark_theme();
}

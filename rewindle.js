function clear_local_storage() {
    var dark_theme = localStorage.getItem("darkTheme") === "true" ? true : false;
    localStorage.clear();
    localStorage.setItem("darkTheme", JSON.stringify(dark_theme));
}

function reset_all() {
    if (window.confirm("Are you sure? Current progress will be reset.")) {
        clear_local_storage();
        localStorage.setItem("DateOffset", 1);
        location.reload();
    }
}

function offset_day(keypress_override = false) {
    if (JSON.parse(localStorage.gameState).boardState[0] === "" && document.getElementById("day_rewind_count").value === localStorage.getItem("DateOffset")) return;
    if (!keypress_override && event.key !== 'Enter') return;
    if (JSON.parse(localStorage.gameState).boardState[0] !== "" && !window.confirm("Are you sure? Current progress will be reset.")) return;
    clear_local_storage();
    localStorage.setItem("DateOffset", document.getElementById("day_rewind_count").value >= 1 ? document.getElementById("day_rewind_count").value : 1);
    location.reload();
}

function current_day_setting() {
    var date = new Date(Date.now());
    date.setDate(date.getDate() - localStorage.getItem("DateOffset"));
    document.getElementById("current_chrono").innerHTML = date.toDateString();
}

function set_dark_theme() {
    var body = document.querySelector("body");
    if (localStorage.getItem("darkTheme") === "true") body.classList.add("nightmode");
    else body.classList.remove("nightmode");
}

function load_custom_values() {
    if (localStorage.getItem("DateOffset") == null || localStorage.getItem("DateOffset") <= 0) localStorage.setItem("DateOffset", 1);
    document.getElementById("day_rewind_count").value = localStorage.getItem("DateOffset");
    current_day_setting();
    set_dark_theme();
}

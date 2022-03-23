function store_puzzle_game_state(puzzle_key) {
    var all_states;
    if (localStorage.getItem("AllGameStates") == null) {
        all_states = new Object();
        all_states[puzzle_key] = JSON.parse(localStorage.getItem("gameState"));
        localStorage.setItem("AllGameStates", JSON.stringify(all_states))
    }
    else {
        all_states = JSON.parse(localStorage.getItem("AllGameStates"));
        all_states[puzzle_key] = JSON.parse(localStorage.getItem("gameState"));
        localStorage.setItem("AllGameStates", JSON.stringify(all_states))
    }
}

function load_puzzle_game_state(puzzle_key) {
    var all_states;
    if (localStorage.getItem("AllGameStates") == null || puzzle_key == null) {
        return;
    }
    else {
        all_states = JSON.parse(localStorage.getItem("AllGameStates"));
        var stored_state = all_states[puzzle_key];
        if (stored_state == null) return;
        localStorage.setItem("gameState", JSON.stringify(stored_state));
    }
}

function check_game_state() {
    if (event.key !== 'Enter') return;
    var last_state = JSON.parse(localStorage.getItem("lastGameState"));
    var current_state = JSON.parse(localStorage.getItem("gameState"));
    if (last_state != current_state) {
        localStorage.setItem("lastGameState", JSON.stringify(current_state))
        var current_puzzle = localStorage.getItem("SelectedPuzzle");
        if (current_puzzle != null) {
            store_puzzle_game_state(current_puzzle);
        }
    }
}

function get_puzzle_count() {
    var today = new Date();
    return Math.round(Math.abs((new Date(2021, 5, 19) - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000));
}

function get_puzzle_offset(puzzle) {
    var puzzle_offset = get_puzzle_count() - puzzle;
    return puzzle_offset
}

function set_date_offset(puzzle) {
    localStorage.setItem("DateOffset", get_puzzle_offset(puzzle))
}

function default_puzzle() {
    return get_puzzle_count() - 1;
}

function clear_local_storage() {
    var dark_theme = localStorage.getItem("darkTheme") === "true" ? true : false;
    var date_offset = localStorage.getItem("DateOffset") == null ? get_puzzle_offset(default_puzzle()) : localStorage.getItem("DateOffset");
    var selected_puzzle = localStorage.getItem("SelectedPuzzle") == null ? default_puzzle() : localStorage.getItem("SelectedPuzzle");
    var statistics = JSON.parse(localStorage.getItem("statistics"));
    var all_states = JSON.parse(localStorage.getItem("AllGameStates"));
    localStorage.clear();
    localStorage.setItem("SelectedPuzzle", selected_puzzle);
    localStorage.setItem("DateOffset", date_offset);
    localStorage.setItem("darkTheme", JSON.stringify(dark_theme));
    if (statistics != null) localStorage.setItem("statistics", JSON.stringify(statistics));
    if (all_states != null) localStorage.setItem("AllGameStates", JSON.stringify(all_states));
}

function reset_all() {
    if (window.confirm("WARNING: Completion and Statistics for ALL PUZZLES will be reset!! Are you sure?") && window.confirm("Are you REALLY sure???")) {
        localStorage.clear();
        location.reload();
    }
}

function offset_day(keypress_override = false) {
    if (JSON.parse(localStorage.gameState).boardState[0] === "" && document.getElementById("selected_puzzle").value === localStorage.getItem("SelectedPuzzle")) return;
    if (!keypress_override && event.key !== 'Enter') return;
    if (JSON.parse(localStorage.gameState).boardState[0] !== "" && document.getElementById("selected_puzzle").value === localStorage.getItem("SelectedPuzzle") && window.confirm("Are you sure? Current puzzle progress will be reset.")) {
        var all_states = JSON.parse(localStorage.getItem("AllGameStates"));
        delete all_states[parseInt(localStorage.getItem("SelectedPuzzle"))];
        localStorage.setItem("AllGameStates", JSON.stringify(all_states));
    }
    else store_puzzle_game_state(localStorage.getItem("SelectedPuzzle"));
    clear_local_storage();
    localStorage.setItem("SelectedPuzzle", document.getElementById("selected_puzzle").value >= get_puzzle_count() ? default_puzzle() : document.getElementById("selected_puzzle").value);
    set_date_offset(localStorage.getItem("SelectedPuzzle"));
    load_puzzle_game_state(localStorage.getItem("SelectedPuzzle"));
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

function adjust_puzzle_number(n){
    var adjusted_number = parseInt(document.getElementById("selected_puzzle").value) + parseInt(n);
    document.getElementById("selected_puzzle").value = adjusted_number;
    offset_day(true);
}

function load_custom_values() {
    let gameStateOverride = sessionStorage.getItem('gameStateOverride');
    if (!gameStateOverride) {
        load_puzzle_game_state(localStorage.getItem("SelectedPuzzle"));
        sessionStorage.setItem('gameStateOverride', true);
        location.reload();
    }
    if (localStorage.getItem("DateOffset") == null || localStorage.getItem("DateOffset") <= 0) {
        localStorage.setItem("DateOffset", 1);
        let initialLoad = sessionStorage.getItem('initialLoadComplete');
        if (!initialLoad) {
            sessionStorage.setItem('initialLoadComplete', true);
            location.reload();
        }
    }
    if (localStorage.getItem("ForceResetStorage") === 'true'){
        reset_all();
        localStorage.removeItem("ForceResetStorage");
    }
    if (localStorage.getItem("SelectedPuzzle") == null || localStorage.getItem("SelectedPuzzle") >= get_puzzle_count()) localStorage.setItem("SelectedPuzzle", default_puzzle());
    document.getElementById("selected_puzzle").value = localStorage.getItem("SelectedPuzzle");
    set_date_offset(localStorage.getItem("SelectedPuzzle"));
    current_day_setting();
    set_dark_theme();
}
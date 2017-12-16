// Functions ----------------------------------

/**
 * Load dictionary with specific language
 * @param {string} language - Words language
 */
function loadDictionary(language, callback) {
  loadJSON('dict/' + language + '.json', function (data) {
    dictionary = data;
    callback();
  }, function (error) {
    alert(error);
  });
}


/**
 * Switching teams color
 */
function switchTeam() {
  if (teamId == 0) {
    teamId = 1;
    turnEl.classList.add('current1');
    turnEl.classList.remove('current0');
  } else {
    teamId = 0;
    turnEl.classList.add('current0');
    turnEl.classList.remove('current1');
  }
}

function startSelecting(target) {
  selecting = target;
  selecting.classList.add('selected');
}


function startTap(e) {
  tapStartTime = new Date().getTime();
  var target = e.target;

  if (target.classList.contains('card') &&
      !target.classList.contains('opened')) {
    startSelecting(target);
  }

  if (clickedInsideId(target, 'full')) {
    toggleFullScreen();
  }

  if (target.id == 'reload') {
    window.location.reload(true);
  }

  if (clickedInsideId(target, 'turn')) {
    switchTeam();
  }

  e.preventDefault();
  return false;
}


function endTap(e) {
  var tapEndTime = new Date().getTime();
  var tapTime = tapEndTime - tapStartTime;
  var longtap = tapTime > 600;


  if (clickedInsideId(e.target, 'hint')) {
    if (longtap) {
      loadGame();
    } else {
      toggleHint();
    }
  }

  if (selecting) {
    if (longtap) {
      openCard(parseId(selecting.id));
    }

    selecting.classList.remove('selected');
    selecting = null;
  }
}


function openCard(id) {
  var fieldTeamId = field[id].roleId - 2;

  if (field[id].roleId == 0) {
    gameOver();
  } else if (field[id].roleId == 1) { // neutral
    switchTeam();
  } else if (fieldTeamId == teamId) { // proper
    teams[fieldTeamId].cards--;
    updateTeamCounter(fieldTeamId);
  } else {                            // fail
    teams[fieldTeamId].cards--;
    updateTeamCounter(fieldTeamId);
    switchTeam();
  }

  field[id].opened = true;
  selecting.classList.add(roleNames[field[id].roleId], 'opened');
}


function updateTeamCounter(teamId) {
  teams[teamId].counterEl.innerHTML = teams[teamId].cards;
}


function getRandomWordId(usedWords, dictionary) {
  var wordId = random.integer(0, dictionary.length);

  if (usedWords.indexOf(wordId) == -1) {
    return wordId;
  } else {
    return getRandomWordId(usedWords, dictionary);
  }
}


function getRandomRole(availableRoles) {
  var rolesLength = availableRoles.length;
  var roleId = random.integer(0, rolesLength);
  var shiftedRoleId;

  for (var i = 0; i < rolesLength; i++) {
    shiftedRoleId = roleId + i;
    if (shiftedRoleId >= rolesLength) {
      shiftedRoleId -= rolesLength;
    }
    if (availableRoles[shiftedRoleId]) {
      return shiftedRoleId;
    }
  }
}

function fillField(fieldEl, dictionary) {
  var usedWords = [];
  var availableRoles = cfg.roles.slice(0);

  for (var i = 0; i < cfg.field.size; i++) {   
    field[i] = {
      wordId: getRandomWordId(usedWords, dictionary),
      roleId: getRandomRole(availableRoles)
    };

    usedWords.push(field[i].wordId);
    availableRoles[field[i].roleId]--;
  }

  random.shuffle(field);
}


function toggleHint() {
  if (hint) {
    hideHint();
    hint = false;
  } else {
    showHint();
    hint = true;
  }
}


function showHint() {
  var cardEl;

  document.body.classList.add('hint');

 for (var i = 0; i < field.length; i++) {
    cardEl = document.getElementById('c' + i);
    cardEl.classList.add(roleNames[field[i].roleId]);
  }
}


function hideHint() {
  var cardEl;

  document.body.classList.remove('hint');

  for (var i = 0; i < field.length; i++) {
    cardEl = document.getElementById('c' + i);
    if (!field[i].opened) {
      cardEl.classList.remove(roleNames[field[i].roleId]);
    }
  }
}

function gameOver() {
  //alert('death');
}


// Render ----------------------------------

function renderField() {
  var html = [];
  var word, role;

  for (var i = 0; i < field.length; i++) {
    word = dictionary[field[i].wordId];

    if (field[i].opened) {
      role = roleNames[field[i].roleId];
    } else {
      role = '';
    }

    html.push(
      `<div class="cell">
        <div class="card ${role}" id="c${i}">${word}</div>
      </div>`
    );
  }

  return html.join('');
}


function loadGame() {
  //TODO
  teams[0].cards = 9;
  teams[1].cards = 8;

  select = 0;

  fillField(fieldEl, dictionary);
  fieldEl.innerHTML = renderField();

  for (var i = 0; i < teams.length; i++) {
    updateTeamCounter(i);
  }
}



// Vars ----------------------------------

var random = new Random();

var height = document.body.clientHeight;
var width = document.body.clientWidth;

var selecting = null;
var select;

var hint;
var touchStartTime, touchEndTime;
var tapStartTime, tapEndTime;
var dictionary = [];
var teamId = 0;
var field = [];
var fieldEl = document.getElementById('field');
var turnEl = document.getElementById('turn');
var hintEl = document.getElementById('hint');
var roleNames = ["fatal", "neutral", "red", "blue"];

var cfg = {
  field: {
    size: 24
  },
  roles: [1, 6, 9, 8], // death, neautral, team1, team2
  teams: [
    {
      color: 'red',
      cards: 9,
      counterEl: document.getElementById('team1')
    },
    {
      color: 'blue',
      cards: 8,
      counterEl: document.getElementById('team2')
    }
  ]
}

var teams = cfg.teams;



// Events ----------------------------------

document.addEventListener('touchstart', startTap);
document.addEventListener('touchend', endTap);



// Runtime ----------------------------------

loadDictionary('ru', function () {
  loadGame();
});


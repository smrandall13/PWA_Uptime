const container = document.getElementById('brakets-content');
const BRACKET = {
	settings: { bracket: null },
	brackets: [
		{
			id: 1, // Id of Bracket name:bracketName,
			title: 'Pool 02', // Name of Bracket
			game: 'Pool / Billiards', // Game Type
			location: 'Home',
			organizer: 'Shaun',
			status: 'pending', // Pending, Active, Finished, Paused
			elimination: 'single', // How many losses before elimination
			format: 'bestof1', // Best of #
			winner: 0,
			rules: { matchlimit: 0, wincondition: 'Game Winner', tiebreaker: 'Coin Toss' },
			teams: [
				// List of Teams / Players
				{ id: 1, name: 'Jared', color: 'red' },
				{ id: 2, name: 'Shaun', color: 'blue' },
				{ id: 3, name: 'Susan', color: 'yellow' },
				{ id: 4, name: 'Jamie', color: 'cyan' },
			],
			matches: [
				{
					id: 1,
					start: '2025-02-06 10:05',
					end: '2025-02-06 10:15',
					team1: 1,
					team2: 3,
					games: [{ id: 1, score1: 0, score2: 0, winner: 1 }],
				},
				{
					id: 2,
					start: '2025-02-07 11:15',
					end: '2025-02-07 11:27',
					team1: 2,
					team2: 4,
					games: [{ id: 1, score1: 0, score2: 0, winner: 2 }],
				},
			], // List of Matches Played
		},
		{
			id: 2, // Id of Bracket name:bracketName,
			title: 'Basket Ball 3x3', // Name of Bracket
			game: 'Basket Ball', // Game Type
			location: 'Fox Elementary Playground',
			status: 'pending', // Pending, Active, Finished, Paused
			elimination: 'single', // How many losses before elimination
			format: 'bestof3', // Best of #
			organizer: 'Booster Club',
			winner: 0,
			rules: { matchlimit: 15, wincondition: 'Game Winner', tiebreaker: 'Coin Toss' },
			teams: [
				// List of Teams / Players
				{ id: 1, name: 'Team Red', color: 'red', members: ['Susan', 'Jenny', 'Melody'] },
				{ id: 2, name: 'Team Blue', color: 'blue', members: ['Shaun', 'Jared', 'Jamie'] },
				{ id: 3, name: 'Team Yellow', color: 'yellow', members: ['Will', 'Ros', 'Alayna'] },
				{ id: 4, name: 'Team Cyan', color: 'cyan', members: ['German', 'Even', 'Levi'] },
				{ id: 5, name: 'Team Green', color: 'green', members: ['Debbie', 'Skyler', 'Isabella'] },
			],
			matches: [
				{
					id: 1,
					team1: 1,
					team2: 2,
					start: '2025-02-07 10:00',
					end: '2025-02-07 10:15',
					games: [
						{ id: 1, score1: 0, score2: 0, winner: 1 },
						{ id: 2, score1: 0, score2: 0, winner: 1 },
						{ id: 3, score1: 0, score2: 0, winner: 2 },
						{ id: 4, score1: 0, score2: 0, winner: 2 },
						{ id: 5, score1: 0, score2: 0, winner: 1 },
					],
				},
			], // List of Matches Played
		},
		{
			id: 3, // Id of Bracket name:bracketName,
			title: 'Pool 01', // Name of Bracket
			game: 'Pool / Billiards', // Game Type
			location: "Jared's House",
			organizer: 'Jared',
			status: 'finished', // Pending, Active, Finished, Paused
			elimination: 'single', // How many losses before elimination
			format: 'bestof1', // Best of #
			date: '2025-02-06',
			winner: 2,
			rules: { matchlimit: 0, wincondition: 'Game Winner', tiebreaker: 'Coin Toss' },
			teams: [
				// List of Teams / Players
				{ id: 1, name: 'Jared', color: 'red' },
				{ id: 2, name: 'Shaun', color: 'blue' },
				{ id: 3, name: 'Susan', color: 'yellow' },
				{ id: 4, name: 'Jamie', color: 'cyan' },
			],
			matches: [
				{
					id: 1,
					start: '2025-02-06 10:05',
					end: '2025-02-06 10:15',
					team1: 1,
					team2: 3,
					games: [{ id: 1, score1: 0, score2: 0, winner: 1 }],
				},
				{
					id: 2,
					start: '2025-02-07 11:15',
					end: '2025-02-07 11:27',
					team1: 2,
					team2: 4,
					games: [{ id: 1, score1: 0, score2: 0, winner: 2 }],
				},
				{
					id: 3,
					start: '2025-02-07 12:15',
					end: '2025-02-07 13:27',
					team1: 1,
					team2: 2,
					games: [{ id: 1, score1: 0, score2: 0, winner: 2 }],
				},
			], // List of Matches Played
		},
	],
	colors: ['#E63946', '#F4A261', '#2A9D8F', '#E9C46A', '#F77F00', '#A8DADC', '#457B9D', '#D62828', '#F8C8DC', '#3D348B', '#F2E94E', '#8AC926', '#B5179E', '#FB8500', '#06D6A0', '#F15BB5', '#FF595E', '#8338EC', '#1982C4', '#D9ED92'],
	page: function (pageName) {
		container.innerHTML = '';
		let content = ``;
		if (pageName == 'home') {
			// Reset
			STORAGE.reset('app-bracket');

			// Brackets - Open
			const openBrackets = BRACKET.brackets.filter((b) => b.status !== 'finished');

			// Brackets - Closed
			const closedBrackets = BRACKET.brackets.filter((b) => b.status == 'finished');

			content = `<h1>Tournament Brackets</h1>`;
			content += `<div class='brackets-header'>
						<div id='brackets-button-ongoing' class='app-button brackets-header-button brackets-header-button-left app-button-active' disabled>Ongoing</div>
						<div id='brackets-button-finished' class='app-button brackets-header-button brackets-header-button-center' disabled>Finished</div>
						<div id='brackets-button-create' class='app-button brackets-header-button brackets-header-button-right' disabled>Create</div>

						<div id='brackets-button-help' class='app-button app-button-rounded brackets-header-button app-icon-help' style='margin-left:16px;background-size:50%;' title='Help'></div>
					</div><div class='brackets-break brackets-break-top'></div>`;

			// Open Brackets - Tables of Brackets
			let openContent = `<div id='brackets-ongoing' class='flex-column app-block' style='margin:0;'><h2 style='margin:24px 0;'>Ongoing Brackets</h2>`;
			if (openBrackets && openBrackets.length && openBrackets.length > 0) {
				let openRows = ``;
				for (let i = 0; i < openBrackets.length; i++) {
					const bracket = openBrackets[i];

					// Brackets Min
					// const minStartDate = new Date(Math.min(...brackets.flatMap((bracket) => bracket.matches.map((match) => new Date(match.start))))).toISOString(); // Convert to readable format

					// Bracket Min
					let startDate = bracket.matches.map((match) => match.start).reduce((a, b) => (new Date(a) < new Date(b) ? a : b));
					startDate = formatDate(startDate) + ' ' + formatTime(startDate);

					// Count wins for each team
					const winCounts = bracket.matches
						.flatMap((match) => match.games.map((game) => game.winner))
						.reduce((acc, winnerId) => {
							acc[winnerId] = (acc[winnerId] || 0) + 1;
							return acc;
						}, {});

					console.log('WC', winCounts);

					// Find the team with the most wins
					const maxWins = Math.max(...Object.values(winCounts));
					const winningTeamId = Object.keys(winCounts).find((id) => winCounts[id] === maxWins);
					const winningTeam = bracket.teams.find((team) => team.id == winningTeamId).name;

					openRows += `  <div class='brackets-table-row'>
									<div class='brackets-table-cell'><div id='bracket-${bracket.id}' class='brackets-details-button app-button bracket-button-view'></div></div>
									<div class='brackets-table-cell'>${bracket.title}</div>
									<div class='brackets-table-cell'>${winningTeam}</div>
									<div class='brackets-table-cell'>${formatDate(bracket.date)}</div>
									<div class='brackets-table-cell'>${startDate}</div>
								</div>`;
				}

				openContent += `<div class='brackets-container' style='justify-content:center;align-items:center;'>
								<div class='brackets-table'>
									<div class='brackets-table-header'>
										<div class='brackets-table-cell' style='width:50px;'> </div>
										<div class='brackets-table-cell' style='width:170px;'>Title</div>
										<div class='brackets-table-cell' style='width:170px;'>Leader</div>
										<div class='brackets-table-cell' style='width:170px;'>Date</div>
										<div class='brackets-table-cell' style='width:170px;'>Started</div>
									</div>${openRows}
								</div>
							</div>`;
			} else {
				openContent += `<div class='brackets-container'><div class='brackets-group'>No Ongoing Brackets</div></div>`;
			}
			openContent += `</div>`;

			// Closed Brackets - Finalized Bracket
			let closedContent = `<div id='brackets-finished' class='flex-column app-hidden app-block' style='margin:0;'><h2 style='margin:24px 0;'>Finished Brackets</h2>`;
			if (closedBrackets && closedBrackets.length && closedBrackets.length > 0) {
				let closedRows = ``;
				for (let i = 0; i < closedBrackets.length; i++) {
					const bracket = closedBrackets[i];

					let startDate = bracket.matches.map((match) => match.start).reduce((a, b) => (new Date(a) < new Date(b) ? a : b));
					startDate = formatDate(startDate) + ' ' + formatTime(startDate);
					let endDate = bracket.matches.map((match) => match.end).reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
					endDate = formatDate(endDate) + ' ' + formatTime(endDate);
					let winner = bracket.teams.find((team) => team.id == bracket.winner).name;

					closedRows += `  <div class='brackets-table-row'>
									<div class='brackets-table-cell'><div id='bracket-${bracket.id}' class='brackets-details-button app-button bracket-button-view'></div></div>
									<div class='brackets-table-cell'>${bracket.title}</div>
									<div class='brackets-table-cell'>${winner}</div>
									<div class='brackets-table-cell'>${startDate}</div>
									<div class='brackets-table-cell'>${endDate}</div>
								</div>`;
				}
				closedContent += `<div class='brackets-container' style='justify-content:center;align-items:center;'>
								<div class='brackets-table'>
									<div class='brackets-table-header'>
										<div class='brackets-table-cell' style='width:50px;'> </div>
										<div class='brackets-table-cell' style='width:170px;'>Title</div>
										<div class='brackets-table-cell' style='width:170px;'>Winner</div>
										<div class='brackets-table-cell' style='width:170px;'>Started</div>
										<div class='brackets-table-cell' style='width:170px;'>Finished</div>
									</div>${closedRows}
								</div>
							</div>`;
			} else {
				closedContent += `<div class='brackets-container'><div class='brackets-group'>No Finished Brackets</div></div>`;
			}
			closedContent += `</div>`;

			// Create Bracket - Bracket Create Form
			// <label class='brackets-row-label' for='bracket-title'>Game</label><div class='brackets-row-value'><input id='bracket-game' type='text' list='list-brackets-game'></div><div class="brackets-row-note">Game Played</div>;

			let createContent = `<div id='brackets-create' class='flex-column app-hidden app-block' style='margin:0;'>
								<h2 id='brackets-create' style='margin:24px 0;'>Create Bracket</h2>
								<div class='brackets-row-note'>* Required</div>

								<div class='brackets-container'>

									<div class='brackets-group'><div class='brackets-box'>
										<label class='brackets-row-label' for='bracket-title'>* Title</label><div class='brackets-row-value'><input id='bracket-title' class='app-input' type='text' required list='list-brackets-title'></div>
										<div class='brackets-row-note'>Event Title used to identify the Bracket</div>

										<label class='brackets-row-label' for='bracket-elimination'>E-Type</label><div class='brackets-row-value'><select id='bracket-elimination' ><option value='single'>Single</option><option value='double'>Double</option></select></div>
										<div class='brackets-row-note'>Elimination Type</div>

										<label class='brackets-row-label' for='bracket-format'>Format</label><div class='brackets-row-value'><select id='bracket-format' ><option value='bestof1'>Best of 1</option><option value='bestof3'>Best of 3</option><option value='bestof5'>Best of 5</option><option value='bestof7'>Best of 7</option></select></div>
										<div class='brackets-row-note'>Match Format - Number of Games Per Match</div>
									</div></div>

									<div class='brackets-group'><div class='brackets-box'>
										<label class='brackets-row-label' for='bracket-organizer'>Organizer</label><div class='brackets-row-value'><input id='bracket-organizer' type='text' list='list-brackets-organizer'></div>
										<div class='brackets-row-note'>Person or Organization Hosting the Event</div>

										<label class='brackets-row-label' for='bracket-location'>Location</label><div class='brackets-row-value'><input id='bracket-location' type='text' list='list-brackets-location'></div>
										<div class='brackets-row-note'>Location the Event is Held</div>

										<label class='brackets-row-label' for='bracket-date'>Date</label><div class='brackets-row-value'><input id='bracket-date' type='date'></div>
										<div class='brackets-row-note'>Date the Event is Held</div>
									</div></div>

								</div>

								<div class='brackets-break' style='margin:0 0 24px 0'></div>

								<div class='brackets-container'>

									<div class='brackets-group'><div class='brackets-group-title'>Rules</div><div class='brackets-box'>
										<label class='brackets-row-label' for='bracket-rule-matchlimit'>Time Limit</label><div class='brackets-row-value'><input id='bracket-rule-matchlimit' type='number' min='0' step='1' value='0'></div>
										<div class='brackets-row-note'>Optional Time Limit for each match in Minutes</div>

										<label class='brackets-row-label' for='bracket-rule-tiebreaker'>Tiebreaker</label><div class='brackets-row-value'><input id='bracket-rule-tiebreaker' type='text'></div>
										<div class='brackets-row-note'>What to do in the event of a tiebreaker</div>

										<label class='brackets-row-label' for='bracket-rule-winconditions'>Win Conditions</label><div class='brackets-row-value'><input id='bracket-rule-winconditions' type='text'></div>
										<div class='brackets-row-note'>What conditions determine a win</div>

										<label class='brackets-row-label' for='bracket-rule-other'>Other Rules</label><div class='brackets-row-value'><textarea id='bracket-rule-other'></textarea></div>
										<div class='brackets-row-note'>Other Rules to be Enforced</div>
									</div></div>

									<div class='brackets-group'><div class='brackets-group-title'>Teams / Players</div><div id='brackets-teams-list' class='brackets-box'>
										<label class='brackets-row-label' for='bracket-team-1'>* Team 1</label><div class='brackets-row-value'><input id='bracket-team-1' type='text' list='list-brackets-team' required class='app-input'></div>
										<div class='brackets-row-note'><div id='braket-team-1-add' class='brackets-member-add'>+ Add Members</div></div>

										<label class='brackets-row-label' for='bracket-team-2'>* Team 2</label><div class='brackets-row-value'><input id='bracket-team-2' type='text' list='list-brackets-team' required class='app-input'></div>
										<div class='brackets-row-note'><div id='braket-team-2-add' class='brackets-member-add'>+ Add Members</div></div>

										<label class='brackets-row-label' for='bracket-team-3'>Team 3</label><div class='brackets-row-value'><input id='bracket-team-3' type='text' list='list-brackets-team'></div>
										<div class='brackets-row-note'><div id='braket-team-3-add' class='brackets-member-add'>+ Add Members</div></div>

										<label class='brackets-row-label' for='bracket-team-4'>Team 4</label><div class='brackets-row-value'><input id='bracket-team-4' type='text' list='list-brackets-team'></div>
										<div class='brackets-row-note'><div id='braket-team-4-add' class='brackets-member-add'>+ Add Members</div></div>
									<div class='brackets-row-span' style='margin-top:16px;'><div id='brackets-add-team' class='app-button app-button-small' id='bracket-add-team'>Add Team</div></div>
									</div></div>
								</div>

								<div class='brackets-row-span' style='margin-top:16px;'><div id='brackets-bracket-create' class='app-button'>Create Bracket</div></div>`;

			// Datalist
			if (BRACKET.brackets.length > 0) {
				// Titles
				const uniqueTitles = [...new Set(BRACKET.brackets.map((bracket) => bracket.title))].sort();
				createContent += `<datalist id='list-brackets-title'>`;
				uniqueTitles.forEach((entry) => (createContent += `<option value='` + entry + `'>`));
				createContent += `</datalist>`;

				// Locations
				const uniqueLocations = [...new Set(BRACKET.brackets.map((bracket) => bracket.location))].sort();
				createContent += `<datalist id='list-brackets-location'>`;
				uniqueLocations.forEach((entry) => (createContent += `<option value='` + entry + `'>`));
				createContent += `</datalist>`;

				// Organizers
				const uniqueOrganizer = [...new Set(BRACKET.brackets.map((bracket) => bracket.organizer))].sort();
				createContent += `<datalist id='list-brackets-organizer'>`;
				uniqueLocations.forEach((entry) => (createContent += `<option value='` + entry + `'>`));
				createContent += `</datalist>`;

				// Games
				const uniqueGames = [...new Set(BRACKET.brackets.map((bracket) => bracket.game))].sort();
				createContent += `<datalist id='list-brackets-game'>`;
				uniqueGames.forEach((entry) => (createContent += `<option value='` + entry + `'>`));
				createContent += `</datalist>`;

				// Teams
				let teamsArray = [];
				BRACKET.brackets.forEach((bracket) => {
					bracket.teams.forEach((team) => {
						teamsArray.push(team.name);
					});
				});
				const uniqueTeams = [...new Set(teamsArray.map((team) => team))].sort();
				createContent += `<datalist id='list-brackets-team'>`;
				uniqueTeams.forEach((entry) => (createContent += `<option value='` + entry + `'>`));
				createContent += `</datalist>`;

				// Players
			}
			createContent += `</div>`;

			content += openContent + closedContent + createContent;
		}

		container.innerHTML = content;

		// Add Event Listeners
		const helpButton = document.getElementById('brackets-button-help');
		helpButton.addEventListener('click', () => {
			MESSAGE.show('Help', 'This is the help');
		});

		const load = function (pageActive) {
			const pages = ['ongoing', 'finished', 'create'];
			pages.forEach((page) => {
				document.getElementById('brackets-' + page).classList.add('app-hidden');
				document.getElementById('brackets-button-' + page).classList.remove('app-button-active');

				if (page == pageActive) {
					document.getElementById('brackets-' + page).classList.remove('app-hidden');
					document.getElementById('brackets-button-' + page).classList.add('app-button-active');
				}
			});
		};

		document.getElementById('brackets-button-ongoing').addEventListener('click', () => {
			load('ongoing');
		});
		document.getElementById('brackets-button-finished').addEventListener('click', () => {
			load('finished');
		});
		document.getElementById('brackets-button-create').addEventListener('click', () => {
			load('create');
		});

		const detailsButtons = Array.from(document.getElementsByClassName('brackets-details-button'));
		if (detailsButtons && detailsButtons.length && detailsButtons.length > 0) {
			detailsButtons.forEach((button) =>
				button.addEventListener('click', () => {
					const bracketID = button.id.split('-')[1];
					BRACKET.bracket.load(bracketID);
				})
			);
		}

		document.getElementById('brackets-bracket-create').addEventListener('click', () => {
			BRACKET.bracket.create();
		});
	},
	player: {
		create: function (playerName) {
			const player = {
				id: 0,
				name: playerName, // Name of Player
				color: playerColor, // Color of Player/Team
				size: 1, // Size of Player/Team
			};
		},
		remove: function (playerName) {},
	},
	match: {
		create: function (bracketID, player1, player2) {
			// Check Params
			if (isEmpty(bracketID) || isEmpty(player1) || isEmpty(player2)) {
				return;
			}

			// Check Bracket
			const bracket = BRACKET.brackets.find((b) => b.id === bracketID);
			if (bracket && bracket.length && bracket.length > 0) {
				bracket = bracket[0];
			}
			if (!bracket || bracket.id != bracketID) {
				return;
			}

			// Get Matches
			const matches = bracket.matches;

			const match = {
				id: 0,
				player1: player1,
				player2: player2,
				games: [{ score: [0, 0], winner: null }],
			};
		},
		winner: function (matchID, playerID) {},
	},
	bracket: {
		create: function () {
			// Fix Bracket Ids
			let bid = 0;
			BRACKET.brackets.forEach((bracket) => {
				bid++;
				bracket.id = bid;
			});

			const bracketTitle = getValue('bracket-title');

			const team01 = getValue('bracket-team-1');
			const team02 = getValue('bracket-team-2');
			const team03 = getValue('bracket-team-3');
			const team04 = getValue('bracket-team-4');

			if (isEmpty(bracketTitle) || isEmpty(team01) || isEmpty(team02)) {
				MESSAGE.error('Please fill out all required fields.');
				return;
			}
			const bracketGame = getValue('bracket-game');
			const bracketLocation = getValue('bracket-location');
			const bracketOrganizer = getValue('bracket-organizer');
			const bracketDate = getValue('bracket-date');

			let bracketElimination = getValue('bracket-elimination');
			if (isEmpty(bracketElimination)) {
				bracketElimination = 'single';
			}
			let bracketFormat = getValue('bracket-format');
			if (isEmpty(bracketFormat)) {
				bracketFormat = 'bestof1';
			}

			// Teams
			const bracketTeams = [];
			let teamsCount = 1;
			for (let t = 1; t <= 100; t++) {
				let teamName = getValue('bracket-team-' + t);
				if (isEmpty(teamName)) {
					teamColor = BRACKET.colors[teamsCount];
					bracketTeams.push({ id: teamsCount, name: team01, color: teamColor, members: [] });

					// Add Members
					for (let m = 1; m <= 20; m++) {
						let memberName = getValue('bracket-team-' + t + '-member-' + m);
						if (!isEmpty(memeberName)) {
							bracketTeams[teamsCount - 1].members.push(memberName);
						}
					}

					teamsCount++;
				}
			}

			// Create Bracket
			const bracketID = bid++;

			const bracket = {
				id: bracketID, // Id of Bracket name:bracketName,
				title: bracketTitle, // Name of Bracket
				game: bracketGame, // Game Type
				location: bracketLocation, // Location Game is Played
				organizer: bracketOrganizer,
				date: bracketDate,
				status: 'pending', // Pending, Active, Finished, Paused
				elimination: bracketElimination, // How many losses before elimination
				format: bracketFormat, // Best of #
				winner: 0, // ID of Bracket Team
				rules: { matchlimit: getValue('bracket-rule-matchlimit'), wincondition: getValue('bracket-rule-wincondition'), tiebreaker: getValue('bracket-rule-tiebreaker') },
				teams: bracketTeams,
				matches: [], // List of Matches Played
			};
			BRACKET.brackets.push(bracket);
			STORAGE.set('app-brackets', BRACKET.brackets);
			BRACKET.bracket.load(bracketID);
		},
		delete: function (bracketID = '', confirmed = 0) {
			if (!isEmpty(bracketID)) {
				if (confirmed != 1) {
					const bracket = BRACKET.brackets.find((b) => b.id == bracketID);

					MESSAGE.confirm('Delete Bracket', `Are you sure you want to delete the bracket<br><div class='line-center'>${bracket.title}?</div><div class='line-center color-caution'>This cannot be undone.</div>`, () => BRACKET.bracket.delete(bracketID, 1));
				} else {
					BRACKET.brackets = BRACKET.brackets.filter((b) => b.id != bracketID);
					STORAGE.set('app-brackets', BRACKET.brackets);
					BRACKET.page('home');
				}
			}
		},
		load: function (bracketID) {
			container.innerHTML = '';

			// Check Presents
			if (isEmpty(bracketID) || BRACKET.brackets.filter((b) => b.id == bracketID).length === 0) {
				BRACKET.page('home');
				return;
			}

			const bracket = BRACKET.brackets.find((b) => b.id == bracketID);
			STORAGE.set('app-bracket', bracketID);

			let content = `<h2 class='flex-row' style='gap:16px;'><div id='brackets-back' class='app-button app-button-rounded app-icon-home back-size-50'></div> Bracket: ${bracket.title}</h2>`;

			content += `<div id='bracket-delete' class='app-button app-button-caution app-button-large'>Delete Bracket</div>`;
			container.innerHTML = content;

			const backButton = document.getElementById('brackets-back');
			backButton.addEventListener('click', () => {
				BRACKET.page('home');
			});

			const deleteButton = document.getElementById('bracket-delete');
			deleteButton.addEventListener('click', () => {
				BRACKET.bracket.delete(bracketID, 0);
			});
		},
	},
	init: function () {
		let bracketID = STORAGE.get('app-bracket');
		BRACKET.bracket.load(bracketID);

		console.log('Bracket page initialized');
	},
};

BRACKET.init();

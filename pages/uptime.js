const container = document.getElementById('uptime-content');
const list = document.getElementById('uptime-list');

const UPTIME = {
	settings: { interval: null },
	websites: [],
	history: [],

	website: {
		add: function () {
			const input = document.getElementById('uptime-website');

			let url = input.value.trim();
			if (!isEmpty(url)) {
				if (url.substring(0, 4) !== 'http') url = 'https://' + url;
			}

			if (!isEmpty(url) && !UPTIME.websites.includes(url)) {
				UPTIME.websites.push(url);
				UPTIME.websites.sort();
				input.value = '';
				UPTIME.list.update();
			}
		},
		remove: function (index) {
			UPTIME.websites.splice(index, 1);
			UPTIME.list.update();
		},
	},
	list: {
		update: function () {
			list.innerHTML = '';

			UPTIME.websites.forEach((site, index) => {
				const row = document.createElement('div');
				row.className = 'uptime-table-row';

				const offline = UPTIME.history.filter((log) => log.url === site && log.status !== 'Online');

				let siteName = site;
				if (offline.length > 0) {
					siteName += ` <span class="uptime-offline">${offline.length}</span>`;
				}

				row.innerHTML = `
				   <div class='uptime-table-cell'><button class='app-button app-button-small' onclick="UPTIME.log.show(${index})">History</button></div>
				   <div class='uptime-table-cell'><button class='app-button app-button-small' onclick="UPTIME.check(${index})">Check</button></div>
				   <div class='uptime-table-cell'>${siteName}</div>
				   <div class='uptime-table-cell align-center' id='website-status-${index}'>Checking...</div>
				   <div class='uptime-table-cell'><div class='app-button app-button-caution app-button-small app-icon-delete app-icon' onclick="UPTIME.website.remove(${index})"></div></div>
			    `;
				list.appendChild(row);
				UPTIME.check(site, index);
			});
			STORAGE.set('uptime-websites', UPTIME.websites);
		},
	},
	check: function (index) {
		const url = UPTIME.websites[index];
		if (!isEmpty(url)) {
			const statusElement = document.getElementById(`website-status-${index}`);
			statusElement.innerHTML = 'Checking...';
			statusElement.className = 'uptime-table-cell ';
			const startTime = Date.now();
			fetch(url, { method: 'HEAD', mode: 'no-cors' })
				.then(() => {
					statusElement.innerHTML = 'Online';
					statusElement.className = 'uptime-table-cell uptime-online';
					const responseTime = Date.now() - startTime;
					UPTIME.log.add(url, 'Online', responseTime);
				})
				.catch(() => {
					statusElement.innerHTML = 'Offline';
					statusElement.className = 'uptime-table-cell uptime-offline';
					const responseTime = Date.now() - startTime;
					UPTIME.log.add(url, 'Offline', responseTime);
				});
		}
	},
	refresh: function () {
		if (UPTIME.websites && UPTIME.websites.length > 0) UPTIME.websites.forEach((site, index) => UPTIME.check(index));
	},
	log: {
		add: function (url, status, responseTime) {
			UPTIME.history.push({
				url: url,
				status: status,
				responseTime: responseTime,
				date: new Date().toISOString(),
			});

			if (UPTIME.history.length > 10000) {
				UPTIME.history.shift();
			}
			STORAGE.set('uptime-history', UPTIME.history);
		},
		show: function (index) {
			const website = UPTIME.websites[index];
			if (!isEmpty(website)) {
				const history = UPTIME.history.filter((log) => log.url === website);
				// Sort By Date Descending
				history.sort((a, b) => new Date(b.date) - new Date(a.date));
				let content = `<h3>Site: ${UPTIME.websites[index]}</h3>`;
				history.forEach((log) => {
					const statusText = log.status;
					let status = `<span class='uptime-offline'>${statusText}</span>`;
					if (statusText === 'Online') {
						status = `<span class='uptime-online'>${statusText}</span>`;
					}
					content += `<div class='uptime-log-row'>${formatDate(log.date)} ${formatTime(log.date, true)} - ${status} - ${log.responseTime}ms</div>`;
				});
				MESSAGE.show(`History for Site`, content);
			}
		},
	},
	init: function () {
		// History
		let uptimeHistory = STORAGE.get('uptime-history');
		if (isEmpty(uptimeHistory)) {
			UPTIME.history = [];
		} else {
			UPTIME.history = uptimeHistory;
		}

		// Websites
		let uptimeWebsites = STORAGE.get('uptime-websites');
		if (isEmpty(uptimeWebsites)) {
			UPTIME.websites = [];
		} else {
			UPTIME.websites = uptimeWebsites;
			UPTIME.list.update();
		}

		const inputField = document.getElementById('uptime-website'); // Replace with the actual input ID
		inputField.addEventListener('keypress', (event) => {
			console.log('K', event.key);
			if (event.key === 'Enter') {
				event.preventDefault(); // Prevent form submission if inside a form
				UPTIME.website.add();
			}
		});

		document.getElementById('uptime-add').addEventListener('click', UPTIME.website.add);

		clearInterval(UPTIME.settings.interval);
		UPTIME.settings.interval = setInterval(UPTIME.refresh, 10000); // Refresh every 10 seconds
	},
};

UPTIME.init();

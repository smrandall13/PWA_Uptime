const container = document.getElementById('uptime-content');
const list = document.getElementById('uptime-list');

const UPTIME = {
	settings: { interval: null },
	websites: [],

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
				row.innerHTML = `
				   <div class='uptime-table-cell'><button class='app-button app-button-small' onclick="UPTIME.check(${index})">Check</button></div>
				   <div class='uptime-table-cell'>${site}</div>
				   <div class='uptime-table-cell' id='website-status-${index}'>Checking...</div>
				   <div class='uptime-table-cell'><button class='app-button app-button-caution app-button-small app-icon-delete' onclick="UPTIME.remove(${index})">Remove</button></div>
			    `;
				list.appendChild(row);
				UPTIME.check(site, index);
			});
			STORAGE.set('app-uptime', UPTIME.websites);
		},
	},
	check: function (index) {
		const url = UPTIME.websites[index];
		if (!isEmpty(url)) {
			document.getElementById(`website-status-${index}`).innerHTML = 'Checking...';
			fetch(url, { method: 'HEAD', mode: 'no-cors' })
				.then(() => {
					document.getElementById(`website-status-${index}`).innerHTML = 'Online';
					document.getElementById(`website-status-${index}`).className = 'uptime-table-cell uptime-online';
				})
				.catch(() => {
					document.getElementById(`website-status-${index}`).innerHTML = 'Offline';
					document.getElementById(`website-status-${index}`).className = 'uptime-table-cell uptime-offline';
				});
		}
	},
	refresh: function () {
		if (UPTIME.websites && UPTIME.websites.length > 0) UPTIME.websites.forEach((site, index) => UPTIME.check(index));
	},
	init: function () {
		let uptimeWebsites = STORAGE.get('app-uptime');
		if (isEmpty(uptimeWebsites)) {
			UPTIME.websites = [];
		} else {
			UPTIME.websites = uptimeWebsites;
			UPTIME.list.update();
		}

		document.getElementById('uptime-add').addEventListener('click', UPTIME.website.add);

		clearInterval(UPTIME.settings.interval);
		UPTIME.settings.interval = setInterval(UPTIME.refresh, 10000); // Refresh every 10 seconds
	},
};

UPTIME.init();

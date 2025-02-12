const container = document.getElementById('uptime-content');

const UPTIME = {
	settings: { checkInterval: null, tableInterval: null },
	websites: [],
	history: [],
	website: {
		open: function (index) {
			if (index === -1) return;
			const site = UPTIME.websites[index].site;
			if (isEmpty(site)) return;
			window.open(site, `_blank`);
		},
		add: function () {
			const input = document.getElementById('uptime-website');

			let url = input.value.trim();
			if (!isEmpty(url)) {
				if (url.substring(0, 4) !== 'http') url = 'https://' + url;
			}

			if (!isEmpty(url) && !UPTIME.websites.includes(url)) {
				UPTIME.websites.push({ site: url, status: '' });
				UPTIME.websites.sort((a, b) => a.site.localeCompare(b.site));

				STORAGE.set('uptime-websites', UPTIME.websites);

				input.value = '';
				UPTIME.list.update();
			}
		},
		remove: function (index = -1, confirm = 0) {
			if (index === -1) return;
			const site = UPTIME.websites[index].site;
			if (isEmpty(site)) return;
			if (isEmpty(confirm)) confirm = 0;

			if (confirm === 0) {
				MESSAGE.confirm('Remove Website', `Are you sure you want to remove this website from the list?<br>${site}`, () => UPTIME.website.remove(index, 1));
			}
			if (confirm === 1) {
				UPTIME.websites.splice(index, 1);
				STORAGE.set('uptime-websites', UPTIME.websites);

				// Remove History
				UPTIME.history = UPTIME.history.filter((log) => log.url !== site);
				STORAGE.set('uptime-history', UPTIME.history);
			}
			UPTIME.list.update();
		},
	},
	list: {
		update: function () {
			const uptimeTable = document.getElementById('uptime-table');
			clearInterval(UPTIME.settings.tableInterval);
			if (uptimeTable && uptimeTable.innerHTML) {
				uptimeTable.innerHTML = '';

				let tableRows = [];
				UPTIME.websites.forEach((entry, index) => {
					const site = entry.site;
					let siteName = site.replace('https://', '').replace('http://', '');
					let status = entry.status;
					if (isEmpty(status)) status = 'Checking';

					const records = UPTIME.history.filter((log) => log.url === site);
					const offline = UPTIME.history.filter((log) => log.url === site && log.status !== 'Online');

					let uptime = `100% <span class='font-size-xsm italic' style='margin-left:8px;'>(${records.length} )</span>`;
					if (offline.length > 0) {
						uptime = ((records.length / (records.length + offline.length)) * 100).toFixed(2) + `% <span class='font-size-xsm italic' style='margin-left:8px;'>(${records.length - offline.length} or ${records.length})</span>`;
					}

					let lastDate = '';
					let last100 = ``;
					if (records.length > 0) {
						const last = records[records.length - 1];
						const date = new Date(last.date).toLocaleString();
						lastDate = `<div class='app-box-label'>Last</div><div class='app-box-value'>${formatDate(date) + ' ' + formatTime(date, 1)}</div>`;

						if (records.length >= 100) {
							last100 = `<div class='uptime-last-block'>`;
							for (let l = 1; l <= 100; l++) {
								const entry = records[records.length - l];

								let entryLast = formatDate(entry.date) + ' ' + formatTime(entry.date, 1);

								let entryClass = 'uptime-back-online';
								if (entry.status !== 'Online') {
									entryClass = 'uptime-back-offline';
								}
								last100 += `<div class='uptime-last-entry ${entryClass}' title='${entryLast}'></div>`;
							}
							last100 += `</div>`;
						}
					}

					if (status === 'Online') status = `<span class='uptime-online'>Online</span>`;
					if (status !== 'Online' && status !== 'Checking') status = `<span class='uptime-offline'>${status}</span>`;

					let row = `<div class='app-box app-border uptime-site' style='flex-direction:column;'>
						<div class='app-box-title' style='justify-content:start;'>
							<div class='app-button app-icon-eye app-icon-small' onclick="UPTIME.website.open(${index})" title='View'></div>
							<div class='app-ellipsis'>${siteName}</div>
							<div class='app-button app-button-caution app-icon-delete app-icon-small' style='flex:0;' onclick="UPTIME.website.remove(${index})" title='Remove'></div>
						</div>
						<div class='app-box-wrapper'>
							<div class='app-box-group'>
								<div class='app-box-content'>
									<div class='app-box-label'>
										<div class='app-button app-icon-refresh app-icon-small' style='margin-right:auto;' onclick="UPTIME.check(${index},1)" title='Refresh'></div>
										Status
									</div><div class='app-box-value' id='website-status-${index}'>${status}</div>${lastDate}
								</div>
							</div>
							<div class='app-box-group'>
								<div class='app-box-content'>
									<div class='app-box-label'>
										<div class='app-button app-icon-info app-icon-small' style='margin-right:auto;' onclick="UPTIME.log.show(${index})" title='Info'></div>
										Uptime
									</div><div class='app-box-value'>${uptime}</div>
									<div class='app-box-span'>${last100}</div>
								</div>
							</div>
						</div>
					</div>`;
					tableRows.push(row);
				});
				uptimeTable.innerHTML = `<div class='app-box' style='flex-direction:column;gap:8px;padding:0;'>${tableRows.join('')}</div>`;
			}
		},
	},
	check: function (index, force = false) {
		const entry = UPTIME.websites[index];
		let site = entry.site;
		if (!isEmpty(site)) {
			const statusElement = document.getElementById(`website-status-${index}`);
			if (statusElement) {
				if (statusElement.innerHTML && (isEmpty(statusElement.innerHTML) || force)) {
					statusElement.innerHTML = 'Checking';
				}
			}

			const startTime = Date.now();
			const url = `${site}?_=${startTime}`; // Append timestamp to prevent caching

			fetch(url, { cache: 'no-store', method: 'HEAD', mode: 'no-cors' })
				.then(() => {
					if (statusElement) {
						statusElement.innerHTML = '<span class="uptime-online">Online</span>';
					}
					const dateNow = new Date().toLocaleString();
					document.getElementById('uptime-last-checked').innerHTML = formatDate(dateNow) + ' ' + formatTime(dateNow, 1);
					const responseTime = Date.now() - startTime;
					UPTIME.log.add(site, 'Online', responseTime);
				})
				.catch(() => {
					if (statusElement) {
						statusElement.innerHTML = '<span class="uptime-offline">Offline</span>';
					}
					const responseTime = Date.now() - startTime;
					UPTIME.log.add(site, 'Offline', responseTime);
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

			UPTIME.websites.forEach((entry, index) => {
				if (entry.site === url) {
					entry.status = status;
					entry.last = new Date().toISOString();
					entry.responseTime = responseTime;
				}
			});

			if (UPTIME.history.length > 10000) {
				UPTIME.history.shift();
			}
			STORAGE.set('uptime-websites', UPTIME.websites);
			STORAGE.set('uptime-history', UPTIME.history);
			UPTIME.list.update();
		},
		show: function (index) {
			const entry = UPTIME.websites[index];
			const site = entry.site;
			if (!isEmpty(site)) {
				const history = UPTIME.history.filter((log) => log.url === site);
				// Sort By Date Descending
				history.sort((a, b) => new Date(b.date) - new Date(a.date));
				let content = `<h3>Site: ${site}</h3>`;
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
			if (event.key === 'Enter') {
				event.preventDefault(); // Prevent form submission if inside a form
				UPTIME.website.add();
			}
		});

		document.getElementById('uptime-add').addEventListener('click', UPTIME.website.add);

		clearInterval(UPTIME.settings.interval);
		UPTIME.settings.interval = setInterval(UPTIME.refresh, 10000); // Refresh every 10 seconds
		UPTIME.refresh();
	},
};

UPTIME.init();

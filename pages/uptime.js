var UPTIME = {
	websites: [],
	history: [],
	intervals: [],
	website: {
		open: function (index) {
			const site = UPTIME.website.get(index);
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
				UPTIME.websites.push({ site: url, status: '', interval: 10, notify: false });
				UPTIME.websites.sort((a, b) => a.site.localeCompare(b.site));

				STORAGE.set('uptime-websites', UPTIME.websites);

				input.value = '';

				// Get Site Index
				let position = -1;
				UPTIME.websites.forEach((entry, i) => {
					if (entry.site === url) {
						position = i;
						exit;
					}
				});
				UPTIME.list.update();
				UPTIME.check(position);
			}
		},
		remove: function (index = -1, confirm = 0) {
			const site = UPTIME.website.get(index);
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
		update: function (index) {
			const site = UPTIME.website.get(index);
			if (isEmpty(site)) return;

			let siteInterval = site.interval;
			if (isEmpty(siteInterval) || !Number.isInteger(siteInterval)) {
				siteInterval = 10;
			}

			let newInterval = parseInt(getValue(`website-${index}-interval`), 10);
			if (Number.isInteger(newInterval)) {
				if (newInterval < 10) {
					newInterval = 10;
				} else if (newInterval > 60) {
					newInterval = 60;
				}
			} else {
				newInterval = siteInterval;
			}
			UPTIME.websites[index].interval = newInterval;

			let notifyInput = document.getElementById(`website-${index}-notify`);
			UPTIME.websites[index].notify = notifyInput.checked;
			STORAGE.set('uptime-websites', UPTIME.websites);
		},
		get: function (index) {
			if (index === -1) return;
			const site = UPTIME.websites[index].site;
			if (isEmpty(site)) return;
			return site;
		},
	},
	info: {
		date: function (index) {
			if (index === -1) return '';
			const site = UPTIME.websites[index].site;
			if (isEmpty(site)) return '';
			const records = UPTIME.history.filter((log) => log.url === site);
			if (!records || records.length == 0) return '';
			const last = records[records.length - 1];
			const date = new Date(last.date).toLocaleString();
			return `<div class='app-box-label'>Last</div><div id='website-${index}-last' class='app-box-value'>${formatDate(date) + ' ' + formatTime(date, 1)}</div>`;
		},
		uptime: function (index) {
			if (index === -1) return '';
			const site = UPTIME.websites[index].site;
			if (isEmpty(site)) return '';
			const records = UPTIME.history.filter((log) => log.url === site);
			if (records.length == 0) return '0%';
			if (records.length > 0) {
				let offline = records.filter((log) => log.url === site && log.status !== 'Online');

				let percent = 100;
				if (offline.length > 0) {
					percent = 100 - ((offline.length / records.length) * 100).toFixed(2);
				}

				return percent + '%';
			}
		},
		chart: function (index) {
			if (index === -1) return '';
			const site = UPTIME.websites[index].site;
			if (isEmpty(site)) return '';
			const records = UPTIME.history.filter((log) => log.url === site);

			if (records.length > 0) {
				let lastItems = records;
				if (records.length >= 100) {
					lastItems = records.slice(-100);
				}
				let lastOffline = lastItems.filter((log) => log.url === site && log.status !== 'Online');

				let results = ``;
				for (let l = 0; l < lastItems.length; l++) {
					const entry = lastItems[l];

					let recClass = 'uptime-back-online';
					if (entry.status !== 'Online') {
						recClass = 'uptime-back-offline';
					}
					results += `<div class='uptime-last-entry ${recClass}' title='${formatDate(entry.date) + ' ' + formatTime(entry.date, 1)}'></div>`;
				}

				// WP of lastItems is lastOffline
				let lastPercent = 100;
				if (lastOffline.length > 0) {
					lastPercent = 100 - ((lastOffline.length / lastItems.length) * 100).toFixed(2);
				}

				results += `<div class='uptime-last-percent'>${lastPercent}% of Last ${lastItems.length}</div>`;

				return results;
			} else {
				return '';
			}
		},
		responseTime: function (index) {
			if (index === -1) return '';
			const site = UPTIME.websites[index].site;
			if (isEmpty(site)) return '';
			const records = UPTIME.history.filter((log) => log.url === site);
			if (!records || records.length == 0) return '';
			const last = records[records.length - 1];
			if (last.responseTime === 0) return '';
			return `<div class='app-box-label'>Response</div><div id='website-${index}-response' class='app-box-value'>${last.responseTime} ms</div>`;
		},
	},
	list: {
		update: function () {
			const uptimeTable = document.getElementById('uptime-table');
			if (uptimeTable && uptimeTable.innerHTML) {
				uptimeTable.innerHTML = '';

				let tableRows = [];
				UPTIME.websites.forEach((entry, index) => {
					const site = entry.site;
					let siteName = site.replace('https://', '').replace('http://', '');
					let entryStatus = entry.status;
					if (isEmpty(entryStatus)) entryStatus = 'Checking';

					let uptime = UPTIME.info.uptime(index);

					let entryInterval = entry.interval;
					if (isEmpty(entryInterval)) {
						entryInterval = 10;
					}
					entryInterval = `<input id='website-${index}-interval' class='uptime-input' style='min-width:60px;max-width:60px;width:60px;' value='${entryInterval}' type='number' min='10' max='60' onchange='UPTIME.website.update(${index})'>`;

					let lastDate = UPTIME.info.date(index);
					let lastResults = UPTIME.info.chart(index);
					let responseTime = UPTIME.info.responseTime(index);

					if (entryStatus === 'Online') entryStatus = `<span class='uptime-online'>Online</span>`;
					if (entryStatus !== 'Online' && entryStatus !== 'Checking') entryStatus = `<span class='uptime-offline'>${entryStatus}</span>`;

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
									</div><div class='app-box-value' id='website-status-${index}'>${entryStatus}</div>
									${lastDate}
									${responseTime}
								</div>
							</div>
							<div class='app-box-group'>
								<div class='app-box-content'>
									<div class='app-box-label'>
										<div class='app-button app-icon-info app-icon-small' style='margin-right:auto;' onclick="UPTIME.log.show(${index})" title='Info'></div>
										Uptime
									</div><div class='app-box-value'>${uptime}</div>
									<div class='app-box-label'>Interval</div><div class='app-box-value'>${entryInterval} seconds</div>
									<div class='app-box-label'>Notify</div><div class='app-box-value'>
										<div class='app-toggle-wrapper'>
											<label class='app-toggle-switch' >
												<input type='checkbox' id='website-${index}-notify' ${entry.notify ? 'checked' : ''} onchange="UPTIME.website.update(${index})" />
												<span class='app-toggle-slider'></span>
											</label>
										</div>
									</div>
								</div>
							</div>
							<div class='app-box' style='background:transparent;padding:0;'><div class='uptime-last-block'>${lastResults}</div></div>
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
			const url = `${site}`; //?_=${startTime}`; // Append timestamp to prevent caching
			const oldStatus = entry.status;

			UPTIME.fetch(url, { cache: 'no-store', method: 'GET', mode: 'no-cors' })
				.then(() => {
					if (statusElement) {
						statusElement.innerHTML = '<span class="uptime-online">Online</span>';
					}
					const responseTime = Date.now() - startTime;
					UPTIME.log.add(site, 'Online', responseTime);
				})
				.catch(() => {
					if (statusElement) {
						statusElement.innerHTML = '<span class="uptime-offline">Offline</span>';
					}
					if (oldStatus == 'Online' && site.notify === true) {
						UPTIME.notify('Site Down', `A monitored site is offline!<br>${site}`);
					}
					const responseTime = Date.now() - startTime;
					UPTIME.log.add(site, 'Offline', responseTime);
				});
		}
	},
	fetch: function (url) {
		return Promise.race([fetch(url, { cache: 'no-store', method: 'HEAD', mode: 'cors' }), new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))]);
	},
	notify: function (title, message) {
		if (!isEmpty(message)) {
			MESSAGE.alert(title, message);
			let audio = new Audio('/pages/alert.mp3'); // Replace with your alert sound file
			audio.play();
			NOTIFY.send(title, message);
		}
	},
	refresh: function () {
		if (UPTIME.websites && UPTIME.websites.length > 0) {
			// Clear All Intervals
			const intervals = UPTIME.intervals;
			if (intervals && intervals.length && intervals.length > 0) {
				intervals.forEach((interval, index) => {
					clearInterval(interval.interval);
				});
				UPTIME.intervals = [];
			}
			UPTIME.websites.forEach((website, index) => {
				let interval = website.interval;
				if (!interval || interval <= 10) {
					interval = 10;
				}
				UPTIME.websites[index].interval = interval;
				UPTIME.intervals.push({ id: index, interval: setInterval(() => UPTIME.check(index), interval * 1000) });
				UPTIME.check(index);
			});
		}
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
	unload: function () {
		const intervals = UPTIME.intervals;
		if (intervals && intervals.length && intervals.length > 0) {
			intervals.forEach((interval, index) => {
				clearInterval(interval.interval);
			});
		}
		UPTIME = null;
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
		}

		const inputField = document.getElementById('uptime-website'); // Replace with the actual input ID
		inputField.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				event.preventDefault(); // Prevent form submission if inside a form
				UPTIME.website.add();
			}
		});

		document.getElementById('uptime-add').addEventListener('click', UPTIME.website.add);

		UPTIME.list.update();
		UPTIME.refresh();

		// Add Unload
		APP.execute(() => {
			UPTIME.unload();
		});
	},
};

UPTIME.init();

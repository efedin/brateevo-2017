document.addEventListener('DOMContentLoaded', function() {
	'use strict';
	var mymap = L.map('mapid').setView([55.63652, 37.76311], 14);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18,
		id: 'eugfed.1bhdmffh',
		accessToken: 'pk.eyJ1IjoiZXVnZmVkIiwiYSI6ImNpc3Zwb29lNTAxdjYzMHFwbGx6MWF4aGYifQ.hDJNY5auEdio97Cw0-Ll2w'
	}).addTo(mymap);

	var getJSON = function(url) {
		var promise = new RSVP.Promise(function(resolve, reject){
			var client = new XMLHttpRequest();
			client.open('GET', url);
			client.onreadystatechange = handler;
			client.responseType = 'json';
			client.setRequestHeader('Accept', 'application/json');
			client.send();

			function handler() {
				if (this.readyState === this.DONE) {
					if (this.status === 200) {
						resolve(this.response);
					} else {
						reject(this);
					}
				}
			};
		});

		return promise;
	};

	function getDistrict (ikNum) {
		return (ikNum <= 1732 && ikNum !== 1726) ? 1 : 2;
	}

	var promises = [
		getJSON('data/brateevo.iks.geo.json')
	];

	RSVP.all(promises).then(function(dataArr) {
		L.geoJson(dataArr[0], {
			style: function (feature) {
				return getDistrict(feature.properties.ik) === 1 ? {
					color: '#ffcc00'
				} : {
					color: '#00ccff'
				};
			},
			onEachFeature: function (feature, layer) {
				layer.bindPopup('УИК ' + feature.properties.ik);
			}
		}).addTo(mymap);
	});

	getJSON('data/iks.buildings.geo.json').then(function(data) {
		L.geoJson(data, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.building);
			}
		}).addTo(mymap);
	});
});

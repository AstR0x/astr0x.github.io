$(document).ready(function() {
	const buttonmagnifier = document.getElementById('magnifier');
	const APIKey = 'c1a5ef1e777670da9b49432a84d4b250'
	//функция преобразования первой буквы названия города
	function firstLettertoUpper(str) {
		let str1 = str.slice(1, str.length);
		let firstch = str.charAt(0);
		return (firstch.toUpperCase() + str1);
	}

	let latitude1; //Долгота
	let longitude1; //Широта

	//Генерация XML запроса к серверу и парсинг ответа
	function getDataViaUrl(url) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, false);
		xhr.send();
		if (xhr.status != 200) {
			console.log(xhr.status);
		} else {
			var Data = JSON.parse(xhr.responseText);
		}
		return Data;
	}
	//Функция вывода температуры и названия города
	function innerTemp(Data) {
		//Вывод названия города
		$('.city-name').text(Data.name);
		//Вывод температуры
		let temp = $('.temp-value');
		if (Data.main.temp > 273) {
			temp.text('+' + (Data.main.temp - 273).toFixed(1) + '°C');
		} else if (Data.main.temp < 273) {
			temp.text((Data.main.temp - 273).toFixed(1) + '°C');
		} else {
			temp.text('0&#176C');
		}
	}
	//
	function innerSstatusImg(status, img, Data, sunrise, sunset) {
		let now = new Date();
		$('.weather-status').text(status);
		if (now.getTime() < sunset.getTime()) {
			$('#leftcol').css('background-image','url(img/' + img + '.jpg');
		} else {
			$('#leftcol').css('background-image', 'url(img/' + img + '_night.jpg');
		}		
	}
	//Вывод статуса погоды и прикрепление соответствующей картинки
	function innerStatusImg(Data, sunrise, sunset) {	
		let now = new Date();
		if (Data.weather[0].main == 'Clear') {		
			innerSstatusImg('Ясно','сlear', Data, sunrise, sunset);
		} else if (Data.weather[0].description == 'scattered clouds' || Data.weather[0].description == 'few clouds') {
			innerSstatusImg('Малооблачно', 'scatteredclouds', Data, sunrise, sunset);
	    } else if (Data.weather[0].description == 'overcast clouds') {
			innerSstatusImg('Пасмурно','cloudy', Data, sunrise, sunset);
	    } else if (Data.weather[0].description == 'broken clouds') {
			innerSstatusImg('Облачно с прояснениями','brokenclouds', Data, sunrise, sunset);
		} else if (Data.weather[0].description == 'light rain') {
			innerSstatusImg('Слабый дождь','rain', Data, sunrise, sunset);
	    } else if (Data.weather[0].main == 'Rain') {
			innerSstatusImg('Дождь','rain', Data, sunrise, sunset);
		} else if (Data.weather[0].main == 'Smoke') {
			innerSstatusImg('Дымка','mist', Data, sunrise, sunset); 
		} else if (Data.weather[0].main == 'Snow') {
			innerSstatusImg('Идёт снег','snow', Data, sunrise, sunset);
		} else if (Data.weather[0].main == 'Mist') {
			innerSstatusImg('Мгла','mist', Data, sunrise, sunset);		
		} else if (Data.weather[0].main == 'Fog') {
			innerSstatusImg('Туман','mist', Data, sunrise, sunset);
		} else {
			document.getElementsByClassName('weather-status')[0].innerHTML = Data.weather[0].description;
		}
	}
	//Вывод давления, влажности, скорости ветра, времени рассвета и заката
	function innerParameters(Data, sunrise, sunset) {
		document.getElementsByClassName('wind-value')[0].innerHTML = Data.wind.speed + ' м/c';
		document.getElementsByClassName('humidity-value')[0].innerHTML = Data.main.humidity + '%';
		document.getElementsByClassName('pressure-value')[0].innerHTML = (Data.main.pressure * 0.750062).toFixed(2) + ' мм';
		document.getElementsByClassName('sunrise')[0].innerHTML = 'Восход '+ sunrise.toLocaleTimeString();
		document.getElementsByClassName('sunset')[0].innerHTML = 'Закат ' + sunset.toLocaleTimeString();
	}

	function innerDateTimeTempForToday(Data) {
		let arrayDate = ['.first-date', '.second-date', '.third-date', '.fourth-date', '.fifth-date', '.sixth-date', '.seventh-date', '.eighth-date'];
		let arrayTime = ['.first-time', '.second-time', '.third-time', '.fourth-time', '.fifth-time', '.sixth-time', '.seventh-time', '.eighth-time']
		let arrayTemp =  ['.first-temp', '.second-temp', '.third-temp', '.fourth-temp', '.fifth-temp', '.sixth-temp', '.seventh-temp', '.eighth-temp']
		for (i = 0, k = 0; i < 8; i++, k += 1) {
			$(arrayDate[i]).text(Data.list[k].dt_txt.slice(8, 11) + '.' + Data.list[0].dt_txt.slice(5, 7));
			$(arrayTime[i]).text(Data.list[k].dt_txt.slice(11, 19));
			$(arrayTemp[i]).text((Data.list[k].main.temp - 273).toFixed(1) + '°C');
		}
	}

	function getIcon(icon, weather_icon) {
		let urlIcon = 'http://openweathermap.org/img/w/' + icon + '.png'
		document.getElementById(weather_icon).style.backgroundImage = 'url(' + urlIcon + ')';
	}

	//Функция получения получения погоды через координаты
	function getWeatherViaGeo() {
		let url_day = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude1 + '&lon=' + longitude1 + '&appid=c1a5ef1e777670da9b49432a84d4b250';
		let url_5days = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude1 + '&lon=' + longitude1 + '&appid=c1a5ef1e777670da9b49432a84d4b250';
		getWeatherViaURL(url_day);
		getWeatherForToday(url_5days);

	}
	//Определение координат пользователя
	navigator.geolocation.getCurrentPosition(function(position) {
		latitude1 = position.coords.latitude; //широта
		longitude1 = position.coords.longitude;
		getWeatherViaGeo(); //долгота  
	})
	//Функция вывода даты и времени 
	function getTime() {
		var now = new Date();
		$('#time').text('Time: ' + now.toTimeString().slice(0, 8));
		document.getElementById('date').innerHTML = ('Date: ' + now.toDateString());
	}

	function getWeatherForToday(url) {
		var Data = getDataViaUrl(url);
		innerDateTimeTempForToday(Data);
		let arrayIcon = ['first-weather-icon', 'second-weather-icon', 'third-weather-icon', 
		'fourth-weather-icon', 'fifth-weather-icon', 'sixth-weather-icon',
		 'seventh-weather-icon', 'eighth-weather-icon'];
		for (i = 0, k = 0; i < 8; i++, k += 1) {
			getIcon(Data.list[k].weather[0].icon, arrayIcon[i]);
		}
	}
	// НА 5 ДНЕЙ http://api.openweathermap.org/data/2.5/forecast?q=astrakhan&appid=c1a5ef1e777670da9b49432a84d4b250
	//Функция поиска информации по вводу названия города
	function getWeatherViaURL(url) {	
		var Data = getDataViaUrl(url);
		let sunrise = new Date(Data.sys.sunrise * 1000);
		let sunset = new Date(Data.sys.sunset * 1000);
		innerTemp(Data);
		innerStatusImg(Data, sunrise, sunset);
		innerParameters(Data, sunrise, sunset);
	}

	$('#magnifier').click(function(e) {
		e.preventDefault();
		let city = document.querySelector('#search').value;
		$('.city-name').text(firstLettertoUpper(city));
		let url_day = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=c1a5ef1e777670da9b49432a84d4b250';
		let url_5days = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=c1a5ef1e777670da9b49432a84d4b250';
		console.log(url_5days);
		getWeatherViaURL(url_day);
		getWeatherForToday(url_5days);
	})
	getTime();
})



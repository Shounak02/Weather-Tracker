let weather = {
  apiKey: "67b92f0af5416edbfe58458f502b0a31",
  pexelsApiKey: "lupsFslnXDMYI4zUU87YVjfW5ScjneYkd8DihFuSn4ta8ViKYLykb1X9", // Pexels API key

  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  fetchWeatherByLocation: function (lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");

    // Dynamically change the background based on the weather description
    this.setBackground(description.toLowerCase());
  },

  setBackground: function (description) {
    let searchTerm;

    if (description.includes("clear")) {
      searchTerm = "clear sky";
    } else if (description.includes("cloud")) {
      searchTerm = "cloudy sky";
    } else if (description.includes("rain")) {
      searchTerm = "rainy weather";
    } else if (description.includes("snow")) {
      searchTerm = "snowy landscape";
    } else if (description.includes("storm")) {
      searchTerm = "stormy weather";
    } else if (description.includes("mist") || description.includes("fog")) {
      searchTerm = "foggy weather";
    } else {
      searchTerm = "weather";
    }

    // Fetch background image from Pexels API based on the weather description
    fetch(`https://api.pexels.com/v1/search?query=${searchTerm}&per_page=1`, {
      headers: {
        Authorization: this.pexelsApiKey
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const backgroundUrl = data.photos[0].src.landscape;
        document.body.style.backgroundImage = `url(${backgroundUrl})`;
      })
      .catch((error) => {
        console.error("Error fetching background image:", error);
        document.body.style.backgroundImage =
          "url('https://www.pexels.com/photo/earth-planet-76969/')"; // fallback image here
      });
  },

  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

  getCurrentLocationWeather: function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.fetchWeatherByLocation(latitude, longitude);
        },
        () => {
          // If user denies geolocation, fallback to a default city
          alert("Unable to retrieve your location. Showing default location.");
          this.fetchWeather("Kolkata");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      this.fetchWeather("Kolkata");
    }
  }
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    weather.search();
  }
});

// Automatically fetch weather for the user's current location when the page loads
weather.getCurrentLocationWeather();

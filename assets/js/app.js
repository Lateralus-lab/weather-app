const form = document.querySelector('.form');
const input = document.querySelector('.input');
const msg = document.querySelector('.msg');
const list = document.querySelector('.city');

const apiKey = 'd81d344e6c78605f3a41e3db81554b19';

form.addEventListener('submit', e => {
  e.preventDefault();
  let inputVal = input.value;

  // Checking if city was already searched
  const listItems = list.querySelectorAll('.city__item');
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = '';

      if (inputVal.includes(',')) {
        if (inputVal.split(',')[1].length > 2) {
          inputVal = inputVal.split(',')[0];
          content = el
              .querySelector('.city__name-city')
              .textContent.toLowerCase();
        } else {
          content = el.querySelector('.city__name').dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector('.city__name-city').textContent.toLowerCase();
      }
      return content === inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know weather for 
            ${filteredArray[0].querySelector('.city__name-city').textContent} 
            ...otherwise be more specific by providing the country code as well`;
      form.reset();
      input.focus();
      return;
    }
  }

  // Ajax
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
      .then(response => response.json())
      .then(data => {
        const {main, name, sys, weather} = data;
        const icon = `https://openweathermap.org/img/wn/${
            weather[0]["icon"]
        }@2x.png`;

        const li = document.createElement('li');
        li.classList.add('city__item');
        const markup = `
        <h3 class="city__name" data-name="${name}, ${sys.country}">
          <span class="city__name-city">${name}</span>
          <sup class="city__name-country">${sys.country}</sup>
        </h3>
        <div class="city__temp">${Math.round(main.temp)}<sup class="city__temp-deg">&#8451;</sup></div>
        <figure class="city__figure">
          <img class="city__icon" src="${icon}" alt="${weather[0]['description']}">
          <figcaption class="city__figcaption">${weather[0]['description']}</figcaption>
        </figure>
        `;
        li.innerHTML = markup;
        list.appendChild(li);
      })
      .catch(() => {
        msg.textContent = 'Please search for a valid city';
      });

  msg.textContent = "";
  form.reset();
  input.focus();
});

const calendarLinks = document.querySelectorAll('.sidebar__calendar-link');
const reportCards = document.querySelectorAll('.report__card:not(.sidebar)');
const errorElement = document.getElementById('error');

let data = [];

fetch('data.json')
  .then((res) => {
    if (!res.ok) {
      throw new Error('Something went wrong while loading the data.');
    }
    return res.json();
    })
  .then((json) => {
    data = json;
    updateCards('weekly');
  })
  .catch((err) => {
    console.error(err);
    if(errorElement) {
      errorElement.textContent = '❌ Unable to fetch the data. Please try again later.';
      errorElement.classList.remove('hidden');
    }
  });

calendarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    calendarLinks.forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    const selected = link.textContent.toLowerCase();
    updateCards(selected);
  });
});

function updateCards(period) {
  data.forEach(item => {
    const title = item.title.toLowerCase().replace(' ', '-');
    const card = document.querySelector(`.report__card.${title}`);
    if (!card) return;

    const current = item.timeframes[period].current;
    const previous = item.timeframes[period].previous;

    const hours = card.querySelector('.report__card-hours');
    const time = card.querySelector('.report__card-time');
    const cardLabel = card.querySelector('.report__card-title');

    cardLabel.textContent = item.title;
    hours.textContent = `${current}hrs`;

    let label = '';
    if (period === 'daily') label = 'Yesterday';
    else if (period === 'weekly') label = 'Last Week';
    else if (period === 'monthly') label = 'Last Month';

    time.textContent = `${label} - ${previous}hrs`;
  });
}

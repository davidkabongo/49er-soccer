'use strict';

const hamburgerBtn = document.querySelector('.hamburger-btn');
const ul = document.querySelector('.nav-links');

hamburgerBtn.addEventListener('click', () => {
    ul.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {

    const HOLIDAY_API_URL = 'https://holidays.abstractapi.com/v1/';
    const HOLIDAY_API_KEY = 'd90809ec183741728ad54e80c07d3701';

    const calendar = document.getElementById('calendar');
    const eventList = document.getElementById('event-list');
    const eventFormContainer = document.getElementById('event-form-container');
    const signinButton = document.getElementById('signin-button');
    const eventForm = document.getElementById('event-form');
    const mainContainer = document.getElementById('main');
    
    const events = [];

    function generateCalendar() {
        const date = new Date();
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        calendar.innerHTML = '';
        
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.classList.add('day-header');
            calendar.appendChild(dayElement);
        });
        
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty-cell');
            calendar.appendChild(emptyCell);
        }
        
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayElement.textContent = day;
            calendar.appendChild(dayElement);
        }
        
        highlightEventDays();
    }

    function highlightEventDays() {
        const dayElements = document.querySelectorAll('.calendar-day');
        events.forEach(event => {
            const eventDate = event.date;
            dayElements.forEach(day => {
                if (day.dataset.date === eventDate) {
                    day.classList.add('has-event');
                }
            });
        });
    }

    function addEventToList(event) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${event.name}</strong> (${event.date}): ${event.description}`;
        eventList.appendChild(listItem);

        highlightEventDays();
    }

    function displayError(message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;

        mainContainer.appendChild(errorElement);

        setTimeout(() => {
            errorElement.style.opacity = '0';
            setTimeout(() => {
                errorElement.remove();
            }, 1000);
        }, 5000);
    }

    // Using a holday API to only allow matches, when there isn't a major US holday
    // The API is from Abstract API
    
    function checkHoliday(date) {
        const country = 'US';
        const [year, month, day] = date.split('-');
        const apiURL = `${HOLIDAY_API_URL}?country=${country}&api_key=${HOLIDAY_API_KEY}&year=${year}&month=${month}&day=${day}`;
    
        // List of major college-observed holidays
        const majorHolidays = [
            'New Year\'s Day',
            'Martin Luther King Jr. Day',
            'Presidents\' Day',
            'Memorial Day',
            'Independence Day',
            'Labor Day',
            'Thanksgiving Day',
            'Christmas Day'
        ];
    
        return fetch(apiURL, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Holiday API error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Holiday data for ${date}:`, data);
                
                // If data exists, check if it's a major holiday
                if (data && data.length > 0) {
                    const holidayName = data[0].name;
                    // Check if the holiday is in our list of major holidays
                    return majorHolidays.some(major => holidayName.includes(major)) ? holidayName : null;
                } else {
                    return null;
                }
            })
            .catch(err => {
                console.error('Error fetching holiday data:', err.message);
                return false;
            });
    }

    // Add an event listener to the form
    document.getElementById('event-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the selected date from the form input
        const eventDate = document.getElementById('event-date').value;
        const selectedDate = new Date(eventDate);
        const month = selectedDate.getMonth();
        
        updateCalendarLayout(month);
    });

    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const eventName = document.getElementById('event-name').value;
        const eventDate = document.getElementById('event-date').value;
        const eventDescription = document.getElementById('event-description').value || 'GO NINERS!!!';
    
        try {
            // Ensure we wait for the holiday check result
            const holidayName = await checkHoliday(eventDate);
    
            if (holidayName) {
                // Show the error with the holiday name
                const holidayMessage = `No matches - it's a holiday: ${holidayName}`;
                displayError(holidayMessage);
            } else {
                // Proceed with adding the event
                const newEvent = {
                    name: eventName,
                    date: eventDate,
                    description: eventDescription,
                };
                events.push(newEvent);
                addEventToList(newEvent);
            }
        } catch (error) {
            displayError(`Error checking holiday status: ${error.message}`);
        }
    
        eventForm.reset();
    });

    signinButton.addEventListener('click', () => {
        if (eventFormContainer.style.display === 'none' || eventFormContainer.style.display === '') {
            eventFormContainer.style.display = 'block';
        } else {
            eventFormContainer.style.display = 'none';
        }
    });


    generateCalendar();
});

document.addEventListener('DOMContentLoaded', () => {

    //menu tab
    const menuTab   = document.getElementById('menuTab');
    const openBtn  = document.querySelector('.menu');
    const closeBtn = document.getElementById('closeMenu');

    //open and close menu drawer
    const openDrawer  = () => {
        menuTab.classList.add('active');
    };
    const closeDrawer = () => {
        menuTab.classList.remove('active');
    };

    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    //close menu when clicked outside of menu tab
    document.addEventListener('click', (e) => {
        if (menuTab.classList.contains('active') && !menuTab.contains(e.target) && !openBtn.contains(e.target)) {
            closeDrawer();
        }
    });

    //close menu when user presses esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuTab.classList.contains('active')) closeDrawer();
    });

    //define date manipulating buttons
    const today = document.querySelector('.today');
    const prevBtn = document.getElementById('yesterday');
    const nextBtn = document.getElementById('tomorrow');

    //get date
    let current = new Date();
    const fmt = { year: 'numeric', month: 'long', day: 'numeric' };

    //Date manipulation
    function render() {
        today.textContent = current.toLocaleDateString(undefined, fmt);
    }
    render();

    //define next and last week buttons in menu
    const nWeek = document.querySelector('.nWeek');
    const lWeek = document.querySelector('.lWeek');

    nWeek.addEventListener('click', e => {
        saveList(current);
        current.setDate(current.getDate() + 7);
        render();
        loadList(current);
    })

    lWeek.addEventListener('click', e => {
        saveList(current);
        current.setDate(current.getDate() - 7);
        render();
        loadList(current);
    })

    const dateKey = (d) => new Date(d).toLocaleDateString('en-CA');
    // "YYYY-MM-DD" in local time
    const storageKey = (d) => `${dateKey(d)}`;

    const numEvent = document.querySelector('.numEvent');

    //saves the events for a date
    function saveList(date) {
        sessionStorage.setItem(storageKey(date), event.innerHTML);
    }

    //loads the events for a date
    function loadList(date) {
        event.innerHTML = sessionStorage.getItem(storageKey(date) || '');
        getNumEvent();
    }

    //save current events when prevBtn is pressed
    prevBtn.addEventListener('click', () => {
        if (event.firstChild){
            saveList(current);
        }
        current.setDate(current.getDate() - 1);
        render();
        loadList(current);
    })

    //save current events when nextBtn is pressed
    nextBtn.addEventListener('click', () => {
        if (event.firstChild){
            saveList(current);
        }
        current.setDate(current.getDate() + 1);
        render();
        loadList(current);
    })

    //when the date is clicked on, change current date to today
    today.addEventListener('click', () => {
        current = new Date();
        render();
        loadList(current);
    })



    const input = document.querySelector('.input');
    const add = document.querySelector('.register');
    const event = document.querySelector('.event');
    const clearAll = document.querySelector('.clearAll');

    //event listener that is restored once loaded from storage
    event.addEventListener('click', (e) => {
        //delete button
        if (e.target && e.target.classList.contains('delEvent')) {
            e.target.closest('li')?.remove();
            saveList(current);
        }

        //done button
        if (e.target && e.target.classList.contains('doneEvent')) {
            const li = e.target.closest('li');
            const span = li?.querySelector('.text');     // get the text span
            span.classList.toggle('markDone');
            saveList(current);
        }

        //pin and unpin events
        if (e.target && e.target.classList.contains('pinEvent')) {
            const li = e.target.closest('li');
            const span = li?.querySelector('.pinEvent');
            if (li.dataset.originalIndex === undefined) {
                li.dataset.originalIndex = Array.from(event.children).indexOf(li);
            }
            //save the original index of event for unpinning
            const originalIndex = parseInt(li.dataset.originalIndex, 10);
            //unpin
            if (li.classList.contains('pinned')) {
                li.classList.remove('pinned');
                console.log(originalIndex);
                span.classList.toggle('markPin');
                event.insertBefore(li, event.children[originalIndex+1]);
            }
            //pin
            else {
                console.log(originalIndex);
                span.classList.toggle('markPin');
                event.insertBefore(li, event.firstChild);
                li.classList.add('pinned');
            }
        }
        getNumEvent();
    });

    //add event using enter and button click
    add.addEventListener('click', addToList);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addToList();
        }
    });

    //adding event to list
    function addToList() {
        const li = document.createElement('li');

        const span = document.createElement('span');
        //event as text
        span.textContent = input.value;
        span.className = 'text';

        //delete event button
        const delEvent = document.createElement('button');
        delEvent.className = 'delEvent';
        delEvent.textContent = 'Delete';
        //done event button
        const doneEvent = document.createElement('button');
        doneEvent.className = 'doneEvent';
        doneEvent.textContent = 'Done';
        //pin event button
        const pinEvent = document.createElement('button');
        pinEvent.className = 'pinEvent';
        pinEvent.textContent = 'Pin';

        //add event to list
        if (span && span.textContent !== '') {
            li.appendChild(doneEvent);
            li.appendChild(span);
            li.appendChild(pinEvent);
            li.appendChild(delEvent);
            event.appendChild(li);
        }

        getNumEvent();
        saveList(current);
        input.value = '';
    }

    //clear all events for a date
    function clearALlEvents() {
        while (event.firstChild) {
            event.removeChild(event.firstChild);
        }
    }
    clearAll.addEventListener('click', () => {
        clearALlEvents();
        getNumEvent();
    })

    //get the number of Events
    function getNumEvent() {
        numEvent.textContent = "To-do: " + event.children.length;
    }

    //calendar manipulation
    const menuContent = document.getElementById('menuContent');
    datePickerEl = document.createElement('input');
    datePickerEl.type = 'date';
    datePickerEl.className = 'menuDatePicker';// make it obvious
    menuContent.appendChild(datePickerEl);
    datePickerEl.addEventListener('change', () => {
        if (!datePickerEl.value) return;
        const [y, m, d] = datePickerEl.value.split('-').map(Number);
        saveList(current);
        current = new Date(y, m - 1, d);
        render();
        loadList(current);

    });
});
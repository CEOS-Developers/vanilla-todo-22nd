document.addEventListener('DOMContentLoaded', () => {

    //menu tab
    const menuTab = document.getElementById('menuTab');
    const openBtn = document.querySelector('.menu');
    const closeBtn = document.getElementById('closeMenu');

    //open and close menu drawer
    const openDrawer = () => {
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

});
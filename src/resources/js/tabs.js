document.addEventListener('DOMContentLoaded', () => {
    let tabs = document.getElementsByClassName('nav-tabs');
    const updateAddress = e => {
        if (history.pushState && e.target.dataset.link) {
            history.pushState(null, null, `#${e.target.dataset.link}`);
        }
    };
    if (tabs.length > 0) {
        tabs = tabs[0].querySelectorAll('li');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', updateAddress);
            const linkTag = tabs[i].querySelector('a');
            if (location.hash !== '') {
                const currentHash = location.hash.substr(1);
                if (currentHash === linkTag.dataset.link) {
                    linkTag.click();
                }
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    let menuCollapsed = false;
    const mobileMenu = document.getElementById('mobile-menu');

    let localContextInUrl = '';

    if (COMPODOC_CURRENT_PAGE_CONTEXT !== '') {
        switch (COMPODOC_CURRENT_PAGE_CONTEXT) {
            case 'additional-page':
                localContextInUrl = 'additional-documentation';
                break;
            case 'class':
                localContextInUrl = 'classes';
                break;
            case 'miscellaneous-functions':
            case 'miscellaneous-variables':
            case 'miscellaneous-typealiases':
            case 'miscellaneous-enumerations':
                localContextInUrl = 'miscellaneous';
            default:
                break;
        }
    }

    function hasClass(el, cls) {
        return el.className && new RegExp(`(\\s|^)${cls}(\\s|$)`).test(el.className);
    }

    const processLink = (link, url) => {
        if (url.charAt(0) !== '.') {
            let prefix = '';
            switch (COMPODOC_CURRENT_PAGE_DEPTH) {
                case 5:
                    prefix = '../../../../../';
                    break;
                case 4:
                    prefix = '../../../../';
                    break;
                case 3:
                    prefix = '../../../';
                    break;
                case 2:
                    prefix = '../../';
                    break;
                case 1:
                    prefix = '../';
                    break;
                case 0:
                    prefix = './';
                    break;
            }
            link.setAttribute('href', prefix + url);
        }
    };

    const processMenuLinks = (links, dontAddClass) => {
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const linkHref = link.getAttribute('href');
            if (linkHref) {
                const linkHrefFile = linkHref.substr(
                    linkHref.lastIndexOf('/') + 1,
                    linkHref.length
                );
                if (
                    linkHrefFile.toLowerCase() === COMPODOC_CURRENT_PAGE_URL.toLowerCase() &&
                    link.innerHTML.indexOf('Getting started') === -1 &&
                    !dontAddClass &&
                    linkHref.toLowerCase().indexOf(localContextInUrl.toLowerCase()) !== -1
                ) {
                    link.classList.add('active');
                }
                processLink(link, linkHref);
            }
        }
    };
    const chapterLinks = document.querySelectorAll('[data-type="chapter-link"]');
    processMenuLinks(chapterLinks);
    const entityLinks = document.querySelectorAll('[data-type="entity-link"]');
    processMenuLinks(entityLinks);
    const indexLinks = document.querySelectorAll('[data-type="index-link"]');
    processMenuLinks(indexLinks, true);
    const compodocLogos = document.querySelectorAll('[data-type="compodoc-logo"]');
    const customLogo = document.querySelectorAll('[data-type="custom-logo"]');
    const processLogos = entityLogos => {
        for (let i = 0; i < entityLogos.length; i++) {
            const entityLogo = entityLogos[i];
            if (entityLogo) {
                let url = entityLogo.getAttribute('data-src');
                // Dark mode + logo
                const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDarkMode && url.indexOf('compodoc') !== -1) {
                    url = 'images/compodoc-vectorise-inverted.png';
                }
                if (url.charAt(0) !== '.') {
                    let prefix = '';
                    switch (COMPODOC_CURRENT_PAGE_DEPTH) {
                        case 5:
                            prefix = '../../../../../';
                            break;
                        case 4:
                            prefix = '../../../../';
                            break;
                        case 3:
                            prefix = '../../../';
                            break;
                        case 2:
                            prefix = '../../';
                            break;
                        case 1:
                            prefix = '../';
                            break;
                        case 0:
                            prefix = './';
                            break;
                    }
                    entityLogo.src = prefix + url;
                }
            }
        }
    };
    processLogos(compodocLogos);
    processLogos(customLogo);

    setTimeout(() => {
        document.getElementById('btn-menu').addEventListener('click', () => {
            if (menuCollapsed) {
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'block';
                document.getElementsByTagName('body')[0].style['overflow-y'] = 'hidden';
            }
            menuCollapsed = !menuCollapsed;
        });

        /**
         * Native bootstrap doesn't wait DOMContentLoaded event to start his job, re do it here
         */
        const Collapses = document.querySelectorAll('[data-bs-toggle="collapse"]');
        for (let o = 0, cll = Collapses.length; o < cll; o++) {
            const collapse = Collapses[o];
            const options = {};
            options.duration = collapse.getAttribute('data-duration');
            const targetId = collapse.getAttribute('data-bs-target');
            if (targetId !== '') {
                options.parent = collapse;
                const c = new BSN.Collapse(targetId, options);
            }
        }

        // collapse menu
        const classnameMenuToggler = document.getElementsByClassName('menu-toggler');
        const faAngleUpClass = 'ion-ios-arrow-up';
        const faAngleDownClass = 'ion-ios-arrow-down';
        const toggleItemMenu = e => {
            const element = e.target;
            const parent = element.parentNode;
            let parentLink;
            let elementIconChild;
            if (parent) {
                if (!parent.classList.contains('linked')) {
                    e.preventDefault();
                } else {
                    parentLink = parent.parentNode;
                    if (parentLink && element.classList.contains('link-name')) {
                        parentLink.trigger('click');
                    }
                }
                elementIconChild = parent.getElementsByClassName(faAngleUpClass)[0];
                if (!elementIconChild) {
                    elementIconChild = parent.getElementsByClassName(faAngleDownClass)[0];
                }
                if (elementIconChild) {
                    if (elementIconChild.classList.contains(faAngleUpClass)) {
                        elementIconChild.classList.add(faAngleDownClass);
                        elementIconChild.classList.remove(faAngleUpClass);
                    } else {
                        elementIconChild.classList.add(faAngleUpClass);
                        elementIconChild.classList.remove(faAngleDownClass);
                    }
                }
            }
        };

        for (let i = 0; i < classnameMenuToggler.length; i++) {
            classnameMenuToggler[i].addEventListener('click', toggleItemMenu, false);
        }

        // Scroll to active link
        const menus = document.querySelectorAll('.menu');
        let i = 0;
        const len = menus.length;
        let activeMenu;
        let activeMenuClass;
        let activeLink;

        for (i; i < len; i++) {
            if (getComputedStyle(menus[i]).display !== 'none') {
                activeMenu = menus[i];
                activeMenuClass = activeMenu.getAttribute('class').split(' ')[0];
            }
        }

        if (activeMenu) {
            activeLink = document.querySelector(`.${activeMenuClass} .active`);
            if (activeLink) {
                const linkType = activeLink.getAttribute('data-type');
                const linkContext = activeLink.getAttribute('data-context');
                if (linkType === 'entity-link') {
                    const parentLi = activeLink.parentNode;
                    let parentUl;
                    let parentChapterMenu;
                    if (parentLi) {
                        parentUl = parentLi.parentNode;
                        if (parentUl) {
                            parentChapterMenu = parentUl.parentNode;
                            if (parentChapterMenu) {
                                const toggler = parentChapterMenu.querySelector('.menu-toggler');
                                const elementIconChild =
                                    toggler.getElementsByClassName(faAngleUpClass)[0];
                                if (toggler && !elementIconChild) {
                                    toggler.click();
                                }
                            }
                        }
                    }
                    if (linkContext && linkContext === 'sub-entity') {
                        // Toggle also the master parent menu
                        const linkContextId = activeLink.getAttribute('data-context-id');
                        const toggler = activeMenu.querySelector(
                            `.chapter.${linkContextId} a .menu-toggler`
                        );
                        if (toggler) {
                            toggler.click();
                        }
                        if (linkContextId === 'additional') {
                            const mainToggler = activeMenu.querySelector(
                                `.chapter.${linkContextId} div.menu-toggler`
                            );
                            if (mainToggler) {
                                mainToggler.click();
                            }
                        }
                    }
                } else if (linkType === 'chapter-link') {
                    const linkContextId = activeLink.getAttribute('data-context-id');
                    const toggler = activeLink.querySelector('.menu-toggler');
                    if (toggler) {
                        toggler.click();
                    }
                    if (linkContextId === 'additional') {
                        const mainToggler = activeMenu.querySelector(
                            `.chapter.${linkContextId} div.menu-toggler`
                        );
                        if (mainToggler) {
                            mainToggler.click();
                        }
                    }
                }
                setTimeout(() => {
                    activeMenu.scrollTop = activeLink.offsetTop;
                    if (
                        activeLink.innerHTML.toLowerCase().indexOf('readme') !== -1 ||
                        activeLink.innerHTML.toLowerCase().indexOf('overview') !== -1
                    ) {
                        activeMenu.scrollTop = 0;
                    }
                }, 300);
            }
        }
    }, 0);
});

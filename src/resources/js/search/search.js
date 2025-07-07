(compodoc => {
    const usePushState = typeof history.pushState !== 'undefined';
    // DOM Elements
    const $body = document.querySelector('body');
    let $searchResults;
    let $searchInput;
    let $searchList;
    let $searchTitle;
    let $searchResultsCount;
    let $searchQuery;
    let $mainContainer;
    let $xsMenu;

    // Throttle search
    function throttle(fn, wait) {
        let timeout;

        return function () {
            const args = arguments;
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = undefined;
                    fn.apply(this, args);
                }, wait);
            }
        };
    }

    function displayResults(res) {
        const noResults = res.count === 0;
        const groups = {};
        if (noResults) {
            $searchResults.classList.add('no-results');
        } else {
            $searchResults.classList.remove('no-results');
        }

        // Clear old results
        $searchList.innerText = '';

        // Display title for research
        $searchResultsCount.innerText = res.count;
        $searchQuery.innerText = res.query;

        // Group result by context
        res.results.forEach(res => {
            const context = res.title.split(' - ')[0];
            if (typeof groups[context] === 'undefined') {
                groups[context] = {
                    results: [res]
                };
            } else {
                groups[context].results.push(res);
            }
        });

        const sortedGroups = Object.keys(groups).sort();

        for (let i = 0; i < sortedGroups.length; i++) {
            const property = sortedGroups[i];

            const $li = document.createElement('li');
            $li.classList.add('search-results-group');
            let finalPropertyLabel = '';
            const propertyLabels = property.split('-');

            if (
                propertyLabels.length === 2 &&
                propertyLabels[0] !== 'miscellaneous' &&
                propertyLabels[0] !== 'additional'
            ) {
                finalPropertyLabel = `${
                    propertyLabels[0].charAt(0).toUpperCase() + propertyLabels[0].substring(1)
                } - ${propertyLabels[1].charAt(0).toUpperCase()}${propertyLabels[1].substring(1)} (${groups[property].results.length})`;
            } else if (propertyLabels[0] === 'additional') {
                finalPropertyLabel = `Additional pages (${groups[property].results.length})`;
            } else {
                finalPropertyLabel = `${
                    propertyLabels[0].charAt(0).toUpperCase() + propertyLabels[0].substring(1)
                } (${groups[property].results.length})`;
            }
            const $groupTitle = document.createElement('h3');
            $groupTitle.innerText = finalPropertyLabel;
            $li.appendChild($groupTitle);

            const $ulResults = document.createElement('ul');
            $ulResults.classList.add('search-results-list');

            groups[property].results.forEach(res => {
                let link = '';
                const $liResult = document.createElement('li');
                $liResult.classList.add('search-results-item');
                switch (COMPODOC_CURRENT_PAGE_DEPTH) {
                    case 0:
                        link = './';
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        link = '../'.repeat(COMPODOC_CURRENT_PAGE_DEPTH);
                        break;
                }
                const finalResLabel =
                    res.title.split(' - ')[1].charAt(0).toUpperCase() +
                    res.title.split(' - ')[1].substring(1);
                const $link = document.createElement('a');
                $link.innerText = finalResLabel;
                $link.href = link + res.url;
                $liResult.appendChild($link);
                $ulResults.appendChild($liResult);
            });
            $li.appendChild($ulResults);

            $searchList.appendChild($li);
        }
    }

    function launchSearch(q) {
        $body.classList.add('with-search');

        if ($xsMenu.style.display === 'block') {
            $mainContainer.style.height = 'calc(100% - 100px)';
            $mainContainer.style.marginTop = '100px';
        }

        throttle(
            compodoc.search.query(q, 0, MAX_SEARCH_RESULTS).then(results => {
                displayResults(results);
            }),
            1000
        );
    }

    function closeSearch() {
        $body.classList.remove('with-search');
        if ($xsMenu.style.display === 'block') {
            $mainContainer.style.height = 'calc(100% - 50px)';
        }
    }

    function bindMenuButton() {
        document.getElementById('btn-menu').addEventListener('click', () => {
            if ($xsMenu.style.display === 'none') {
                $body.classList.remove('with-search');
                $mainContainer.style.height = 'calc(100% - 50px)';
            }
            $searchInputs.forEach((item, index) => {
                item.value = '';
            });
        });
    }

    function bindSearch() {
        // Bind DOM
        $searchInputs = document.querySelectorAll('#book-search-input input');

        $searchResults = document.querySelector('.search-results');
        $searchList = $searchResults.querySelector('.search-results-list');
        $searchTitle = $searchResults.querySelector('.search-results-title');
        $searchResultsCount = $searchTitle.querySelector('.search-results-count');
        $searchQuery = $searchTitle.querySelector('.search-query');
        $mainContainer = document.querySelector('.container-fluid');
        $xsMenu = document.querySelector('.xs-menu');

        // Launch query based on input content
        function handleUpdate(item) {
            const q = item.value;

            if (q.length === 0) {
                closeSearch();
                window.location.href = window.location.href.replace(window.location.search, '');
            } else {
                launchSearch(q);
            }
        }

        // Detect true content change in search input
        const propertyChangeUnbound = false;

        $searchInputs.forEach((item, index) => {
            // HTML5 (IE9 & others)
            item.addEventListener('input', function (e) {
                handleUpdate(this);
            });
            // Workaround for IE < 9
            item.addEventListener('propertychange', function (e) {
                if (e.originalEvent.propertyName === 'value') {
                    handleUpdate(this);
                }
            });
            // Push to history on blur
            item.addEventListener('blur', function (e) {
                // Update history state
                if (usePushState) {
                    const uri = updateQueryString('q', this.value);
                    if (this.value !== '') {
                        history.pushState({ path: uri }, null, uri);
                    }
                }
            });
        });
    }

    function launchSearchFromQueryString() {
        const q = getParameterByName('q');
        if (q && q.length > 0) {
            // Update search inputs
            $searchInputs.forEach((item, index) => {
                item.value = q;
            });
            // Launch search
            launchSearch(q);
        }
    }

    compodoc.addEventListener(compodoc.EVENTS.SEARCH_READY, event => {
        bindSearch();

        bindMenuButton();

        launchSearchFromQueryString();
    });

    function getParameterByName(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'i');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function updateQueryString(key, value) {
        value = encodeURIComponent(value);

        let url = window.location.href;
        const re = new RegExp(`([?&])${key}=.*?(&|#|$)(.*)`, 'gi');
        let hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null)
                return url.replace(re, `$1${key}=${value}$2$3`);

            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) url += `#${hash[1]}`;
            return url;
        }
        if (typeof value !== 'undefined' && value !== null) {
            const separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = `${hash[0] + separator + key}=${value}`;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) url += `#${hash[1]}`;
            return url;
        }
        return url;
    }
})(compodoc);

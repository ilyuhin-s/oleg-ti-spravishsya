

var addDataElement = (property, data) => {
    const isHave = document.querySelector('.jira-data');

    const jira = isHave ? isHave : document.createElement('div');
    jira.classList.add('jira-data');
    jira.dataset[property] = JSON.stringify(data);

    !isHave && document.body.appendChild(jira);
}

(function () {
    if (!location.href.includes('hd.samoletgroup')) return;

    fetch('https://hd.samoletgroup.ru/rest/greenhopper/1.0/xboard/plan/backlog/data.json?rapidViewId=848&selectedProjectKey=SFIN&fields=summary')
        .then(response => response.json())
        .then(data => {
            const sprints = data.sprints.map(({ id, name }) => {
                return ({ value: id, label: name });
            });

            addDataElement('sprints', sprints);
        });
})()

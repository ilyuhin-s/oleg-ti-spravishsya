

var addDataElement = (property, data) => {
    const isHave = document.querySelector('.jira-data');

    const jira = isHave ? isHave : document.createElement('div');
    jira.classList.add('jira-data');
    jira.dataset[property] = JSON.stringify(data);

    !isHave && document.body.appendChild(jira);
}

(function () {
    if (!location.href.includes('hd.samoletgroup')) return;
    const sprintId = document.querySelector('.sprint-id');

    fetch(`https://hd.samoletgroup.ru/rest/api/2/search?fields=timetracking,summary,parent&jql=project = "Кластер S.Финансы" & Sprint = ${sprintId.dataset.id}`).then(response => response.json())
        .then(data => data.issues.reduce((prev, current) => {
            return !current.fields.parent
                ? ({ ...prev, [current.key]: { ...prev[current.key], id: current.key, title: current.fields.summary, task: current.fields.timetracking.originalEstimateSeconds } })
                : ({ ...prev, [current.fields.parent.key]: { ...prev[current.fields.parent.key], [current.fields.summary.includes('BE') ? 'back' : current.fields.summary.includes('FE') ? 'front' : 'test']: current.fields.timetracking?.originalEstimateSeconds } })
        }, {}))
        .then(data => {
            addDataElement('issues', Object(data).values());
            sprintId.remove();
        });
})()

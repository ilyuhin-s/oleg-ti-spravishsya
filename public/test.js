
const interval = setInterval(() => {
    if (!miro?.v1) return;

    miro.v1.addListener(miro.v1.enums.event.CANVAS_CLICKED, (e) => {
        const { x, y } = e.data;
        const data = document.querySelector('.miro-data');
        const isActive = data?.dataset?.active;
        isActive && createShapes({ x, y });
        data && (document.querySelector('.miro-data').dataset.active = '');
    });

    clearInterval(interval);
}, 1000);

function createShapes({ x: xClicked, y }) {
    const tasksString = document.querySelector('.miro-data').dataset.tasks;
    const tasks = JSON.parse(tasksString);

    const getFontSize = (index) => {
        return [14, 18, 24, 24, 24, 36, 48, 48, 48][index] || 48;
    }

    tasks.map((item, index) => {
        window.miro.board.createShape({
            "content": `SFIN-${item.id}`,
            "shape": "round_rectangle",
            "origin": "center",
            "x": xClicked + 464/2,
            "y": y + index * 200,
            style: { textAlign: 'center', textAlignVertical: 'middle', fontSize: 64, fillColor: item.color },
            width: 465,
            height: 167

        });
        window.miro.board.createText({
            "content": item.title,
            "origin": "center",
            width: 2800,
            "x": xClicked + 550 + 1400,
            "y": y + index * 200,
            style: { textAlign: 'left', fontSize: 64},
        });

        let x = xClicked + 3700;
        ['back', 'front', 'test'].map((key) => {
            if (item[key]) {
                const hour = 46;
                const width = item[key] * hour;
                x = x + (width / 2);
                window.miro.board.createShape({
                    "content": `SFIN-${item.id}`,
                    "shape": "round_rectangle",
                    x,
                    "y": y + index * 200,
                    style: { textAlign: 'center', textAlignVertical: 'middle', fontSize: getFontSize(item[key]), fillColor: item.color },
                    width,
                    height: 167
                })
                x += (width / 2) + 10;
            }
        })
    });

}
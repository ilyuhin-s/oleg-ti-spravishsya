/*global miro*/
export default (miro) => {
    Array(6).fill({ id: 'SFIN-4532', title: 'После сбараметры фильтра в Назначение работ' }).map((item, index) => {
        var randomColor = (function generateRandomColorHex() {
            return "#" + ("00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6);
        })()

        miro.board.createShape({

            "content": item.id,
            "shape": "round_rectangle",

            "origin": "center",
            "x": 0,
            "y": index * 50,
            style: { textAlign: 'center', textAlignVertical: 'middle', fontSize: 14, fillColor: randomColor },
            width: 100,
            height: 40

        }).then(console.log)
        miro.board.createText({

            "content": item.title,
            "origin": "center",
            width: 600,
            "x": 375,
            "y": index * 50,
            style: { textAlign: 'left', fontSize: 16 },

        }).then(console.log)
    })
}
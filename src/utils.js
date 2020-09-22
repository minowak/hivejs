const createDragAndDropFor = (target) => {
    target.interactive = true;
    let drag
    target.on("mousedown", function (e) {
        drag = target;
    })
    target.on("mouseup", function (e) {
        drag = false;
    })
    target.on("mousemove", function (e) {
        if (drag) {
            drag.position.x += e.data.originalEvent.movementX;
            drag.position.y += e.data.originalEvent.movementY;
        }
    })
}

export default {
    createDragAndDropFor
}
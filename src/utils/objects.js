export function emptyMarker(lat, lng, speed, accuracy) {
    return {
        pos: { lat, lng },
        speed,
        accuracy,
        // options: { icon: "/img/markers/red.png" }
        // options: {
        //     label: {
        //         text: "\ue530",
        //         fontFamily: "Material Icons",
        //         color: "#ffffff",
        //         fontSize: "18px",
        //     },
        // }
    };
}

export function emptyPointDataDTO(lat, lng, speed, accuracy) {
    return { lat, lng, speed, accuracy };
}
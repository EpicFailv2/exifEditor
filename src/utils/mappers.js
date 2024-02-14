import { emptyMarker, emptyPointDataDTO } from "./objects";

export function mapMarkerToPointDataDTO(marker) {
    return emptyPointDataDTO(marker.pos.lat, marker.pos.lng, marker.speed, marker.accuracy);
}

export function mapPointDataDTOToMarker(pdd) {
    return emptyMarker(pdd.lat, pdd.lng, pdd.speed, pdd.accuracy);
}

export function mapMapDataDTOToMarker(mdd) {
    if (mdd.dataHistory && mdd.dataHistory.length) {
        return mapPointDataDTOToMarker(mdd.dataHistory[mdd.dataHistory.length - 1]);
    } else return emptyMarker();
}
import { SortOrder } from "./SortOrder";

export interface SortChangedEvent {
    readonly sortedColumnIndex: number,
    readonly sortOrder: SortOrder,
}

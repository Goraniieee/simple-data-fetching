export enum FetchActionType {
    SUCCESS = "FETCH_SUCCESS",
    ERROR = "FETCH_ERROR",
}

export enum FetchStatus {
    LOADING = "loading",
    SUCCESS = "success",
    ERROR = "error",
}

export type Action<T, K extends keyof T> = 
    | { type: FetchActionType.SUCCESS, key: K }
    | { type: FetchActionType.ERROR, key: K };

export const statusReducer = <T extends Record<K, FetchStatus>, K extends keyof T>(state: T, action: Action<T, K>): T => {
    switch (action.type) {
        case FetchActionType.SUCCESS:
            if (state[action.key] !== FetchStatus.LOADING) {
                console.warn(`Unexpected state transition from ${state[action.key]} to ${FetchStatus.SUCCESS}`);
                return state;
            }
            return { ...state, [action.key]: FetchStatus.SUCCESS };
        case FetchActionType.ERROR:
            if (state[action.key] !== FetchStatus.LOADING) {
                console.warn(`Unexpected state transition from ${state[action.key]} to ${FetchStatus.ERROR}`);
                return state;
            }
            return { ...state, [action.key]: FetchStatus.ERROR };
        default:
            return state;
    }
};

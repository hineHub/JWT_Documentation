export interface IStorageService {
    get(key: string) : any;
    set(key: string, value : any);
    delete(key: string);
}
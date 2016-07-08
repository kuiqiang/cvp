export class Video {
    _id:string;
    name:string;
    description:string;
    url:string;
    ratings:Array<number>;

    constructor(_id?:string, name?:string, description?:string, url?:string, ratings?:Array<number>) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.ratings = ratings;
    }
}

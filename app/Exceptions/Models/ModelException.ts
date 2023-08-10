export class ModelException extends Error {

    private code: number;

    constructor(msg: string = "Model exception", code: number = 500) {
        super(msg);

        this.code = code;
    }

    getCode(): number {
        return this.code;
    }
}

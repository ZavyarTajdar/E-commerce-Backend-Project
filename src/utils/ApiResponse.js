class ApiResponse{
    constructor(
        statuscode,
        message = "Success",
        data
    )
    {
        this.statuscode = statuscode;
        this.data = data;
        this.message = message;
        this.success = statuscode >= 200 && statuscode < 300;
    }
}

export { ApiResponse };
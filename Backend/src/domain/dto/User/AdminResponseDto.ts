export interface AdminResponseDto{
accessToken:string,
refreshToken:string,
admin:{
    id:string,
    email:string,
    role:string
}
}
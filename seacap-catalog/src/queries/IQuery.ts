export default interface IQuery<TReq, TRes>
{
    call: (req: TReq) => Promise<TRes>;
}
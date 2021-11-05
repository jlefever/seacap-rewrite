export default interface Entity
{
    id: number;
    name: string;
    kind: string;
    startLineno: number | null;
    endLineno: number | null;
    parent: Entity | null;
}
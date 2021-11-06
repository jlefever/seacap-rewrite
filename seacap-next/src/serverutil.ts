import { createCradle, ICradle } from "@seacap/catalog";

export function getCradle(): ICradle
{
    // @ts-ignore
    if (global.myCradle)
    {
        // @ts-ignore
        return global.myCradle as ICradle;
    }

    const myCradle = createCradle()
    // @ts-ignore
    global.myCradle = myCradle;
    return myCradle;
}
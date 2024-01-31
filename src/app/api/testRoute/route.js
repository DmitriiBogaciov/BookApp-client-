import { getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import { NextResponse} from "next/server";

export const GET = withApiAuthRequired(async function shows(req) {
    try {
        const res = new NextResponse();
        const { accessToken } = await getAccessToken(req, res);

        return NextResponse.json({ accessToken });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
});